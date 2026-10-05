-- ReZone Patholab: run this whole file once in Supabase > SQL Editor.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text unique not null,
  role text not null default 'patient' check (role in ('patient','collector','doctor')),
  created_at timestamptz default now()
);
create unique index profiles_email_key on public.profiles (lower(email)) where email <> '';

create table public.bookings (
  id text primary key,
  specimen_id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  patient_name text not null,
  age text, gender text, mobile text,
  address text, pincode text, latitude double precision, longitude double precision,
  package_name text not null,
  total_price numeric not null default 0,
  status text not null default 'booked' check (status in ('booked','collected','approved')),
  created_at timestamptz not null default now(),
  collected_at timestamptz,
  approved_at timestamptz,
  result_values jsonb,
  remarks text
);

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

-- Every new sign-up becomes a PATIENT. Roles are never taken from the browser.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'name', 'Patient'),
          lower(coalesce(new.email, '')),
          right(regexp_replace(coalesce(new.raw_user_meta_data->>'phone', ''), '\D', '', 'g'), 10),
          'patient');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

create policy "own profile" on public.profiles for select using (id = auth.uid());
create policy "doctor reads all profiles" on public.profiles for select using (public.my_role() = 'doctor');

create policy "patient reads own bookings" on public.bookings for select using (user_id = auth.uid());
create policy "staff read all bookings" on public.bookings for select using (public.my_role() in ('collector','doctor'));
create policy "patient creates own booking" on public.bookings for insert
  with check (user_id = auth.uid() and status = 'booked' and result_values is null and public.my_role() = 'patient');
-- No UPDATE/DELETE policies: changes only happen through the functions below.

create or replace function public.approve_collection(p_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() not in ('collector','doctor') then raise exception 'Not allowed'; end if;
  update public.bookings set status = 'collected', collected_at = now() where id = p_id and status = 'booked';
  if not found then raise exception 'Booking not found or already collected'; end if;
end $$;

create or replace function public.approve_report(p_id text, p_values jsonb, p_remarks text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'doctor' then raise exception 'Only the doctor can approve reports'; end if;
  update public.bookings set status = 'approved', approved_at = now(), result_values = p_values, remarks = p_remarks
   where id = p_id and status = 'collected';
  if not found then raise exception 'Sample not collected yet or report already approved'; end if;
end $$;

create or replace function public.set_role(p_phone text, p_role text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'doctor' then raise exception 'Only the doctor can manage staff'; end if;
  if p_role not in ('collector','patient') then raise exception 'Invalid role'; end if;
  update public.profiles set role = p_role where phone = right(regexp_replace(p_phone, '\D', '', 'g'), 10) and role <> 'doctor';
  if not found then raise exception 'No registered user with this phone number'; end if;
end $$;

revoke all on function public.my_role(), public.approve_collection(text), public.approve_report(text, jsonb, text), public.set_role(text, text) from public, anon;
grant execute on function public.my_role(), public.approve_collection(text), public.approve_report(text, jsonb, text), public.set_role(text, text) to authenticated;

alter publication supabase_realtime add table public.bookings;

-- Lets the login page turn a phone number into the account's email (phone + password login).
create or replace function public.login_email(p_phone text) returns text
language sql stable security definer set search_path = public as
$$ select email from public.profiles where phone = right(regexp_replace(p_phone, '\D', '', 'g'), 10) limit 1 $$;
grant execute on function public.login_email(text) to anon, authenticated;

-- AFTER the doctor has registered once on the website with his own phone number, run:
--   update public.profiles set role = 'doctor' where phone = '10-DIGIT-DOCTOR-PHONE';
