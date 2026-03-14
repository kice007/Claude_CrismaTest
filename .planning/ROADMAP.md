# Roadmap: CrismaTest

## Overview

CrismaTest ships as a premium SaaS prototype: a bilingual, fully interactive talent assessment platform where candidates complete a real test experience and receive an animated CrismaScore, while companies browse, compare, and filter candidates via a seeded dashboard. The build flows from design system foundations through shared UI, marketing pages, the candidate test journey, the company dashboard, and finally payment and security hardening — each phase delivering a coherent, independently verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Design system tokens, i18n framework, and font setup — the substrate every component builds on (completed 2026-03-14)
- [ ] **Phase 2: Shared UI + Nav Shell** - Reusable component library (toasts, modals, skeletons, error pages), responsive nav, and global layout wrapper
- [ ] **Phase 2.1: Screen Design** (INSERTED) - Full Pencil screen designs for all product areas — visual spec used by Phases 3–6
- [ ] **Phase 3: Landing Pages + Data Foundation** - All five marketing pages served with real Supabase data, seeded database, and contact form API
- [ ] **Phase 4: Auth + Test Flow** - Visual-only sign-up/login and the full five-step candidate test journey
- [ ] **Phase 5: Company Dashboard + API** - Complete company-facing dashboard with six views, wired to six live API routes returning seeded data
- [ ] **Phase 6: Payment + Security** - Visual checkout flow, security hardening, and final compliance pass

## Phase Details

### Phase 1: Foundation
**Goal**: The design system, i18n wiring, and typography are in place so every subsequent component can be built to brand spec, fully bilingual, from day one.
**Depends on**: Nothing (first phase)
**Requirements**: DSYS-01, DSYS-02, DSYS-03, I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06
**Success Criteria** (what must be TRUE):
  1. Tailwind config exposes brand color tokens (brand-primary, brand-navy, brand-accent, etc.) and any component referencing them renders the correct hex values in the browser
  2. Shadcn/ui components render using CrismaTest brand colors via CSS variables, not Shadcn defaults
  3. Inter and JetBrains Mono load via next/font and are visible on any rendered page
  4. A developer can switch the app language from EN to FR and back — instantly, without page reload — and the selected language persists across a browser refresh
  5. Every UI string in any component is sourced from a translation key — grep for hardcoded English text in JSX returns zero results
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Design system: brand tokens in globals.css + Shadcn init + Framer Motion variants
- [ ] 01-02-PLAN.md — i18n framework: react-i18next config, I18nProvider, LanguageSwitcher, fonts in layout.tsx
- [ ] 01-03-PLAN.md — Validation artifact: /dev/design-system page + type-check script

### Phase 2: Shared UI + Nav Shell
**Goal**: Every reusable UI primitive exists and is usable by any page — developers can assemble pages from a working component library rather than building primitives inline.
**Depends on**: Phase 1
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, LAND-06, LAND-07, LAND-08
**Success Criteria** (what must be TRUE):
  1. A toast notification (success, warning, or error variant) slides in from the right and auto-dismisses after 4 seconds when triggered
  2. A modal (invite, calendar, export, or contact) opens focus-trapped and closes on ESC or backdrop click
  3. Skeleton shimmer placeholders appear on any data-heavy view while data is loading
  4. The desktop nav renders logo left, links center, EN|FR + Login + Sign Up right — collapses to a hamburger sheet on mobile with 48px tap targets
  5. The app renders without horizontal overflow at 320px viewport width on any page
**Plans**: 6 plans

Plans:
- [ ] 02-01-PLAN.md — Shadcn/ui init: install dialog, drawer, sheet, sonner; scaffold src/components/ui/
- [ ] 02-02-PLAN.md — Skeleton shimmer primitive + EmptyState component + branded 404/500 pages
- [ ] 02-03-PLAN.md — Toast system: Sonner Toaster wired into layout.tsx
- [ ] 02-04-PLAN.md — Modal system: useMediaQuery hook + four modal variants (Dialog/Drawer)
- [ ] 02-05-PLAN.md — Nav shell: NavShell + NavDesktop + NavMobile + wire layout.tsx
- [ ] 02-06-PLAN.md — Validation: i18n key audit + design-system Phase 2 section + human checkpoint

### Phase 2.1: Screen Design (INSERTED)
**Goal**: Every screen in the product has a Pencil design using brand tokens, ready as a visual spec so Phases 3–6 never have to guess at layout, spacing, or component composition.
**Depends on**: Phase 2
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06
**Success Criteria** (what must be TRUE):
  1. All five landing pages and both nav states (desktop + mobile) are designed in Pencil using brand color tokens and Inter typography
  2. Auth screens (sign-up, login, forgot-password) are designed with form layouts, field states, and role-selector variant
  3. All five candidate test-flow screens are designed — including all six question format layouts and the animated result gauge
  4. All six company dashboard views are designed with the brand-navy sidebar, data tables, and mobile tab-bar state
  5. Checkout and success screens are designed with the Stripe-styled card form layout
  6. A shared component reference sheet exists in Pencil: toast variants, modal variants, skeleton states, empty states, and 404/500 pages
