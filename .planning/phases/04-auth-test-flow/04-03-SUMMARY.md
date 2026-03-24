---
plan: 04-03
phase: 04-auth-test-flow
status: complete
completed: 2026-03-24
---

## Summary

Built the first two test-flow pages using the split-panel layout (dark navy left, white card right).

## Tasks

| Task | Status | Commit |
|------|--------|--------|
| Task 1: /test/[id]/intro split-panel page | ✓ | 7c768d8 |
| Task 2: /test/[id]/user-info candidate info form | ✓ | 450a076 |

## Key Files Created

- `src/app/(test)/test/[id]/intro/page.tsx` — Split-panel intro: role badge, duration, 4 modules list, webcam disclaimer chip, "Start Test →" CTA linking to user-info
- `src/app/(test)/test/[id]/user-info/page.tsx` — 5-field form (fullName, email, phone, jobTitle, company) with zod validation, stores to `sessionStorage.crismatest_candidate_info`, navigates to /check

## Decisions

- Used `useParams<{ id: string }>()` (client component) for route param access
- `standardSchemaResolver` import from `@hookform/resolvers/standard-schema` (consistent with 04-01 fix)
- MOCK_TEST always used regardless of id param — Phase 5 will wire real API
- All strings via i18n t() — keys already in locales/en.json + fr.json from 04-00
