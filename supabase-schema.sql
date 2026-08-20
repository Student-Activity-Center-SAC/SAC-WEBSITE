-- ================================================================
-- KL SAC Website — Supabase Database Schema
-- Run this once in Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Admin users
create table if not exists sac_admins (
  id            bigserial primary key,
  username      text unique not null,
  password_hash text not null,
  name          text,
  created_at    timestamptz default now()
);

-- Homepage stats
create table if not exists sac_stats (
  key        text primary key,
  value      integer not null default 0,
  label      text not null,
  suffix     text default '+',
  updated_at timestamptz default now()
);

-- News articles
create table if not exists news_articles (
  slug       text primary key,
  title      text not null,
  excerpt    text default '',
  body       text default '',
  category   text default 'General',
  date       date not null default current_date,
  featured   boolean default false,
  photo_url  text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities
create table if not exists activities (
  code          text primary key,
  club_slug     text not null,
  domain        text not null,
  title         text not null,
  description   text default '',
  competencies  text default '',
  activity_date date not null,
  venue         text default '',
  time_slot     text,
  difficulty    text default 'Beginner',
  sdc_credits   integer default 3,
  created_at    timestamptz default now()
);

-- Publications
create table if not exists publications (
  id                  text primary key,
  title               text not null,
  type                text not null default 'Magazine',
  year                text not null,
  description         text default '',
  pdf_url             text,
  download_available  boolean default true,
  sort_order          integer default 0,
  created_at          timestamptz default now()
);

-- Announcements
create table if not exists sac_announcements (
  id          bigserial primary key,
  title       text not null,
  content     text not null,
  type        text default 'general',
  created_by  text,
  created_at  timestamptz default now(),
  expires_at  timestamptz,
  is_active   boolean default true
);

-- Disable RLS (auth is handled by Next.js JWT middleware)
alter table sac_admins      disable row level security;
alter table sac_stats       disable row level security;
alter table news_articles   disable row level security;
alter table activities      disable row level security;
alter table publications    disable row level security;
alter table sac_announcements disable row level security;

-- ── Seed initial stats ───────────────────────────────────────────
insert into sac_stats (key, value, label, suffix) values
  ('students',     8500, 'Students Enrolled', '+'),
  ('clubs',          25, 'Active Clubs',       '' ),
  ('activities',    400, 'Annual Activities',  '+'),
  ('achievements',  150, 'Achievements',       '+')
on conflict (key) do nothing;

-- ── Seed existing publications ───────────────────────────────────
insert into publications (id, title, type, year, description, pdf_url, download_available, sort_order) values
  ('pub-aug-story',
   'The August Story — Volume 1',
   'Magazine', '2026',
   'A curated collection of stories, achievements, and highlights from KL SAC activities during August 2026.',
   '/publications/independence-day-2026.pdf', true, 1),
  ('pub-independence-day',
   'Independence Day 2026 — Event Report',
   'Newsletter', '2026',
   'Official documentation of the Independence Day 2026 celebrations at KL University, organised by KL SAC.',
   '/publications/august-story-vol1.pdf', true, 2)
on conflict (id) do nothing;

-- ── Clubs ────────────────────────────────────────────────────────
create table if not exists clubs (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  domain_code     text not null,
  domain_slug     text not null,
  tagline         text,
  about           jsonb default '[]',
  purpose         text,
  competencies    jsonb default '[]',
  activities_list jsonb default '[]',
  logo_url        text,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table clubs disable row level security;

-- Photo columns added for gallery feature
alter table clubs add column if not exists cover_url text;
alter table clubs add column if not exists gallery jsonb default '[]';

-- ── Council members ───────────────────────────────────────────────
create table if not exists council_members (
  id            text primary key,
  name          text not null,
  role          text not null,
  subtitle      text,
  photo         text,
  year_of_study text,
  branch        text,
  linkedin      text,
  journey       text,
  achievements  jsonb default '[]',
  clubs_list    jsonb default '[]',
  club_lead     text,
  is_faculty    boolean default false,
  designation   text,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table council_members disable row level security;

-- ── Student Stories ──────────────────────────────────────────────
create table if not exists stories (
  slug          text primary key,
  title         text not null,
  student_name  text not null,
  student_year  text,
  club_name     text,
  domain_code   text,
  excerpt       text default '',
  body          text default '',
  photo         text,
  tags          jsonb default '[]',
  featured      boolean default false,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table stories disable row level security;

-- ── Site Settings ─────────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      text default '',
  label      text not null,
  type       text default 'text',
  updated_at timestamptz default now()
);
alter table site_settings disable row level security;

insert into site_settings (key, value, label, type) values
  ('hero_video_url',  '',  'Hero Background Video URL',   'url'),
  ('hero_title',      '',  'Homepage Hero Title',          'text'),
  ('hero_subtitle',   '',  'Homepage Hero Subtitle',       'textarea'),
  ('about_tagline',   '',  'About Page Tagline',           'textarea'),
  ('home_meta_desc',  '',  'Homepage Meta Description',    'textarea')
on conflict (key) do nothing;

-- ── Storage bucket for media uploads ────────────────────────────
insert into storage.buckets (id, name, public)
  values ('sac-media', 'sac-media', true)
  on conflict do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Public read sac-media') then
    create policy "Public read sac-media"
      on storage.objects for select using (bucket_id = 'sac-media');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anon upload sac-media') then
    create policy "Anon upload sac-media"
      on storage.objects for insert with check (bucket_id = 'sac-media');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anon delete sac-media') then
    create policy "Anon delete sac-media"
      on storage.objects for delete using (bucket_id = 'sac-media');
  end if;
end $$;