**Plans**: TBD

### Phase 3: Landing Pages + Data Foundation
**Goal**: All five marketing pages are live and bilingual, the Supabase database is seeded with realistic data, and the contact form posts real data and sends a real email.
**Depends on**: Phase 2.1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, DATA-01, DATA-02, DATA-03, DATA-10, SEC-01
**Success Criteria** (what must be TRUE):
  1. Visiting /, /for-candidates, /for-companies, /pricing, and /contact all render fully with correct bilingual content and no layout breaks on mobile or desktop
  2. Submitting the contact form saves a row to Supabase contact_submissions and triggers a Resend email notification
  3. Submitting the contact form more than 3 times from the same IP within one hour returns a rate-limit error without exposing server details
  4. Running npm run db:seed populates test_templates, mock_candidates, and questions tables with the specified seed counts (30-50 candidates, 80-120 questions, 8 templates)
  5. The .env.schema file declares all five environment variables; the .env file is confirmed absent from git history
**Plans**: TBD

### Phase 4: Auth + Test Flow
**Goal**: A user can sign up or log in (visually), reach the appropriate flow, and complete the full five-step candidate test journey from intro through animated result.
**Depends on**: Phase 3
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, TEST-01, TEST-02, TEST-03, TEST-04, TEST-05
**Success Criteria** (what must be TRUE):
  1. Signing up as Candidate redirects to /test/sample/intro; signing up as Company redirects to /dashboard; the logged-in nav avatar and dropdown appear immediately
  2. Navigating to /dashboard or /test/* while logged out redirects to /login
  3. The pre-flight check page requests real webcam and microphone permissions from the browser and shows a live mic level indicator; the Start CTA stays disabled until the checklist is agreed
  4. The test engine renders all six question formats (QCM, drag & drop, case study, simulation, audio/video, short text), tracks progress, and shows a countdown timer that turns amber then red as time expires
  5. After submitting the test, the calculating screen runs its animated sequence and auto-redirects to the result page where the CrismaScore gauge animates from 0 to the final value and confetti fires if the score exceeds 70
**Plans**: TBD

### Phase 5: Company Dashboard + API
**Goal**: A logged-in company user can browse, search, compare, and inspect candidates across all six dashboard views, with all data served from live Supabase API routes.
**Depends on**: Phase 4
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DATA-04, DATA-05, DATA-06, DATA-07, DATA-08, DATA-09
**Success Criteria** (what must be TRUE):
  1. The candidate list table loads from GET /api/candidates and supports search by name or email plus filters for role, score range, status, and date range — email addresses do not appear in the list response
  2. Clicking a candidate row opens the detail page (GET /api/candidates/[id]), showing the score gauge, sub-scores, fraud flags, AI insight card, and a clickable mailto link for the candidate's email
  3. The compare view lets a user select up to 3 candidates side-by-side and correctly identifies the top scorer with a "Recommended for Interview" badge
  4. The talent pool view (GET /api/talent-pool) renders as a filterable card grid and opens a contact modal on card click
  5. The build-test 4-step flow completes end-to-end and shows the "Test Ready" confirmation with copy-link and send CTAs
  6. On mobile, the sidebar collapses to a bottom tab bar, and data tables reformat as scrollable card stacks
**Plans**: TBD

### Phase 6: Payment + Security
**Goal**: The visual checkout flow is complete and the codebase passes a full security compliance pass — no sensitive data leaks, all inputs sanitized, rate limiting enforced.
**Depends on**: Phase 5
**Requirements**: PAY-01, PAY-02, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07
**Success Criteria** (what must be TRUE):
  1. Navigating to /checkout/[plan] shows the Stripe-styled form UI; clicking Subscribe Now triggers a 1.5s loading state then redirects to /checkout/success with the correct plan name
  2. A grep for dangerouslySetInnerHTML across the entire codebase returns zero results
  3. All external links in the app carry rel="noopener noreferrer"
  4. POST /api/contact with an oversized or malicious payload returns a generic error message — no stack trace, no internal path, no field-level SQL error
  5. localStorage contains only the language preference key — no scores, tokens, or user identifiers are stored client-side

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 2.1 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-03-14 |
| 2. Shared UI + Nav Shell | 0/6 | Not started | - |
| 2.1. Screen Design | 0/TBD | Not started | - |
| 3. Landing Pages + Data Foundation | 0/TBD | Not started | - |
| 4. Auth + Test Flow | 0/TBD | Not started | - |
| 5. Company Dashboard + API | 0/TBD | Not started | - |
| 6. Payment + Security | 0/TBD | Not started | - |
