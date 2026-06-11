-- Temporary focused fix: allow anonymous visitors to create reservations.
-- Visitors still cannot read, update, or delete reservations.

grant insert on public.reservations to anon;

drop policy if exists "Public can create reservations" on public.reservations;
create policy "Public can create reservations"
on public.reservations
for insert
to anon, authenticated
with check (
  status in ('pending', 'waiting')
  and guests between 1 and 30
  and char_length(trim(name)) between 2 and 120
  and char_length(trim(phone)) between 6 and 40
  and (email is null or email = '' or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  and day in ('2026-06-26'::date, '2026-06-27'::date, '2026-06-28'::date)
  and slot = '20:30'
  and char_length(coalesce(notes, '')) <= 600
  and char_length(coalesce(area, '')) <= 120
  and char_length(coalesce(arrival, '')) <= 80
  and char_length(coalesce(tables, '')) <= 80
);

select policyname, roles, cmd, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'reservations';
