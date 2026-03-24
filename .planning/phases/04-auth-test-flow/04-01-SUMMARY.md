---
phase: 04-auth-test-flow
plan: "01"
subsystem: auth-pages
tags: [auth, sign-up, login, react-hook-form, zod, framer-motion, i18n]
dependency_graph:
  requires:
    - "04-00 (auth.ts setAuthSession, layout.tsx route group, locale files)"
    - "src/lib/animations.ts (fadeIn, fadeUp variants)"
  provides:
    - "/sign-up route — 5-step company registration flow"
    - "/login route — email + password login form"
  affects:
    - "locales/en.json and fr.json — auth i18n keys added"
    - "src/app/(auth)/forgot-password/*.tsx — import path fix applied"
tech_stack:
  added: []
  patterns:
    - "AnimatePresence mode=wait for step machine transitions"
    - "standardSchemaResolver from @hookform/resolvers/standard-schema (not bare @hookform/resolvers)"
    - "SignUpStep union type string literal state machine"
    - "Role chip multi-select with toggling selected state"
key_files:
  created:
    - src/app/(auth)/sign-up/page.tsx
    - src/app/(auth)/login/page.tsx
  modified:
    - locales/en.json (auth_signup_*, auth_otp_*, auth_onboarding_*, auth_allset_*, auth_login_* keys)
    - locales/fr.json (French equivalents, formal vous register)
    - src/app/(auth)/forgot-password/page.tsx (import path fix)
    - src/app/(auth)/forgot-password/verify/page.tsx (import path fix)
    - src/app/(auth)/forgot-password/reset/page.tsx (import path fix)
decisions:
  - "standardSchemaResolver must be imported from @hookform/resolvers/standard-schema — the bare @hookform/resolvers package only exports toNestErrors and validateFieldsNatively"
  - "Step machine uses local React state (SignUpStep union) — no external state library needed for 5-step linear flow"
  - "OTP step accepts any 6-digit code — no real validation in v1 prototype"
  - "Onboarding 1 and 2 selects are uncontrolled — values not persisted beyond UI in v1"
metrics:
  duration: "4 minutes"
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_changed: 7
---

# Phase 4 Plan 01: Auth Pages (Sign-Up + Login) Summary

Multi-step company sign-up flow (5 steps: form → OTP → onboarding-1 → onboarding-2 → all-set) and single-step login form, both calling setAuthSession() on completion and redirecting to /dashboard.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | /sign-up multi-step flow (AUTH-01) | 35a41af | sign-up/page.tsx, en.json, fr.json, forgot-password fixes |
| 2 | /login email + password form (AUTH-02) | 1f3c815 | login/page.tsx |

## What Was Built

### /sign-up (AUTH-01)

5-step flow with AnimatePresence mode="wait" transitions:

1. **form** — react-hook-form + standardSchemaResolver + zod schema (7 fields: companyName, firstName, lastName, email, password, companySize, country). Password show/hide toggle. Google OAuth "Coming soon" toast. "Already have an account? Log in" link.
2. **otp** — 6-digit code input. Any 6-digit value advances. Resend shows toast.
3. **onboarding-1** — Industry + hiring volume selects with step badge.
4. **onboarding-2** — Role chip multi-select (8 chips, toggle selected state). At least 1 required.
5. **complete** — CheckCircle icon (64px brand-primary). CTA calls `setAuthSession()` then `router.push('/dashboard')`.

### /login (AUTH-02)

Single-step form: email, password (with show/hide toggle), remember-me checkbox, forgot-password link (`/forgot-password`). Entrance animation with `fadeUp` variant. Google OAuth "Coming soon" toast. Submit calls `setAuthSession()` then `router.push('/dashboard')`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Wrong standardSchemaResolver import path in all (auth) pages**
- **Found during:** Task 1 type-check
- **Issue:** All (auth) pages (including 04-00 forgot-password pages) imported `standardSchemaResolver` from `@hookform/resolvers` — the bare package only exports `toNestErrors` and `validateFieldsNatively`. The resolver lives in the `@hookform/resolvers/standard-schema` sub-package.
- **Fix:** Updated import to `@hookform/resolvers/standard-schema` in all 5 affected files: sign-up/page.tsx, login/page.tsx, forgot-password/page.tsx, forgot-password/verify/page.tsx, forgot-password/reset/page.tsx
- **Files modified:** All 5 (auth) pages with form
- **Commit:** 35a41af (included in Task 1 commit)

## Verification Results

- `npm run type-check` — exit 0
- `npm run build` — exit 0; `/sign-up` and `/login` both appear as static routes

## Self-Check: PASSED

- `src/app/(auth)/sign-up/page.tsx` — EXISTS
- `src/app/(auth)/login/page.tsx` — EXISTS
- Commit 35a41af — FOUND (sign-up + i18n + import fixes)
- Commit 1f3c815 — FOUND (login page)
