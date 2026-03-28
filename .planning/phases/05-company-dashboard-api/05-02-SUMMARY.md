---
phase: 05-company-dashboard-api
plan: "02"
subsystem: api
tags: [supabase, next.js, route-handlers, privacy, candidates, talent-pool]

requires:
  - phase: 05-01
    provides: supabase mock_candidates table seeded, createServerSupabaseClient established

provides:
  - GET /api/candidates — candidate list without email (DATA-06 privacy at query level)
  - GET /api/candidates/[id] — full candidate detail including email (DATA-07)
  - GET /api/talent-pool — candidates with crima_score >= 60, no email

affects: [05-wave2-dashboard-ui, candidate-list-views, talent-pool-views]

tech-stack:
  added: []
  patterns:
    - "Email privacy enforced at SELECT query level, not stripped in JS handler"
    - "PostgREST PGRST116 error code detected for 404 on .single() with no row"
    - "Query param filtering via chained .eq()/.ilike()/.gte()/.lte() on Supabase builder"
    - "All route handlers follow try/catch wrapping with { error: string } minimal responses"

key-files:
  created:
    - src/app/api/candidates/route.ts
    - src/app/api/candidates/[id]/route.ts
    - src/app/api/talent-pool/route.ts
    - src/app/(test)/test/[id]/info/page.tsx
  modified: []

key-decisions:
  - "Email excluded from /api/candidates and /api/talent-pool SELECT queries at DB level, not stripped in handler — enforces DATA-06 without runtime risk"
  - "PGRST116 PostgREST code checked explicitly for .single() not-found — returns 404 before logging as error"
  - "Talent pool threshold: crima_score >= 60 — differentiates pool from general candidate list"

patterns-established:
  - "Route handlers: try/catch entire handler, console.error('[route-name] supabase error:', error.message), return { error: string } with no internal detail"
  - "Single-row lookup: .single() + PGRST116 check for 404 before generic 500"

requirements-completed: [DATA-06, DATA-07, DATA-08]

duration: 9min
completed: 2026-03-28
---

# Phase 5 Plan 02: Candidates API Routes Summary

**Three Supabase-backed route handlers enforcing email privacy at query level: candidate list, candidate detail, and talent pool**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-28T16:10:03Z
- **Completed:** 2026-03-28T16:19:19Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- GET /api/candidates returns pageable candidate list with email intentionally excluded from SELECT (DATA-06 enforced at Supabase query level, not stripped in handler)
- GET /api/candidates/[id] returns full candidate record including email with PGRST116-aware 404 handling (DATA-07)
- GET /api/talent-pool returns crima_score >= 60 candidates ordered by score descending, all query params supported (DATA-08)
- All routes support ?role=, ?status=, ?search=, ?score_min=, ?score_max= filter params via chained Supabase query builder

## Task Commits

Each task was committed atomically:

1. **Task 1: GET /api/candidates + GET /api/candidates/[id]** - `4e81590` (feat)
2. **Task 2: GET /api/talent-pool** - `f322adb` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/app/api/candidates/route.ts` - GET /api/candidates — filtered list, email excluded
- `src/app/api/candidates/[id]/route.ts` - GET /api/candidates/[id] — full detail with email, 404 on PGRST116
- `src/app/api/talent-pool/route.ts` - GET /api/talent-pool — crima_score >= 60 filtered pool
- `src/app/(test)/test/[id]/info/page.tsx` - New page (auto-fix: modules string[] type applied)

## Decisions Made
- Email privacy enforced at SELECT query level (not stripped in JS) — removes any possibility of accidental exposure via refactor
- PGRST116 PostgREST error code detected explicitly for .single() not-found, returns 404; other errors return 500
- Talent pool threshold set to crima_score >= 60 per plan spec

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed mod.name type error in info/page.tsx**
- **Found during:** Task 1 verification (npm run build)
- **Issue:** `src/app/(test)/test/[id]/info/page.tsx` used `mod.name` and `mod.count` on loop variable `mod` but `test.modules` is typed as `string[]` — TypeScript error blocked build
- **Fix:** Changed loop variable references from `mod.name` to `mod` and `mod.count` fallback to `'–'`; `intro/page.tsx` had an identical pre-committed fix already applied
- **Files modified:** src/app/(test)/test/[id]/info/page.tsx
- **Verification:** Build passed after fix
- **Committed in:** `4e81590` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing type bug in info/page.tsx)
**Impact on plan:** Fix was required to unblock build verification. No scope change to the API routes.

## Issues Encountered
- Next.js 16 Turbopack on Windows exhibits transient ENOENT errors during parallel static page generation (race condition on tmp file writes). Required multiple build retries until a clean run completed. TypeScript compilation itself succeeded on every attempt.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 API routes operational and registered in the build manifest
- Dashboard Wave 2 UI can consume /api/candidates and /api/talent-pool immediately
- Detail views can consume /api/candidates/[id] for email mailto links

---
*Phase: 05-company-dashboard-api*
*Completed: 2026-03-28*
