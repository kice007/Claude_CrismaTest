# Phase 5: Company Dashboard + API - Research

**Researched:** 2026-03-28
**Domain:** Next.js App Router dashboard, Supabase API routes, multi-view data-driven UI
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Scope — Dashboard views**
- All 8 DASH requirements in scope: DASH-01 (candidates table), DASH-02 (mobile), DASH-03 (candidate detail), DASH-04 (compare), DASH-05 (talent pool), DASH-06 (build test), DASH-07 (tests list), DASH-08 (test detail + edit)
- Design authority: `design/dashboard.pen` is the sole authoritative visual spec for all dashboard views, flows, and layouts — implement to match every frame exactly

**Sidebar + nav structure**
- 4 primary nav items + bottom user section: Dashboard (→ /dashboard), Candidates (→ /dashboard), Tests (→ /dashboard/tests), Talent Pool (→ /dashboard/talent-pool)
- User profile lives at the bottom of the sidebar (avatar + plan badge) — not a primary nav item, but one of the 5 mobile tab bar icons
- Build Test is NOT a sidebar nav item — accessible only via "Build New Test" CTA within the Tests section (/dashboard/tests)
- Mobile bottom tab bar: 5 icons (Dashboard, Candidates, Tests, Talent Pool, Profile) — 56px height, brand-navy background
- /dashboard (Dashboard nav item) → candidate list table directly — no separate overview/stats page

**API routes — architecture**
- All routes as Next.js route handlers under `src/app/api/` — consistent with existing /api/contact pattern
- Full list: GET /api/candidates, GET /api/candidates/[id], GET /api/tests, GET /api/tests/[id], PUT /api/tests/[id], DELETE /api/tests/[id], GET /api/talent-pool
- Data source: Supabase directly — assume Phase 3 seeding is complete; if tables are empty, re-run the seed script as part of Phase 5 setup
- No TypeScript fallback — routes either return Supabase data or a clean error

**API routes — data privacy**
- GET /api/candidates must NOT return email — enforced via Supabase column select (omit email from the SELECT query, not stripped in-handler)
- GET /api/candidates/[id] returns full candidate including email (clickable mailto on detail page)

**API routes — error responses**
- All error responses: `{ error: string }` minimal JSON — e.g. `{ error: 'Not found' }`, `{ error: 'Internal server error' }`
- No stack traces, no field-level details, no internal paths in any error response

**Compare view**
- State passed via query params: `/dashboard/compare?ids=a,b,c` — shareable URL, survives refresh
- Compare renders as a separate route `/dashboard/compare` (not an overlay panel) — back → /dashboard preserves selection
- "Recommended for Interview" badge: awarded to the top-scoring candidate(s) — if two candidates tie on CrismaScore, both get the badge
- "Export Report": downloads a static pre-made branded PDF from /public — no dynamic PDF generation, all clicks download the same file

**Build-test wizard**
- Step state: useState in parent component at /dashboard/build-test — all 4 steps render within a single page component
- Back navigation between steps supported, preserving filled-in data
- Custom question modal: Dialog (desktop) / Drawer (mobile) — consistent with established Phase 2 modal pattern
- After wizard completes: success modal → redirect to `/dashboard/tests/[newId]` — newId generated client-side (e.g. crypto.randomUUID() or timestamp-based mock ID)
- "Copy Link" CTA: copies a fake test URL to clipboard + toast confirmation
- "Send to Candidates" CTA: opens email modal with prefilled subject + body

