-- Run after the event closes to delete reservation personal data.
-- Recommended timing: after 28 June 2026, once operational checks are complete.

delete from public.reservations
where day between '2026-06-26'::date and '2026-06-28'::date;

delete from public.votes;

select count(*) as remaining_reservations
from public.reservations;

select count(*) as remaining_votes
from public.votes;
