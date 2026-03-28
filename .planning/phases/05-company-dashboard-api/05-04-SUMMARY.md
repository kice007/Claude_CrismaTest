---
phase: 05-company-dashboard-api
plan: 04
subsystem: ui
tags: [react, tailwind, next.js, i18next, lucide-react, auth]

# Dependency graph
requires:
  - phase: 05-company-dashboard-api
    provides: dashboard i18n keys in locale files (pre-loaded by Plan 01 — added here as Rule 3 deviation)
  - phase: 04-auth-test-flow
    provides: useAuth() hook, isLoggedIn, login/logout, auth-context.tsx
provides:
  - DashboardShell component: fixed inset-0 z-50 overlay with Sidebar + BottomTabBar
  - Sidebar component: brand-navy 240px desktop sidebar with 4 nav items + user section
  - BottomTabBar component: mobile 5-icon tab bar (56px, brand-navy)
  - src/app/(dashboard)/layout.tsx: route group layout with auth guard
  - NavShell suppression on /dashboard/* via pathname early-return guard
affects: [05-05, 05-06, 05-07, 05-08, 05-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route group (dashboard) layout: auth guard + DashboardShell wrapper pattern"
    - "Belt-and-suspenders NavShell suppression: fixed z-50 overlay + pathname early-return"
    - "Dashboard auth guard: useEffect redirect pattern — if (!isLoggedIn) router.replace('/login')"
    - "Rules of Hooks compliance: early-return guard placed AFTER all hook calls"

key-files:
  created:
    - src/components/dashboard/Sidebar.tsx
    - src/components/dashboard/BottomTabBar.tsx
    - src/components/dashboard/DashboardShell.tsx
    - src/app/(dashboard)/layout.tsx
    - src/app/(dashboard)/dashboard/page.tsx
  modified:
    - src/components/nav/NavShell.tsx
    - locales/en.json
    - locales/fr.json
    - src/app/(test)/test/[id]/intro/page.tsx

key-decisions:
  - "Dashboard early-return guard placed AFTER all hooks in NavShell — Rules of Hooks compliance"
  - "Dashboard i18n keys added to locale files as Rule 3 deviation — Plan 01 not yet executed but Plan 04 components require them"
  - "DashboardShell uses fixed inset-0 z-50 as layer 1 NavShell suppression; NavShell pathname check is layer 2"
  - "BottomTabBar Profile tab uses toast('Profile coming soon') — no profile page in v1"

patterns-established:
  - "Route group (dashboard) auth guard: useEffect + router.replace('/login') if !isLoggedIn, return null while redirecting"
  - "Sidebar active state: exact match for /dashboard, startsWith for /dashboard/tests and /dashboard/talent-pool"

requirements-completed: [DASH-01, DASH-02]

# Metrics
duration: 35min
completed: 2026-03-28
---

# Phase 05 Plan 04: Dashboard Shell Layout Summary

**Brand-navy Sidebar + mobile BottomTabBar wired into (dashboard) route group with auth guard and dual-layer NavShell suppression**

## Performance

- **Duration:** 35 min
- **Started:** 2026-03-28T05:00:00Z
- **Completed:** 2026-03-28T05:35:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- DashboardShell built as fixed inset-0 z-50 overlay that covers the global NavShell on all dashboard routes
- Sidebar (240px desktop, brand-navy) with 4 nav items + user section + logout; active state via pathname matching
- BottomTabBar (56px mobile, brand-navy) with 5 icon tabs; Profile tab shows toast placeholder
- (dashboard) route group layout.tsx with useAuth() guard redirecting unauthenticated users to /login
- NavShell updated with /dashboard/* early-return placed after all hooks (Rules of Hooks compliant)

## Task Commits

Each task was committed atomically:

1. **Task 1: Sidebar + BottomTabBar components** - `daeb9cc` (feat)
2. **Task 2: DashboardShell + (dashboard)/layout.tsx + NavShell suppression** - `5013d39` (feat)

**Plan metadata:** _(committed with state update)_

## Files Created/Modified
- `src/components/dashboard/Sidebar.tsx` - Brand-navy 240px sidebar with nav + user section
- `src/components/dashboard/BottomTabBar.tsx` - Mobile 5-icon tab bar, fixed bottom-0, brand-navy
- `src/components/dashboard/DashboardShell.tsx` - Full-page dashboard container (fixed inset-0 z-50)
- `src/app/(dashboard)/layout.tsx` - Route group layout with auth guard + DashboardShell
- `src/app/(dashboard)/dashboard/page.tsx` - Stub page for /dashboard route
- `src/components/nav/NavShell.tsx` - Added /dashboard/* early-return guard after all hooks
- `locales/en.json` - Added complete dashboard namespace with all sub-keys
- `locales/fr.json` - Added complete dashboard namespace (formal vous register)
- `src/app/(test)/test/[id]/intro/page.tsx` - Fixed pre-existing type error in modules map

## Decisions Made
- Early-return guard in NavShell placed AFTER all hook calls to comply with Rules of Hooks — cannot place before useAuth() which is declared after usePathname()
- Dashboard i18n keys added in this plan as a Rule 3 deviation because Plan 01 was not yet executed but the Sidebar/BottomTabBar components require them
- Profile tab in BottomTabBar shows sonner toast "Profile coming soon" — no profile route in v1 per CONTEXT.md

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added dashboard i18n namespace to locale files**
- **Found during:** Task 1 (Sidebar + BottomTabBar)
- **Issue:** Plan 04 depends on Plan 01 for dashboard i18n keys, but Plan 01 had not been executed — locale files had no `dashboard` namespace, so all `t('dashboard.nav.*')` calls would fall back to key strings
- **Fix:** Added complete `dashboard` namespace to en.json and fr.json following the exact key structure specified in Plan 01 Task 2
- **Files modified:** locales/en.json, locales/fr.json
- **Verification:** TypeScript compiles without errors; build passes
- **Committed in:** daeb9cc (Task 1 commit)

**2. [Rule 1 - Bug] Fixed pre-existing type error in intro/page.tsx modules map**
- **Found during:** Task 2 verification (npm run build)
- **Issue:** `test.modules` is `string[]` in MockTest type but intro/page.tsx treated each element as `{ name: string, count: number }` — TypeScript error blocking build
- **Fix:** Changed `mod.name` → `modName` and `mod.count` → `''` for the duration fallback
- **Files modified:** src/app/(test)/test/[id]/intro/page.tsx
- **Verification:** Build passes with no TypeScript errors
- **Committed in:** 5013d39 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking prerequisite, 1 pre-existing bug)
**Impact on plan:** Both fixes necessary for build to pass. No scope creep. Dashboard keys follow Plan 01 spec exactly.

## Issues Encountered
- Build intermittently failed with lock file / ENOTEMPTY errors — cleared .next directory between attempts; infrastructure-level race condition, not a code issue
- NavShell was modified externally between edits (linter restored commented NavDesktop/NavMobile imports and added an app nav section) — re-applied dashboard guard after external modification

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DashboardShell is complete and ready for all Wave 2 dashboard views (Plans 05-09)
- Auth guard pattern established — every new dashboard page gets protection automatically via the route group layout
- Sidebar active state will highlight correctly as new routes are added under /dashboard/*
- No blockers for Wave 2 implementation

---
*Phase: 05-company-dashboard-api*
*Completed: 2026-03-28*
