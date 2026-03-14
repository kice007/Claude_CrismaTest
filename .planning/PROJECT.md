# CrismaTest

## What This Is

CrismaTest is a premium SaaS talent assessment platform that generates a universal, portable, fraud-resistant employability score — the **CrismaScore** (0-100) — broken into five sub-scores. Candidates prove their real skills in a 10-15 minute adaptive, proctored test. Companies use the score to make faster, objective hiring decisions. v1 is a fully clickable prototype with real UI, real bilingual support, and real Supabase data — but visual-only auth and payments.

## Core Value

A candidate completes the test, gets their CrismaScore, and can share it — and a company can view, compare, and filter candidates by score. Everything else serves this loop.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Landing & Marketing**
- [ ] Home page with hero, trust bar, 3-step process, anti-fraud section, testimonials, FAQ, footer
- [ ] /for-candidates page explaining CrismaScore with share examples
- [ ] /for-companies page with B2B value prop, dashboard screenshot, demo CTA
- [ ] /pricing page with 4-plan table (Free / Starter $49 / Pro $149 / Enterprise), monthly/annual toggle
- [ ] /contact page with demo request form (POST to Supabase + Resend email, rate-limited 3/IP/hour)
- [ ] EN/FR language switcher in nav — instant switch, no reload, persisted in localStorage
- [ ] Full responsiveness across all landing pages (mobile / tablet / desktop)

**Authentication (Visual Only)**
- [ ] /sign-up page — form with name, email, password, role selector (Candidate / Company) — sets boolean isLoggedIn state, redirects to relevant flow
- [ ] /login page — email + password, forgot password link (static), sets isLoggedIn
- [ ] /forgot-password page — static "Check your email" confirmation
- [ ] Logged-in nav state — avatar + dropdown (My Profile, Settings, Logout)
- [ ] Protected routes (/dashboard, /test) redirect to /login if not "logged in"

**Candidate Test Flow**
- [ ] /test/[id]/intro — role badge, time estimate, module list, Start CTA
- [ ] /test/[id]/check — live webcam preview (real browser permission), mic level indicator (Web Audio API), anti-fraud checklist, disabled CTA until agreed
- [ ] /test/[id]/questions — 12-18 question carousel, 6 formats: QCM, drag & drop (dnd-kit), case study, simulation, audio/video (90s record), short text (150-word counter)
- [ ] /test/[id]/calculating — animated 5-7s loader with staggered steps, auto-redirects to result
- [ ] /test/[id]/result — animated CrismaScore gauge (0→final, 1.5s), 5 animated sub-score bars, grade badge, strengths panel, confetti if score > 70, share CTA, improve CTA, retest counter

**Company Dashboard**
- [ ] /dashboard — candidate list table with avatar, name, role, CrismaScore chip, TrustScore, status, date, actions; search + filters (role, score range, status, date)
- [ ] /dashboard/candidates/[id] — candidate detail with email (clickable mailto), score gauge, sub-scores, test timeline, mocked video player, fraud flags panel, AI insight card, interview invite + email CTAs
- [ ] /dashboard/compare — select up to 3 candidates, side-by-side layout with scores, flags, video thumbnails, interview recommendation badge, export PDF CTA (static)
- [ ] /dashboard/talent-pool — card grid (4/2/1 col), filterable/searchable, contact modal
- [ ] /dashboard/build-test — 4-step flow: role → modules → custom questions → generate (animated loader → confirmation)
- [ ] Dashboard sidebar: brand-navy, icon + label nav, bottom user avatar; collapses to bottom tab bar on mobile

**Payment Flow (Visual Only)**
- [ ] /checkout/[plan] — plan summary, billing toggle, Stripe-styled card form UI (not connected), loading → success redirect
- [ ] /checkout/success — success screen with dashboard and test CTAs

