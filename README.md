# KL SAC Website — Developer Handoff

> **For Nischal** — everything you need to deploy this on `sac.kluniversity.in`

---

## What this is

The new KL SAC (Student Activity Center) website built with **Next.js**, replacing the old site at `sac.kluniversity.in`. It currently connects to a **Supabase** PostgreSQL database — but for the college server deployment, swap it out for the college PostgreSQL database (see below). The student dashboard (`sacactivities.kluniversity.in`) remains separate — this site just links to it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (swap to college PostgreSQL — see below) |
| Auth | JWT-based admin auth (custom) |
| Hosting | College server (Node.js) |

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/pinnamanenirohith/KLSAC.git
cd KLSAC/NewSACWebsite/my-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in `my-app/` — get Supabase values from Rohith:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_JWT_SECRET=
ADMIN_SETUP_KEY=KLSACsetup2026
NEXT_PUBLIC_BASE_URL=https://sac.kluniversity.in
```

### 3. Build & Run

```bash
npm run build
npm start
```

The app runs on `http://localhost:3000` by default. Point Nginx to that port.

### 4. Nginx Config (example)

```nginx
server {
    listen 80;
    server_name sac.kluniversity.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> Add SSL via Let's Encrypt (`certbot`) to get HTTPS — required to show the padlock in the browser address bar.

---

## Migrating from Supabase to College PostgreSQL

The current codebase uses the Supabase client. If you're moving the database to the college server, here's what needs to change:

### 1. Install a PostgreSQL client

```bash
npm install pg
```

### 2. Replace the Supabase client

The Supabase client is initialised in `lib/supabase/server.ts` and `lib/supabase/client.ts`. Replace those with a direct `pg` pool:

```ts
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default pool;
```

Add these to `.env.local`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=klsac
DB_USER=
DB_PASSWORD=
```

### 3. Replace Supabase queries

Every API route uses `supabase.from('table').select/insert/update/upsert`. Replace with `pool.query(...)`. Example:

```ts
// Before (Supabase)
const { data } = await supabase.from('clubs').select('*').order('sort_order');

// After (pg)
const { rows: data } = await pool.query('SELECT * FROM clubs ORDER BY sort_order ASC');
```

### 4. Create the database tables

Run this SQL on the college PostgreSQL to create the required tables:

```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain_code TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  club_slug TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  competencies TEXT,
  month TEXT,
  week TEXT,
  activity_date DATE,
  venue TEXT,
  time_slot TEXT,
  difficulty TEXT DEFAULT 'Beginner',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  club_slug TEXT,
  domain TEXT,
  activity_date DATE,
  venue TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## What's Already Built

### Public Pages
- `/` — Homepage
- `/about` — About SAC
- `/domains` — All 5 domains (TEC, LCH, ESO, HWB, IIE)
- `/domains/[slug]` — Individual domain page
- `/clubs` — All clubs listing
- `/clubs/[slug]` — Individual club page with all activities
- `/activities` — All activities with domain/club filter
- `/events` — Events calendar
- `/contact` — Contact page
- `/achievements`, `/stories`, `/news`, `/publications`, `/leadership`, `/collaborate` — Static pages

### Admin Panel (`/admin`)
- Login at `/admin/login`
- Manage clubs, activities, events
- Domain filter + club filter on activities page
- Upload club photos

### Domains & Clubs (25 clubs across 5 domains)
| Domain | Clubs |
|---|---|
| TEC | 8 clubs |
| LCH | 11 clubs |
| ESO | 3 clubs (SVR club pending data) |
| HWB | 3 clubs |
| IIE | — (activities pending) |

### Activities Seeded (testing only — add fresh from admin after deploy)
- LCH: 210 activities across 11 clubs
- ESO: 60 activities across 3 clubs
- HWB: 30 activities across 3 clubs

---

## After Deployment — What to Add via Admin Panel

1. **Club details** — name, description, tagline, domain
2. **Club photos/logos** — upload from admin
3. **Activities** — add for each club (or use seed endpoints to bulk-load)
4. **Events** — any upcoming events with dates
5. **Leadership** — SAC leadership team details

---

## Seed Endpoints (Bulk Load Activities)

Hit these after deploy to load all activity data without entering one by one:

```bash
# LCH — 210 activities
curl -X POST https://sac.kluniversity.in/api/admin/seed/lch-activities \
  -H "x-setup-key: KLSACsetup2026"

# ESO — 60 activities
curl -X POST https://sac.kluniversity.in/api/admin/seed/eso-activities \
  -H "x-setup-key: KLSACsetup2026"

# HWB — 30 activities
curl -X POST https://sac.kluniversity.in/api/admin/seed/hwb-activities \
  -H "x-setup-key: KLSACsetup2026"
```

---

## Important Notes

- **No SDC credits** — all mentions removed site-wide intentionally
- **Student dashboard** — `sacactivities.kluniversity.in` is already linked everywhere, no changes needed
- **Admin login** — credentials are in the database, ask Rohith
- **IIE activities** — not yet added, pending content from Rohith

---

## Built By

**First SAC Website** — Deepak Reddy Gathpa & Tadikonda Sai Manikanta

**Current Website** — Rohith Venkata Sai Pinnamaneni & Singana Nischal
