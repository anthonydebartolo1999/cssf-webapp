-- CSSF Supabase schema - backend for reservations and shared stands.
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  day date not null,
  slot text not null,
  guests integer not null check (guests between 1 and 30),
  area text,
  arrival text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'waiting', 'cancelled')),
  tables text
);

create index if not exists reservations_created_at_idx on public.reservations (created_at desc);
create index if not exists reservations_day_slot_idx on public.reservations (day, slot);
create index if not exists reservations_status_idx on public.reservations (status);

create table if not exists public.trucks (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  code text not null unique,
  name text not null,
  category text not null check (category in ('cocktail', 'dolci', 'birra', 'sudamericano', 'primi', 'carne', 'pesce', 'forno', 'fritti', 'bbq', 'tradizione', 'brace', 'pizza')),
  zone text not null,
  menu text not null,
  color text not null default '#e84b2a',
  status text not null default 'open' check (status in ('open')),
  x numeric not null check (x between 0 and 100),
  y numeric not null check (y between 0 and 100),
  map_positions jsonb
);

create index if not exists trucks_code_idx on public.trucks (code);
create index if not exists trucks_category_idx on public.trucks (category);

create table if not exists public.votes (
  id text primary key,
  created_at timestamptz not null default now(),
  category text not null check (category in ('top-street-food', 'top-panino', 'top-tradizione', 'top-dessert', 'top-drink')),
  truck_id text not null references public.trucks (id) on delete cascade,
  voter_name text not null default 'Anonimo'
);

alter table public.votes
add column if not exists voter_name text not null default 'Anonimo';

create index if not exists votes_created_at_idx on public.votes (created_at desc);
create index if not exists votes_category_idx on public.votes (category);
create index if not exists votes_truck_id_idx on public.votes (truck_id);

create table if not exists public.reviews (
  id text primary key,
  created_at timestamptz not null default now(),
  reviewer text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  body text not null
);

alter table public.reviews
add column if not exists age_range text,
add column if not exists gender text,
add column if not exists favorite_aspect text,
add column if not exists improvement_area text,
add column if not exists would_return text;

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_rating_idx on public.reviews (rating);
create index if not exists reviews_improvement_area_idx on public.reviews (improvement_area);

