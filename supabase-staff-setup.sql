-- Run this after creating the staff user in Supabase Authentication > Users.
-- Replace the email with the exact staff email, then execute in SQL Editor.

insert into public.staff_members (user_id, role, active)
select id, 'owner', true
from auth.users
where email = 'INSERISCI_EMAIL_STAFF'
on conflict (user_id) do update
set role = excluded.role,
    active = true;

select user_id, role, active
from public.staff_members;
