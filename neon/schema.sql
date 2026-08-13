create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null, title_en text not null,
  category_tr text not null, category_en text not null,
  description_tr text not null, description_en text not null,
  year text not null, href text not null, color text not null default '#0066ff',
  cover_image text, published boolean not null default false,
  archived boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists logo_works (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null, title_en text not null,
  category_tr text not null, category_en text not null,
  description_tr text not null, description_en text not null,
  initials text not null, color text not null default '#0066ff', logo_image text,
  published boolean not null default false, archived boolean not null default false,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index if not exists projects_published_sort_order_idx on projects (published, archived, sort_order);
create index if not exists logo_works_published_sort_order_idx on logo_works (published, archived, sort_order);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project text not null,
  locale text not null check (locale in ('tr', 'en')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_requests_status_created_at_idx on contact_requests (status, created_at desc);
