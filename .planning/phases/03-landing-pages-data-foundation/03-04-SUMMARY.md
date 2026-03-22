---
phase: 03-landing-pages-data-foundation
plan: "04"
subsystem: ui, api
tags: [next.js, supabase, resend, zod, rate-limiting, dark-variant, contact-form]

# Dependency graph
requires:
  - phase: 03-01
    provides: Supabase client (createServerSupabaseClient), rate limiter (applyRateLimiter)
  - phase: 03-03
    provides: All 11 home section components with variant prop interface
provides:
  - /dark page — all 11 sections rendered with variant="dark" (navy backgrounds, white text)
  - POST /api/contact — rate-limited, Zod-validated, Supabase-persisted, Resend-notified
affects: [phase-04-candidates-page, phase-05-pricing-page]

# Tech tracking
tech-stack:
  added: [resend (email notifications)]
  patterns: [rate-limit-before-body-parse, db-insert-then-email-log-on-failure, literal-true-gdpr-enforcement]

key-files:
  created:
    - src/app/dark/page.tsx
  modified:
    - src/app/api/contact/route.ts

key-decisions:
  - "Rate limit applied before body parse — prevents DoS via large request body"
  - "gdprConsent: z.literal(true) enforces GDPR server-side — false/absent/any non-true value rejects submission"
  - "Resend email failure is caught and logged; never causes 500 — DB insert already succeeded"
  - "All API error responses are generic strings — no stack traces, SQL details, or internal paths"
  - "Switched from inline rate limiter to shared applyRateLimiter(req, 3, 3600) — 1-hour window per plan spec"

patterns-established:
  - "Dark page pattern: outer div sets bg-brand-navy, variant prop controls per-section color tokens"
  - "API security pattern: rate limit -> parse -> validate -> persist -> notify; each step returns generic errors"

requirements-completed: [LAND-02, DATA-01, DATA-02, SEC-01]

# Metrics
duration: 8min
completed: 2026-03-22
---

# Phase 03 Plan 04: Dark Page + Contact API Summary

**Dark home page at /dark with all 11 sections in navy/dark variant, and POST /api/contact wired to Supabase + Resend with 1-hour rate limiting and server-side GDPR enforcement**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-22T20:59:31Z
- **Completed:** 2026-03-22T21:07:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `/dark` page renders all 11 section components with `variant="dark"` — no duplication of component code
- `POST /api/contact` now persists to Supabase `contact_submissions` table and sends Resend email notification
- Rate limiter upgraded from 1-minute inline to 1-hour shared `applyRateLimiter` with proper ordering (before body parse)
- GDPR enforcement: `z.literal(true)` rejects any submission where `gdprConsent` is absent, false, or non-true
- SEC-01 compliance: all error responses are generic, no internal details leaked

## Task Commits

Each task was committed atomically:

1. **Task 1: Dark home page route (/dark)** - `e880ca8` (feat)
2. **Task 2: POST /api/contact route — rate limit + validate + persist + email** - `37319e1` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/app/dark/page.tsx` - Dark variant home page; passes variant="dark" to all 11 sections
- `src/app/api/contact/route.ts` - Replaced inline rate limiter with shared applyRateLimiter; added Supabase insert + Resend email

## Decisions Made
- Replaced the Plan 03-03 inline rate limiter (1-minute, custom Map logic) with the shared `applyRateLimiter(req, 3, 3600)` from `src/lib/rate-limiter.ts` — matches the plan spec of 3 requests per hour and avoids duplication
- Rate limit check placed before `req.json()` parse to prevent large-body DoS — plan explicitly specifies this ordering
- Resend email on failure: caught in try/catch and logged via `console.error` only; never causes a 500 because the DB insert already succeeded

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated rate limit window from 60s to 3600s**
- **Found during:** Task 2 (contact API implementation)
- **Issue:** The existing `route.ts` (created as part of Plan 03-03) used a 1-minute window (`RATE_LIMIT_WINDOW_MS = 60 * 1000`) and an inline rate limiter. Plan 04 spec requires 3 requests per hour (3600 seconds) using the shared `applyRateLimiter` utility.
- **Fix:** Replaced entire rate limiting implementation with `applyRateLimiter(req, 3, 3600)` from `@/lib/rate-limiter`; removed the inline Map, inline function, and globalThis cleanup interval.
- **Files modified:** `src/app/api/contact/route.ts`
- **Verification:** Build succeeds; `applyRateLimiter` call matches Plan 01 interface exactly
- **Committed in:** `37319e1` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug: wrong rate limit window in prior stub)
**Impact on plan:** Necessary correctness fix — the stub from 03-03 used wrong window duration. No scope creep.

## Issues Encountered
- The existing `route.ts` created in Plan 03-03 used a 60-second window and inline rate limiter. Plan 04 spec was authoritative (3 requests/hour, shared utility). Replaced entirely — handled as Rule 1 auto-fix.

## User Setup Required
External services require manual configuration before the API route is functional end-to-end:
- `RESEND_API_KEY` — Resend API key (from resend.com dashboard)
- `ADMIN_EMAIL` — Email address that receives demo request notifications
- `NEXT_PUBLIC_APP_URL` — Production app URL for the `from` email domain
- Supabase `contact_submissions` table must exist (created in Plan 03-01 migration)

## Next Phase Readiness
- /dark page is complete — all 11 sections render in dark variant; ready for visual QA
- POST /api/contact is production-ready pending environment variable configuration
- ContactForm component already submits to `/api/contact`; form-to-email flow is end-to-end connected
- Phase 3 is now feature-complete on the landing page and API layer

---
*Phase: 03-landing-pages-data-foundation*
*Completed: 2026-03-22*
