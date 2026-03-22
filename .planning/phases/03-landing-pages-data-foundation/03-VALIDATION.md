---
phase: 3
slug: landing-pages-data-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None yet (no test runner configured) |
| **Config file** | none — manual verification only for this phase |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint` (catches type errors and i18n issues)
- **After every plan wave:** Run `npm run build` (full build verifies page routing and API routes)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 03-01-T1 | 01 | 1 | DATA-10, SEC-01 | manual | check `.env.schema` exists; verify `.env` absent from git | ⬜ pending |
| 03-01-T2 | 01 | 1 | DATA-01, DATA-02 | manual | Supabase dashboard confirms tables + RLS policies | ⬜ pending |
| 03-01-T3 | 01 | 1 | DATA-03 | manual | `npm run db:seed` exits 0; Supabase dashboard shows 40 candidates, ~100 questions, 8 templates | ⬜ pending |
| 03-02-T1 | 02 | 2 | LAND-01 | build | `npm run build` — home-light page compiles with no errors | ⬜ pending |
| 03-02-T2 | 02 | 2 | LAND-01 | manual | Visit `/` in browser — all sections render, bilingual toggle works, no layout breaks at 320px | ⬜ pending |
| 03-03-T1 | 03 | 2 | LAND-02 | build | `npm run build` — `/dark` page compiles | ⬜ pending |
| 03-03-T2 | 03 | 2 | LAND-02 | manual | Visit `/dark` in browser — dark variant renders correctly | ⬜ pending |
| 03-04-T1 | 04 | 3 | DATA-09 | build | `npm run build` — `/api/contact` route compiles | ⬜ pending |
| 03-04-T2 | 04 | 3 | DATA-09 | manual | POST /api/contact with valid payload → row in Supabase contact_submissions + Resend email sent | ⬜ pending |
| 03-04-T3 | 04 | 3 | DATA-09 | manual | POST /api/contact 4× from same IP within 1 hour → 4th returns 429, no stack trace in response | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Supabase project created (manual) — URL + keys available for `.env`
- [ ] `@supabase/ssr` installed — `npm install @supabase/ssr`
- [ ] `resend` installed — `npm install resend`
- [ ] `zod` installed — `npm install zod`
- [ ] `varlock` installed — `npm install -D varlock` (for `.env.schema`)
- [ ] `.env` file created locally with all 6 vars (not committed)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Supabase tables + RLS exist | DATA-01, DATA-02 | No test runner; requires live Supabase | Open Supabase dashboard → confirm 5 tables with correct RLS policies |
| Seed script populates data | DATA-03 | Requires live Supabase | `npm run db:seed` → check row counts in dashboard |
| Contact form saves to Supabase | DATA-09 | Live network call | Submit form → verify row in `contact_submissions` table |
| Resend email sends | DATA-09 | Requires Resend account + ADMIN_EMAIL | Submit form → check admin email inbox |
| Rate limit triggers on 4th submission | DATA-09 | State-dependent timing | Submit form 4× in < 1 hour from same IP → 4th returns error toast |
| No `.env` in git | SEC-01 | Git history check | `git log --all --full-history -- .env` returns no commits |
| i18n strings bilingual | LAND-01, LAND-02 | Visual/toggle check | Switch EN↔FR on both pages — all text changes, no fallback keys visible |
| No horizontal overflow at 320px | LAND-01, LAND-02 | Responsive visual check | DevTools → 320px viewport — no scrollbar on any section |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
