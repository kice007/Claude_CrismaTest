---
phase: 5
slug: company-dashboard-api
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured — CLAUDE.md states "No test runner is configured yet" |
| **Config file** | None — Wave 0 installs shadcn components + seeds DB |
| **Quick run command** | `npm run lint && npx tsc --noEmit` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds (lint + type-check), ~60 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npx tsc --noEmit`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full build must be green + human visual QA of all 8 dashboard views
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| Wave 0 setup | 01 | 0 | DATA-04–09 | setup | `npm run lint && npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| API /api/candidates | 01 | 1 | DATA-06 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| API /api/candidates/[id] | 01 | 1 | DATA-07 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| API /api/tests | 01 | 1 | DATA-04 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| API /api/tests/[id] | 01 | 1 | DATA-05 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| API /api/talent-pool | 01 | 1 | DATA-08 | manual | `npm run build` | ❌ W0 | ⬜ pending |
| Candidate list UI | 02 | 2 | DASH-01 | manual-only | Visual inspection in browser | ❌ W0 | ⬜ pending |
| Candidate detail UI | 02 | 2 | DASH-03 | manual-only | Visual browser inspection | N/A | ⬜ pending |
| Compare view | 03 | 2 | DASH-04 | manual-only | Browser navigation + DevTools | N/A | ⬜ pending |
| Talent pool grid | 03 | 2 | DASH-05 | manual-only | Visual browser inspection | N/A | ⬜ pending |
| Build-test flow | 03 | 2 | DASH-06 | manual-only | Visual browser inspection | N/A | ⬜ pending |
| Tests list | 04 | 2 | DASH-07 | manual-only | Visual browser inspection | N/A | ⬜ pending |
| Mobile responsive | 04 | 3 | DASH-02 | manual-only | DevTools 375px responsive mode | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] shadcn components installed: `npx shadcn@latest add table badge select input checkbox tabs separator`
- [ ] `public/crima-compare-report.pdf` — placeholder branded PDF for DASH-04 export CTA
- [ ] Verify `npm run db:seed` produces populated `mock_candidates` and `test_templates`

*No automated test files — no test runner configured. Build + lint + type-check serve as the automated gate.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Candidate list search + filters | DASH-01 | UI interaction, no test runner | Open /dashboard/candidates, search by name/email, apply role/score/status/date filters |
| Mobile bottom tab bar | DASH-02 | Visual responsive layout | DevTools → 375px → verify sidebar becomes bottom tab bar |
| Candidate detail gauge + mailto | DASH-03 | Visual + link behavior | Click candidate row → verify score gauge, sub-scores, fraud flags, AI card, mailto link |
| Compare badge on top scorer | DASH-04 | Visual with data dependency | Select 3 candidates → verify "Recommended for Interview" on highest scorer |
| Talent pool contact modal | DASH-05 | UI interaction | Click talent pool card → verify contact modal opens |
| Build-test 4-step flow | DASH-06 | Multi-step UX flow | Complete all 4 steps → verify "Test Ready" with copy-link + send CTAs |
| Email omitted in list response | DATA-06 | API response inspection | `curl http://localhost:3000/api/candidates` — verify no `email` key in list items |
| Email present in detail response | DATA-07 | API response inspection | `curl http://localhost:3000/api/candidates/{id}` — verify `email` present |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
