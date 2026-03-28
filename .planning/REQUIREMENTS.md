# Requirements: CrismaTest

**Defined:** 2026-03-14
**Last updated:** 2026-03-22 — synced frame names with actual design files; fixed DSGN-01 status (landing pages partial); added auth onboarding flow frames; corrected dashboard/auth frame name mismatches
**Core Value:** A candidate completes the test and gets their CrismaScore — a company can review and compare candidates by score.

---

## Route Map

> Derived from all Pencil design files. Each route maps to a named frame.

### Public / Landing (`design/landing-pages.pen`)

| Route | Frame | Description |
|-------|-------|-------------|
| `/` | `home-light` | Light home page — hero, features, social proof, pricing CTA |
| `/dark` | `home-dark` | Dark variant of home page |


### Authentication (`design/auth.pen`)

| Route | Frame | Description |
|-------|-------|-------------|
| `/sign-up` | `sign-up` | Company registration form |
| `/sign-up` (OTP step) | `modal-otp` | Email OTP verification modal after sign-up |
| `/sign-up` (onboarding) | `onboarding-step1` | Company profile setup — step 1 of 2 |
| `/sign-up` (onboarding) | `onboarding-step2` | Company profile setup — step 2 of 2 |
| `/sign-up` (complete) | `modal-allset` | "All set!" completion modal |
| `/login` | `login` | Email + password login |
| `/forgot-password` | `forgot-password` | Step 1 — enter email |
| `/forgot-password/verify` | `otp-verify` | Step 2 — enter OTP code |
| `/forgot-password/reset` | `new-password` | Step 3 — new password + confirmation |

### Candidate Test Flow (`design/test-flow.pen`)

| Route | Frame (ID) | Description |
|-------|------------|-------------|
| `/test/[id]/intro` | `intro` (`mEEpY`) | Role badge, module list, anti-fraud notice, "Start Test" CTA |
| `/test/[id]/user-info` | `user-info` (`70euA`) | **NEW** — Candidate info form (name, email, phone, job title, company) |
| `/test/[id]/check` | `check` (`oUhTX`) | Pre-flight: webcam preview, mic bars, checklist, "I'm Ready" CTA |
| `/test/[id]/questions` | `questions--qcm`, `questions--dragdrop`, `questions--casestudy`, `questions--simulation`, `questions--audiovideo`, `questions--shorttext` | Question carousel — 6 format types |
| `/test/[id]/calculating` | `calculating` (`UEtRR`) | Animated score computation (5–7s, auto-redirect) |
| `/test/[id]/result` | `result` (`m6thB`) / `result--confetti` (`vkvua`) | Score gauge, sub-scores, share CTA; confetti variant if score > 70 |

### Company Dashboard (`design/dashboard.pen`)

| Route | Frame | Description |
|-------|-------|-------------|
| `/dashboard` | `dashboard` | Brand-navy sidebar + candidate table |
| `/dashboard/candidates/[id]` | `candidates-detail` | Score gauge, sub-scores, fraud flags, AI insight |
| `/dashboard/compare` | `compare` | Side-by-side comparison — **not a direct URL**; reached by selecting candidates on `/dashboard` then clicking "Compare" |
| `/dashboard/talent-pool` | `talent-pool` | Card grid of available candidates |
| `/dashboard/build-test` | `build-test` → `build-test-modules` → `build-test-custom-questions` → `build-test-generate` → `build-test-preview` → `build-test-success` | 4-step test builder + preview + success modal |
| `/dashboard/tests` | `tests` | All created tests — list with name, role, date, status; actions: view detail, edit, delete |
| `/dashboard/tests/[id]` | `test-details` | Test detail — questions preview, shareable link, candidate responses count, edit/delete actions |
| `/dashboard/tests/[id]` (edit) | `test-edit` → `test-edit-success` | Inline edit mode + save success modal |
| `/dashboard/tests/[id]` (share) | `test-share-modal` | Share modal with copy link + email CTA |

### Payment (`design/payments.pen`)

| Route | Frame | Description |
|-------|-------|-------------|
| `/checkout/[plan]` | `checkout` | Plan summary, billing toggle, Stripe-styled card form |
| `/checkout/success` | `checkout-success` | Success illustration + "Go to Dashboard" CTA |

---

## User & Navigation Flows

### Candidate Flow

