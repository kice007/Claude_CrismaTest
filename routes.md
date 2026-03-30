# CrismaTest — Route Map

## Public Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page. Sections: hero, trust bar, problem/solution, features, CrismaScore explainer, anti-fraud, test library, FAQ, contact, footer. |
| `/dark` | Dark-theme variant of the landing page. Identical structure with dark style overrides. |
| `/dev/design-system` | Dev-only component playground. Shows brand colors, typography, UI components, animations, i18n, modals, skeletons, and empty states. Returns 404 in production. |

---

## Authentication Routes (`(auth)`)

| Route | Description |
|-------|-------------|
| `/login` | Login form with email/password, password visibility toggle, "forgot password" link, Google OAuth button, and signup link. On submit calls `login()` and redirects to `/dashboard`. |
| `/sign-up` | 5-step registration wizard: (1) account details form, (2) OTP email verification, (3) industry/hiring preferences, (4) usage intent survey, (5) success confirmation modal. Sets auth session and redirects to `/dashboard`. |
| `/onboarding` | 2-step onboarding questionnaire for existing users (industry/hiring preferences → usage intent). Redirects to `/dashboard` on completion. |
| `/forgot-password` | Password reset entry point. Collects the user's email, stores it in sessionStorage, and navigates to `/forgot-password/verify`. |
| `/forgot-password/verify` | OTP verification step for password reset. 6-digit code input with resend option. Redirects to `/forgot-password/reset` on success. |
| `/forgot-password/reset` | New password form with strength requirements (min 8 chars, number, special character). Clears sessionStorage and redirects to `/login` on success. |

---

## Dashboard Routes (`/dashboard`) — Auth-gated

| Route | Description |
|-------|-------------|
| `/dashboard` | Main overview. Displays 4 KPI cards (tests sent, avg score, candidates reviewed, fraud flags), a score distribution chart, top 3 candidates card, and a paginated recent-candidates table. |
| `/dashboard/candidates` | Full candidate list with pagination (10/page), role multi-select filter, score-range filter, full-text search, checkbox selection (up to 5), compare button (2+ selected), status badges, and per-row profile link. |
| `/dashboard/candidates/[id]` | Candidate detail page. Sections: profile header, CrismaScore gauge + sub-scores, role-fit assessment, test timeline, video preview, hiring pipeline, anti-fraud flags, AI insights, recruiter notes, and interview scheduling modal. |
| `/dashboard/tests` | Test template library. 22 preset templates with role filter, status filter (Active / Draft / Archived), name search, and a table showing modules, duration, status, created date, and response count. |
| `/dashboard/tests/[id]` | Test template detail and configuration/preview page. |
| `/dashboard/talent-pool` | Grid view of talent pool candidates. Full-width search bar, filter chips (role, score range, status), sort dropdown, and responsive 3-column card grid. |
| `/dashboard/talent-pool/[id]` | Talent pool candidate detail. Profile card, 3 test result cards (Cognitive, Technical Skills, Leadership Potential) each with CrismaScore and sub-scores, anti-fraud status, and a contact modal. |
| `/dashboard/compare` | Side-by-side comparison for up to 3 candidates (IDs passed via `?ids=` query param). Comparison table covers CrismaScore, sub-scores, fraud risk, pipeline stage, and AI verdict. Highlights the best-fit candidate. |
| `/dashboard/build-test` | Test builder wizard. Renders the `BuildTestWizard` component for creating new test templates. |
| `/dashboard/settings` | Settings page — placeholder, currently shows "Coming soon". |

---

## Test Simulation Routes (`/test/[id]`) — Public

> The `[id]` segment is the test identifier. All routes below are part of a linear candidate flow.

| Route | Description |
|-------|-------------|
| `/test/[id]/intro` | Pre-test introduction screen. Shows test role, total duration, module breakdown with icons, and a camera/privacy disclaimer. CTA starts the flow to `/test/[id]/user-info`. |
| `/test/[id]/info` | Duplicate of `/test/[id]/intro`. Same layout and content. |
| `/test/[id]/user-info` | Candidate info collection form. Fields: full name, email, phone, company, job title (all required). Saves to sessionStorage and navigates to `/test/[id]/check`. |
| `/test/[id]/check` | Equipment check screen. Live webcam preview with mic-level ripple indicator, auto-detects camera/mic permissions, and manual checklist (testing alone, no secondary screens, consent). Start button activates when all checks pass. |
| `/test/[id]/questions` | Main test interface. Progress bar, module badge, countdown timer (turns orange ≤60s, red ≤30s). Supports 5 question types: multiple-choice (QCM), drag-and-drop ordering, case study/simulation, audio/video recording, and short text. Auto-submits on timeout. Saves answers to sessionStorage. |
| `/test/[id]/calculating` | Results processing screen. Animated floating particles, pulsing spinner, staggered processing steps. Auto-redirects to `/test/[id]/result` after 6 seconds. |
| `/test/[id]/result` | Final results page. Animated SVG score gauge with grade badge (Excellent / Good / Average / Below), sub-score bar charts (Logic, Communication, Job Skills, Trust, Video), AI-generated strengths, share button, and retake option. Confetti animation for scores above 70. |
