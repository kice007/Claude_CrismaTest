# Phase 1: Foundation - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Design system tokens, i18n framework, and typography are wired up so every subsequent component can be built to brand spec, fully bilingual, from day one. This phase delivers infrastructure only — no user-facing pages except a dev-only validation artifact.

</domain>

<decisions>
## Implementation Decisions

### Brand token scope
- Colors are fully specified (brand-primary #1B4FD8, brand-secondary #3B6FE8, brand-navy #0F2A6B, brand-light #EEF2FF, brand-accent #6366F1, neutrals, success/warning/danger) — define all in `@theme` in globals.css (Tailwind v4 approach, not tailwind.config.ts)
- Standard Tailwind spacing scale — no custom spacing tokens in Phase 1
- Custom border-radius tokens in `@theme`: e.g., `--radius-card`, `--radius-chip`, `--radius-badge` to keep component rounding consistent across all phases
- Custom shadow tokens in `@theme`: e.g., `--shadow-card`, `--shadow-dropdown`, `--shadow-modal` to achieve the premium SaaS depth aesthetic
- Framer Motion shared variants library (`src/lib/motion.ts`): define `fadeIn`, `slideUp`, `slideIn`, `staggerChildren`, `scaleIn` with `@media (prefers-reduced-motion)` baked in — all 6 phases import from one place

### Typography
- Replace Geist Sans + Geist Mono (current scaffold defaults) with Inter + JetBrains Mono via `next/font/google`
- Update `layout.tsx` CSS variables and `@theme` references accordingly
- `font-display: swap` on both fonts (per DSYS-03)

### i18n wiring
- react-i18next with a custom App Router-compatible setup (NOT next-i18next — that targets Pages Router)
- Translation files at `/locales/en.json` and `/locales/fr.json`
- Phase 1 seeds only the keys needed for Phase 1 components (language switcher labels, any dev page strings)
- Language switcher component (`src/components/LanguageSwitcher.tsx`): EN|FR pill buttons on desktop, globe icon dropdown on mobile — standalone component ready to be dropped into the nav in Phase 2
- Language stored in localStorage, restored on next visit (I18N-04)

### Shadcn/ui
- Install Shadcn/ui CLI and override with brand CSS variables in globals.css
- CSS variable overrides go in `:root` block alongside brand tokens — not in a separate file
- Phase 1 only installs Shadcn; no individual components are added yet (phases 2+ add them as needed)

### Validation artifact
- Create `/dev/design-system` page — shows: all brand color swatches, Inter + JetBrains Mono specimens, a live EN↔FR language toggle, and sample Shadcn components in brand colors
- Dev mode only: returns 404 in production (NODE_ENV check in the page component or middleware)
- This page directly maps to all 5 Phase 1 success criteria — can be used to verify the phase visually

### Claude's Discretion
- Exact Framer Motion variant values (duration, easing, delay) — match the premium SaaS feel
- Specific border-radius and shadow token values — derive from design reference (v0-crisma-test-landing-page.vercel.app)
- i18next configuration details (detection order, fallback language, debug mode)
- Exact structure of the /dev/design-system page layout

</decisions>

<specifics>
## Specific Ideas

- Design reference: v0-crisma-test-landing-page.vercel.app — derive shadow and border-radius values from that visual aesthetic
- Brand positioning: YC-funded SaaS meets professional HR tool — reference Searchable.com, GitBook.com, ReflexAI.com for depth/polish level
- The Framer Motion library must wrap all animations in `@media (prefers-reduced-motion: no-preference)` — handle this once in the shared variants, so no phase has to remember

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/globals.css`: Already uses Tailwind v4 `@import "tailwindcss"` + `@theme inline` pattern — brand tokens extend this, not a separate config file
- `src/app/layout.tsx`: Current font setup (Geist) is the integration point for replacing with Inter + JetBrains Mono

### Established Patterns
- Tailwind v4 `@theme inline` in globals.css — brand tokens follow this same pattern (CSS custom properties under `@theme`)
- No `tailwind.config.ts` needed for color tokens in v4 — everything goes in CSS

### Integration Points
- `layout.tsx` is the single place fonts are loaded and applied — update CSS variables here
- `globals.css` is where all Tailwind tokens, CSS variables, and Shadcn overrides live
- Language switcher component will be a standalone `src/components/LanguageSwitcher.tsx` — Phase 2 imports and places it in the nav

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-14*
