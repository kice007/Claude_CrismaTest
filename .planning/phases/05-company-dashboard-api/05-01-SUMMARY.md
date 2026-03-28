---
phase: 05-company-dashboard-api
plan: 01
subsystem: ui
tags: [shadcn, tailwind, i18n, react, next, pdf]

# Dependency graph
requires:
  - phase: 02-shared-ui-nav-shell
    provides: shadcn init with Nova preset and brand HSL token pattern
  - phase: 03-landing-pages-data-foundation
    provides: locale file structure and i18n pattern (useTranslation)
provides:
  - shadcn table, badge, select, input, checkbox, tabs, separator components in src/components/ui/
  - public/crima-compare-report.pdf for Export Report CTA
  - Complete dashboard i18n namespace in en.json and fr.json (10 sub-namespaces, 100+ keys)
affects: [05-02, 05-03, 05-04, 05-05, 05-06, 05-07, 05-08, 05-09]

# Tech tracking
tech-stack:
  added: [shadcn@4.1.1 (table, badge, select, input, checkbox, tabs, separator)]
  patterns: [shadcn add does not overwrite globals.css — brand tokens survive component installs]

key-files:
  created:
    - src/components/ui/table.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/select.tsx
    - src/components/ui/input.tsx
    - src/components/ui/checkbox.tsx
    - src/components/ui/tabs.tsx
    - src/components/ui/separator.tsx
    - public/crima-compare-report.pdf
  modified:
    - locales/en.json
    - locales/fr.json

key-decisions:
  - "shadcn add (component install) does NOT overwrite globals.css :root — only shadcn init does. Brand tokens survive all future component additions."
  - "public/crima-compare-report.pdf is a minimal valid 600-byte PDF (no branding) — v1 requirement is downloadable file existence, not visual fidelity"
  - "All dashboard i18n keys pre-loaded in Wave 0 so zero missing-key fallbacks occur during component builds in subsequent plans"

patterns-established:
  - "dashboard.* i18n namespace: all dashboard strings live under top-level 'dashboard' key with sub-namespaces matching UI sections"
  - "Static PDF pattern: Export CTA downloads from /public — no dynamic PDF generation in v1"

requirements-completed: [DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DATA-04, DATA-05, DATA-06, DATA-07, DATA-08, DATA-09]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 05 Plan 01: Wave 0 Setup Summary

**7 shadcn UI components installed, static PDF placeholder created, and 100+ dashboard i18n keys pre-loaded in en.json/fr.json — all dependencies established before any dashboard component is built**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-28T13:10:05Z
- **Completed:** 2026-03-28T13:18:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Installed 7 shadcn components (table, badge, select, input, checkbox, tabs, separator) — all importable without error
- Confirmed brand HSL tokens survive `shadcn add` operations (no overwrite, unlike `shadcn init`)
- Created minimal valid PDF at public/crima-compare-report.pdf for Export Report CTA
- Pre-loaded complete dashboard i18n namespace (10 sub-namespaces: nav, sidebar, candidateTable, candidateDetail, compare, talentPool, buildTest, tests, testDetail, status, errors) in both en.json and fr.json

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn components + restore brand tokens** - `06a1202` (chore)
2. **Task 2: Create static PDF + pre-load all dashboard i18n keys** - `127ec65` (feat)

## Files Created/Modified
- `src/components/ui/table.tsx` - shadcn Table component
- `src/components/ui/badge.tsx` - shadcn Badge component
- `src/components/ui/select.tsx` - shadcn Select component
- `src/components/ui/input.tsx` - shadcn Input component
- `src/components/ui/checkbox.tsx` - shadcn Checkbox component
- `src/components/ui/tabs.tsx` - shadcn Tabs component
- `src/components/ui/separator.tsx` - shadcn Separator component
- `public/crima-compare-report.pdf` - Minimal valid PDF for Export Report CTA (600 bytes)
- `locales/en.json` - Added complete dashboard namespace with 10 sub-namespaces
- `locales/fr.json` - Added complete dashboard namespace in formal French (vous register)

## Decisions Made
- `shadcn add` (post-init component install) does NOT overwrite globals.css — unlike `shadcn init` which rewrites :root. No manual brand token restoration was needed. This updates the established Phase 02-01 decision.
- PDF placeholder is a minimal valid 600-byte PDF. The requirement is "downloadable file" — v1 does not need visual branding on the exported PDF.
- All dashboard keys pre-loaded before any component is built — eliminates missing-key fallbacks (i18n audit pattern established in Phase 02).

## Deviations from Plan

None — plan executed exactly as written. The `shadcn add` command did not require brand token restoration (unlike `shadcn init`), which is a clarification to the existing pattern, not a deviation.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- All 7 shadcn UI components available for import in Phase 5 dashboard components
- PDF at /crima-compare-report.pdf ready for static download link in Compare view
- All dashboard strings available via `useTranslation()` with `dashboard.*` key pattern
- Ready to proceed with Wave 1: candidate dashboard UI (plans 02-05)

---
*Phase: 05-company-dashboard-api*
*Completed: 2026-03-28*
