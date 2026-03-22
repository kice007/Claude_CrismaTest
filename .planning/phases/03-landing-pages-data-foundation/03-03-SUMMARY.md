---
phase: 03-landing-pages-data-foundation
plan: "03"
subsystem: landing-pages
tags: [home-page, sections, i18n, animations, contact-form, react-hook-form, zod]
dependency_graph:
  requires: [03-02]
  provides: [home-light-page, 11-section-components, contact-api-route]
  affects: [03-04]
tech_stack:
  added: ["@hookform/resolvers@5.2.2 (standardSchemaResolver for zod v4)"]
  patterns: [variant-prop, useTranslation, motion-whileInView, standardSchemaResolver]
key_files:
  created:
    - src/app/page.tsx
    - src/components/home/HeroSection.tsx
    - src/components/home/TrustBar.tsx
    - src/components/home/WhatIsSection.tsx
    - src/components/home/HowItWorksSection.tsx
    - src/components/home/ForCompaniesSection.tsx
    - src/components/home/AntifraudSection.tsx
    - src/components/home/TestLibrarySection.tsx
    - src/components/home/TestimonialsSection.tsx
    - src/components/home/FaqSection.tsx
    - src/components/home/ContactSection.tsx
    - src/components/home/ContactForm.tsx
    - src/components/home/FooterSection.tsx
    - src/app/api/contact/route.ts
  modified:
    - src/app/globals.css
    - package.json
decisions:
  - "Used standardSchemaResolver from @hookform/resolvers/standard-schema — @hookform/resolvers v5 removed the zod-specific resolver; zod v4 implements the standard-schema spec natively"
  - "Hero section always renders with bg-brand-navy regardless of variant prop — design spec mandates dark hero on both light and dark pages"
  - "AntifraudSection always dark navy per design spec — variant prop accepted but bg is fixed"
  - "ContactForm uses mode='onBlur' validation — avoids error flash on pristine fields while giving fast feedback on blur"
  - "Created /api/contact route alongside page — ContactForm references it; missing route would cause fetch 404 at runtime"
  - "TrustBar marquee uses CSS keyframes via arbitrary Tailwind value — zero JS, compatible with reduced-motion media query added to globals.css"
  - "TestimonialsSection: desktop uses Framer Motion staggerChildren + slideUp; mobile uses CSS overflow-x scroll with snap — no JS carousel needed"
metrics:
  duration: "~25min"
  completed: "2026-03-22"
  tasks_completed: 2
  files_created: 14
  files_modified: 2
---

# Phase 03 Plan 03: Home-Light Page — 11 Section Components

**One-liner:** 11 bilingual home section components with floating dashboard card hero, variant prop, Framer Motion scroll animations, and RHF + zod v4 contact form.

## What Was Built

Full home-light page at `/` — all 11 section components assembled in `src/app/page.tsx`. Each section component accepts a `variant?: "light" | "dark"` prop for Plan 04 reuse. All text via `useTranslation()`.

### Section components

| Component | Key features |
|---|---|
| HeroSection | Navy bg (always), floating frosted-glass dashboard card mockup with CrismaScore chips, dual CTAs, trust badge |
| TrustBar | CSS-only marquee (keyframe in globals.css), 6 company names, duplicate list for seamless loop |
| WhatIsSection | 3-stat cards, staggerChildren + fadeIn on scroll with whileInView once:true |
| HowItWorksSection | 3 numbered steps (01/02/03), desktop row / mobile stack |
| ForCompaniesSection | 6-feature grid (3 cols desktop, 2 tablet, 1 mobile), lucide icons, CTA |
| AntifraudSection | Always dark navy, 2x2 feature grid with checkmark icons, brand-accent accents |
| TestLibrarySection | 8 template cards in 4-col grid with hardcoded duration map (10–15 min) |
| TestimonialsSection | Desktop: 3-col Framer Motion grid; mobile: CSS snap carousel |
| FaqSection | Custom accordion with useState, 7 items, chevron rotation, max-h transition |
| ContactSection | Wrapper with centered max-w-2xl white card |
| FooterSection | 3-col layout, Next.js Link, lucide LinkedIn/Twitter icons, copyright bar |

### ContactForm (client component)

- `react-hook-form` + `zodResolver` via `standardSchemaResolver` (zod v4 compat)
- 6 fields: name, company, email, teamSize (select), message (textarea optional), gdprConsent (checkbox)
- Inline field errors, disabled submit when invalid/submitting
- Posts to `/api/contact` — handles 429 (rate limit) and generic errors via sonner toasts

### /api/contact route

- Zod schema validation (server-side mirror of client schema)
- Module-level Map rate limiter: 3 requests/minute per IP, 5-min cleanup interval
- Returns 429 on rate limit, 422 on validation error, 200 on success

### page.tsx

- Server Component — no "use client"
- `export const metadata` with title + description
- `min-w-0 overflow-x-hidden` wrapper prevents horizontal overflow at 320px

## Deviations from Plan

### Auto-added: /api/contact route (Rule 2 — Missing Critical Functionality)

**Found during:** Task 2 implementation
**Issue:** ContactForm posts to `/api/contact` via fetch. Without the route, the form would silently 404 in production.
**Fix:** Created `src/app/api/contact/route.ts` with zod validation and rate limiting.
**Files modified:** `src/app/api/contact/route.ts` (new file)
**Commit:** 8e1f60b

### Auto-fix: @hookform/resolvers/standard-schema instead of /zod (Rule 3 — Blocking Issue)

**Found during:** Task 2 setup
**Issue:** `@hookform/resolvers` v5.2.2 removed the `/zod` sub-package. Plan referenced `zodResolver` from `@hookform/resolvers/zod` which no longer exists.
**Fix:** Used `standardSchemaResolver` from `@hookform/resolvers/standard-schema` — zod v4 implements the Standard Schema spec natively, making this a drop-in replacement.
**Files modified:** `src/components/home/ContactForm.tsx`
**Commit:** 8e1f60b

## Known Warning (Non-blocking)

ESLint reports 1 warning on `ContactForm.tsx` line 60 (`watch("gdprConsent")`): React Compiler incompatible library warning. This is a known react-hook-form + React Compiler interaction — the watch function cannot be safely memoized. The warning does not affect functionality and the build succeeds. This is a pre-existing constraint documented in Phase 02 decisions.

## Self-Check: PASSED

All 14 created files confirmed present on disk. Both commits (f91e918, 8e1f60b) confirmed in git log. npm run build succeeds cleanly with 0 errors. npm run lint shows 0 errors (1 warning, expected).
