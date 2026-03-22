---
phase: 03-landing-pages-data-foundation
plan: "02"
subsystem: ui
tags: [i18n, react-i18next, translations, landing-page, bilingual]

# Dependency graph
requires:
  - phase: 03-00
    provides: Supabase client, rate limiter, and data layer foundation

provides:
  - Complete bilingual (EN/FR) translation keys for all 11 landing page sections
  - home_hero_, home_trust_, home_what_is_, home_how_, home_companies_, home_antifraid_, home_tests_, home_testimonial_, home_faq_, contact_form_, home_footer_ key namespaces

affects:
  - 03-03-landing-page-sections (will consume home_ keys via useTranslation())
  - 03-04-contact-form (will consume contact_form_ keys)
  - Any future component in src/components/home/

# Tech tracking
tech-stack:
  added: []
  patterns:
    - All landing page strings pre-declared in locale files before component authoring
    - Key prefix convention: section_element (e.g., home_hero_headline, contact_form_submit)

key-files:
  created: []
  modified:
    - locales/en.json
    - locales/fr.json

key-decisions:
  - "All 11 landing page section copy blocks pre-loaded into locale files before components are built — eliminates missing-key fallback strings during component development"
  - "French translations use formal vous register throughout — consistent with B2B professional context"
  - "Job role templates (home_tests_template_*) translated to French equivalents — Data Analyst kept as-is, widely understood in French professional context"

patterns-established:
  - "Pre-declare translation keys before building components — prevents fallback key strings appearing during dev"
  - "section_element key naming (home_hero_headline, home_antifraid_feat_1) — matches established home_/contact_form_ prefix convention"

requirements-completed: [LAND-01, LAND-02]

# Metrics
duration: 4min
completed: 2026-03-22
---

# Phase 03 Plan 02: Landing Page i18n Keys Summary

**100+ bilingual translation keys for all 11 landing page sections pre-loaded into en.json and fr.json with professional French translations using formal vous register**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-22T20:36:09Z
- **Completed:** 2026-03-22T20:40:42Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Added all landing page copy as i18n keys to both locale files before any section components are built
- 100+ keys covering hero, trust bar, what-is, how-it-works, companies feature grid, anti-fraud, test library, testimonials (3), FAQ (7 Q&A), contact form, and footer
- French translations complete and professionally written — no key returns its key string as fallback
- Verification script confirms PASS: all home_ and contact_form_ keys present in fr.json

## Task Commits

Each task was committed atomically:

1. **Task 1: Add all landing page i18n keys to en.json and fr.json** - `8129c48` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `locales/en.json` - Added 100+ home_ and contact_form_ translation keys for all 11 landing page sections
- `locales/fr.json` - Added complete French translations for all new keys using formal vous register

## Decisions Made

- French translations use formal "vous" register throughout — B2B professional context requires formal address
- Job role template names translated to French equivalents (e.g., "Chef de produit", "Responsable marketing") except "Data Analyst" which is widely used as-is in French professional settings
- Testimonial names kept as realistic French names (Sophie Lefebvre, Marc Dupont, Claire Martin) to match French locale authentically

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All translation keys are ready for Plan 03 (landing page section components) and Plan 04 (contact form component)
- Section components can call `t("home_hero_headline")` etc. without risk of missing-key fallback strings
- No blockers.

---
*Phase: 03-landing-pages-data-foundation*
*Completed: 2026-03-22*
