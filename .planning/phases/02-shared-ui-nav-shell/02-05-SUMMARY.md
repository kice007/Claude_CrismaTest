---
phase: 02-shared-ui-nav-shell
plan: "05"
subsystem: ui
tags: [react, next.js, tailwind, i18next, lucide-react, base-ui]

# Dependency graph
requires:
  - phase: 02-shared-ui-nav-shell/02-01
    provides: shadcn setup, sheet component, brand tokens, LanguageSwitcher
  - phase: 02-shared-ui-nav-shell/02-03
    provides: I18nProvider, Toaster wired in layout.tsx
provides:
  - Fixed responsive nav shell (NavShell, NavDesktop, NavMobile) wired into global layout
  - Glassmorphism scroll transition on nav header
  - Mobile hamburger menu with Sheet slide-down
  - Nav i18n keys in both locales (7 keys each)
  - layout.tsx final form: NavShell + pt-16 main spacer + overflow-x-hidden body
affects: [03-landing-pages, all-phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Fixed nav with useEffect scroll listener (no useCallback — React Compiler active)
    - LogoMark extracted as shared component to avoid SVG duplication
    - NavDesktop/NavMobile render at different breakpoints (hidden md:flex / flex md:hidden)
    - Base UI SheetTrigger uses render prop (not asChild) for custom button element

key-files:
  created:
    - src/components/nav/LogoMark.tsx
    - src/components/nav/NavDesktop.tsx
    - src/components/nav/NavMobile.tsx
    - src/components/nav/NavShell.tsx
  modified:
    - src/app/layout.tsx
    - locales/en.json
    - locales/fr.json

key-decisions:
  - "LogoMark extracted to shared component (src/components/nav/LogoMark.tsx) rather than duplicated in NavDesktop and NavMobile"
  - "Base UI SheetTrigger uses render prop pattern (not asChild) — Base UI v1 does not support asChild, uses render instead"
  - "NavShell placed inside I18nProvider in layout.tsx — NavDesktop/NavMobile call useTranslation() which requires i18n context"
  - "overflow-x-hidden on body prevents horizontal scroll at 320px viewport (LAND-08)"

patterns-established:
  - "Nav scroll glassmorphism: useEffect with passive scroll listener, setScrolled(window.scrollY > 8), no useCallback"
  - "Responsive breakpoint split: NavDesktop uses hidden md:flex, NavMobile uses flex md:hidden"
  - "All nav strings via useTranslation() — zero hardcoded English strings in JSX"

requirements-completed: [LAND-06, LAND-07, LAND-08, UI-07]

# Metrics
duration: 5min
completed: 2026-03-14
---

# Phase 2 Plan 05: Nav Shell Summary

**Fixed responsive nav shell with glassmorphism scroll transition, mobile Sheet hamburger, and full i18n via react-i18next wired into global layout**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-14T22:04:29Z
- **Completed:** 2026-03-14T22:09:30Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- NavShell (fixed header with useEffect scroll glassmorphism), NavDesktop (logo-left, links-center, CTAs-right), NavMobile (hamburger + Sheet slide-down) all created
- LogoMark extracted as shared inline SVG component to avoid duplication
- layout.tsx updated: NavShell inside I18nProvider, children in `<main className="pt-16 min-w-0">`, overflow-x-hidden on body
- 7 nav i18n keys added to both locales (en + fr) — zero hardcoded strings in JSX
- Build passes with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create NavShell, NavDesktop, NavMobile components** - `611c50d` (feat)
2. **Task 2: Wire NavShell into layout.tsx with content spacer** - `b4f5846` (feat)

## Files Created/Modified
- `src/components/nav/LogoMark.tsx` - Shared inline SVG diamond brand mark (28x28)
- `src/components/nav/NavDesktop.tsx` - Logo-left, center nav links, LanguageSwitcher+Login+SignUp right; hidden on mobile
- `src/components/nav/NavMobile.tsx` - Hamburger trigger + Sheet slide-down with all links; hidden on desktop
- `src/components/nav/NavShell.tsx` - Fixed header wrapper with scroll glassmorphism state via useEffect
- `src/app/layout.tsx` - NavShell mounted inside I18nProvider; children in main with pt-16 min-w-0; overflow-x-hidden on body
- `locales/en.json` - Added 7 nav translation keys
- `locales/fr.json` - Added 7 nav translation keys (French)

## Decisions Made
- **LogoMark as shared component:** The plan noted duplication was acceptable for this size, but extracting to `LogoMark.tsx` is cleaner — both NavDesktop and NavMobile import it.
- **Base UI SheetTrigger render prop:** The sheet.tsx uses `@base-ui/react/dialog` (not Radix), so `asChild` is not supported. Used `render` prop on SheetTrigger to render custom button element.
- **NavShell inside I18nProvider:** NavDesktop and NavMobile use `useTranslation()`, which requires i18n context — nav must be inside the provider.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] LogoMark extracted to shared component**
- **Found during:** Task 1 (creating NavDesktop and NavMobile)
- **Issue:** Plan suggested duplicating LogoMark SVG in both components; extraction is cleaner and avoids future sync bugs
- **Fix:** Created `src/components/nav/LogoMark.tsx`; both NavDesktop and NavMobile import it
- **Files modified:** src/components/nav/LogoMark.tsx (created)
- **Verification:** Type-check passes, build passes
- **Committed in:** 611c50d (Task 1 commit)

**2. [Rule 1 - Bug] Base UI SheetTrigger render prop instead of asChild**
- **Found during:** Task 1 (NavMobile implementation)
- **Issue:** Plan showed `<SheetTrigger asChild>` pattern (Radix UI style), but sheet.tsx uses `@base-ui/react/dialog` which uses `render` prop
- **Fix:** Changed to `<SheetTrigger render={<button ...>...</button>} />` pattern
- **Files modified:** src/components/nav/NavMobile.tsx
- **Verification:** Type-check passes with zero errors
- **Committed in:** 611c50d (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 — correctness)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
None — build passed first attempt after both corrections.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Global nav shell is in place — all Phase 3+ pages inherit it automatically via layout.tsx
- Nav links (/for-candidates, /for-companies, /pricing, /login, /sign-up) are wired but routes don't exist yet — Phase 3 will create them
- Language switcher works in nav (reads from i18n context)
- No blockers for Phase 3 landing pages

---
*Phase: 02-shared-ui-nav-shell*
*Completed: 2026-03-14*

## Self-Check: PASSED

- src/components/nav/NavShell.tsx: FOUND
- src/components/nav/NavDesktop.tsx: FOUND
- src/components/nav/NavMobile.tsx: FOUND
- src/components/nav/LogoMark.tsx: FOUND
- commit 611c50d (Task 1): FOUND
- commit b4f5846 (Task 2): FOUND