**Shared UI**
- [ ] Skeleton loading states on all data-heavy views (shimmer 1.5s)
- [ ] Empty state illustrations + CTAs
- [ ] Toast notifications (success/warning/error, slide-in 250ms, 4s auto-dismiss)
- [ ] Modal system (invite candidate, calendar, export, contact) — focus-trapped, ESC to close
- [ ] Branded 404 and 500 pages

**Data & Backend**
- [ ] Supabase schema: test_templates, mock_candidates, questions, contact_submissions tables
- [ ] RLS: all tables read-only via anon key; contact_submissions insert-only
- [ ] Seed script: 30-50 mock candidates, 80-120 questions, 8 test templates
- [ ] API routes: GET /api/tests, GET /api/tests/[slug], GET /api/candidates, GET /api/candidates/[id], GET /api/talent-pool, POST /api/contact
- [ ] Resend integration on POST /api/contact
- [ ] varlock .env.schema with all env variables declared

**Design System**
- [ ] Tailwind config extended with all brand tokens (brand-primary #1B4FD8, brand-navy #0F2A6B, etc.)
- [ ] Shadcn/ui installed and overridden with brand tokens via CSS variables
- [ ] Inter + JetBrains Mono loaded via next/font
- [ ] All animations via Framer Motion (variants pattern)
- [ ] Lucide React icons throughout (20px, 1.5px stroke)

### Out of Scope

- Real authentication (Supabase Auth / JWT) — v2
- Real payment processing (Stripe) — v2
- Real AI adaptive engine or anti-fraud proctoring — v2
- Real score computation — v2
- Google OAuth — v2 ("Coming soon" toast in v1)
- Dark mode — not required for v1
- Heavy server infrastructure / complex API beyond 6 routes — v2
- CrismaWork integration — v3
- Third-party ATS/LinkedIn/Indeed API — v3

## Context

- **Existing scaffold**: Next.js 16 App Router (upgraded from v14 specified in docs — use current scaffold), React 19, TypeScript, Tailwind CSS v4, ESLint. Backend docs specify Next.js 14 + Tailwind 3 but the actual scaffold is newer — adapt accordingly.
- **Design reference**: v0-crisma-test-landing-page.vercel.app (existing logo source)
- **Brand positioning**: YC-funded SaaS meets professional HR tool — reference Searchable.com, GitBook.com, ReflexAI.com
- **Supabase MCP**: Already installed for Claude Code dev tooling (direct DB access during development)
- **Deployment**: Vercel — auto-deploy on push to main

## Constraints

- **Tech stack**: Next.js App Router, React, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion, react-i18next, dnd-kit, Supabase, Vercel, Resend — no substitutions
- **Bilingual**: EN/FR from day 1 — zero hardcoded UI strings — all via `useTranslation()` — 100% coverage
- **Responsiveness**: Mobile-first, 5 breakpoints (xs/sm/md/lg/xl) — no horizontal overflow at 320px minimum — test engine full-screen on all breakpoints
- **Minimum touch targets**: 48×48px on all interactive elements
- **Form inputs**: 16px minimum font-size (prevents iOS auto-zoom)
- **Animations**: All wrapped in `@media (prefers-reduced-motion: no-preference)`
- **Security**: No dangerouslySetInnerHTML, no stack traces in error responses, XSS sanitization on all inputs, SUPABASE_SERVICE_ROLE_KEY server-only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Visual-only auth in v1 | Prototype focus — prove product value before building real backend | — Pending |
| Visual-only payments in v1 | Same — Stripe integration is v2 work | — Pending |
| Supabase for minimal DB | Real data display (seeded candidates/tests) without heavy backend | — Pending |
| react-i18next for i18n | Industry standard, zero-reload client-side language switching | — Pending |
| dnd-kit for drag & drop | Best-in-class touch support for ranking questions | — Pending |
| Shadcn/ui + Tailwind | Rapid component development with full design token control | — Pending |
| Next.js 16 scaffold (vs v14 in docs) | Existing scaffold is newer — use it, adapt dependencies accordingly | — Pending |

---
*Last updated: 2026-03-14 after initialization*