### Claude's Discretion
- Exact Supabase query structure (joins, ordering, pagination) for each API route
- Dashboard layout group structure (`(dashboard)/layout.tsx` with DashboardShell component)
- Exact sidebar animation on collapse/expand
- Mobile card stack layout details for the candidate table
- Loading skeleton compositions per dashboard view

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DASH-01 | `/dashboard` candidate table with search, filters, skeleton loading | API route GET /api/candidates, Supabase column select, `(dashboard)` route group layout pattern |
| DASH-02 | Mobile: sidebar → bottom tab bar (5 icons, 56px); table → scrollable card stack; filters → bottom sheet | useMediaQuery hook (already built), CSS responsive utilities, fixed bottom nav pattern |
| DASH-03 | `/dashboard/candidates/[id]` detail page — score gauge, sub-scores, fraud flags, AI insight, invite/email actions | GET /api/candidates/[id], existing modals (InviteModal, CalendarModal), mailto link pattern |
| DASH-04 | Compare view `/dashboard/compare?ids=a,b,c` — 3-column layout, badge logic, PDF export | Query param state passing, client-side data join from /api/candidates/[id], static PDF in /public |
| DASH-05 | `/dashboard/talent-pool` — filterable card grid, contact modal on click | GET /api/talent-pool, existing ContactModal, card grid responsive layout |
| DASH-06 | `/dashboard/build-test` — 4-step wizard, custom question modal, success redirect | useState step machine, POST /api/tests (mock/Supabase), crypto.randomUUID() for newId |
| DASH-07 | `/dashboard/tests` — test list table, skeleton, empty state, Build New Test CTA | GET /api/tests, existing EmptyState + Skeleton components |
| DASH-08 | `/dashboard/tests/[id]` — detail + edit mode + delete confirm + share modal | GET/PUT/DELETE /api/tests/[id], ExportModal reuse for share, confirm pattern |
| DATA-04 | GET /api/tests — all test templates | Supabase `test_templates` table query |
| DATA-05 | GET /api/tests/[id] — full test detail | Supabase `test_templates` + `questions` join |
| DATA-06 | GET /api/candidates — list, no email | Supabase `mock_candidates` SELECT (omit email column) |
| DATA-07 | GET /api/candidates/[id] — full detail including email | Supabase `mock_candidates` SELECT * by id |
| DATA-08 | GET /api/talent-pool — filterable entries | Supabase `mock_candidates` SELECT with status filter or dedicated query |
| DATA-09 | POST /api/contact — (already exists as /api/contact, verify it matches DATA-09 spec) | Existing `src/app/api/contact/route.ts` — completed in Phase 3 |
</phase_requirements>

---

## Summary

Phase 5 is the largest phase in the project — 8 dashboard views plus 7 new API routes. All core dependencies (Supabase client, auth context, modal components, skeleton/empty-state primitives, animation variants, i18n, dnd-kit) are already installed and working from previous phases. The implementation pattern is clear and consistent: the existing `/api/contact` route is the template for all new API routes; the existing Dialog/Drawer modal pattern is the template for all new modals; the existing `useAuth` redirect guard is the template for all dashboard protected routes.

The primary new architectural element is the `(dashboard)` route group with a shared `DashboardShell` layout that houses the brand-navy sidebar (desktop) and bottom tab bar (mobile). This shell must suppress the global `NavShell` rendered in `layout.tsx` — the dashboard has its own chrome. Every dashboard page must check auth and redirect to `/login` if not authenticated, following the Phase 4 pattern.

The Supabase schema from Phase 3 (`mock_candidates`, `test_templates`, `questions`) is fully in place and seeded. API routes query these tables directly using `createServerSupabaseClient()`. The `mock_candidates` table has all fields needed for the dashboard: `crima_score`, `trust_score`, `logic_score`, `comms_score`, `job_skill_score`, `fraud_flag_severity`, `status`, `role`, `test_date`, `email`. The talent pool view is served from the same `mock_candidates` table — no separate table exists.

**Primary recommendation:** Build the phase in layers — API routes first (verifiable independently), then DashboardShell, then views in dependency order: candidates list → detail → compare → talent pool → tests list → test detail → build-test wizard.

---

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.1.6 | Route handlers + page routes | Project standard — all routes are App Router |
| `@supabase/ssr` | ^0.9.0 | Server-side Supabase client | Already set up in `src/lib/supabase.ts` |
| `motion` (motion/react) | ^12.36.0 | Animations (fadeUp, staggerContainer, etc.) | Project standard via `src/lib/animations.ts` |
| `lucide-react` | ^0.577.0 | Icons (sidebar nav, table actions, badges) | Already installed, used throughout |
| `react-i18next` | ^16.5.8 | All UI strings | I18N-02 mandates zero hardcoded strings |
| `@dnd-kit/core` + `@dnd-kit/sortable` | ^6.3.1 / ^10.0.0 | Drag-and-drop (build-test module ordering, questions) | Already installed for test flow drag-drop |
| `sonner` | ^2.0.7 | Toast notifications (copy link, success states) | Already installed, Toaster in layout.tsx |
| `zod` | ^4.3.6 | Input validation in API routes | Already used in /api/contact |

