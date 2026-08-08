create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null,
  title_en text not null,
  category_tr text not null,
  category_en text not null,
  description_tr text not null,
  description_en text not null,
  year text not null,
  href text not null,
  color text not null default '#0066ff',
  cover_image text,
  archived boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logo_works (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null,
  title_en text not null,
  category_tr text not null,
  category_en text not null,
  description_tr text not null,
  description_en text not null,
  initials text not null,
  color text not null default '#0066ff',
  logo_image text,
  archived boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.logo_works enable row level security;

create policy "published projects are public" on public.projects for select using (published = true);
create policy "signed-in users manage projects" on public.projects for all to authenticated using (true) with check (true);
create policy "published logo works are public" on public.logo_works for select using (published = true);
create policy "signed-in users manage logo works" on public.logo_works for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true) on conflict (id) do nothing;
create policy "portfolio assets are public" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "signed-in users upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets');
create policy "signed-in users update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets');
create policy "signed-in users delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets');

alter table public.projects add column if not exists archived boolean not null default false;
alter table public.logo_works add column if not exists archived boolean not null default false;