create table if not exists public.analytics_events (
  id text primary key,
  created_at timestamptz not null default now(),
  type text not null check (type in ('visit', 'section_view', 'click', 'form_submit', 'conversion', 'consent', 'admin')),
  label text not null,
  section text,
  session_id text not null,
  details jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_idx on public.analytics_events (type);
create index if not exists analytics_events_section_idx on public.analytics_events (section);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

create or replace view public.vote_leaderboard as
select
  category,
  truck_id,
  count(*)::integer as vote_count
from public.votes
group by category, truck_id;

create or replace view public.reservation_slot_usage as
select
  day,
  slot,
  coalesce(sum(guests) filter (where status in ('pending', 'confirmed')), 0)::integer as used_guests,
  count(*) filter (where status in ('pending', 'confirmed'))::integer as active_reservations
from public.reservations
group by day, slot;

create table if not exists public.staff_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'staff' check (role in ('owner', 'admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  endpoint text not null,
  subscription jsonb not null,
  p256dh_key text not null,
  auth_key text not null,
  scope text not null default 'staff' check (scope in ('staff', 'public')),
  device_label text,
  user_agent text,
  active boolean not null default true
);

create unique index if not exists push_subscriptions_endpoint_scope_idx on public.push_subscriptions (endpoint, scope);

alter table public.staff_members enable row level security;
alter table public.push_subscriptions enable row level security;

create or replace function public.is_staff(member_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_members
    where user_id = member_id
      and active = true
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists trucks_set_updated_at on public.trucks;
create trigger trucks_set_updated_at
before update on public.trucks
for each row execute function public.set_updated_at();

drop trigger if exists push_subscriptions_set_updated_at on public.push_subscriptions;
create trigger push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

alter table public.reservations enable row level security;
alter table public.trucks enable row level security;
alter table public.votes enable row level security;
alter table public.reviews enable row level security;
alter table public.analytics_events enable row level security;

grant insert on public.reservations to anon;
grant select, update, delete on public.reservations to authenticated;
grant select on public.trucks to anon, authenticated;
grant insert, update, delete on public.trucks to authenticated;
revoke select on public.votes from anon;
grant insert on public.votes to anon;
grant select, insert on public.votes to authenticated;
grant delete on public.votes to authenticated;
grant select, insert on public.reviews to anon, authenticated;
grant delete on public.reviews to authenticated;
grant insert on public.analytics_events to anon, authenticated;
grant select, delete on public.analytics_events to authenticated;
grant select on public.vote_leaderboard to anon, authenticated;
grant select on public.reservation_slot_usage to anon, authenticated;
grant select on public.staff_members to authenticated;
grant execute on function public.is_staff(uuid) to authenticated;

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

-- Recommended production policies after Supabase Auth is enabled for staff.
drop policy if exists "Staff can read reservations" on public.reservations;
create policy "Staff can read reservations"
on public.reservations
for select
to authenticated
using (public.is_staff());

drop policy if exists "Staff can update reservations" on public.reservations;
create policy "Staff can update reservations"
on public.reservations
for update
to authenticated
using (public.is_staff())
with check (public.is_staff() and status in ('pending', 'confirmed', 'waiting', 'cancelled'));

drop policy if exists "Staff can delete reservations" on public.reservations;
create policy "Staff can delete reservations"
on public.reservations
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Public can read trucks" on public.trucks;
create policy "Public can read trucks"
on public.trucks
for select
to anon, authenticated
using (true);

drop policy if exists "Staff can create trucks" on public.trucks;
create policy "Staff can create trucks"
on public.trucks
for insert
to authenticated
with check (
  public.is_staff()
  and char_length(trim(code)) between 2 and 12
  and char_length(trim(name)) between 2 and 120
  and char_length(trim(zone)) between 2 and 120
  and char_length(trim(menu)) between 2 and 800
);

drop policy if exists "Staff can update trucks" on public.trucks;
create policy "Staff can update trucks"
on public.trucks
for update
to authenticated
using (public.is_staff())
with check (
  public.is_staff()
  and char_length(trim(code)) between 2 and 12
  and char_length(trim(name)) between 2 and 120
  and char_length(trim(zone)) between 2 and 120
  and char_length(trim(menu)) between 2 and 800
);

drop policy if exists "Staff can delete trucks" on public.trucks;
create policy "Staff can delete trucks"
on public.trucks
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Public can read votes" on public.votes;
drop policy if exists "Staff can read votes" on public.votes;
create policy "Staff can read votes"
on public.votes
for select
to authenticated
using (public.is_staff());

drop policy if exists "Public can create votes" on public.votes;
create policy "Public can create votes"
on public.votes
for insert
to anon, authenticated
with check (
  category in ('top-street-food', 'top-panino', 'top-tradizione', 'top-dessert', 'top-drink')
  and char_length(trim(voter_name)) between 1 and 80
  and exists (
    select 1
    from public.trucks
    where trucks.id = truck_id
  )
);

drop policy if exists "Staff can delete votes" on public.votes;
create policy "Staff can delete votes"
on public.votes
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
on public.reviews
for select
to anon, authenticated
using (true);

drop policy if exists "Public can create reviews" on public.reviews;
create policy "Public can create reviews"
on public.reviews
for insert
to anon, authenticated
with check (
  rating between 1 and 5
  and char_length(trim(reviewer)) between 1 and 80
  and char_length(trim(title)) between 2 and 120
  and char_length(trim(body)) between 10 and 800
  and coalesce(age_range, '') in ('', 'under-18', '18-24', '25-34', '35-44', '45-54', '55-plus')
  and coalesce(gender, '') in ('', 'female', 'male', 'non-binary', 'prefer-not')
  and coalesce(favorite_aspect, '') in ('', 'food', 'stand-variety', 'atmosphere', 'music', 'organization', 'location')
  and coalesce(improvement_area, '') in ('', 'queues', 'seating', 'prices', 'signage', 'payment', 'cleanliness', 'more-stands', 'nothing')
  and coalesce(would_return, '') in ('', 'yes', 'maybe', 'no')
);

drop policy if exists "Staff can delete reviews" on public.reviews;
create policy "Staff can delete reviews"
on public.reviews
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Public can create analytics events" on public.analytics_events;
create policy "Public can create analytics events"
on public.analytics_events
for insert
to anon, authenticated
with check (
  type in ('visit', 'section_view', 'click', 'form_submit', 'conversion', 'consent', 'admin')
  and char_length(trim(label)) between 1 and 180
  and char_length(trim(coalesce(section, 'app'))) between 1 and 80
  and char_length(trim(session_id)) between 8 and 80
);

drop policy if exists "Staff can read analytics events" on public.analytics_events;
create policy "Staff can read analytics events"
on public.analytics_events
for select
to authenticated
using (public.is_staff());

drop policy if exists "Staff can delete analytics events" on public.analytics_events;
create policy "Staff can delete analytics events"
on public.analytics_events
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Staff can read push subscriptions" on public.push_subscriptions;
create policy "Staff can read push subscriptions"
on public.push_subscriptions
for select
to authenticated
using (public.is_staff());

insert into public.trucks (id, code, name, category, zone, menu, color, status, x, y, map_positions)
values
  ('stand-afterlife', 'S01', 'Afterlife', 'cocktail', 'Area drink', 'Cocktail freschi e gustosi per accompagnare le serate.', '#7c3aed', 'open', 52.3, 16.1, null),
  ('stand-armonia-gusti', 'S02', 'Armonia dei Gusti', 'dolci', 'Passeggiata dolce', 'Gelati, monoporzioni e pangoccioli.', '#db2777', 'open', 47.1, 29.5, null),
  ('stand-birra-cala', 'S03', 'Birra Cala', 'birra', 'Area drink', 'Birra per rinfrescare la serata.', '#d97706', 'open', 58.9, 16.9, '[{"x":58.9,"y":16.9},{"x":26.3,"y":36.4}]'::jsonb),
  ('stand-caracas-bistro-25', 'S04', 'Caracas Bistro 25', 'sudamericano', 'Area world food', 'Burrito, arepas e churros per un salto in Sud America.', '#059669', 'open', 19.1, 34.5, null),
  ('stand-che-gnocchi', 'S05', 'Che Gnocchi', 'primi', 'Via centrale', 'Gnocchi alla carbonara, gnocchi all''amatriciana e gustose lasagne.', '#2563eb', 'open', 16.7, 15.5, null),
  ('stand-chimi', 'S06', 'Chimi', 'carne', 'Area brace', 'Asado argentino tradizionale e hamburger.', '#dc2626', 'open', 64.4, 67.8, null),
  ('stand-gamro', 'S07', 'GamRo', 'pesce', 'Area mare', 'Panini con il pesce e frittura.', '#0891b2', 'open', 25.3, 16.8, null),
  ('stand-la-forneria', 'S08', 'La Forneria', 'forno', 'Via centrale', 'Focacce gustose e cuoppo di polpette.', '#ca8a04', 'open', 65.7, 16.8, null),
  ('stand-la-verace', 'S09', 'La Verace', 'fritti', 'Area novita', 'Cuzzitiello e corn dog.', '#ea580c', 'open', 34.4, 38.7, null),
  ('stand-panzerotto-on-the-road', 'S10', 'Panzerotto on the Road', 'fritti', 'Via centrale', 'Panzerotti e burrata fritta.', '#16a34a', 'open', 8.8, 16.7, null),
  ('stand-sams-food-truck', 'S11', 'Sam''s Food Truck', 'bbq', 'Area BBQ', 'Brisket e panini con pulled pork.', '#be123c', 'open', 49.4, 53.4, null),
  ('stand-the-butchers', 'S12', 'The Butchers', 'carne', 'Area brace', 'Cuoppo di carne, hamburger, salsiccia e alette di pollo.', '#9333ea', 'open', 37.4, 20.1, null),
  ('stand-trattoria-da-ciardullo', 'S13', 'Trattoria da Ciardullo', 'tradizione', 'Area tradizione', 'Patate mbacchiuse e pasta casereccia.', '#4d7c0f', 'open', 43.5, 15.3, null),
  ('stand-willy-crak', 'S14', 'Willy Crak', 'brace', 'Area brace', 'Arrosticini, caciocavallo impiccato e novita con bistecca di pecora.', '#b45309', 'open', 10.7, 30.6, null),
  ('stand-zia-ne', 'S15', 'Zia Ne', 'pizza', 'Area pizza', 'Pizza a portafoglio e gustose frittatine di pasta.', '#e11d48', 'open', 56.3, 61, null)
on conflict (id) do nothing;

do $$
begin
  alter publication supabase_realtime add table public.reservations;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.trucks;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.votes;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.reviews;
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.analytics_events;
exception
  when duplicate_object then null;
end;
$$;