### Supporting (Already Installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vaul` | ^1.1.2 | Drawer (mobile modal bottom sheet) | All Dialog→Drawer mobile switchovers |
| `@base-ui/react` | ^1.3.0 | Sheet component (mobile nav patterns) | NOT needed for modals — vaul + shadcn covers it |
| `react-hook-form` | ^7.72.0 | Forms (build-test step 1, send-to-candidates email modal) | Any dashboard form with validation |
| `@hookform/resolvers` | ^5.2.2 | standardSchemaResolver for zod v4 | Must use `@hookform/resolvers/standard-schema` sub-path |

### Needs Installation

| Library | Purpose | Why Needed |
|---------|---------|-----------|
| `npx shadcn@latest add table` | shadcn Table component | DASH-01 candidate table, DASH-07 tests table |
| `npx shadcn@latest add badge` | shadcn Badge component | Score chips, status badges, role badges |
| `npx shadcn@latest add select` | shadcn Select component | Filter dropdowns in candidate table |
| `npx shadcn@latest add input` | shadcn Input component | Search fields, form inputs in wizard |
| `npx shadcn@latest add checkbox` | shadcn Checkbox component | Row selection for compare, wizard toggles |
| `npx shadcn@latest add tabs` | shadcn Tabs component | Test detail (DASH-08) tabbed content |
| `npx shadcn@latest add separator` | shadcn Separator | Visual dividers in sidebar, compare view |

**Note:** shadcn init uses Nova preset (established in Phase 2 decision). Brand HSL tokens must survive any shadcn add operation — verify `:root` vars after each `npx shadcn@latest add`.

**Installation:**
```bash
npx shadcn@latest add table badge select input checkbox tabs separator
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/app/
├── (dashboard)/                    # Route group — DashboardShell wraps all views
│   ├── layout.tsx                  # DashboardShell (sidebar + bottom tab bar, auth guard)
│   ├── dashboard/                  # /dashboard — candidates table
│   │   └── page.tsx
│   ├── dashboard/candidates/
│   │   └── [id]/
│   │       └── page.tsx            # /dashboard/candidates/[id] — detail
│   ├── dashboard/compare/
│   │   └── page.tsx                # /dashboard/compare?ids=a,b,c
│   ├── dashboard/talent-pool/
│   │   └── page.tsx
│   ├── dashboard/tests/
│   │   ├── page.tsx                # tests list
│   │   └── [id]/
│   │       └── page.tsx            # test detail + edit
│   └── dashboard/build-test/
│       └── page.tsx                # 4-step wizard (single page, step state via useState)
src/app/api/
├── candidates/
│   ├── route.ts                    # GET /api/candidates
│   └── [id]/
│       └── route.ts                # GET /api/candidates/[id]
├── tests/
│   ├── route.ts                    # GET /api/tests, POST /api/tests
│   └── [id]/
│       └── route.ts                # GET, PUT, DELETE /api/tests/[id]
└── talent-pool/
    └── route.ts                    # GET /api/talent-pool
src/components/dashboard/
├── DashboardShell.tsx              # Sidebar + bottom tab bar layout shell
├── Sidebar.tsx                     # Desktop sidebar with nav items + user section
├── BottomTabBar.tsx                # Mobile 5-icon tab bar (56px, brand-navy)
├── CandidateTable.tsx              # DASH-01 data table component
├── CandidateCard.tsx               # DASH-02 mobile card stack item
├── ScoreGauge.tsx                  # Animated circular CrismaScore gauge
├── SubScoreBars.tsx                # 5 sub-score horizontal bars
├── FraudFlagsPanel.tsx             # Severity badges + flag list
├── AIInsightCard.tsx               # 3-bullet interview recommendation
├── CompareColumn.tsx               # Single candidate column in compare view
├── TalentPoolCard.tsx              # DASH-05 candidate card for pool grid
├── BuildTestWizard.tsx             # DASH-06 4-step wizard parent
├── TestListTable.tsx               # DASH-07 tests table
└── FilterSheet.tsx                 # Mobile bottom sheet for filters
```

