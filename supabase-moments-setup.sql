-- CSSF Moments setup
-- Run this in Supabase SQL Editor if public photo upload returns:
-- "Bucket not found"

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

alter table public.moments enable row level security;

grant insert on public.moments to anon, authenticated;
grant select, update, delete on public.moments to authenticated;

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cssf-moments',
  'cssf-moments',
  true,
  7340032,
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

do $$
begin
  alter publication supabase_realtime add table public.moments;
exception
  when duplicate_object then null;
end;
$$;
