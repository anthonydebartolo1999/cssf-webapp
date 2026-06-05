-- Optional smoke test from SQL Editor.
-- If this insert appears in Table Editor, the reservations table accepts valid rows.

insert into public.reservations (
  id,
  name,
  phone,
  email,
  day,
  slot,
  guests,
  area,
  arrival,
  notes,
  status,
  tables
) values (
  'TEST-SQL-001',
  'Test SQL',
  '3331234567',
  'test@example.com',
  '2026-06-26',
  '20:30',
  2,
  'centrale',
  '20:00',
  'test da SQL editor',
  'pending',
  '1 tavolo'
)
on conflict (id) do update
set updated_at = now()
returning id, name, phone, day, slot, guests, status;