### Pattern 1: DashboardShell Route Group Layout

The `(dashboard)` route group layout suppresses the global `NavShell` by not including it. The global `layout.tsx` always renders `NavShell` — the dashboard group must override this at the page level by rendering a full-height layout that visually replaces the global nav.

**What:** The `(dashboard)/layout.tsx` wraps all dashboard pages with the sidebar + main content area. The sidebar contains 4 nav items + user profile at the bottom. Auth guard lives here — redirect to /login if not authenticated.

**When to use:** All `/dashboard/*` routes share this layout.

**Example:**
```tsx
// src/app/(dashboard)/layout.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return <DashboardShell>{children}</DashboardShell>
}
```

**Critical issue:** The global `layout.tsx` renders `NavShell` for all routes. The dashboard has its own full-page chrome. Use CSS to hide the global nav inside dashboard pages OR restructure DashboardShell to render at fixed position covering the nav. The simplest approach: render the `(dashboard)` pages inside a `fixed inset-0` container that overlays the global layout entirely.

### Pattern 2: API Route — createServerSupabaseClient

All API routes follow the exact same structure as the existing `/api/contact` route.

```typescript
// src/app/api/candidates/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    // Email privacy: omit email from column select — enforced at query level
    const { data, error } = await supabase
      .from('mock_candidates')
      .select('id, full_name, role, avatar_initials, avatar_color, crima_score, trust_score, status, test_date, fraud_flag_severity, fraud_flag_count')
      .order('test_date', { ascending: false })
    if (error) {
      console.error('[candidates] supabase error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Pattern 3: Auth Guard in Dashboard Layout

Following Phase 4 pattern — `useAuth().isLoggedIn` check with `router.replace('/login')`. The guard lives in `(dashboard)/layout.tsx`, not duplicated in each page.

### Pattern 4: Compare via Query Params

State persists in the URL. The `/dashboard` page reads selection state from local React state (checkboxes) and constructs the URL. The compare page reads `?ids=a,b,c`, splits on comma, and fetches each candidate via `/api/candidates/[id]`.

```tsx
// On /dashboard — when "Compare Selected" clicked:
const ids = selectedIds.join(',')
router.push(`/dashboard/compare?ids=${ids}`)

// On /dashboard/compare:
const searchParams = useSearchParams()
const ids = searchParams.get('ids')?.split(',') ?? []
// Fetch each: Promise.all(ids.map(id => fetch(`/api/candidates/${id}`)))
```

### Pattern 5: Build-Test Step Machine (useState)

```tsx
type WizardStep = 'role' | 'modules' | 'custom-questions' | 'generate' | 'preview' | 'success'

const [step, setStep] = useState<WizardStep>('role')
const [wizardData, setWizardData] = useState({ role: '', modules: [], customQuestions: [] })