```
[Landing /]
  └─ "Take Free Test" / test link
       └─ /test/[id]/intro          (Start Test →)
            └─ /test/[id]/user-info  (Continue →)       ← NEW
                 └─ /test/[id]/check  ("I'm Ready" — all checkboxes checked →)
                      └─ /test/[id]/questions  (12–18q carousel, Submit Test →)
                           └─ /test/[id]/calculating  (auto 5–7s →)
                                └─ /test/[id]/result
                                     ├─ "Share CrismaScore" → copy link / LinkedIn sheet
                                     ├─ "Improve Your Score" → /pricing
                                     └─ "Retake Test" → /test/[id]/intro
```

### Company Flow

```
[Landing /]
  ├─ "Sign Up" → /sign-up → (OTP verify → onboarding step 1 → onboarding step 2 → all set modal) → /dashboard
  └─ "Login"   → /login   → /dashboard
                               ├─ row click → /dashboard/candidates/[id]
                               │    ├─ "Invite to Interview" → calendar modal
                               │    └─ "Email Candidate" → mailto
                               ├─ checkbox select 2–3 candidates → "Compare" button → /dashboard/compare
                               │    └─ (no direct URL — requires candidate selection state)
                               ├─ /dashboard/talent-pool
                               │    └─ card click → inline detail modal → "Contact Candidate"
                               ├─ /dashboard/tests
                               │    ├─ row: view detail → /dashboard/tests/[id]
                               │    │    ├─ edit → inline edit or /dashboard/tests/[id]/edit
                               │    │    └─ delete → confirm modal → removed from list
                               │    └─ "Build New Test" → /dashboard/build-test (4 steps)
                               └─ /dashboard/build-test (4 steps)
                                    └─ "Copy Test Link" / "Send to Candidates" (static) → saved to /dashboard/tests
```

### Auth Sub-flow — Forgot Password (3 steps)

```
/login → "Forgot password?" → /forgot-password (enter email)
  → /forgot-password/verify (OTP — any code accepted, no real email)
       → /forgot-password/reset (new password + confirm)
            → /login
```

### Payment Flow

```
/pricing → "Subscribe" → /checkout/[plan]
  → "Subscribe Now" (1.5s loading) → /checkout/success
       → "Go to Dashboard" → /dashboard
       └─ "Take Your First Test" → /test/sample/intro
```

---

## Data Flow

### Candidate Test Session

```
user-info form
  → sessionStorage: { fullName, email, phone, jobTitle, company }
  → carried through all test steps (used to identify submission)

questions engine
  → local React state: { answers[], flaggedQuestions[], currentIndex, timeRemaining }
  → on Submit Test: POST /api/submissions (v2; v1 uses mock local state)

calculating page
  → reads mock answers → derives score locally (v1 static/deterministic)
  → stores { crimsaScore, subScores } in sessionStorage

result page
  → reads sessionStorage for score + user-info
  → renders gauge, sub-scores, confetti (score > 70)
  → "Share" CTA copies static URL
```

### Company Dashboard

```
/dashboard               → GET /api/candidates              → candidate list (no email exposed)
                           user selects 2–3 rows → Compare button unlocks
                           → /dashboard/compare  → client-side join of selected /api/candidates/[id] responses (no dedicated URL without selection state)
/candidates/[id]        → GET /api/candidates/[id]         → full detail incl. email
/talent-pool             → GET /api/talent-pool              → filterable pool entries
/tests                   → GET /api/tests                    → all test templates (id, role, name, modules, created_at, status)
/tests/[id]             → GET /api/tests/[id]               → full test detail with questions preview + response count
                           PUT /api/tests/[id]               → edit test (name, modules, custom questions)
                           DELETE /api/tests/[id]            → delete test → confirm modal → removed
/build-test              → POST /api/tests (on "Generate")   → creates new test → redirects to /dashboard/tests/[newId]
```

### Auth (v1 — visual only)

```
/sign-up  → sets isLoggedIn = true in localStorage → redirect /dashboard
/login    → sets isLoggedIn = true in localStorage → redirect /dashboard
/logout   → clears isLoggedIn                       → redirect /
protected routes (/dashboard, /test/*) → check isLoggedIn → redirect /login if false
```

---

## v1 Requirements

### Design System (DSYS)

