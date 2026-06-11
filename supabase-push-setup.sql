-- CSSF push setup for an existing Supabase project.
-- Run this after supabase-schema.sql if the project is already live.

create extension if not exists pgcrypto;

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

drop index if exists push_subscriptions_endpoint_key;
create unique index if not exists push_subscriptions_endpoint_scope_idx on public.push_subscriptions (endpoint, scope);

alter table public.push_subscriptions enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists push_subscriptions_set_updated_at on public.push_subscriptions;
create trigger push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

drop policy if exists "Staff can read push subscriptions" on public.push_subscriptions;
create policy "Staff can read push subscriptions"
on public.push_subscriptions
for select
to authenticated
using (public.is_staff());

-- Webhook setup:
-- 1. In Supabase go to Database -> Webhooks.
-- 2. Create a webhook on table public.reservations for INSERT.
-- 3. URL: https://YOUR-VERCEL-DOMAIN/api/push/reservations
-- 4. Method: POST
-- 5. Header: x-webhook-secret = YOUR_PUSH_WEBHOOK_SECRET
-- 6. Body can use the default Supabase record payload.
