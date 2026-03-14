# Phase 2: Shared UI + Nav Shell - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Build every reusable UI primitive (toasts, modals, skeletons, empty states, error pages) and the responsive nav shell. Phase 2 delivers the component library and global layout wrapper — no page-level content. Pages in Phases 3–6 assemble from these building blocks.

</domain>

<decisions>
## Implementation Decisions

### Nav visual character
- Logo: icon + text — inline SVG geometric mark (simple diamond or square shape) in brand-primary, paired with "CrismaTest" text in Inter bold. Placeholder until Pencil designs (Phase 2.1) define the final logo mark.
- Desktop layout: logo left | nav links center | EN|FR (LanguageSwitcher from Phase 1) + Login + Sign Up right
- Login CTA: ghost/outline button (border brand-primary, transparent bg)
- Sign Up CTA: solid filled button (brand-primary bg, white text) — primary conversion action
- Scroll behavior: shadow appears on scroll AND background transitions toward glassmorphism (backdrop-blur strengthens slightly, bg opacity decreases slightly — e.g., `bg-white/95 backdrop-blur-sm` → `bg-white/80 backdrop-blur-md` on scroll)
- Mobile: hamburger icon → slide-down sheet with all nav links + language toggle, 48px tap targets

### Toast interaction model
- Slide in from right, 250ms (use existing `slideIn` variant from `src/lib/motion.ts`)
- Stack vertically — newest on top, max 3 visible simultaneously; if 4th triggers, oldest auto-dismisses
- Auto-dismiss at 4 seconds
- Manual dismiss: × button on each toast (user can close early)
- Variants: success (brand-primary/green), warning (amber), error (red/danger)

### Modal interaction model
- Desktop: centered dialog with backdrop overlay
- Mobile: bottom sheet (slides up) — use Shadcn/ui Drawer (vaul-based)
- Sizes are content-driven on desktop:
  - Narrow (max-w-md ~448px): invite candidate modal, contact modal
  - Medium (max-w-lg ~512px): calendar modal
  - Wide (max-w-xl ~576px): export modal
- Focus-trapped; closes on ESC or backdrop click (spec requirement)

### Empty state component
- Single generic `EmptyState` component — props: `title`, `body`, `ctaLabel`, `ctaHref` (optional)
- Illustration: minimal abstract SVG — blue-palette geometric shapes (not character-based), consistent across all uses
- Same card + abstract SVG + text + CTA structure used for branded 404 and 500 error pages
- Error pages are not a separate design system — they use the EmptyState visual language

### Skeleton shimmer primitive
- Phase 2 ships the `Skeleton` primitive only — pages in Phases 3–6 compose their own layout-matching skeletons
- Generic component: configurable via `className` (width, height, border-radius via Tailwind utilities)
- Animation: left-to-right shimmer, 1.5s infinite CSS animation (not Framer Motion — purely CSS for performance)
- Accessibility: `@media (prefers-reduced-motion: reduce)` renders static muted box instead of animating shimmer

### Claude's Discretion
- Exact shimmer gradient colors (within neutral/brand-light palette)
- Specific glassmorphism transition values (blur amount, opacity delta on scroll)
- Toast position anchoring (bottom-right vs top-right — bottom-right is typical for this pattern)
- Nav link hover states and active indicators
- Exact geometric mark shape for logo placeholder

</decisions>

<specifics>
## Specific Ideas

- Nav glassmorphism on scroll: inspired by premium SaaS references (Searchable.com, GitBook.com) — subtle, not heavy frosted-glass. The scroll transition should feel like the nav is "lifting off" the page slightly.
- Logo geometric mark: simple and replaceable — it's a placeholder for Phase 2.1 Pencil designs. Don't over-invest in it.
- Empty state illustration: think Linear's empty states — geometric, on-brand, not whimsical or cartoon-y.
- Modal bottom-sheet on mobile: this is the pattern for ALL four modal types (invite, calendar, export, contact) — no exceptions.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/motion.ts`: `slideIn`, `fadeIn`, `scaleIn`, `staggerChildren` variants ready — toast slide-in and modal entrance animations use these directly
- `src/components/LanguageSwitcher.tsx`: standalone, ready to be imported into the nav shell
- `src/components/I18nProvider.tsx`: wraps the app — nav shell sits inside this provider

### Established Patterns
- Tailwind v4 `@theme inline` in `globals.css` — all new component tokens (if any needed) follow this pattern
- Brand tokens fully resolved: `brand-primary`, `brand-navy`, `brand-light`, `brand-accent` available as Tailwind utilities
- Shadcn/ui installed — use its Dialog (modal), Drawer (bottom sheet), Toast/Sonner or custom toast built on motion variants
- `MotionConfig reducedMotion="user"` in layout.tsx handles Framer Motion animations — skeleton shimmer is a CSS animation and needs its own `@media (prefers-reduced-motion)` rule

### Integration Points
- `src/app/layout.tsx`: nav shell wraps all pages here — the `<main>` content area sits below the fixed nav
- All Phase 3+ pages inherit the nav automatically via layout.tsx
- `LanguageSwitcher` drops directly into the nav's right section (already built and tested)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-shared-ui-nav-shell*
*Context gathered: 2026-03-14*
