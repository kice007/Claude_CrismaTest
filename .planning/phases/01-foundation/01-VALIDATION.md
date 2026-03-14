---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured — CLAUDE.md explicitly states "No test runner is configured yet" |
| **Config file** | none — Wave 0 adds type-check script |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint && npm run build`
- **After every plan wave:** Run `npm run build` (zero TypeScript errors, zero ESLint errors)
- **Before `/gsd:verify-work`:** Full build green + manual /dev/design-system walkthrough
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | DSYS-01 | manual | Visual inspection on /dev/design-system | ❌ Wave 0 | ⬜ pending |
| 1-01-02 | 01 | 1 | DSYS-02 | manual | Visual inspection on /dev/design-system | ❌ Wave 0 | ⬜ pending |
| 1-01-03 | 01 | 1 | DSYS-03 | manual | Chrome DevTools Network + Computed Styles | ❌ Wave 0 | ⬜ pending |
| 1-02-01 | 02 | 2 | I18N-01 | manual | /dev/design-system language toggle | ❌ Wave 0 | ⬜ pending |
| 1-02-02 | 02 | 2 | I18N-02 | lint/grep | `grep -r "[A-Z]" src/components src/app --include="*.tsx"` | ❌ Wave 0 | ⬜ pending |
| 1-02-03 | 02 | 2 | I18N-03 | manual | Browser resize on /dev/design-system | ❌ Wave 0 | ⬜ pending |
| 1-02-04 | 02 | 2 | I18N-04 | manual | Switch to FR, refresh, verify FR is active | ❌ Wave 0 | ⬜ pending |
| 1-02-05 | 02 | 2 | I18N-05 | manual | /dev/design-system plural demo | ❌ Wave 0 | ⬜ pending |
| 1-02-06 | 02 | 2 | I18N-06 | manual/script | `document.documentElement.lang` in DevTools console | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Add `"type-check": "tsc --noEmit"` script to package.json for faster type validation
- [ ] `/dev/design-system` page must exist as the primary visual validation artifact for all 9 requirements
- [ ] `npm run build` + `npm run lint` serve as the automated gate (no unit test runner in scope)

*All Phase 1 requirements are infrastructure/visual — automated unit tests would require a test runner not yet in scope. Build validation + the /dev/design-system page cover all success criteria.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Brand color tokens render correct hex values | DSYS-01 | No test runner; CSS utility output is visual | Open /dev/design-system, verify color swatches match brand hex values |
| Shadcn components use brand CSS variables | DSYS-02 | Visual rendering check | Open /dev/design-system, verify Shadcn Button/Badge use brand colors not defaults |
| Inter + JetBrains Mono load with swap | DSYS-03 | Font loading is browser-verified | Chrome DevTools Network tab — verify font files loaded; Computed Styles — verify font-family |
| EN/FR language files load | I18N-01 | Runtime behavior | Open /dev/design-system, toggle EN↔FR, verify all strings switch |
| Language switcher renders at breakpoints | I18N-03 | Visual/responsive | Resize browser: desktop shows EN\|FR pills, mobile shows globe dropdown |
| Language persists across refresh | I18N-04 | Browser behavior | Switch to FR, hard refresh (Ctrl+Shift+R), verify FR still active |
| Plural keys work EN and FR | I18N-05 | Runtime behavior | /dev/design-system plural demo section |
| html[lang] updates on switch | I18N-06 | DOM mutation | Switch to FR, run `document.documentElement.lang` in console — expect "fr" |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
