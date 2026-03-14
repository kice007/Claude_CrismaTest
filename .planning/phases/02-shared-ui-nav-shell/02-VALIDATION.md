---
phase: 2
slug: shared-ui-nav-shell
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None configured — CLAUDE.md states "No test runner is configured yet" |
| **Config file** | none |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full build must be green + manual `/dev/design-system` walkthrough for all Phase 2 components
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | UI-01–UI-07, LAND-06–LAND-08 | automated | `npm run build` (post shadcn init) | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 1 | UI-01 | manual | `npm run build` + visual inspect `/dev/design-system` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 1 | UI-02 | manual | `npm run build` + visual inspect `/dev/design-system` | ❌ W0 | ⬜ pending |
| 2-02-03 | 02 | 1 | UI-05 | manual | Navigate to `/does-not-exist` | ❌ W0 | ⬜ pending |
| 2-03-01 | 03 | 2 | UI-03 | manual | `/dev/design-system` toast triggers + 4s auto-dismiss | ❌ W0 | ⬜ pending |
| 2-03-02 | 03 | 2 | UI-04 | manual | `/dev/design-system` modal triggers at <768px | ❌ W0 | ⬜ pending |
| 2-04-01 | 04 | 3 | LAND-06 | manual | Browser scroll on any page | ❌ W0 | ⬜ pending |
| 2-04-02 | 04 | 3 | LAND-07 | manual | Mobile viewport (320px) hamburger sheet | ❌ W0 | ⬜ pending |
| 2-04-03 | 04 | 3 | LAND-08 | manual | DevTools device emulation at 320px | ❌ W0 | ⬜ pending |
| 2-04-04 | 04 | 3 | UI-06 | manual | OS reduced-motion toggle + computed styles inspect | ❌ W0 | ⬜ pending |
| 2-04-05 | 04 | 3 | UI-07 | manual | DevTools element inspector for 48px targets | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npx shadcn@latest init` — must run before any component can be added (no `components.json` exists)
- [ ] `npx shadcn@latest add dialog drawer sheet sonner` — install all required primitives
- [ ] Verify `@import "tw-animate-css"` added to `src/app/globals.css` by shadcn init
- [ ] Verify brand token `:root` block preserved (not overwritten by shadcn's generated variables)
- [ ] `/dev/design-system` page updated with Phase 2 component demo section

*All other plans depend on Wave 0 completing successfully.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Skeleton shimmer animates, stops with reduced-motion | UI-01, UI-06 | No visual test runner | `/dev/design-system` → toggle OS reduced-motion → inspect `.shimmer` computed animation |
| EmptyState renders SVG + text + CTA | UI-02 | Visual regression only | `/dev/design-system` → EmptyState demo |
| Toast slides in, stacks max 3, auto-dismisses at 4s | UI-03 | Animation + timing | `/dev/design-system` → trigger 4 toasts rapidly; 4th should auto-dismiss oldest |
| Modal focus-trapped, ESC closes, backdrop click closes | UI-04 | Interaction/focus | Open modal → Tab key → verify focus stays trapped; press ESC; click backdrop |
| Bottom sheet on mobile | UI-04 | Viewport-dependent | DevTools → 375px → open modal → verify Drawer not Dialog renders |
| 404 page — no stack trace | UI-05 | Visual check | Navigate to `/does-not-exist` → verify EmptyState, no error details shown |
| 500 page — no stack trace | UI-05 | Visual check | Trigger error boundary → verify EmptyState shown |
| Nav shadow + glassmorphism on scroll | LAND-06 | Visual/animation | Scroll any page → verify `shadow-card` + `backdrop-blur-md` applied |
| Hamburger → sheet with 48px tap targets | LAND-07 | Interaction | DevTools 320px → tap hamburger → verify sheet opens → measure link tap targets |
| No horizontal overflow at 320px | LAND-08 | Visual | DevTools 320px → each page → no horizontal scrollbar |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
