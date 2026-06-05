-- Utility: clear test votes from Supabase.
-- Run in Supabase SQL Editor when you want to reset the live leaderboard.

delete from public.votes;

select count(*) as remaining_votes
from public.votes;
