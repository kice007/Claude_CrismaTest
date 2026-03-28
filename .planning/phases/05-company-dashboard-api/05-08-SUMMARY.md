---
phase: 05-company-dashboard-api
plan: "08"
subsystem: dashboard
tags: [wizard, multi-step, build-test, modal, dialog, drawer]
dependency_graph:
  requires: [05-03, 05-04]
  provides: [DASH-06]
  affects: [/dashboard/build-test, /dashboard/tests/[id]]
tech_stack:
  added: []
  patterns: [Dialog/Drawer responsive modal, Base UI Select, useState step machine]
key_files:
  created:
    - src/components/dashboard/BuildTestWizard.tsx
    - src/app/(dashboard)/dashboard/build-test/page.tsx
  modified: []
decisions:
  - "Success modal uses Base UI Dialog open={step === 'success'} with empty onOpenChange — prevents ESC dismiss without conditional hooks"
  - "Preview step added as a read-only summary between generate and success, with 100% progress bar indicator"
  - "Add Question modal uses isMobile = useMediaQuery('(max-width: 768px)') for Dialog/Drawer branch (same pattern as InviteModal)"
  - "onValueChange typed as (val: string | null) for Base UI Select — null-guard applied with fallback to default value"
metrics:
  duration: "~2 min"
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_changed: 2
---

# Phase 05 Plan 08: Build-Test Wizard Summary

Build-test 4-step wizard (DASH-06) with role selection, module toggles, custom questions (Dialog/Drawer modal), generate step calling POST /api/tests, preview step, and non-dismissible success modal with Copy Link, Send to Candidates, and View Test navigation.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | BuildTestWizard component (4 steps + success modal) | cd7edd3 | src/components/dashboard/BuildTestWizard.tsx |
| 2 | Build-test page | e67ac35 | src/app/(dashboard)/dashboard/build-test/page.tsx |

## What Was Built

**BuildTestWizard.tsx** — Single-file comprehensive wizard:
- Step 1 (Role): 8-role grid; selected role gets brand-primary border; Next enabled when selection made
- Step 2 (Modules): 8-module checkbox grid (Base UI Checkbox); min 1 required; Back preserves role
- Step 3 (Custom Questions): up to 3 optional custom questions; Add Question opens Dialog (desktop) / Drawer (mobile); delete buttons on each entry
- Step 4 (Generate): summary card with role, module badges, question count; POST /api/tests with spinner state; error handled via toast.error
- Preview: read-only test summary (estimated questions, modules, custom questions); full progress bar; "Looks Good — Continue" advances to success
- Success modal: non-dismissible Base UI Dialog (`open={step === 'success'}`, empty `onOpenChange`); Copy Test Link (clipboard + toast), Send to Candidates (mailto), View Test (resets wizard + router.push)

**build-test/page.tsx** — Minimal page mounting BuildTestWizard in max-w-3xl container.

## Decisions Made

1. **Success modal non-dismissible** — Base UI Dialog `onOpenChange={() => {}}` (empty handler) prevents ESC/backdrop close; user must click a CTA button.
2. **Preview step placement** — After generate (POST /api/tests) succeeds, user sees a read-only preview before the success modal; aligns with "looks good" UX flow.
3. **isMobile breakpoint** — Used `(max-width: 768px)` consistent with existing InviteModal pattern.
4. **Base UI Select null-guard** — `onValueChange={(val: string | null) => setType(val ?? 'Multiple Choice')}` follows existing dashboard page pattern documented in STATE.md decisions.

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npm run build` passes — `/dashboard/build-test` shows as static route in output
- All 4 steps compile correctly
- Add Question modal branches on useMediaQuery
- POST /api/tests called in generate step with spinner
- Success modal: Copy Link, Send to Candidates, View Test all wired
- View Test resets wizard state then calls router.push('/dashboard/tests/' + newTestId)

## Self-Check

Files exist:
- FOUND: src/components/dashboard/BuildTestWizard.tsx
- FOUND: src/app/(dashboard)/dashboard/build-test/page.tsx

Commits exist:
- FOUND: cd7edd3 — feat(05-08): implement BuildTestWizard 4-step component
- FOUND: e67ac35 — feat(05-08): add /dashboard/build-test page

## Self-Check: PASSED
