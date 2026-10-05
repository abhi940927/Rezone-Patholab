-- Run this ONCE in Supabase > SQL Editor (after schema.sql). Switches sign-up to email + phone.

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

-- Lets the login page turn a phone number into the account's email (phone + password login).
create or replace function public.login_email(p_phone text) returns text
language sql stable security definer set search_path = public as
$$ select email from public.profiles where phone = right(regexp_replace(p_phone, '\D', '', 'g'), 10) limit 1 $$;
grant execute on function public.login_email(text) to anon, authenticated;
