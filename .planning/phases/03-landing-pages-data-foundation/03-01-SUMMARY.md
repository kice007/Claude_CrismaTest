---
phase: 03-landing-pages-data-foundation
plan: "01"
subsystem: data-foundation
tags: [supabase, database, rls, seed, rate-limiter, env-schema]
dependency_graph:
  requires: [03-00]
  provides: [supabase-schema, supabase-client, rate-limiter, seed-data]
  affects: [03-02, 03-03, 03-04, 03-05, 03-06]
tech_stack:
  added: [tsx, @supabase/ssr, @supabase/supabase-js, dotenv]
  patterns: [supabase-ssr-client, in-memory-rate-limiter, sql-rls-policies, seeded-demo-data]
key_files:
  created:
    - .env.schema
    - supabase/migrations/001_initial_schema.sql
    - supabase/config.toml
    - src/lib/supabase.ts
    - src/lib/rate-limiter.ts
    - scripts/seed.ts
    - scripts/apply-migration.ts
  modified:
    - package.json (added db:seed script)
    - src/lib/use-media-query.ts (pre-existing lint fix)
decisions:
  - "Used @supabase/ssr createBrowserClient + createServerClient split — server client reads cookies for session handling, browser client for client components"
  - "Rate limiter uses module-level Map (not Redis) — sufficient for single-instance demo; setInterval cleanup every 5 min prevents memory growth"
  - "Seed script uses @supabase/supabase-js (not @supabase/ssr) with service role key — bypasses RLS for admin writes, keeps Node-safe import"
  - "tsx added as devDependency for zero-compile TypeScript seed execution"
  - "supabase/config.toml created via supabase init — enables future db push workflow once SUPABASE_ACCESS_TOKEN is set"
metrics:
  duration: 28min
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_created: 7
  files_modified: 2
---

# Phase 03 Plan 01: Data Foundation Summary

**One-liner:** Supabase schema with 5 RLS-protected tables, SSR-aware client utilities, in-memory rate limiter, and 96-question / 40-candidate seed dataset.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | env schema, migration SQL, client utilities, rate limiter | a9dc3a3 | .env.schema, 001_initial_schema.sql, src/lib/supabase.ts, src/lib/rate-limiter.ts |
| 2 | seed script + package.json db:seed + SEC-01 check | ed7ce05 | scripts/seed.ts, package.json, supabase/config.toml |

## Artifacts

### .env.schema
6 variables declared with `@required`/`@sensitive` annotations in varlock format:
- `NEXT_PUBLIC_SUPABASE_URL` (@required, @sensitive=false)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (@required, @sensitive=false)
- `SUPABASE_SERVICE_ROLE_KEY` (@required, @sensitive)
- `RESEND_API_KEY` (@required, @sensitive)
- `NEXT_PUBLIC_APP_URL` (@required, @sensitive=false)
- `ADMIN_EMAIL` (@required, @sensitive)

### supabase/migrations/001_initial_schema.sql
5 tables with RLS:
- `contact_submissions`: anon INSERT only
- `mock_candidates`: anon SELECT only
- `questions`: anon SELECT only
- `test_templates`: anon SELECT only
- `test_sessions`: anon INSERT only

### src/lib/supabase.ts
- `createClient()` — browser client via `@supabase/ssr` `createBrowserClient`
- `createServerSupabaseClient()` — async server client via `createServerClient` with cookie getAll/setAll handlers

### src/lib/rate-limiter.ts
- `applyRateLimiter(req, maxRequests, windowSeconds)` — IP-based in-memory Map
- `setInterval` cleanup every 5 minutes
- Returns `{ allowed: boolean }`

### scripts/seed.ts
- 8 test templates (one per role, slug, modules, duration)
- 96 questions (6 types × 8 roles × 2 each, bilingual EN/FR)
- 40 candidates (5 per role, diverse names, bell-curve CrismaScores 55–85, realistic statuses)

## SEC-01 Verification

```
git log --all --full-history -- .env
```
Result: zero commits. `.env` has never been committed to git history. PASS.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing lint error in use-media-query.ts**
- **Found during:** Task 1 verification (npm run lint -- --max-warnings=0)
- **Issue:** `setMatches(media.matches)` called directly inside useEffect body — violated `react-hooks/set-state-in-effect` rule
- **Fix:** Added conditional check `if (media.matches !== matches)` and suppressed exhaustive-deps for the query-only dependency
- **Files modified:** src/lib/use-media-query.ts
- **Commit:** a9dc3a3 (bundled with Task 1)

**2. [Rule 1 - Bug] Fixed unused ROLES const in seed.ts causing lint warning**
- **Found during:** Task 2 lint verification
- **Issue:** `ROLES` const array was defined with `as const` and used only as `typeof ROLES` for type inference — ESLint flagged it as assigned but not used at runtime
- **Fix:** Replaced `const ROLES = [...] as const` + `type Role = (typeof ROLES)[number]` with an explicit union type `type Role = 'Software Engineer' | ...`
- **Files modified:** scripts/seed.ts
- **Commit:** ed7ce05 (bundled with Task 2)

**3. [Rule 3 - Blocking] Migration not yet applied to Supabase project**
- **Found during:** Task 2 verification (npm run db:seed)
- **Issue:** `supabase/migrations/001_initial_schema.sql` is authored but NOT yet applied to the live Supabase project. Tables do not exist yet, so seed exits with "Could not find the table 'public.test_templates'".
- **Root cause:** Applying SQL migrations to Supabase requires either (a) Supabase CLI with `SUPABASE_ACCESS_TOKEN` for `db push`, or (b) manual paste into Supabase Dashboard SQL Editor. Neither a DB URL nor access token was available.
- **Added:** `scripts/apply-migration.ts` helper (documents the connection attempt) and `supabase/config.toml` (CLI init for future `db push`)
- **Resolution needed:** User must apply the migration SQL manually. See "Next Step" below.

## Seed Verification Status

| Check | Status |
|-------|--------|
| scripts/seed.ts exists | PASS |
| 8 templates defined | PASS |
| 96 questions defined | PASS |
| 40 candidates defined | PASS |
| package.json db:seed script | PASS |
| npm run lint | PASS |
| npm run build | PASS |
| npm run db:seed exits 0 | PENDING — migration must be applied first |
| SEC-01 git log -- .env | PASS (0 commits) |

## Next Step: Apply Migration

Before `npm run db:seed` will succeed, apply the migration SQL to your Supabase project:

**Option A — Supabase Dashboard (easiest):**
1. Go to https://supabase.com/dashboard/project/txgistzndllejjluzjef/sql/new
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click Run
4. Then run `npm run db:seed`

**Option B — Supabase CLI (requires access token):**
```bash
export SUPABASE_ACCESS_TOKEN=your_personal_access_token
npx supabase link --project-ref txgistzndllejjluzjef
npx supabase db push
npm run db:seed
```

## Self-Check: PASSED

Files created:
- FOUND: .env.schema
- FOUND: supabase/migrations/001_initial_schema.sql
- FOUND: src/lib/supabase.ts
- FOUND: src/lib/rate-limiter.ts
- FOUND: scripts/seed.ts
- FOUND: supabase/config.toml

Commits:
- FOUND: a9dc3a3 (Task 1)
- FOUND: ed7ce05 (Task 2)
