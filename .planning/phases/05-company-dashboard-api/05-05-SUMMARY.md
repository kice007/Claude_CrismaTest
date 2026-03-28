---
phase: 05-company-dashboard-api
plan: "05"
subsystem: ui
tags: [react, tailwind, next.js, i18next, framer-motion, lucide-react, shadcn]

# Dependency graph
requires:
  - phase: 05-02
    provides: GET /api/candidates, GET /api/candidates/[id] route handlers
  - phase: 05-04
    provides: DashboardShell, Sidebar, BottomTabBar, (dashboard) layout with auth guard

provides:
  - /dashboard page: candidate list table with search, filters, selection, compare CTA
  - /dashboard/candidates/[id] page: full candidate detail view
  - CandidateTable component: shadcn Table with checkbox selection, score badges, row click
  - CandidateCard component: mobile card stack for candidate rows
  - ScoreGauge component: SVG circle gauge with Framer Motion strokeDashoffset animation
  - SubScoreBars component: 5 horizontal progress bars (logic/comms/job-skill/trust/video)
  - FraudFlagsPanel component: severity badge + flag list
  - AIInsightCard component: 3-bullet AI recommendation based on score thresholds

affects: [05-07, 05-08, 05-09, compare-flow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Base UI Select onValueChange receives (val: string | null) — null-guard required when forwarding to setState<string>"
    - "ScoreGauge: SVG strokeDasharray/strokeDashoffset animated via motion.circle with 1.5s ease-out"
    - "use(params) pattern for Next.js 16 App Router client component dynamic params"
    - "Candidate list + detail pages both use useEffect fetch with debounced search (300ms)"

key-files:
  created:
    - src/app/(dashboard)/dashboard/candidates/[id]/page.tsx
    - src/components/dashboard/CandidateTable.tsx
    - src/components/dashboard/CandidateCard.tsx
    - src/components/dashboard/ScoreGauge.tsx
    - src/components/dashboard/SubScoreBars.tsx
    - src/components/dashboard/FraudFlagsPanel.tsx
    - src/components/dashboard/AIInsightCard.tsx
  modified:
    - src/app/(dashboard)/dashboard/page.tsx

key-decisions:
  - "Base UI Select onValueChange typed as (val: string | null, eventDetails) => void — null-guard (val ?? 'all') applied to prevent SetStateAction<string> type error"
  - "ScoreGauge uses motion.circle from motion/react for strokeDashoffset animation — Framer Motion handles SVG attribute animation natively"
  - "AIInsightCard bullets are fully mocked based on score thresholds — no AI API calls in v1"
  - "Video score derived from (logic_score + comms_score) / 2 on detail page — API does not return a video_score field"
  - "FraudFlagsPanel uses MOCK_FLAGS lookup keyed by severity when no flags array provided"

patterns-established:
  - "Dashboard page layout: flex flex-col h-full overflow-y-auto bg-slate-50 with max-w-7xl mx-auto inner container"
  - "CandidateTable + CandidateCard dual-mode: hidden md:block (table) / md:hidden (card stack)"
  - "Score color coding: >=70 green, 50-69 amber, <50 red — used in both CandidateTable and ScoreGauge grade badge"

requirements-completed: [DASH-01, DASH-03]

# Metrics
duration: 23min
completed: 2026-03-28
---

# Phase 05 Plan 05: Candidate List and Detail Dashboard Views Summary

**Animated SVG CrismaScore gauge + candidate list table (DASH-01) and full detail view (DASH-03) wired to Supabase API routes with search, filter, and modal actions**

## Performance

- **Duration:** 23 min
- **Started:** 2026-03-28T16:28:36Z
- **Completed:** 2026-03-28T16:51:36Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- /dashboard page fully replaces stub: fetches /api/candidates, debounces search 300ms, applies role/status/score filters as query params, shows Compare Selected button when >=2 rows selected
- CandidateTable uses shadcn/ui Table with checkbox column (select-all + per-row), color-coded CrismaScore badges, status badges, eye icon row actions
- CandidateCard provides mobile card stack equivalent with 48px tap targets
- /dashboard/candidates/[id] loads full candidate detail: ScoreGauge animates 0→score on mount, SubScoreBars show 5 dimensions, FraudFlagsPanel shows severity badge + flag list
- Email address rendered as clickable mailto: link; Invite to Interview opens CalendarModal
- AIInsightCard generates 3 mocked recommendation bullets based on score range

## Task Commits

Each task was committed atomically:

1. **Task 1: /dashboard candidate list page** - `5c0a2cd` (feat)
2. **Task 2: /dashboard/candidates/[id] detail + shared components** - `d6f9bce` (feat)

**Plan metadata:** _(committed with state update)_

## Files Created/Modified
- `src/app/(dashboard)/dashboard/page.tsx` - Full candidates list page (replaces stub)
- `src/components/dashboard/CandidateTable.tsx` - shadcn Table with checkbox selection, score/status badges
- `src/components/dashboard/CandidateCard.tsx` - Mobile card representation of candidate row
- `src/app/(dashboard)/dashboard/candidates/[id]/page.tsx` - Candidate detail page with two-column layout
- `src/components/dashboard/ScoreGauge.tsx` - SVG circle gauge animated via Framer Motion
- `src/components/dashboard/SubScoreBars.tsx` - 5 horizontal sub-score progress bars
- `src/components/dashboard/FraudFlagsPanel.tsx` - Anti-fraud severity badge + flag list
- `src/components/dashboard/AIInsightCard.tsx` - Mocked 3-bullet AI recommendation card

## Decisions Made
- Base UI Select's `onValueChange` has type `(value: string | null, eventDetails) => void` — wrapped with `(val) => setState(val ?? 'all')` null-guard to satisfy TypeScript strict mode
- Video score not returned by `/api/candidates/[id]` — derived as `Math.round((logic_score + comms_score) / 2)` on the client; no plan change needed
- `use(params)` pattern required for Next.js 16 App Router to access dynamic params in a client component

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Base UI Select onValueChange null-guard**
- **Found during:** Task 1 verification (npm run build)
- **Issue:** `onValueChange={setRoleFilter}` type-errors because Base UI Select passes `string | null` but `setRoleFilter` expects `SetStateAction<string>`
- **Fix:** Wrapped handler: `(val) => setRoleFilter(val ?? 'all')`
- **Files modified:** src/app/(dashboard)/dashboard/page.tsx
- **Verification:** Build passed with no TypeScript errors
- **Committed in:** `5c0a2cd` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — type compatibility bug)
**Impact on plan:** Minor fix, no scope change.

## Issues Encountered
- None — both builds passed on first attempt after the null-guard fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DASH-01 and DASH-03 are complete; checkbox selection pattern established for compare flow (Plan 07)
- ScoreGauge, SubScoreBars, FraudFlagsPanel, AIInsightCard are reusable in compare view
- /dashboard/compare route (Plan 07) can receive `?ids=` query param from the Compare Selected button immediately
- No blockers for remaining Wave 2 plans

---
*Phase: 05-company-dashboard-api*
*Completed: 2026-03-28*
