---
phase: 05-company-dashboard-api
plan: "07"
subsystem: dashboard-tests
tags: [dashboard, tests, CRUD, list-view, detail-page, edit, delete, share]
dependency_graph:
  requires: [05-03, 05-04]
  provides: [DASH-07, DASH-08]
  affects: [dashboard-navigation, build-test-wizard-destination]
tech_stack:
  added: []
  patterns:
    - Tests list table with loading skeleton and empty state
    - Delete confirm dialog pattern (Dialog with cancel/confirm)
    - Test detail page with inline edit mode toggle
    - Share modal using Dialog/Drawer switchover via useMediaQuery
    - Tabs for Details vs Questions views (Base UI tabs)
    - mailto: send to candidates pattern
key_files:
  created:
    - src/app/(dashboard)/dashboard/tests/page.tsx
    - src/components/dashboard/TestListTable.tsx
    - src/app/(dashboard)/dashboard/tests/[id]/page.tsx
  modified: []
decisions:
  - "Edit mode uses inline toggle (editMode boolean) within the detail page — no separate /edit route needed; cleaner UX for small forms"
  - "Share modal reuses isDesktop/useMediaQuery pattern from InviteModal — Dialog on desktop, Drawer on mobile"
  - "ALL_MODULES constant defined in detail page for module checkboxes — avoids API call for static list"
  - "Tabs value prop: Base UI Tabs uses Tab/Panel primitives with value attribute on TabsContent"
  - "questionsToShow sliced to first 5 with expand toggle — avoids overwhelming the detail view on initial load"
metrics:
  duration: 4min
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_created: 3
  files_modified: 0
---

# Phase 05 Plan 07: Tests List + Detail/Edit/Delete Summary

**One-liner:** Tests list table (DASH-07) and full CRUD detail page (DASH-08) — view, inline edit, delete with confirm, share via modal/drawer.

## What Was Built

### Task 1: Tests list page + TestListTable component

Created `src/components/dashboard/TestListTable.tsx`:
- Props: `{ tests, onView, onEdit, onDelete, loading? }`
- Columns: Test Name, Role (Badge blue), Modules count, Created date, Status Badge (green/amber/slate), Responses, Actions
- Loading state: 5 Skeleton shimmer rows
- Actions column: Eye (view), Pencil (edit), Trash (delete) icon buttons with stopPropagation
- Row click calls `onView(id)`

Created `src/app/(dashboard)/dashboard/tests/page.tsx`:
- Fetches from `/api/tests?search=...` with 300ms debounce
- Header: "Tests" title + "Build New Test" CTA button
- Search bar input
- Empty state via `EmptyState` component with Build New Test CTA href
- Delete confirm dialog: shadcn Dialog with Cancel + Delete Test buttons
- `DELETE /api/tests/[id]` removes from local state on success
- Error: `toast.error(dashboard.errors.loadFailed)`

### Task 2: Test detail + edit + share page

Created `src/app/(dashboard)/dashboard/tests/[id]/page.tsx`:
- Fetches from `/api/tests/${id}` on mount; handles 404 with friendly error state
- View mode: h1 name + role badge + status badge + created date
- Shareable link: read-only Input + Copy Link button (clipboard API + toast) + Share button
- Candidate responses count + "View in Dashboard" link
- Action buttons: Edit Test, Delete Test (opens modal), Send to Candidates (opens mailto)
- Tabs (Base UI): Details tab (modules chips + custom questions list) and Questions tab (paginated, max 5 + expand)
- Edit mode: name Input, module checkboxes (ALL_MODULES), custom questions add/edit/remove
- Save: `PUT /api/tests/[id]` + save success Dialog + local state update + `editMode=false`
- Cancel: resets editData from current test state
- Share modal: Dialog (desktop) / Drawer (mobile) via useMediaQuery
- Delete flow: confirm Dialog -> `DELETE /api/tests/[id]` -> redirect to `/dashboard/tests`
- Send to Candidates: opens prefilled `mailto:` in new tab

## Verification

- `npm run build` passes — both routes listed: `/dashboard/tests` and `/dashboard/tests/[id]`
- All API patterns consistent with established dashboard conventions

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/app/(dashboard)/dashboard/tests/page.tsx` — FOUND
- `src/components/dashboard/TestListTable.tsx` — FOUND
- `src/app/(dashboard)/dashboard/tests/[id]/page.tsx` — FOUND
- Commit `c68e123` (Task 1) — FOUND
- Commit `c847aa2` (Task 2) — FOUND