// Back preserves data — only step changes
const goBack = () => {
  const steps: WizardStep[] = ['role', 'modules', 'custom-questions', 'generate', 'preview']
  const idx = steps.indexOf(step)
  if (idx > 0) setStep(steps[idx - 1])
}
```

### Anti-Patterns to Avoid

- **Fetching in each dashboard page independently:** Keep all data-fetching in client components with `useEffect` + `useState`. No RSC data fetching for dashboard pages — the auth guard requires `'use client'` in the layout, making children client components too.
- **Stripping email in-handler instead of at query level:** The DATA-06 privacy requirement mandates omitting `email` from the Supabase SELECT string. Never select `*` then delete the field in JS.
- **Duplicating auth guard in each page:** One guard in `(dashboard)/layout.tsx`, zero repetition in pages.
- **Using motion.ts (deprecated):** Import variants from `src/lib/animations.ts`, not `src/lib/motion.ts`.
- **Hardcoded strings:** Every UI string — table headers, badge labels, empty state text, button labels — must use `useTranslation()` and have keys in both locale files.
- **Dynamic PDF generation:** "Export Report" downloads `/public/crima-compare-report.pdf` — do not use any PDF library.
- **Triggering NavShell suppression with complex conditionals:** The cleanest approach is `position: fixed; inset: 0; z-index: 50` on the DashboardShell container, which overlays the global layout.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Table with sorting/filtering | Custom `<table>` from scratch | shadcn `Table` component | Accessibility, consistent styling, less code |
| Modal with focus trap + ESC | Custom modal overlay | shadcn `Dialog` + `vaul` Drawer | Already in place (InviteModal pattern) |
| Toast notifications | Custom toast state | `sonner` via `toast()` | Already installed, Toaster in layout |
| Drag-and-drop module ordering | Custom mouse/touch events | `@dnd-kit/sortable` | Already installed, proven from TEST-03 |
| Score circular gauge | Canvas or SVG from scratch | SVG `<circle>` with `strokeDasharray` animation via Framer Motion | Simple, no dependency, matches design |
| Status badges | Custom CSS chips | shadcn `Badge` component | Consistent variant system |
| Clipboard copy | Custom execCommand | `navigator.clipboard.writeText()` + toast | Browser API, no library needed |
| PDF generation | react-pdf or jsPDF | Static file in `/public/crima-compare-report.pdf` | Locked decision — zero complexity |
| Form validation in wizard | Manual state + error display | `react-hook-form` + zod | Already installed, used in auth forms |

**Key insight:** The entire component and library foundation was laid in Phases 1-4. Phase 5 is assembly, not infrastructure.

---

## Common Pitfalls

### Pitfall 1: Global NavShell Overlap

**What goes wrong:** The global `layout.tsx` renders `<NavShell />` above all pages. Dashboard pages need their own full-page chrome (sidebar + content area) and cannot have the public navbar in the way.

**Why it happens:** App Router root layout wraps every route unconditionally.

**How to avoid:** Render the DashboardShell as `fixed inset-0 z-50 bg-white` so it visually covers the global NavShell. Alternatively, check in NavShell whether the current route starts with `/dashboard` and suppress rendering. The "z-index overlay" approach is simplest and does not require modifying NavShell.

**Warning signs:** White navbar bar visible above the dashboard sidebar on desktop.

### Pitfall 2: Email Leaking in Candidate List Response

**What goes wrong:** Using `.select('*')` on `mock_candidates` returns the `email` field, violating DATA-06/DASH-01 privacy requirement.

**Why it happens:** Developer convenience of `select('*')` for quick fetching.

**How to avoid:** Always use an explicit column list in the SELECT query for `/api/candidates`. The column list is documented in the API route pattern above.

**Warning signs:** A browser network inspection of `GET /api/candidates` response containing an `email` field.

### Pitfall 3: shadcn Overwriting Brand Tokens

**What goes wrong:** Running `npx shadcn@latest add [component]` rewrites `:root` CSS variables in `globals.css`, replacing project brand tokens with shadcn oklch() defaults.

**Why it happens:** shadcn CLI updates the CSS variable block on every `add` command.

**How to avoid:** After each `npx shadcn@latest add`, check `globals.css` for brand token overrides (brand-primary, brand-navy, brand-accent, etc.) and restore if needed. Phase 2 decision documents this exact risk.

**Warning signs:** Brand colors suddenly wrong on existing components after a new shadcn add.

### Pitfall 4: Deprecated motion.ts Import

**What goes wrong:** Importing animation variants from `src/lib/motion.ts` instead of `src/lib/animations.ts`.

**Why it happens:** `motion.ts` is the older file, still present in the codebase.

**How to avoid:** All new Phase 5 components import from `src/lib/animations.ts`. The `motion.ts` file is deprecated and retained only for the legacy design-system page.

**Warning signs:** `import { fadeIn } from '@/lib/motion'` in any new file.

### Pitfall 5: Score Gauge Animation Not Reducing Motion

**What goes wrong:** Circular score gauge animates even when `prefers-reduced-motion: reduce` is set.

**Why it happens:** SVG animations or Framer Motion variants bypassing the global MotionConfig.

**How to avoid:** Use Framer Motion `motion.circle` for the gauge stroke animation — the global `MotionConfig reducedMotion="user"` in `layout.tsx` handles suppression automatically. Do NOT use CSS `@keyframes` for the gauge — it bypasses MotionConfig.

### Pitfall 6: Build-Test newId Routing Race

**What goes wrong:** After wizard completion, `router.push('/dashboard/tests/' + newId)` navigates to a page that tries to `GET /api/tests/[newId]` — but the mock newId (crypto.randomUUID()) doesn't exist in Supabase.

**Why it happens:** The build-test flow is v1 mock — no real POST to Supabase.

**How to avoid:** The `/dashboard/tests/[id]` page must handle a 404/empty response gracefully (EmptyState or redirect to /dashboard/tests). The build-test wizard shows a success modal before redirect — the redirect can go to `/dashboard/tests` (list) instead of the specific test ID to avoid the 404, OR the test detail page renders with mock data from the wizard completion state passed via query param.

**Confirmed decision from CONTEXT.md:** Redirect to `/dashboard/tests/[newId]` — so the tests/[id] page must handle "not found" without crashing.

### Pitfall 7: useSearchParams Needs Suspense Boundary

**What goes wrong:** The `/dashboard/compare` page calls `useSearchParams()` which requires the component to be wrapped in `<Suspense>` in Next.js App Router, otherwise build fails.

**Why it happens:** Next.js 16 enforces Suspense boundaries for `useSearchParams` during static rendering.

**How to avoid:** Wrap the component that calls `useSearchParams()` in a `<Suspense fallback={<Skeleton />}>` boundary, or use `export const dynamic = 'force-dynamic'` at the page level.

---

## Code Examples

Verified patterns from existing project code:

### API Route — Standard Pattern (from /api/contact)

```typescript
// All new API routes follow this structure exactly
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('mock_candidates')
      .select('id, full_name, role, avatar_initials, avatar_color, crima_score, trust_score, status, test_date, fraud_flag_severity, fraud_flag_count')
      .order('crima_score', { ascending: false })
    if (error) {
      console.error('[candidates] supabase error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Modal Pattern (from InviteModal.tsx)

```tsx
// Dialog (desktop) / Drawer (mobile) — use for ALL dashboard modals
'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/use-media-query'

function ModalContent() { /* shared content component */ }

export function SomeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  if (isDesktop) {
    return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><ModalContent /></DialogContent></Dialog>
  }
  return <Drawer open={open} onOpenChange={onOpenChange}><DrawerContent><ModalContent /></DrawerContent></Drawer>
}
```

### Auth Guard (from auth-context.tsx + Phase 4 pattern)

```tsx
// In (dashboard)/layout.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])
  if (!isLoggedIn) return null
  return <DashboardShell>{children}</DashboardShell>
}
```

### Circular Score Gauge (SVG + Framer Motion)

```tsx
// No external library — SVG circle with strokeDasharray
import { motion } from 'motion/react'

export function ScoreGauge({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track */}
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#E0E7FF" strokeWidth="10" />
      {/* Animated progress — MotionConfig reducedMotion="user" handles reduced-motion globally */}
      <motion.circle
        cx="70" cy="70" r={radius}
        fill="none"
        stroke="#1B4FD8"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ transformOrigin: '70px 70px', rotate: '-90deg' }}
      />
      <text x="70" y="74" textAnchor="middle" className="font-bold text-2xl fill-brand-primary">
        {score}
      </text>
    </svg>
  )
}
```

### Clipboard Copy + Toast

```tsx
// navigator.clipboard — no library needed
async function handleCopyLink(url: string) {
  await navigator.clipboard.writeText(url)
  toast.success(t('dashboard.copyLink.success'))
}
```

### useSearchParams with Suspense (Next.js 16 requirement)

```tsx
// src/app/(dashboard)/dashboard/compare/page.tsx
import { Suspense } from 'react'
import { CompareView } from './CompareView'
import { Skeleton } from '@/components/Skeleton'

export default function ComparePage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CompareView />
    </Suspense>
  )
}

// CompareView.tsx — 'use client' component that calls useSearchParams
'use client'
import { useSearchParams } from 'next/navigation'
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `motion.ts` (legacy variants) | `animations.ts` (current variants, no inline transitions) | Phase 3 refactor | Use `animations.ts` for all new components |
| `zodResolver` from `@hookform/resolvers/zod` | `standardSchemaResolver` from `@hookform/resolvers/standard-schema` | Phase 3 | zod v4 uses Standard Schema; the `/zod` sub-path was removed |
| `react-hook-form` manual `useCallback` memoization | React Compiler handles memoization | Phase 1 (React 19 + Compiler active) | Do NOT add useMemo/useCallback in new form components |
| Global `NavShell` always visible | Dashboard uses its own full-screen chrome | Phase 5 (new) | DashboardShell overlays the global layout |

**Deprecated/outdated:**
- `src/lib/motion.ts`: Retained for legacy design-system page only — do not import in Phase 5 components.
- `@hookform/resolvers/zod` sub-path: Use `@hookform/resolvers/standard-schema` instead.

---

## Supabase Schema Reference

Phase 3 seeded the following tables — all in place:

### `mock_candidates` — used by DASH-01, DASH-02, DASH-03, DASH-04, DASH-05

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| full_name | text | display name |
| email | text | **OMIT from list response** |
| role | text | filter by |
| avatar_initials | text | 2-letter initials |
| avatar_color | string | hex color for avatar bg |
| crima_score | integer | 0-100 |
| logic_score | integer | sub-score |
| comms_score | integer | sub-score |
| job_skill_score | integer | sub-score |
| trust_score | integer | sub-score |
| fraud_flag_severity | text | 'Low'|'Medium'|'High' |
| fraud_flag_count | integer | number of flags |
| status | text | 'Pending'|'Reviewed'|'Hired'|'Rejected' |
| test_date | timestamptz | when test was taken |

**Talent Pool:** Served from `mock_candidates` — no separate table. Filter by status or role for the talent pool view. The CONTEXT.md does not specify a separate `talent_pool` Supabase table, so GET /api/talent-pool queries `mock_candidates`.

### `test_templates` — used by DASH-06, DASH-07, DASH-08

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| role | text | |
| slug | text | unique |
| name | text | display name |
| duration_minutes | integer | |
| modules | jsonb | array of module strings |
| active | boolean | status |
| created_at | timestamptz | |

**Gap:** The schema has no `custom_questions` column or `status` enum ('Active'/'Draft'/'Archived') on `test_templates`. DASH-07 requires a status badge. For v1, map `active: true` → 'Active', `active: false` → 'Archived'. For DASH-08 edit (PUT /api/tests/[id]), status change means toggling `active`. Custom questions can be stored as an additional `jsonb` column or handled client-side only (build-test is a v1 mock).

**Schema gap recommendation:** Add a `status` column ('Active'|'Draft'|'Archived') and `custom_questions` jsonb column to `test_templates` via a new Supabase migration, OR map existing `active` boolean to status in the API response.

### `questions` — used by DASH-08 (test detail preview)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| role | text | filter questions by role |
| question_type | text | qcm/dragdrop/etc. |
| text_en | text | English question text |
| text_fr | text | French question text |

---

## Open Questions

1. **NavShell suppression in dashboard layout**
   - What we know: The global `layout.tsx` always renders `<NavShell />`. Dashboard needs its own chrome.
   - What's unclear: Whether to use z-index overlay, conditional NavShell rendering, or a separate root layout segment.
   - Recommendation: Use `position: fixed; inset: 0; z-index: 50` on the DashboardShell container — simplest, no changes to global layout or NavShell required.

2. **Talent Pool data source**
   - What we know: `GET /api/talent-pool` is a separate route but the schema only has `mock_candidates`.
   - What's unclear: Does the talent pool show all candidates, or a filtered subset (e.g., status = 'Reviewed' or 'Hired')?
   - Recommendation: Serve talent pool from `mock_candidates` filtered to exclude 'Pending' + 'Rejected' statuses, or return all candidates. Claude's discretion — pick whichever produces the most populated demo grid.

3. **test_templates schema gap — status + custom_questions**
   - What we know: DASH-07 requires 'Active'/'Draft'/'Archived' badges; schema only has `active: boolean`.
   - What's unclear: Whether to add a migration or map in the API layer.
   - Recommendation: Map `active: true` → 'Active', `active: false` → 'Archived' in the API response for v1. No migration needed. Build-test wizard saves custom_questions to client state only (mock).

4. **build-test POST /api/tests**
   - What we know: After wizard completion, newId is client-generated via `crypto.randomUUID()`.
   - What's unclear: Does the wizard actually POST to Supabase, or just generate a fake ID and redirect?
   - Recommendation: v1 mock — no real POST. Generate newId client-side, show success modal, redirect to `/dashboard/tests` (list) not `/dashboard/tests/[newId]` to avoid guaranteed 404. If the decision is strictly to redirect to `/dashboard/tests/[newId]`, the tests/[id] page must render a graceful "Test not found" EmptyState.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured — CLAUDE.md states "No test runner is configured yet" |
| Config file | None — see Wave 0 |
| Quick run command | `npm run lint && npm run type-check` (lint + type safety as proxy) |
| Full suite command | `npm run build` (full build verifies route compilation, type errors, missing imports) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-04 | GET /api/tests returns test templates | manual | `curl http://localhost:3000/api/tests` | ❌ Wave 0 |
| DATA-05 | GET /api/tests/[id] returns full detail | manual | `curl http://localhost:3000/api/tests/{id}` | ❌ Wave 0 |
| DATA-06 | GET /api/candidates omits email field | manual | `curl http://localhost:3000/api/candidates` — verify no `email` key | ❌ Wave 0 |
| DATA-07 | GET /api/candidates/[id] includes email | manual | `curl http://localhost:3000/api/candidates/{id}` — verify `email` present | ❌ Wave 0 |
| DATA-08 | GET /api/talent-pool returns entries | manual | `curl http://localhost:3000/api/talent-pool` | ❌ Wave 0 |
| DASH-01 | Candidate list loads, search + filters work | manual-only | Visual inspection in browser | ❌ Wave 0 |
| DASH-02 | Mobile layout: bottom tab bar + card stack | manual-only | Browser DevTools responsive mode at 375px | N/A |
| DASH-03 | Detail page shows gauge, mailto link, modals | manual-only | Visual browser inspection | N/A |
| DASH-04 | Compare URL survives refresh, badge on top scorer | manual-only | Browser navigation + DevTools | N/A |
| DASH-05 | Talent pool grid + contact modal | manual-only | Visual browser inspection | N/A |
| DASH-06 | Build-test 4 steps complete, copy link toast | manual-only | Visual browser inspection | N/A |
| DASH-07 | Tests list loads, empty state, Build CTA | manual-only | Visual browser inspection | N/A |
| DASH-08 | Edit mode + delete confirm + share modal | manual-only | Visual browser inspection | N/A |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run type-check`
- **Per wave merge:** `npm run build`
- **Phase gate:** `npm run build` green + human visual QA of all 8 dashboard views before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `public/crima-compare-report.pdf` — placeholder branded PDF must exist before DASH-04 export CTA can be tested
- [ ] shadcn components installed: `npx shadcn@latest add table badge select input checkbox tabs separator`
- [ ] Verify `npm run db:seed` produces populated `mock_candidates` and `test_templates` before API route testing

*(No automated test files to create — no test runner configured. Build + lint + type-check serve as the automated gate.)*

---

## Sources

### Primary (HIGH confidence)
- Codebase direct inspection — `src/lib/supabase.ts`, `src/lib/auth-context.tsx`, `src/app/api/contact/route.ts`, `src/components/modals/InviteModal.tsx`, `src/lib/animations.ts`, `src/lib/use-media-query.ts`, `package.json`, `supabase/migrations/001_initial_schema.sql`
- `.planning/phases/05-company-dashboard-api/05-CONTEXT.md` — locked decisions
- `.planning/REQUIREMENTS.md` — all DASH-01 through DASH-08, DATA-04 through DATA-09 specs
- `.planning/STATE.md` — accumulated project decisions

### Secondary (MEDIUM confidence)
- Next.js App Router documentation patterns for route groups, `useSearchParams` Suspense requirement (standard Next.js 16 behavior, consistent with project's Next.js 16.1.6)
- shadcn/ui component installation pattern — `npx shadcn@latest add` (confirmed from Phase 2 decisions in STATE.md)

### Tertiary (LOW confidence)
- NavShell suppression via `fixed inset-0 z-50` pattern — inferred from CSS principles, not verified against a specific official source. Alternative (conditional NavShell render) is equally valid.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries from package.json, verified installed
- Architecture: HIGH — patterns directly derived from existing codebase files
- Pitfalls: HIGH — most derived from STATE.md accumulated decisions (real project history)
- Supabase schema: HIGH — read from `001_initial_schema.sql` directly
- NavShell suppression: MEDIUM — inferred pattern, alternatives noted

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable project; no fast-moving external dependencies added this phase)
