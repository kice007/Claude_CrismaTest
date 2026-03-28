# Phase 5: Company Dashboard + API - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

A logged-in company user can browse, search, compare, and inspect candidates across all 8 dashboard views (DASH-01 through DASH-08), with all data served from live Supabase API routes. The phase includes the full dashboard route group, sidebar shell, all 6+ API route handlers, and the mobile bottom tab bar collapse behavior.

Note: The ROADMAP says "six views" but REQUIREMENTS.md assigns DASH-07 (Tests list) and DASH-08 (Test detail/edit) to Phase 5 — all 8 views are in scope.

</domain>

<decisions>
## Implementation Decisions

### Scope — Dashboard views
- All 8 DASH requirements in scope: DASH-01 (candidates table), DASH-02 (mobile), DASH-03 (candidate detail), DASH-04 (compare), DASH-05 (talent pool), DASH-06 (build test), DASH-07 (tests list), DASH-08 (test detail + edit)
- **Design authority: `design/dashboard.pen` is the sole authoritative visual spec for all dashboard views, flows, and layouts — implement to match every frame exactly**

### Sidebar + nav structure
- 4 primary nav items + bottom user section: **Dashboard** (→ /dashboard), **Candidates** (→ /dashboard), **Tests** (→ /dashboard/tests), **Talent Pool** (→ /dashboard/talent-pool)
- User profile lives at the bottom of the sidebar (avatar + plan badge) — not a primary nav item, but one of the 5 mobile tab bar icons
- **Build Test is NOT a sidebar nav item** — accessible only via "Build New Test" CTA within the Tests section (/dashboard/tests)
- Mobile bottom tab bar: 5 icons (Dashboard, Candidates, Tests, Talent Pool, Profile) — 56px height, brand-navy background
- /dashboard (Dashboard nav item) → candidate list table directly — no separate overview/stats page

### API routes — architecture
- All routes as Next.js route handlers under `src/app/api/` — consistent with existing /api/contact pattern
- Full list: GET /api/candidates, GET /api/candidates/[id], GET /api/tests, GET /api/tests/[id], PUT /api/tests/[id], DELETE /api/tests/[id], GET /api/talent-pool
- Data source: Supabase directly — assume Phase 3 seeding is complete; if tables are empty, re-run the seed script as part of Phase 5 setup
- No TypeScript fallback — routes either return Supabase data or a clean error

### API routes — data privacy
- GET /api/candidates **must NOT return email** — enforced via Supabase column select (omit email from the SELECT query, not stripped in-handler)
- GET /api/candidates/[id] returns full candidate including email (clickable mailto on detail page)

### API routes — error responses
- All error responses: `{ error: string }` minimal JSON — e.g. `{ error: 'Not found' }`, `{ error: 'Internal server error' }`
- No stack traces, no field-level details, no internal paths in any error response

### Compare view
- State passed via query params: `/dashboard/compare?ids=a,b,c` — shareable URL, survives refresh
- Compare renders as a **separate route** `/dashboard/compare` (not an overlay panel) — back → /dashboard preserves selection
- "Recommended for Interview" badge: awarded to the top-scoring candidate(s) — if two candidates tie on CrismaScore, **both get the badge**
- "Export Report": downloads a **static pre-made branded PDF** from /public — no dynamic PDF generation, all clicks download the same file

### Build-test wizard
- Step state: **useState in parent component** at /dashboard/build-test — all 4 steps render within a single page component; refer to `design/dashboard.pen` for exact step layouts and transitions
- Back navigation between steps supported, preserving filled-in data
- Custom question modal: **Dialog (desktop) / Drawer (mobile)** — consistent with established Phase 2 modal pattern
- After wizard completes: success modal → redirect to `/dashboard/tests/[newId]` — newId generated client-side (e.g. crypto.randomUUID() or timestamp-based mock ID)
- "Copy Link" CTA: copies a fake test URL to clipboard + toast confirmation
- "Send to Candidates" CTA: opens email modal with prefilled subject + body

### Claude's Discretion
- Exact Supabase query structure (joins, ordering, pagination) for each API route
- Dashboard layout group structure (`(dashboard)/layout.tsx` with DashboardShell component)
- Exact sidebar animation on collapse/expand
- Mobile card stack layout details for the candidate table
- Loading skeleton compositions per dashboard view

</decisions>

<specifics>
## Specific Ideas

- `design/dashboard.pen` is the ground truth for all visual decisions — every frame in that file should be implemented. When in doubt about layout, spacing, component composition, or interaction flow, read the Pencil design first.
- The compare view badge logic: top scorer = highest CrismaScore; ties = both get "Recommended for Interview"
- Static PDF export: one branded PDF lives in /public/crima-compare-report.pdf — all export CTAs download it
- Build test mock ID: use crypto.randomUUID() or Date.now() to generate a fake test ID client-side on completion

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/modals/InviteModal.tsx`, `CalendarModal.tsx`, `ExportModal.tsx`, `ContactModal.tsx`: all 4 modals built in Phase 2 — reuse directly in dashboard (invite candidate, calendar for interview, export, contact talent pool candidate)
- `src/components/Skeleton.tsx`: shimmer primitive — compose per-view skeleton layouts for candidate table, talent pool grid, test list
- `src/components/EmptyState.tsx`: use for empty candidate table, empty tests list, empty talent pool
- `src/lib/supabase.ts`: Supabase client (client + server variants) already set up — API routes use the server variant
- `src/lib/motion.ts`: `fadeIn`, `slideUp`, `staggerChildren` — use for dashboard view transitions, score gauge animations
- `src/lib/auth.ts` + `src/lib/auth-context.tsx`: auth helpers from Phase 4 — dashboard routes require isLoggedIn check (redirect to /login if not authenticated)
- `src/lib/rate-limiter.ts`: existing rate limiter — available for API routes if needed

### Established Patterns
- All strings via `useTranslation()` — every dashboard label, table header, button, empty state, and error message goes in /locales/en.json and /locales/fr.json first
- Framer Motion variants from `src/lib/motion.ts` — all animations import from here
- Modal pattern: Dialog (desktop) / Drawer (mobile) via `src/lib/use-media-query.ts` — all dashboard modals follow this pattern
- Error responses: `{ error: string }` — established in this phase, consistent with SEC-05
- Protected routes: redirect to /login if not authenticated — Phase 4 pattern applies to all /dashboard/* routes

### Integration Points
- New route group: `src/app/(dashboard)/` with a shared `layout.tsx` housing the DashboardShell (sidebar + bottom tab bar)
- API routes added under `src/app/api/`: candidates/, candidates/[id]/, tests/, tests/[id]/, talent-pool/
- `src/lib/supabase.ts` server client used in all new API routes
- `/locales/en.json` and `/locales/fr.json` extended with all dashboard copy keys
- `design/dashboard.pen` read via Pencil MCP before implementing each dashboard view

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-company-dashboard-api*
*Context gathered: 2026-03-28*
