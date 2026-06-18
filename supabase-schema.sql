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
  category text not null check (category in ('best-street-chef', 'courtesy-award', 'tradition-award')),
  truck_id text not null references public.trucks (id) on delete cascade,
  voter_name text not null default 'Anonimo'
);

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'votes_category_check'
      and conrelid = 'public.votes'::regclass
  ) then
    alter table public.votes drop constraint votes_category_check;
  end if;
exception
  when undefined_table then null;
end;
$$;

alter table public.votes
add constraint votes_category_check
check (category in ('best-street-chef', 'courtesy-award', 'tradition-award'));

alter table public.votes
add column if not exists voter_name text not null default 'Anonimo',
add column if not exists prize_opt_in boolean not null default false,
add column if not exists email text,
add column if not exists gender text,
add column if not exists age_range text,
add column if not exists distance text,
add column if not exists score integer check (score between 1 and 5);

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
add column if not exists origin_area text,
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

create table if not exists public.moments (
  id text primary key,
  created_at timestamptz not null default now(),
  uploader_name text not null,
  caption text,
  image_path text not null unique,
  image_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

create index if not exists moments_created_at_idx on public.moments (created_at desc);
create index if not exists moments_status_idx on public.moments (status);

create or replace view public.vote_leaderboard as
select
  category,
  truck_id,
  count(*)::integer as vote_count,
  coalesce(sum(score), 0)::integer as total_score,
  coalesce(round(avg(score)::numeric, 2), 0)::numeric as avg_score
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
alter table public.moments enable row level security;

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
grant insert on public.moments to anon, authenticated;
grant select, update, delete on public.moments to authenticated;
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
  category in ('best-street-chef', 'courtesy-award', 'tradition-award')
  and score between 1 and 5
  and char_length(trim(voter_name)) between 1 and 80
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and coalesce(gender, '') in ('', 'female', 'male', 'prefer-not')
  and coalesce(age_range, '') in ('', 'under-18', '18-24', '25-34', '35-44', '45-54', '55-plus')
  and coalesce(distance, '') in ('', 'luzzi', 'nearby-towns', 'rende', 'cosenza', 'over-25km', 'over-50km')
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
  and coalesce(gender, '') in ('', 'female', 'male', 'prefer-not')
  and coalesce(origin_area, '') in ('', 'luzzi', 'nearby-towns', 'rende', 'cosenza', 'over-25km', 'over-50km')
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

drop policy if exists "Public can create moments" on public.moments;
create policy "Public can create moments"
on public.moments
for insert
to anon, authenticated
with check (
  char_length(trim(uploader_name)) between 2 and 80
  and char_length(coalesce(caption, '')) <= 220
  and char_length(trim(image_path)) between 10 and 255
  and image_path like 'public/%'
  and char_length(trim(image_url)) between 20 and 500
  and status = 'pending'
);

drop policy if exists "Staff can read moments" on public.moments;
create policy "Staff can read moments"
on public.moments
for select
to authenticated
using (public.is_staff());

drop policy if exists "Staff can update moments" on public.moments;
create policy "Staff can update moments"
on public.moments
for update
to authenticated
using (public.is_staff())
with check (public.is_staff() and status in ('pending', 'approved', 'rejected'));

drop policy if exists "Staff can delete moments" on public.moments;
create policy "Staff can delete moments"
on public.moments
for delete
to authenticated
using (public.is_staff());

drop policy if exists "Staff can read push subscriptions" on public.push_subscriptions;
create policy "Staff can read push subscriptions"
on public.push_subscriptions
for select
to authenticated
using (public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cssf-moments',
  'cssf-moments',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload CSSF moments" on storage.objects;
create policy "Public can upload CSSF moments"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'cssf-moments'
  and (storage.foldername(name))[1] = 'public'
);

drop policy if exists "Public can read CSSF moments" on storage.objects;
create policy "Public can read CSSF moments"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'cssf-moments');

drop policy if exists "Staff can delete CSSF moments" on storage.objects;
create policy "Staff can delete CSSF moments"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cssf-moments'
  and public.is_staff()
);

