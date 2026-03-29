---
phase: 4
slug: auth-test-flow
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no test runner configured (per CLAUDE.md) |
| **Config file** | None — Wave 0 installs dependencies only |
| **Quick run command** | `npm run type-check` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds (type-check) / ~60s (build + lint) |

---

## Sampling Rate

- **After every task commit:** Run `npm run type-check`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green + manual browser walkthrough of both complete flows
- **Max feedback latency:** ~30 seconds (type-check)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-00-01 | 00 | 0 | AUTH-01–05, TEST-01–05 | automated | `npm run type-check` | ✅ | ⬜ pending |
| 4-01-01 | 01 | 1 | AUTH-01 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 1 | AUTH-02 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 1 | AUTH-03 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | AUTH-04, AUTH-05 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-03-01 | 03 | 2 | TEST-01 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-03-02 | 03 | 2 | TEST-02 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-04-01 | 04 | 3 | TEST-03 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-05-01 | 05 | 3 | TEST-04, TEST-05 | manual | `npm run type-check` | ❌ W0 | ⬜ pending |
| 4-06-01 | 06 | 4 | All AUTH + TEST | manual+auto | `npm run build && npm run lint` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Install `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities canvas-confetti` + `@types/canvas-confetti`
- [ ] Create `src/proxy.ts` (protected routes guard — cookie-based, `proxy` export, not `middleware`)
- [ ] Create `src/lib/auth.ts` (`setAuthSession` / `clearAuthSession` / `getIsLoggedIn` helpers)
- [ ] Create `src/lib/mock-data.ts` (`MOCK_TEST` static object matching Supabase schema)
- [ ] Add all auth + test i18n keys to `locales/en.json` and `locales/fr.json`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sign-up flow (form → OTP → onboarding → dashboard) | AUTH-01 | Multi-step modal flow with browser navigation | Visit /sign-up, complete all steps, confirm redirect to /dashboard |
| Login sets cookie + localStorage | AUTH-02 | document.cookie and localStorage are browser-only | Visit /login, submit, check DevTools Application tab |
| Forgot password 3-step flow | AUTH-03 | Multi-step route sequence | Visit /forgot-password, complete all steps |
| Nav switches to avatar after login | AUTH-04 | Visual state change in NavShell | Log in, confirm avatar replaces Login/Sign Up buttons |
| /dashboard redirects when logged out | AUTH-05 | proxy.ts behavior (edge runtime) | Clear cookies, navigate to /dashboard, confirm 302 to /login |
| Test intro split-panel renders | TEST-01 | Visual layout check | Visit /test/sample/intro |
| user-info form stores to sessionStorage | TEST-01b | sessionStorage is browser-only | Submit user-info form, check DevTools > Application > Session Storage |
| Webcam + mic permissions requested | TEST-02 | Browser permission dialog + live mic bars | Visit /test/sample/check |
| All 6 question types render + timer colors | TEST-03 | Complex UI interaction (drag-drop, timer, carousel) | Step through all question types; let timer reach 1:00 then 0:30 |
| Calculating auto-redirects after 5–7s | TEST-04 | setTimeout redirect | Submit test, observe calculating screen auto-navigate |
| Score gauge animates + confetti fires | TEST-05 | Animation + canvas confetti (score > 70) | Observe result page on load |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
