---
phase: 04-auth-test-flow
plan: "00"
subsystem: auth
tags: [next.js, middleware, localStorage, cookie, i18n, dnd-kit, canvas-confetti]

requires:
  - phase: 03-landing-pages-data-foundation
    provides: locale file structure (locales/en.json, locales/fr.json) used as base

provides:
  - src/proxy.ts — cookie-based protected route guard for /dashboard and /test/* routes
  - src/lib/auth.ts — visual auth helpers (setAuthSession, clearAuthSession, getIsLoggedIn)
  - src/lib/mock-data.ts — MOCK_TEST with 12 typed questions covering all 6 question types
  - src/app/(auth)/layout.tsx — full-screen auth route group, no NavShell, no pt-16
  - src/app/(test)/layout.tsx — full-screen test route group, no NavShell, no pt-16
  - locales/en.json + fr.json — complete auth_* and test_* i18n keys (130+ keys added)

affects:
  - 04-01 (auth pages import setAuthSession/clearAuthSession/getIsLoggedIn)
  - 04-02 through 04-05 (test-flow pages import MOCK_TEST, use test_* keys)
  - All Phase 4 plans that render under (auth) or (test) route groups

tech-stack:
  added:
    - "@dnd-kit/core ^6.3.1"
    - "@dnd-kit/sortable ^10.0.0"
    - "@dnd-kit/utilities ^3.2.2"
    - "canvas-confetti ^1.9.4"
    - "@types/canvas-confetti ^1.9.0"
  patterns:
    - "proxy.ts (not middleware.ts) for Next.js 16 protected routes — function named proxy not middleware"
    - "localStorage flag + companion cookie pattern for visual auth state"
    - "Route group layouts ((auth), (test)) to override root layout NavShell + pt-16"
    - "All i18n keys pre-loaded into locale files before any component is built"

key-files:
  created:
    - src/proxy.ts
    - src/lib/auth.ts
    - src/lib/mock-data.ts
    - src/app/(auth)/layout.tsx
    - src/app/(test)/layout.tsx
  modified:
    - locales/en.json (auth_* and test_* keys added)
    - locales/fr.json (auth_* and test_* keys added, vous register)
    - src/lib/utils.ts (formatTime added)

key-decisions:
  - "Next.js 16 proxy.ts: function named proxy (not middleware), file named proxy.ts (not middleware.ts)"
  - "Visual-only auth: localStorage key crismatest_isLoggedIn for UI reactivity + crismatest_auth cookie for proxy.ts edge guard"
  - "Cookie name crismatest_auth with value '1' — all code must use exactly these strings"
  - "Route groups (auth) and (test) each have their own layout.tsx suppressing the root NavShell + pt-16"
  - "All 130+ auth_* and test_* i18n keys added to both locales before any Phase 4 component is built"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, TEST-01, TEST-02, TEST-03, TEST-04, TEST-05]

duration: 10min
completed: 2026-03-24
---

# Phase 4 Plan 00: Auth + Test-Flow Foundation Summary

**Visual auth helpers (localStorage + cookie), protected route guard (proxy.ts), MOCK_TEST with 12 typed questions, route group layouts suppressing NavShell, and 130+ i18n keys pre-loaded for auth and test-flow screens**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-24T13:00:00Z
- **Completed:** 2026-03-24T13:11:57Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Cookie-based protected route guard in src/proxy.ts — unauthenticated requests to /dashboard and /test/* redirect to /login with `from` param
- Visual auth helpers in src/lib/auth.ts — setAuthSession sets both localStorage flag and document.cookie; clearAuthSession clears both; getIsLoggedIn is SSR-safe
- Static MOCK_TEST in src/lib/mock-data.ts — 12 questions covering all 6 types (qcm, dragdrop, casestudy, simulation, audiovideo, shorttext)
- Route group layouts created for (auth) and (test) — both render children in `<main className="min-h-screen">` with no NavShell or pt-16
- 130+ auth_* and test_* i18n keys added to both locales/en.json and locales/fr.json before any Phase 4 component is built

## Task Commits

1. **Task 1: Install packages + create proxy.ts + auth.ts + mock-data.ts** - `cfe11a9` (feat)
2. **Task 2: Route group layouts + i18n keys (auth + test-flow)** - `7be7d05` (feat)

## Files Created/Modified

- `src/proxy.ts` — Next.js 16 protected route guard; exports proxy function and config matcher
- `src/lib/auth.ts` — Visual auth: setAuthSession, clearAuthSession, getIsLoggedIn
- `src/lib/mock-data.ts` — MOCK_TEST constant with 12 questions, MockTest and MockQuestion types
- `src/lib/utils.ts` — formatTime(seconds) helper added
- `src/app/(auth)/layout.tsx` — Full-screen layout for auth pages, no NavShell
- `src/app/(test)/layout.tsx` — Full-screen layout for test-flow pages, no NavShell
- `locales/en.json` — auth_* and test_* keys added (130+ keys)
- `locales/fr.json` — auth_* and test_* keys added in French vous register (130+ keys)

## Decisions Made

- Next.js 16 uses proxy.ts (not middleware.ts); function must be named `proxy` not `middleware` — critical for the edge runtime to pick it up
- Visual-only auth uses two simultaneous stores: localStorage key `crismatest_isLoggedIn` for UI reactivity + cookie `crismatest_auth=1` for proxy.ts edge guard — both must be set/cleared together
- Cookie value '1' (not 'true') chosen for minimal footprint; all code must agree on this string
- formatTime added to utils.ts (not a separate file) — fits the existing utility pattern

## Deviations from Plan

None — plan executed exactly as written. Task 1 was already committed before this execution; Task 2 completed the remaining work (layouts + i18n keys).

## Issues Encountered

- Task 1 was already committed in a previous partial execution (commit `cfe11a9`). The locale files were also pre-populated with auth keys by a 04-01 continuation agent (commit `35a41af`). Task 2 confirmed all required keys were present and added any remaining missing keys.
- i18n keys were largely pre-populated by 04-01 agent before Task 2 ran — deduplication was handled gracefully (existing keys untouched, new keys appended).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All foundation files ready for 04-01 (auth pages) and 04-02 through 04-05 (test-flow pages)
- MOCK_TEST id is 'sample' — all Phase 4 test-flow development uses /test/sample/intro
- Cookie name crismatest_auth and localStorage key crismatest_isLoggedIn are canonical — do not change in downstream plans

---

## Self-Check

- `src/proxy.ts` — FOUND (committed in cfe11a9)
- `src/lib/auth.ts` — FOUND (committed in cfe11a9)
- `src/lib/mock-data.ts` — FOUND (committed in cfe11a9)
- `src/app/(auth)/layout.tsx` — FOUND (committed in 7be7d05)
- `src/app/(test)/layout.tsx` — FOUND (committed in 7be7d05)
- `locales/en.json auth_signup_title` — FOUND
- `locales/fr.json test_intro_cta` — FOUND
- commit cfe11a9 — FOUND
- commit 7be7d05 — FOUND

## Self-Check: PASSED

---
*Phase: 04-auth-test-flow*
*Completed: 2026-03-24*