- [x] **DSYS-01**: Tailwind config extended with all brand tokens (colors: brand-primary #1B4FD8, brand-secondary #3B6FE8, brand-navy #0F2A6B, brand-light #EEF2FF, brand-accent #6366F1, neutrals, success/warning/danger; typography scale; spacing scale)
- [x] **DSYS-02**: Shadcn/ui installed and overridden with brand tokens via CSS variables in globals.css
- [x] **DSYS-03**: Inter + JetBrains Mono loaded via next/font with font-display: swap

### Internationalization (I18N)

- [x] **I18N-01**: react-i18next + next-i18next configured — /locales/en.json and /locales/fr.json with all UI strings
- [x] **I18N-02**: Every component uses useTranslation() — zero hardcoded UI strings
- [x] **I18N-03**: Language switcher component renders EN|FR pills in desktop nav, globe icon dropdown on mobile
- [x] **I18N-04**: Language switch is instant (no page reload), stored in localStorage, restored on next visit
- [x] **I18N-05**: Plurals implemented via i18next plural keys for candidate counts
- [x] **I18N-06**: Meta tags (lang attribute, og:locale) set per page via next-i18next

### Landing Pages (LAND)

- [x] **LAND-01**: `/` Light Home page — implement frame `home-light` and `home-dark` solely from `design/landing-pages.pen`; hero, features, social proof, pricing CTA, footer; 11 sections built (03-03)
- [x] **LAND-02**: `/dark` Dark Home page — implement frame `home-dark` from `design/landing-pages.pen`
- [x] **LAND-01_02-contact**: contact form submit → POST /api/contact (built in 03-03 with zod validation + rate limiting)
- [x] **LAND-06**: Fixed nav (desktop): logo left, links center, EN|FR + Login + Sign Up right; white/95 backdrop-blur; shadow on scroll
- [x] **LAND-07**: Mobile nav: hamburger → slide-down sheet with all links + language toggle, 48px tap targets
- [x] **LAND-08**: All landing pages fully responsive — no horizontal overflow at 320px minimum

### Authentication — Visual Only (AUTH)

- [x] **AUTH-01**: `/sign-up` — form (Company Name, first name, last name, work email, password show/hide, company size, country/region dropdown); submit → `modal-otp` (email verification) → `onboarding-step1` (company profile) → `onboarding-step2` → `modal-allset` → sets isLoggedIn=true in localStorage → redirect `/dashboard`; Google OAuth button shows "Coming soon" toast
- [x] **AUTH-02**: `/login` — email + password + remember me; sets isLoggedIn; forgot password link → `/forgot-password`
- [x] **AUTH-03**: `/forgot-password` 3-step flow: Step 1 (`/forgot-password`, frame `forgot-password`) enter email → Step 2 (`/forgot-password/verify`, frame `otp-verify`) OTP entry (any code accepted, no real email) → Step 3 (`/forgot-password/reset`, frame `new-password`) new password + confirmation → back to `/login`
- [x] **AUTH-04**: Logged-in nav state — user avatar + name top-right, dropdown with My Profile, Settings, Logout; logout clears isLoggedIn → redirect to `/`; refer to `design/dashboard.pen`
- [x] **AUTH-05**: Protected routes — `/dashboard` and `/test/*` redirect to `/login` if isLoggedIn = false

### Candidate Test Flow (TEST)

> **Design source:** `design/test-flow.pen` — all frames at 1440×900, no NavShell (full-screen focus mode per `introNote`)

- [x] **TEST-01**: `/test/[id]/intro` — frame `intro` (`mEEpY`); split-panel layout (720px navy left: logo + tagline "Your skills, objectively measured." + "Trusted by 500+ companies"; 720px light right: white card with role badge, duration row, module breakdown list, webcam disclaimer chip, "Start Test →" CTA button); no NavShell; full-width centered card on all breakpoints; "Start Test →" → `/test/[id]/user-info`

- [ ] **TEST-01b**: `/test/[id]/user-info` — frame `user-info` (`70euA`); **NEW step between intro and check**; split-panel layout matching intro (navy left: logo + "Step 1 of 2" badge + "Tell us a bit about yourself before we begin."; light right: white card with title "Your Information"); form fields: Full Name (placeholder "e.g. John Smith"), Email Address (placeholder "e.g. john@company.com"), Phone / Contact, Job Title, Company / Organization; all fields required; form data stored in sessionStorage under key `crismatest_candidate_info`; "Continue →" CTA → `/test/[id]/check`

- [x] **TEST-02**: `/test/[id]/check` — frame `check` (`oUhTX`); "Pre-flight check" header with logo; two-column body: left col (real webcam preview via browser permission request, mic level animated bars via Web Audio API), right col (anti-fraud checklist: camera ✓, mic ✓, alone in room ✓, no extra screens ✓; disclaimer checkbox); "I'm Ready" CTA activates only when ALL four checkboxes are checked (per `readyNote`); camera/mic denied → warning toast + retry button; "I'm Ready" → `/test/[id]/questions`

- [x] **TEST-03**: `/test/[id]/questions` — 6 question format frames, all sharing header/body/footer structure; **header**: progress bar (`progressBarBg`), module badge (`moduleBadge`, brand-accent), countdown timer (`timerBox`, JetBrains Mono — `#F59E0B` amber at 1:00 remaining, `#EF4444` red at 0:30 per `timerNote`); **footer**: Previous button, "Flag for review" link (brand-accent), Next/Submit button; stateful 12-18 question carousel; full-screen, no NavShell:
  - *QCM* (`questions--qcm`, `uxyll`): single/multi-select A/B/C/D; multi-select uses checkboxes per `qcmNote`
  - *Drag & Drop* (`questions--dragdrop`, `lBny6`): ranking via dnd-kit, 48px touch targets, visible drag handles per `ddNote`
  - *Case Study* (`questions--casestudy`, `34eoS`): scenario card (`csScenario`, brand-light bg) + 3 decision questions per `csNote`
  - *Simulation* (`questions--simulation`, `Ru5jv`): branching customer support scenario — answer changes next question per `simNote`; two-column body (`simLeft` + `simRight`)
  - *Audio/Video* (`questions--audiovideo`, `0vBzj`): dark video area (`avVideoArea`, `#1F2937`), 90s record limit, countdown bar, preview before submit per `avNote`; record/stop/preview/submit button row
  - *Short Text* (`questions--shorttext`, `iNQFK`): textarea (`stTextarea`, brand-primary 2px border), 150-word limit, real-time word counter in JetBrains Mono per `stNote`; "Submit Test" on last question → `/test/[id]/calculating`

- [x] **TEST-04**: `/test/[id]/calculating` — frame `calculating` (`UEtRR`); full dark-navy background with neural-network particle animation (`calcBg`); centered card (`calcCard`, `#0F2A6B`, cornerRadius 16, padding 56): circular gauge area (200×200, brand-primary 6px stroke ring) + staggered step list (`calcSteps`) — "Analyzing responses." → "Checking consistency." → "Computing sub-scores." → "Generating CrismaScore." (staggerChildren 0.3s per `calcNote`); auto-redirects to `/test/[id]/result` after 5–7s

- [x] **TEST-05**: `/test/[id]/result` — two variants based on score:
  - Standard: frame `result` (`m6thB`), brand-light background
  - Confetti (score > 70): frame `result--confetti` (`vkvua`), canvas-confetti overlay
  - Both: white header (logo), two-column body (leftCol 380px fixed: CrismaScore gauge 0→final 1.5s ease-out Framer Motion + grade badge; 5 sub-score bars: Logic, Communication, JobSkill, Trust, Video; strengths panel 2-3 bullets); rightCol fill: share CTA "Share Your CrismaScore" (copy link + LinkedIn sheet), "Improve Your Score" → `/pricing`, "Retake Test" → `/test/[id]/intro` with retest counter; gauge full-width mobile, sub-scores stacked

### Company Dashboard (DASH)

- [x] **DASH-01**: `/dashboard` — frame `dashboard`; brand-navy sidebar (desktop, icon+label nav items, user avatar+plan badge at bottom); candidate table (avatar, name, role, CrismaScore chip, TrustScore, status badge, date, actions); row click → `/dashboard/candidates/[id]`; filters (role, score range, status, date range); search (name or email); "Invite Candidate" button → static modal; skeleton loading on data fetch
- [x] **DASH-02**: Mobile: sidebar → bottom tab bar (5 icons, 56px, brand-navy bg); table → scrollable card stack; filters → bottom sheet
- [x] **DASH-03**: `/dashboard/candidates/[id]` — frame `candidates-detail`; header card (avatar, name, role, email clickable mailto, test date, status badge); CrismaScore gauge + 5 sub-score bars; test timeline with module timestamps; mocked video player; anti-fraud flags panel (severity Low/Medium/High badges); AI insight card (3-bullet interview recommendation); "Invite to Interview" → calendar modal; "Email Candidate" → mailto with prefilled subject; back → `/dashboard`
- [x] **DASH-04**: Compare view — frame `compare`; **not a standalone URL**; reached by selecting 2–3 candidate rows on `/dashboard` via checkboxes then clicking "Compare Selected"; state passed via React context / query params (e.g. `?ids=a,b,c`); 3-column layout (score gauge, sub-score bars, fraud flags, video thumbnail per candidate); "Recommended for Interview" badge on top scorer; "Export Report" → downloads static PDF mockup; columns stack vertically on mobile; back → `/dashboard` preserves selection
- [x] **DASH-05**: `/dashboard/talent-pool` — frame `talent-pool`; card grid (4 cols desktop / 2 tablet / 1 mobile): avatar, name, role, CrismaScore badge, TrustScore, last test date, Contact CTA; filters (score range, role, experience); search (name, role, skill); card click → inline detail modal; "Contact Candidate" → email modal with prefilled mailto
- [x] **DASH-06**: `/dashboard/build-test` — frames `build-test` (role) → `build-test-modules` (module toggle) → `build-test-custom-questions` (up to 3 custom questions, add via `Add Question Modal`) → `build-test-generate` (generate) → `build-test-preview` (preview) → `build-test-success` (success modal); "Copy Test Link" and "Send to Candidates" CTAs (static); on complete → test saved → redirect to `/dashboard/tests/[newId]`

- [x] **DASH-07**: `/dashboard/tests` — frame `tests`; sidebar nav item "Tests" (alongside Candidates, Talent Pool, Build Test); table columns: test name, role, modules count, created date, status badge (Active/Draft/Archived), candidate responses count, actions (View, Edit, Delete); "Build New Test" CTA → `/dashboard/build-test`; empty state with illustrated card + "Build your first test" CTA; skeleton loading; search by test name or role

- [x] **DASH-08**: `/dashboard/tests/[id]` — frame `test-details`; header: test name, role badge, status badge, created date; shareable link field (copy-to-clipboard via `test-share-modal`); modules list with question counts per module; custom questions preview (read-only); candidate responses count with link to filtered `/dashboard` view; "Edit Test" → `test-edit` frame (name, modules, custom questions editable) → save → `test-edit-success` modal; "Delete Test" → confirm modal ("This will remove the test and its shareable link") → delete → redirect to `/dashboard/tests`; "Send to Candidates" → email modal with prefilled mailto

### Payment Flow — Visual Only (PAY)

- [ ] **PAY-01**: `/checkout/[plan]` — frame `checkout`; plan summary card (name, price, features); billing toggle (monthly/annual, switches price display); Stripe-styled card form (card number, expiry, CVC, cardholder name); billing info (email, address, country); "Subscribe Now" → 1.5s loading → `/checkout/success`; "Back to Pricing" link
- [ ] **PAY-02**: `/checkout/success` — frame `checkout-success`; success illustration, "Welcome to CrismaTest [Plan]!" headline, "Go to Dashboard" → `/dashboard`, "Take Your First Test" → `/test/sample/intro`

### Backend & Data (DATA)

- [x] **DATA-01**: Supabase schema — tables: `test_templates`, `mock_candidates`, `questions`, `contact_submissions`, `test_sessions` (id, test_id, candidate_info JSON, answers JSON, score, sub_scores JSON, created_at)
- [x] **DATA-02**: RLS — all tables read-only via anon key; `contact_submissions` insert-only; `test_sessions` insert-only from client; email field not exposed in candidates list response
- [x] **DATA-03**: Seed script (`npm run db:seed`) — 30-50 mock candidates with varied scores, roles, fraud flags; 80-120 static questions across 8 roles, 6 types, EN+FR text; test templates for 8 roles
- [x] **DATA-04**: `GET /api/tests` — returns all test templates (id, role, slug, name, modules, duration, status, created_at, response_count)
- [x] **DATA-05**: `GET /api/tests/[id]` — returns single test with full question list, custom questions, shareable link, response count
- [x] **DATA-05b**: `PUT /api/tests/[id]` — updates test name, modules, custom questions; returns updated test
- [x] **DATA-05c**: `DELETE /api/tests/[id]` — soft-deletes test (status → Archived); returns 204
- [x] **DATA-06**: `GET /api/candidates` — returns mock candidates list (no email in list response)
- [x] **DATA-07**: `GET /api/candidates/[id]` — returns full candidate detail including email
- [x] **DATA-08**: `GET /api/talent-pool` — returns filterable talent pool entries
- [x] **DATA-09**: `POST /api/contact` — validates fields (zod schema), stores in Supabase `contact_submissions`, triggers Resend email, rate-limited 3/IP/hour, returns minimal error messages
- [x] **DATA-10**: varlock `.env.schema` declared with all env variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL` with `@required`/`@sensitive` tags
- [ ] **DATA-11**: `candidate_info` from `/test/[id]/user-info` form (fullName, email, phone, jobTitle, company) stored in sessionStorage key `crismatest_candidate_info`; passed as JSON body field to `POST /api/test-sessions` on test submit (v1: localStorage mock; v2: Supabase `test_sessions` table)

### Security (SEC)

- [x] **SEC-01**: `.env` in `.gitignore` — never committed; `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` used only in server-side API routes, never in client bundle
- [ ] **SEC-02**: No `dangerouslySetInnerHTML` anywhere — zero raw HTML rendering of user input
- [ ] **SEC-03**: `POST /api/contact` validates all fields server-side (zod schema) and sanitizes inputs against XSS
- [ ] **SEC-04**: Rate limiting on `/api/contact` — 3 submissions per IP per hour
- [ ] **SEC-05**: API routes return minimal error messages — no stack traces exposed to client
- [ ] **SEC-06**: External links use `rel="noopener noreferrer"`
- [ ] **SEC-07**: localStorage stores only non-sensitive data (language preference, isLoggedIn boolean — no scores in URL params or localStorage; candidate_info in sessionStorage cleared on tab close)

### Screen Design — Pencil (DSGN)

- [~] **DSGN-01**: Landing pages designed in `design/landing-pages.pen` — frames: `home-light` (/), `home-dark` (/dark) ✓ DONE; MISSING: `nav--mobile` mobile hamburger sheet frame (375px open state)
- [~] **DSGN-02**: Auth screens designed in `design/auth.pen` — frames: `sign-up`, `modal-otp`, `onboarding-step1`, `onboarding-step2`, `modal-allset`, `login`, `forgot-password`, `otp-verify`, `new-password` ✓ DONE; MISSING: `sign-up--error`, `login--error` error state frames
- [x] **DSGN-03**: Test flow designed in `design/test-flow.pen` — frames in canvas order: `intro` → `user-info` → `check` → `questions--qcm` / `questions--dragdrop` / `questions--casestudy` / `questions--simulation` / `questions--audiovideo` / `questions--shorttext` → `calculating` → `result` / `result--confetti`; design annotations (notes) embedded on canvas per step
- [~] **DSGN-04**: Dashboard designed in `design/dashboard.pen` — frames: `dashboard`, `candidates-detail`, `compare`, `talent-pool`, `build-test`, `build-test-modules`, `build-test-custom-questions`, `build-test-generate`, `build-test-preview`, `build-test-success`, `tests`, `test-details`, `test-edit`, `test-edit-success`, `test-share-modal`, `Add Question Modal` ✓ DONE; MISSING:  responsive mobile frames + skeleton/empty state variants
- [x] **DSGN-05**: Payment flow designed in `design/payments.pen` — frames: `checkout`, `checkout-success`
- [x] **DSGN-06**: Shared component reference sheet — toast variants (success/warning/error), modal variants, skeleton shimmer states, empty state illustrations, branded 404 and 500 pages
- [x] **DSGN-07**: User-info frame designed in `design/test-flow.pen` — frame `user-info` (`70euA`); split-panel matching intro style (navy left: logo + "Step 1 of 2" badge; light right: card with 5 form fields + Continue CTA); inserted between `intro` and `check` in canvas vertical stack

### Shared UI (UI)

- [x] **UI-01**: Skeleton loading states (shimmer 1.5s infinite) on all data-heavy views
- [x] **UI-02**: Empty state with illustrated card + body text + CTA (blue-palette abstract shapes)
- [x] **UI-03**: Toast system — success/warning/error, slide-in from right 250ms, 4s auto-dismiss
- [x] **UI-04**: Modal system — invite candidate, calendar, export, contact modals; focus-trapped; ESC to close
- [x] **UI-05**: Branded 404 and 500 pages — no stack trace, link back to home
- [x] **UI-06**: All animations wrapped in `@media (prefers-reduced-motion: no-preference)`
- [x] **UI-07**: Minimum 48×48px touch targets on all interactive elements; 16px minimum font-size on all form inputs

---

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

---

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

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSYS-01 | Phase 1 | Complete |
| DSYS-02 | Phase 1 | Complete |
| DSYS-03 | Phase 1 | Complete |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| I18N-03 | Phase 1 | Complete |
| I18N-04 | Phase 1 | Complete |
| I18N-05 | Phase 1 | Complete |
| I18N-06 | Phase 1 | Complete |
| DSGN-01 | Phase 2.1 | Partial — home-light + home-dark done; missing nav--mobile hamburger sheet frame |
| DSGN-02 | Phase 2.1 | Partial — core flows done; error states missing |
| DSGN-03 | Phase 2.1 | Complete |
| DSGN-04 | Phase 2.1 | Partial — all desktop views done; responsive mobile + empty states missing |
| DSGN-05 | Phase 2.1 | Complete |
| DSGN-06 | Phase 2.1 | Complete |
| DSGN-07 | Phase 2.1 | Complete |
| UI-01 | Phase 2 | Complete |
| UI-02 | Phase 2 | Complete |
| UI-03 | Phase 2 | Complete |
| UI-04 | Phase 2 | Complete |
| UI-05 | Phase 2 | Complete |
| UI-06 | Phase 2 | Complete |
| UI-07 | Phase 2 | Complete |
| LAND-06 | Phase 2 | Complete |
| LAND-07 | Phase 2 | Complete |
| LAND-08 | Phase 2 | Complete |
| LAND-01 | Phase 3 | Complete |
| LAND-02 | Phase 3 | Complete |
| LAND-01_02-contact | Phase 3 | Pending |
| DATA-01 | Phase 3 | Complete |
| DATA-02 | Phase 3 | Complete |
| DATA-03 | Phase 3 | Complete |
| DATA-10 | Phase 3 | Complete |
| DATA-11 | Phase 3 | Pending |
| SEC-01 | Phase 3 | Complete |
| AUTH-01 | Phase 4 | Complete |
| AUTH-02 | Phase 4 | Complete |
| AUTH-03 | Phase 4 | Complete |
| AUTH-04 | Phase 4 | Complete |
| AUTH-05 | Phase 4 | Complete |
| TEST-01 | Phase 4 | Complete |
| TEST-01b | Phase 4 | Pending |
| TEST-02 | Phase 4 | Complete |
| TEST-03 | Phase 4 | Complete |
| TEST-04 | Phase 4 | Complete |
| TEST-05 | Phase 4 | Complete |
| DASH-01 | Phase 5 | Complete |
| DASH-02 | Phase 5 | Complete |
| DASH-03 | Phase 5 | Complete |
| DASH-04 | Phase 5 | Complete |
| DASH-05 | Phase 5 | Complete |
| DASH-06 | Phase 5 | Complete |
| DASH-07 | Phase 5 | Complete |
| DASH-08 | Phase 5 | Complete |
| DATA-04 | Phase 5 | Complete |
| DATA-05 | Phase 5 | Complete |
| DATA-05b | Phase 5 | Complete |
| DATA-05c | Phase 5 | Complete |
| DATA-06 | Phase 5 | Complete |
| DATA-07 | Phase 5 | Complete |
| DATA-08 | Phase 5 | Complete |
| DATA-09 | Phase 5 | Complete |
| PAY-01 | Phase 6 | Pending |
| PAY-02 | Phase 6 | Pending |
| SEC-02 | Phase 6 | Pending |
| SEC-03 | Phase 6 | Pending |
| SEC-04 | Phase 6 | Pending |
| SEC-05 | Phase 6 | Pending |
| SEC-06 | Phase 6 | Pending |
| SEC-07 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 71 total (removed LAND-03, LAND-04, LAND-05 — orphaned from original 5-page scope, no definitions exist)
- Mapped to phases: 71
- Unmapped: 0

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-21 — synced with design/test-flow.pen, design/landing-pages.pen, design/auth.pen, design/dashboard.pen, design/payments.pen; added Route Map, User & Navigation Flows, Data Flow sections; added TEST-01b (user-info step), DATA-11 (candidate_info storage), DSGN-07*
