# Requirements: CrismaTest

**Defined:** 2026-03-14
**Core Value:** A candidate completes the test and gets their CrismaScore — a company can review and compare candidates by score.

## v1 Requirements

### Design System (DSYS)

- [ ] **DSYS-01**: Tailwind config extended with all brand tokens (colors: brand-primary #1B4FD8, brand-secondary #3B6FE8, brand-navy #0F2A6B, brand-light #EEF2FF, brand-accent #6366F1, neutrals, success/warning/danger; typography scale; spacing scale)
- [ ] **DSYS-02**: Shadcn/ui installed and overridden with brand tokens via CSS variables in globals.css
- [ ] **DSYS-03**: Inter + JetBrains Mono loaded via next/font with font-display: swap

### Internationalization (I18N)

- [x] **I18N-01**: react-i18next + next-i18next configured — /locales/en.json and /locales/fr.json with all UI strings
- [x] **I18N-02**: Every component uses useTranslation() — zero hardcoded UI strings
- [x] **I18N-03**: Language switcher component renders EN|FR pills in desktop nav, globe icon dropdown on mobile
- [x] **I18N-04**: Language switch is instant (no page reload), stored in localStorage, restored on next visit
- [x] **I18N-05**: Plurals implemented via i18next plural keys for candidate counts
- [x] **I18N-06**: Meta tags (lang attribute, og:locale) set per page via next-i18next

### Landing Pages (LAND)

- [ ] **LAND-01**: Home page (/) — hero (navy bg, gradient, headline, 2 CTAs, floating dashboard card), trust bar marquee, what-is section, 3-step process, for-companies feature grid, anti-fraud section, test library preview, testimonials, FAQ, footer
- [ ] **LAND-02**: /for-candidates — CrismaScore breakdown visuals, share examples, social proof, "Take the Test" CTA
- [ ] **LAND-03**: /for-companies — B2B value prop, speed/accuracy/anti-fraud features, dashboard screenshot, company logos, "Request Demo" and "Start Trial" CTAs
- [ ] **LAND-04**: /pricing — 4-plan table (Free / Starter $49 / Pro $149 / Enterprise), monthly/annual toggle (shows 20% discount, visual only), "Get Started" CTAs on paid plans → /checkout/[plan]
- [ ] **LAND-05**: /contact — demo request form (name, company, email, team size, message, consent checkbox), POST to Supabase contact_submissions + Resend email notification, rate-limited 3/IP/hour, success toast on submit
- [ ] **LAND-06**: Fixed nav (desktop): logo left, links center, EN|FR + Login + Sign Up right; white/95 backdrop-blur; shadow on scroll
- [ ] **LAND-07**: Mobile nav: hamburger → slide-down sheet with all links + language toggle, 48px tap targets
- [ ] **LAND-08**: All landing pages fully responsive — no horizontal overflow at 320px minimum

### Authentication — Visual Only (AUTH)

- [ ] **AUTH-01**: /sign-up — form (full name, email, password show/hide, role selector Candidate/Company); client-side validation; submit sets isLoggedIn boolean → redirects Candidate to /test/sample/intro, Company to /dashboard; Google OAuth button shows "Coming soon" toast
- [ ] **AUTH-02**: /login — email + password + remember me; sets isLoggedIn; forgot password link → /forgot-password
- [ ] **AUTH-03**: /forgot-password — static "Check your email" confirmation screen
- [ ] **AUTH-04**: Logged-in nav state — user avatar + name top-right, dropdown with My Profile, Settings, Logout; logout clears isLoggedIn → redirect to /
- [ ] **AUTH-05**: Protected routes — /dashboard and /test/* redirect to /login if isLoggedIn = false

### Candidate Test Flow (TEST)

- [ ] **TEST-01**: /test/[id]/intro — role title, estimated time (10-15 min), module breakdown (icons + labels), anti-fraud notice, "Start Test" CTA → /test/[id]/check; full-width centered card on all breakpoints
- [ ] **TEST-02**: /test/[id]/check (Pre-flight) — real webcam preview (browser permission request), mic level indicator (animated bars via Web Audio API), anti-fraud checklist (camera ✓, mic ✓, alone in room ✓, no extra screens ✓), disclaimer checkbox (disables CTA until checked), camera/mic denied warning + retry; "I'm Ready" CTA → /test/[id]/questions
- [ ] **TEST-03**: /test/[id]/questions (Test Engine) — stateful 12-18 question carousel, full-screen layout (no nav); header with progress bar, module badge, countdown timer (JetBrains Mono, amber at 1min, red at 30s); 6 question formats: QCM (A/B/C/D single or multi-select), drag & drop ranking (dnd-kit, 48px touch targets), case study (scenario + 3 decision questions), simulation (branching customer support scenario), audio/video (90s record, countdown, preview before submit), short text (150-word limit, real-time counter); Previous/Next nav, flag-for-review option; "Submit Test" on last question → /test/[id]/calculating; full-screen on mobile
- [ ] **TEST-04**: /test/[id]/calculating — full-screen animated sequence 5-7s: staggered steps ("Analyzing responses." → "Checking consistency." → "Computing sub-scores." → "Generating CrismaScore."), animated gauge fill, neural-network particle background; auto-redirects to /test/[id]/result
- [ ] **TEST-05**: /test/[id]/result — CrismaScore animated gauge (0→final, 1.5s ease-out) + grade badge (Excellent/Good/etc.); 5 staggered animated sub-score bars (Logic, Communication, JobSkill, Trust, Video); strengths panel (2-3 mocked bullets based on score range); canvas-confetti if score > 70; "Share Your CrismaScore" CTA (copy link + LinkedIn sheet); "Improve Your Score" → /pricing; "Retake Test" with retest counter; gauge full-width on mobile, sub-scores stacked below

### Company Dashboard (DASH)

- [ ] **DASH-01**: /dashboard (Candidate List) — sidebar (desktop, brand-navy, icon+label nav, user avatar+plan badge at bottom); table columns (avatar, name, role, CrismaScore chip, TrustScore, status badge, date, actions); row click → /dashboard/candidates/[id]; filters (role, score range, status, date range); search (name or email); "Invite Candidate" button → static modal; skeleton loading on data fetch
- [ ] **DASH-02**: Mobile sidebar → bottom tab bar (5 icons, 56px, brand-navy bg); table → scrollable card stack; filters → bottom sheet
- [ ] **DASH-03**: /dashboard/candidates/[id] (Detail) — header card (avatar, name, role, email prominently displayed + clickable mailto, test date, status badge); CrismaScore gauge + 5 sub-score bars; test timeline with module timestamps; mocked video player; anti-fraud flags panel (severity Low/Medium/High badges); AI insight card (3-bullet interview recommendation); "Invite to Interview" → calendar modal; "Email Candidate" → mailto with prefilled subject; back → /dashboard
- [ ] **DASH-04**: /dashboard/compare — select up to 3 candidates from searchable dropdown; 3-column layout (score gauge, sub-score bars, fraud flags, video thumbnail); "Recommended for Interview" badge on top scorer; "Export Report" → downloads static PDF mockup; columns stack vertically on mobile with candidate name as section header
- [ ] **DASH-05**: /dashboard/talent-pool — card grid (4 cols desktop / 2 tablet / 1 mobile): avatar, name, role, CrismaScore badge, TrustScore, last test date, Contact CTA; filters (score range, role, experience, availability); search (name, role, skill); card click → inline detail modal; "Contact Candidate" → email modal with prefilled mailto
- [ ] **DASH-06**: /dashboard/build-test — 4-step flow: Step 1 role dropdown (8 roles), Step 2 module toggle chips, Step 3 custom questions (up to 3 text inputs), Step 4 "Generate Test" → animated loader → "Test Ready" confirmation card; "Copy Test Link" and "Send to Candidates" CTAs (static)

### Payment Flow — Visual Only (PAY)

- [ ] **PAY-01**: /checkout/[plan] — plan summary card (name, price, features); billing toggle (monthly/annual, switches price display); Stripe-styled card form (card number, expiry, CVC, cardholder name); billing info (email, address, country); "Subscribe Now" → 1.5s loading → /checkout/success; "Back to Pricing" link
- [ ] **PAY-02**: /checkout/success — success illustration, "Welcome to CrismaTest [Plan]!" headline, "Go to Dashboard" → /dashboard, "Take Your First Test" → /test/sample/intro

### Backend & Data (DATA)

- [ ] **DATA-01**: Supabase schema created — tables: test_templates, mock_candidates, questions, contact_submissions (all fields per BackendDoc spec)
- [ ] **DATA-02**: RLS configured — all tables read-only via anon key; contact_submissions insert-only; no client-side deletes or updates; email field not exposed in candidates list response
- [ ] **DATA-03**: Seed script (npm run db:seed) — 30-50 mock candidates with varied scores, roles, fraud flags; 80-120 static questions across 8 roles, 6 types, EN+FR text; test templates for 8 roles
- [ ] **DATA-04**: GET /api/tests — returns all active test templates (role, slug, modules, duration)
- [ ] **DATA-05**: GET /api/tests/[slug] — returns single test template with questions
- [ ] **DATA-06**: GET /api/candidates — returns mock candidates list (no email in list response)
- [ ] **DATA-07**: GET /api/candidates/[id] — returns full candidate detail including email
- [ ] **DATA-08**: GET /api/talent-pool — returns filterable talent pool entries
- [ ] **DATA-09**: POST /api/contact — validates fields (zod schema), stores in Supabase contact_submissions, triggers Resend email, rate-limited 3/IP/hour, returns minimal error messages
- [ ] **DATA-10**: varlock .env.schema declared with all 5 env variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NEXT_PUBLIC_APP_URL) with @required/@sensitive tags

### Security (SEC)

- [ ] **SEC-01**: .env in .gitignore — never committed; SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY used only in server-side API routes, never in client bundle
- [ ] **SEC-02**: No dangerouslySetInnerHTML anywhere in the codebase — zero raw HTML rendering of user input
- [ ] **SEC-03**: POST /api/contact validates all fields server-side (zod schema) and sanitizes inputs against XSS
- [ ] **SEC-04**: Rate limiting on /api/contact — 3 submissions per IP per hour
- [ ] **SEC-05**: API routes return minimal error messages — no stack traces exposed to client
- [ ] **SEC-06**: External links use rel="noopener noreferrer"
- [ ] **SEC-07**: localStorage stores only non-sensitive data (language preference only — no scores in URL params or localStorage)

### Screen Design — Pencil (DSGN)

- [ ] **DSGN-01**: Landing page system designed in Pencil — home (/), /for-candidates, /for-companies, /pricing, /contact; desktop nav (logo + links + EN|FR + CTA) and mobile nav (hamburger sheet); all sections and content hierarchy visible; brand color tokens and Inter typography applied throughout
- [ ] **DSGN-02**: Auth screens designed — /sign-up (form with role selector, show/hide password, Google OAuth button), /login (email + password + remember me), /forgot-password (static confirmation); form validation state variants shown
- [ ] **DSGN-03**: Candidate test flow designed — /test/[id]/intro (role badge, module list, CTA), /check (webcam preview, mic bars, checklist), /questions (all six question formats: QCM, drag & drop, case study, simulation, audio/video, short text; countdown timer; progress bar), /calculating (animated steps), /result (score gauge, sub-score bars, confetti state, share CTA)
- [ ] **DSGN-04**: Company dashboard designed — /dashboard (brand-navy sidebar, candidate table, filters), /candidates/[id] (score gauge, sub-scores, fraud flags, AI insight), /compare (3-col side-by-side), /talent-pool (card grid, contact modal), /build-test (4-step flow); mobile tab-bar state for all views
- [ ] **DSGN-05**: Payment flow designed — /checkout/[plan] (plan summary, billing toggle, Stripe-styled card form, billing info), /checkout/success (illustration, welcome headline, CTAs)
- [ ] **DSGN-06**: Shared component reference sheet — toast variants (success/warning/error), modal variants (invite, calendar, export, contact), skeleton shimmer states, empty state illustrations, branded 404 and 500 pages

### Shared UI (UI)

- [ ] **UI-01**: Skeleton loading states (shimmer 1.5s infinite) on all data-heavy views
- [ ] **UI-02**: Empty state with illustrated card + body text + CTA (blue-palette abstract shapes)
- [ ] **UI-03**: Toast system — success/warning/error, slide-in from right 250ms, 4s auto-dismiss
- [ ] **UI-04**: Modal system — invite candidate, calendar, export, contact modals; focus-trapped; ESC to close
- [ ] **UI-05**: Branded 404 and 500 pages — no stack trace, link back to home
- [ ] **UI-06**: All animations wrapped in @media (prefers-reduced-motion: no-preference)
- [ ] **UI-07**: Minimum 48×48px touch targets on all interactive elements; 16px minimum font-size on all form inputs

## v2 Requirements

### Authentication
- **AUTH-v2-01**: Real Supabase Auth — email/password login with real session/JWT
- **AUTH-v2-02**: Google OAuth integration
- **AUTH-v2-03**: Real database user creation on sign-up

### Payments
- **PAY-v2-01**: Real Stripe Checkout integration
- **PAY-v2-02**: Supabase subscription tracking

### AI & Proctoring
- **AI-v2-01**: Real adaptive test engine
- **AI-v2-02**: Live anti-fraud proctoring system
- **AI-v2-03**: Real score computation algorithm

### Candidate Profiles
- **PROF-v2-01**: Full candidate profiles with score history and retest tracking

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark mode | Not required for v1 — light mode only |
| i18n scaffold (full /locales files) | Included in I18N-01 scope above |
| CrismaWork integration | v3 — separate product |
| Third-party ATS/LinkedIn/Indeed API | v3 |
| CrismaScore certification with expiry | v3 |
| Heavy server infrastructure | v1 is minimal — Next.js API routes only |
| SSO / custom domain auth | Enterprise tier, post-v1 |
| Full security header suite (CSP, X-Frame-Options) | Critical-only security for v1; full checklist v2 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSYS-01 | Phase 1 | Pending |
| DSYS-02 | Phase 1 | Pending |
| DSYS-03 | Phase 1 | Pending |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| I18N-03 | Phase 1 | Complete |
| I18N-04 | Phase 1 | Complete |
| I18N-05 | Phase 1 | Complete |
| I18N-06 | Phase 1 | Complete |
| DSGN-01 | Phase 2.1 | Pending |
| DSGN-02 | Phase 2.1 | Pending |
| DSGN-03 | Phase 2.1 | Pending |
| DSGN-04 | Phase 2.1 | Pending |
| DSGN-05 | Phase 2.1 | Pending |
| DSGN-06 | Phase 2.1 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 2 | Pending |
| UI-05 | Phase 2 | Pending |
| UI-06 | Phase 2 | Pending |
| UI-07 | Phase 2 | Pending |
| LAND-06 | Phase 2 | Pending |
| LAND-07 | Phase 2 | Pending |
| LAND-08 | Phase 2 | Pending |
| LAND-01 | Phase 3 | Pending |
| LAND-02 | Phase 3 | Pending |
| LAND-03 | Phase 3 | Pending |
| LAND-04 | Phase 3 | Pending |
| LAND-05 | Phase 3 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 3 | Pending |
| DATA-10 | Phase 3 | Pending |
| SEC-01 | Phase 3 | Pending |
| AUTH-01 | Phase 4 | Pending |
| AUTH-02 | Phase 4 | Pending |
| AUTH-03 | Phase 4 | Pending |
| AUTH-04 | Phase 4 | Pending |
| AUTH-05 | Phase 4 | Pending |
| TEST-01 | Phase 4 | Pending |
| TEST-02 | Phase 4 | Pending |
| TEST-03 | Phase 4 | Pending |
| TEST-04 | Phase 4 | Pending |
| TEST-05 | Phase 4 | Pending |
| DASH-01 | Phase 5 | Pending |
| DASH-02 | Phase 5 | Pending |
| DASH-03 | Phase 5 | Pending |
| DASH-04 | Phase 5 | Pending |
| DASH-05 | Phase 5 | Pending |
| DASH-06 | Phase 5 | Pending |
| DATA-04 | Phase 5 | Pending |
| DATA-05 | Phase 5 | Pending |
| DATA-06 | Phase 5 | Pending |
| DATA-07 | Phase 5 | Pending |
| DATA-08 | Phase 5 | Pending |
| DATA-09 | Phase 5 | Pending |
| PAY-01 | Phase 6 | Pending |
| PAY-02 | Phase 6 | Pending |
| SEC-02 | Phase 6 | Pending |
| SEC-03 | Phase 6 | Pending |
| SEC-04 | Phase 6 | Pending |
| SEC-05 | Phase 6 | Pending |
| SEC-06 | Phase 6 | Pending |
| SEC-07 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 65 total (59 original + 6 DSGN)
- Mapped to phases: 65
- Unmapped: 0

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-14 after roadmap creation*
