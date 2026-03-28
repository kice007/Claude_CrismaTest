---
phase: 05-company-dashboard-api
plan: 03
subsystem: api
tags: [api, supabase, tests, crud, zod]
dependency_graph:
  requires: [05-01]
  provides: [GET /api/tests, POST /api/tests, GET /api/tests/[id], PUT /api/tests/[id], DELETE /api/tests/[id]]
  affects: [DASH-06, DASH-07, DASH-08]
tech_stack:
  added: []
  patterns: [Next.js App Router route handlers, zod validation, soft-delete via status field, Supabase select with join]
key_files:
  created:
    - src/app/api/tests/route.ts
    - src/app/api/tests/[id]/route.ts
  modified: []
decisions:
  - "PGRST116 error code used to detect not-found from Supabase .single() — avoids a second existence check on GET"
  - "PUT handler builds updatePayload dynamically to only send provided fields — prevents overwriting existing values with undefined"
  - "DELETE verifies row existence first, then soft-deletes — clean 404 before attempting update"
metrics:
  duration: 4min
  completed_date: "2026-03-28T16:14:26Z"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 5 Plan 03: Tests CRUD API Summary

**One-liner:** Full 5-handler tests CRUD with zod validation, soft-delete pattern, and Supabase join for questions.

## What Was Built

Two Next.js App Router route handler files providing 5 HTTP method handlers for the test templates resource:

**`src/app/api/tests/route.ts`**
- `GET /api/tests` — returns all test template summaries ordered by `created_at` descending; supports `?status=` filter and `?search=` ilike on name/role
- `POST /api/tests` — creates new test template; zod validates role (required), name (required), modules (min 1 item), customQuestions (optional, max 3); generates `shareable_link` via `crypto.randomUUID()`; returns 201 with inserted row

**`src/app/api/tests/[id]/route.ts`**
- `GET /api/tests/[id]` — fetches test template with nested questions via `select('*, questions(*)')` and `.single()`; returns 404 for PGRST116 code
- `PUT /api/tests/[id]` — updates name/modules/customQuestions; zod `.refine()` requires at least one field; builds dynamic update payload to avoid overwriting unspecified fields (DATA-05b)
- `DELETE /api/tests/[id]` — verifies row existence, then soft-deletes by setting `status = 'archived'`; returns 204 No Content (DATA-05c)

All handlers use: `createServerSupabaseClient()`, try/catch wrapping, `console.error('[tests/...]', error.message)`, and `{ error: string }` responses only.

## Requirements Fulfilled

- DATA-04: GET /api/tests + GET /api/tests/[id] implemented
- DATA-05: POST /api/tests implemented with zod validation
- DATA-05b: PUT /api/tests/[id] implemented
- DATA-05c: DELETE /api/tests/[id] soft-delete implemented

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check

- [x] `src/app/api/tests/route.ts` exists
- [x] `src/app/api/tests/[id]/route.ts` exists
- [x] Task 1 commit: `50cb4d0`
- [x] Task 2 commit: `a53ba11`
- [x] Build passes with both routes registered (`/api/tests` and `/api/tests/[id]` shown in route manifest)

## Self-Check: PASSED
