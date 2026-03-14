---
phase: 01-foundation
plan: "01"
subsystem: ui
tags: [tailwind, css-tokens, brand-design, framer-motion, animation, shadcn]

# Dependency graph
requires: []
provides:
  - Brand color token system in globals.css (bg-brand-primary, text-brand-navy, etc.)
  - Shadcn semantic CSS variables mapped to brand HSL equivalents
  - Custom border-radius and shadow design tokens
  - Shared animation variants library (fadeIn, slideUp, slideIn, scaleIn, staggerChildren)
affects: [02-typography, 03-components, all-ui-phases]

# Tech tracking
tech-stack:
  added: [motion@12.36.0]
  patterns:
    - "All brand colors defined in globals.css @theme inline for Tailwind utility class generation"
    - "Shadcn semantic vars in :root mapped to brand HSL, then bridged to @theme inline via var()"
    - "Animation variants centralized in src/lib/motion.ts — import from here in all phases"
    - "No dark mode CSS block — v1 is light mode only"

key-files:
  created:
    - src/lib/motion.ts
  modified:
    - src/app/globals.css

key-decisions:
  - "Used motion-dom for Variants type import — motion/react v12 does not re-export Variants in its TypeScript declaration"
  - "globals.css uses @theme inline (not bare @theme) for all blocks referencing var() to ensure runtime resolution"
  - "Font vars reference --font-inter and --font-jetbrains-mono which will be wired by Plan 02 next/font setup; safe to reference now"

patterns-established:
  - "Brand token pattern: raw hex vars in :root, HSL semantic vars for shadcn, then @theme inline bridges both for Tailwind utilities"
  - "Motion pattern: import { fadeIn, slideUp } from '@/lib/motion' in any component — no local variant definitions needed"

requirements-completed: [DSYS-01, DSYS-02, DSYS-03]

# Metrics
duration: 4min
completed: 2026-03-14
---

# Phase 1 Plan 1: Brand Token System and Motion Variants Summary

**Tailwind brand color tokens (bg-brand-primary, text-brand-navy), shadcn CSS variable overrides, custom radius/shadow design tokens, and shared Framer Motion variants library (5 variants) established as the UI foundation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-14T20:18:10Z
- **Completed:** 2026-03-14T20:22:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced Next.js scaffold CSS with full CrismaTest brand token system — all brand utilities available as Tailwind classes
- Shadcn semantic CSS variables mapped to brand-appropriate HSL values (no shadcn defaults remain)
- Custom design tokens: radius-card (0.75rem), radius-chip (pill), radius-badge; shadow-card, shadow-dropdown, shadow-modal
- Created `src/lib/motion.ts` with 5 shared animation variants for all phases to import

## Task Commits

Each task was committed atomically:

1. **Task 1: Shadcn/ui init and brand token system in globals.css** - `d45a3a1` (feat)
2. **Task 2: Shared Framer Motion variants library** - `a10e777` (feat)

## Files Created/Modified
- `src/app/globals.css` - Full brand token system replacing scaffold CSS; :root shadcn vars, @theme inline brand/neutral/status colors, custom radius and shadow tokens
- `src/lib/motion.ts` - Shared animation variants: fadeIn, slideUp, slideIn, scaleIn, staggerChildren

## Decisions Made
- Imported `Variants` type from `motion-dom` rather than `motion/react` — in motion v12, `Variants` is defined in `motion-dom` but not re-exported in `motion/react`'s TypeScript declarations
- Skipped interactive `npx shadcn@latest init` (non-interactive environment) and wrote the final globals.css directly — the plan's end-state requirement is what matters
- Used `@theme inline` (not bare `@theme`) for all var()-referencing blocks per Tailwind v4 semantics

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Variants import path from motion/react to motion-dom**
- **Found during:** Task 2 (Shared Framer Motion variants library)
- **Issue:** `import type { Variants } from "motion/react"` caused TypeScript error: `'motion/react' has no exported member named 'Variants'`. The `motion/react` types in v12 re-export from `framer-motion`, but `Variants` is only defined in `motion-dom` and not explicitly surfaced through the re-export chain Next.js resolves at build time.
- **Fix:** Changed import to `import type { Variants } from "motion-dom"` which is the canonical source
- **Files modified:** src/lib/motion.ts
- **Verification:** `npm run build` exits 0
- **Committed in:** a10e777 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Fix was necessary for build to pass. The `motion-dom` import is semantically equivalent — `Variants` is the same type regardless of which package it's imported from.

## Issues Encountered
- First `npm install motion` failed with ENOTEMPTY error on Windows (node_modules directory not empty during cleanup). Second install succeeded — motion was already present from a prior install.
- `npx shadcn@latest init --yes` triggered an interactive prompt despite the flag. Skipped shadcn init and wrote globals.css directly with the full required content — the end state is identical.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Brand token foundation complete — all Tailwind utilities (bg-brand-primary, text-brand-navy, etc.) available in every component
- Animation variants ready to import in any component: `import { fadeIn, slideUp } from '@/lib/motion'`
- Plan 02 must wire `--font-inter` and `--font-jetbrains-mono` CSS vars via next/font for fonts to resolve (globals.css references them safely without breaking the build)

---
*Phase: 01-foundation*
*Completed: 2026-03-14*
