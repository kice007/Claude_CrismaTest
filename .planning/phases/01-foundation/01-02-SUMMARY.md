---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [i18next, react-i18next, i18next-browser-languagedetector, motion, next-font, inter, jetbrains-mono, i18n, localization]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: globals.css with CSS variable slots --font-inter and --font-jetbrains-mono for @theme inline

provides:
  - i18next + react-i18next bilingual EN/FR switching with zero-reload
  - localStorage persistence under crismatest_lang key
  - html[lang] attribute sync via I18nProvider useEffect
  - LanguageSwitcher component (desktop pill buttons, mobile globe+buttons)
  - Inter + JetBrains Mono fonts in layout.tsx with CSS variable output
  - MotionConfig with reducedMotion="user" wrapping entire app

affects:
  - phase-02-nav (LanguageSwitcher drop-in ready)
  - all phases (useTranslation() available everywhere via I18nProvider)

# Tech tracking
tech-stack:
  added:
    - i18next ^25
    - react-i18next ^16
    - i18next-browser-languagedetector ^8
    - motion ^12 (MotionConfig)
    - motion-dom ^12 (motion dependency)
  patterns:
    - Client-only i18n: i18n.ts must only be imported from 'use client' components
    - I18nProvider pattern: server layout wraps with client provider for hydration-safe i18n
    - Language persistence via localStorage key crismatest_lang

key-files:
  created:
    - src/lib/i18n.ts
    - src/components/I18nProvider.tsx
    - src/components/LanguageSwitcher.tsx
    - locales/en.json
    - locales/fr.json
  modified:
    - src/app/layout.tsx
    - eslint.config.mjs
    - package.json

key-decisions:
  - "motion package installed (not framer-motion directly) — motion/react is the stable import path for MotionConfig"
  - "motion-dom required explicit reinstall after corrupt initial extraction (missing package.json)"
  - ".claude/ excluded from ESLint ignores — CJS tooling files cause false positive @typescript-eslint/no-require-imports errors"
  - "og:locale set to static en_US default — client-side language state not available during SSR without URL routing"

patterns-established:
  - "Client-only i18n init: src/lib/i18n.ts marked with comment, never import from Server Components"
  - "html[lang] sync: I18nProvider useEffect fires after hydration, sets document.documentElement.lang"
  - "Responsive switcher: hidden md:flex for desktop pills, flex md:hidden for mobile globe variant"
  - "No useMemo/useCallback: React Compiler is active, manual memoization unnecessary"

requirements-completed: [I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06]

# Metrics
duration: 15min
completed: 2026-03-14
---

# Phase 1 Plan 2: i18n Foundation Summary

**react-i18next bilingual EN/FR switching with localStorage persistence, html[lang] sync, responsive LanguageSwitcher component, and Inter + JetBrains Mono fonts replacing Geist scaffold**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-14T20:18:20Z
- **Completed:** 2026-03-14T20:33:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- i18next initialized client-side with localStorage detection using crismatest_lang key (I18N-01/02)
- EN/FR locales with all Phase 1 keys including plural variants candidate_count_one/other (I18N-03/04)
- I18nProvider syncs html[lang] on hydration and language change (I18N-06)
- LanguageSwitcher responsive: desktop EN|FR pill buttons, mobile globe+inline buttons (I18N-05)
- layout.tsx updated with Inter + JetBrains_Mono fonts (display:swap, CSS variable output) + MotionConfig wrapper

## Task Commits

Each task was committed atomically:

1. **Task 1: Install i18n packages and create translation files + i18n config** - `4331be6` (feat)
2. **Task 2: I18nProvider, LanguageSwitcher, and layout.tsx font + i18n wiring** - `f5a3caf` (feat)

**Plan metadata:** (docs commit hash follows after state update)

## Files Created/Modified
- `locales/en.json` - Phase 1 English translation strings with plural keys
- `locales/fr.json` - Phase 1 French translation strings with plural keys
- `src/lib/i18n.ts` - i18next client-only init with LanguageDetector (localStorage → navigator → htmlTag)
- `src/components/I18nProvider.tsx` - 'use client' wrapper with html[lang] sync via useEffect
- `src/components/LanguageSwitcher.tsx` - Responsive EN|FR switcher, drop-in ready for Phase 2 nav
- `src/app/layout.tsx` - Inter + JetBrains_Mono fonts, I18nProvider + MotionConfig wrapping body
- `eslint.config.mjs` - Added .claude/ to ESLint ignores
- `package.json` / `package-lock.json` - i18next, react-i18next, i18next-browser-languagedetector, motion added

## Decisions Made
- Used `motion` package (not `framer-motion` directly) — `motion/react` is the canonical import path
- Set `og:locale` to static `en_US` default — client-side language not available during SSR without URL-based routing
- Excluded `.claude/` from ESLint — GSD tooling is CJS and not part of the Next.js source tree

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed motion package for MotionConfig import**
- **Found during:** Task 2 (layout.tsx update)
- **Issue:** Plan's layout.tsx imports `MotionConfig` from `motion/react` but motion was not installed
- **Fix:** Ran `npm install motion` to add the package
- **Files modified:** package.json, package-lock.json
- **Verification:** Build passes after install
- **Committed in:** f5a3caf (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed corrupt motion-dom extraction (missing package.json)**
- **Found during:** Task 2 build verification
- **Issue:** `motion-dom` was extracted to node_modules but without its package.json, causing `Can't resolve 'motion-dom'` build error from framer-motion (a dependency of motion)
- **Fix:** Deleted node_modules/motion-dom and ran `npm install motion-dom@12.36.0` to force proper extraction
- **Files modified:** node_modules/motion-dom (package.json restored)
- **Verification:** Build exits 0
- **Committed in:** f5a3caf (package-lock.json in Task 2 commit)

**3. [Rule 3 - Blocking] Added .claude/ to ESLint ignores**
- **Found during:** Task 2 lint verification
- **Issue:** ESLint was linting .claude/ GSD tooling (CJS files), producing 70 `@typescript-eslint/no-require-imports` errors
- **Fix:** Added `.claude/**` to globalIgnores in eslint.config.mjs
- **Files modified:** eslint.config.mjs
- **Verification:** `npm run lint` exits 0
- **Committed in:** f5a3caf (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 3 - blocking)
**Impact on plan:** All fixes required for correct operation. No scope creep.

## Issues Encountered
- motion-dom package corruption on initial npm install (Windows npm extracting without package.json) — resolved by targeted reinstall

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `useTranslation()` available everywhere via I18nProvider wrapping the app root
- LanguageSwitcher ready for drop-in into Phase 2 navigation
- Inter + JetBrains Mono CSS variables (`--font-inter`, `--font-jetbrains-mono`) emitted and match globals.css @theme inline slots from Plan 01

---
*Phase: 01-foundation*
*Completed: 2026-03-14*

## Self-Check: PASSED

- locales/en.json: FOUND
- locales/fr.json: FOUND
- src/lib/i18n.ts: FOUND
- src/components/I18nProvider.tsx: FOUND
- src/components/LanguageSwitcher.tsx: FOUND
- src/app/layout.tsx: FOUND
- .planning/phases/01-foundation/01-02-SUMMARY.md: FOUND
- Commit 4331be6: FOUND
- Commit f5a3caf: FOUND
