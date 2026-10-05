-- Run ONCE in Supabase > SQL Editor. Stores each patient's typed address and GPS pin with the booking.
alter table public.bookings
  add column if not exists address text,
  add column if not exists pincode text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;