insert into public.trucks (id, code, name, category, zone, menu, color, status, x, y, map_positions)
values
  ('stand-afterlife', 'S01', 'Afterlife Cocktail', 'cocktail', 'Area drink', 'Cocktail Zone - dove potrai gustare tutti i grandi classici della mixology preparati al momento, CAFFE'' AIELLO', '#7c3aed', 'open', 52.3, 16.1, null),
  ('stand-armonia-gusti', 'S02', 'Armonia dei gusti', 'dolci', 'Passeggiata dolce', 'Frutta realistica, Gelati artigianali, Monoporzioni, Granite, Pancakes, Crepes', '#db2777', 'open', 47.1, 29.5, null),
  ('stand-birra-cala', 'S03', 'Birra Cala', 'birra', 'Area drink', 'Birra artigianale - Birrificio ufficiale del CSSF26', '#d97706', 'open', 58.9, 16.9, '[{"x":58.9,"y":16.9},{"x":26.3,"y":36.4}]'::jsonb),
  ('stand-caracas-bistro-25', 'S04', 'Caracas', 'sudamericano', 'Area world food', 'Arepas, Burritos, Tequenos, Churros, Tutto #GlutenFree', '#facc15', 'open', 19.1, 34.5, null),
  ('stand-che-gnocchi', 'S05', 'Bar Centrale', 'tradizione', 'Via centrale', 'Cullurialli - Cuddruriaddri, Gnocco fritto con salumi e formaggi', '#2563eb', 'open', 16.7, 15.5, null),
  ('stand-chimi', 'S06', 'CHIMI', 'carne', 'Area brace', 'Piatto Carne Argentina ASADO, Panini con Hamburger di carne argentina', '#dc2626', 'open', 64.4, 67.8, null),
  ('stand-gamro', 'S07', 'GamRo', 'pesce', 'Area mare', 'Frittura cuoppo di calamari - #GlutenFree., Panino polpami (polipo), Panino squiddi (calamari), Panino Crusco (baccala)', '#0891b2', 'open', 25.3, 16.8, null),
  ('stand-la-forneria', 'S08', 'La Forneria', 'forno', 'Via centrale', 'Focaccia (Mortadella, Stracchino e pistacchio), Focaccia (Porchetta e crema ai 4 formaggi), Focaccia (Crudo e crema di noci), Arancini (Classici al ragu/ Bianco zafferano e mozzarella), Cuoppo Polpette (Melanzane e carne), Sua maesta "A Grupariata"', '#2563eb', 'open', 65.7, 16.8, null),
  ('stand-la-verace', 'S09', 'La Verace', 'fritti', 'Area novita', 'Cuzzitiello, Corn Dog, patatine fritte', '#ea580c', 'open', 34.4, 38.7, null),
  ('stand-panzerotto-on-the-road', 'S10', 'Panzerotto on the road', 'fritti', 'Via centrale', 'Panzerotti Caldi (Classico o Silano), Panzerotti Freddi (Primavera o Bolognese), Burrate fritte (Burrata Crudo o Burrata Mortadella)', '#16a34a', 'open', 8.8, 16.7, null),
  ('stand-sams-food-truck', 'S11', 'Sam''s Food Truck', 'bbq', 'Area BBQ', 'Panino con Pulled Pork, Panino con Brisket', '#be123c', 'open', 49.4, 53.4, null),
  ('stand-the-butchers', 'S12', 'The butchers', 'carne', 'Area brace', 'Cipollotto (panino con hamburgher di scottona), Salsicciotto (panino con hamburgher di salsiccia), Porchetto ( panino con porchetta), Cuoppo The Butchers (misto carne), Cuoppo Ribs - {ESCLUSIVA CSSF26}, Cuoppo Alette di Pollo #LimitedEdition', '#9333ea', 'open', 37.4, 20.1, null),
  ('stand-trattoria-da-ciardullo', 'S13', 'Trattoria da Ciardullo', 'tradizione', 'Area tradizione', 'Tagliatelle ai funghi Porcini, Maccarruni della nonna (costine carne e polpette al sugo), Scialatelli alla Silana (salsiccia, porcini, pomodorini e ricotta affumicata), Patate mbacchiuse con cipolla, Patate mbacchiuse con funghi porcini, Patate mbacchiuse con peperoni', '#facc15', 'open', 43.5, 15.3, null),
  ('stand-willy-crak', 'S14', 'Willy Crak', 'brace', 'Area brace', 'Arrosticini di pecora, Cacio cavallo impiccato, Patata Conzata (Pulled di pecora, crema di parmigiano e cipolla caramellata), Patate fritte e Pulled di pecora, Panino con pulled di pecora (verdure - cacio - cipolla e salsa sweet chilli)', '#facc15', 'open', 10.7, 30.6, null),
  ('stand-zia-ne', 'S15', 'ZIA NE''', 'pizza', 'Area pizza', 'Pizza a portafoglio (Margherita), Pizza Portafoglio Fredda (Pomodoro - Mozzarella e Pesto), Pizza Fritta (Margherita)', '#e11d48', 'open', 56.3, 61, null)
on conflict (id) do update
set
  code = excluded.code,
  name = excluded.name,
  category = excluded.category,
  zone = excluded.zone,
  menu = excluded.menu,
  color = excluded.color,
  status = excluded.status,
  x = excluded.x,
  y = excluded.y,
  map_positions = excluded.map_positions,
  updated_at = now();

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

do $$
begin
  alter publication supabase_realtime add table public.moments;
exception
  when duplicate_object then null;
end;
$$;
