---
phase: 02-shared-ui-nav-shell
plan: "02"
subsystem: ui
tags: [skeleton, shimmer, empty-state, error-pages, css-animation, prefers-reduced-motion, next-app-router]

# Dependency graph
requires:
  - phase: 02-shared-ui-nav-shell
    plan: "01"
    provides: cn() utility in src/lib/utils.ts, brand tokens in globals.css (@theme inline), shadcn primitives

provides:
  - src/components/Skeleton.tsx — shimmer loading placeholder with CSS-only animation
  - src/components/EmptyState.tsx — empty state card with inline SVG, title, body, optional CTA
  - src/app/not-found.tsx — branded 404 page using EmptyState
  - src/app/error.tsx — branded 500/error-boundary page using EmptyState (Client Component)
  - .shimmer CSS class + @keyframes shimmer + prefers-reduced-motion override in globals.css

affects:
  - All phases 3-6 that render loading states (Skeleton) or empty data views (EmptyState)
  - Any route that needs branded error fallback behaviour

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS-only shimmer animation via .shimmer class (no Framer Motion dependency for performance)
    - prefers-reduced-motion override on .shimmer disables animation and flattens to solid neutral-100
    - EmptyState is a pure Server Component; error.tsx is the only Client Component (Next.js App Router requirement)
    - Inline SVG illustration (blue-palette geometric shapes) keeps zero external image dependency

key-files:
  created:
    - src/components/Skeleton.tsx
    - src/components/EmptyState.tsx
    - src/app/not-found.tsx
    - src/app/error.tsx
  modified:
    - src/app/globals.css (shimmer @keyframes + .shimmer class + reduced-motion override appended)

key-decisions:
  - "Skeleton uses .shimmer CSS class (not Framer Motion) — CSS-only for performance; zero JS overhead"
  - "error.tsx requires 'use client' — Next.js App Router mandates this for error boundary files; not-found.tsx stays a Server Component"
  - "EmptyState inline SVG uses hardcoded hex values matching brand palette (#1B4FD8, #EEF2FF, #6366F1) — SVG does not participate in Tailwind class resolution"

patterns-established:
  - "Skeleton: apply className prop via cn() to control width/height/border-radius at call site"
  - "EmptyState: use for all zero-data and error states throughout phases 3-6"
  - "Error pages: not-found.tsx = Server Component, error.tsx = Client Component — follow this split for all future App Router error files"

requirements-completed: [UI-01, UI-02, UI-05, UI-06]

# Metrics
duration: 2min
completed: 2026-03-14
---

# Phase 02 Plan 02: Skeleton, EmptyState, and Branded Error Pages Summary

**CSS-only shimmer Skeleton primitive, EmptyState component with inline SVG illustration, and branded 404/500 App Router pages — all building on Plan 01's cn() utility and brand tokens**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-14T21:55:31Z
- **Completed:** 2026-03-14T21:56:51Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Skeleton shimmer primitive using CSS-only @keyframes animation with prefers-reduced-motion override (UI-01, UI-06)
- EmptyState component with inline SVG geometric illustration, title/body/CTA props, and 48px touch target on CTA (UI-02, UI-07)
- Branded 404 page (not-found.tsx) and 500/error-boundary page (error.tsx) both using EmptyState (UI-05)
- Production build passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shimmer CSS to globals.css and create Skeleton component** - `9c57330` (feat)
2. **Task 2: Create EmptyState component and branded 404/500 pages** - `5c9755b` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/globals.css` - Shimmer @keyframes + .shimmer class + prefers-reduced-motion override appended after @layer base
- `src/components/Skeleton.tsx` - Shimmer loading placeholder; className prop controls width/height/radius
- `src/components/EmptyState.tsx` - Empty state card with inline SVG, title, body, optional CTA link (min-h-[48px])
- `src/app/not-found.tsx` - Branded 404 page (Server Component) using EmptyState
- `src/app/error.tsx` - Branded 500/error-boundary page (Client Component, 'use client') using EmptyState

## Decisions Made

- **CSS-only shimmer** — Skeleton uses the .shimmer CSS class and @keyframes, not Framer Motion. This avoids any JS overhead for loading skeletons and keeps the component a Server Component.
- **error.tsx is Client Component** — Next.js App Router requires error.tsx files to be Client Components for error boundary wiring; not-found.tsx has no such constraint and remains a Server Component.
- **Inline SVG with hardcoded hex** — The SVG illustration uses raw hex values matching the brand palette since SVG attributes are not processed by Tailwind's class engine.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Skeleton available at `@/components/Skeleton` for all loading states in phases 3-6
- EmptyState available at `@/components/EmptyState` for zero-data and error views
- Branded 404 and 500 error pages active for all routes
- Wave 2 plans (03+) can consume these primitives immediately

---
*Phase: 02-shared-ui-nav-shell*
*Completed: 2026-03-14*

## Self-Check: PASSED

- FOUND: src/app/globals.css
- FOUND: src/components/Skeleton.tsx
- FOUND: src/components/EmptyState.tsx
- FOUND: src/app/not-found.tsx
- FOUND: src/app/error.tsx
- FOUND: commit 9c57330
- FOUND: commit 5c9755b
