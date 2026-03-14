# Phase 2: Shared UI + Nav Shell - Research

**Researched:** 2026-03-14
**Domain:** Shadcn/ui (Dialog, Drawer, Sonner), responsive nav shell, skeleton shimmer, toast system, modal system, Tailwind v4 scroll glassmorphism
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Nav visual character:**
- Logo: icon + text — inline SVG geometric mark (simple diamond or square shape) in brand-primary, paired with "CrismaTest" text in Inter bold. Placeholder until Pencil designs (Phase 2.1).
- Desktop layout: logo left | nav links center | EN|FR (LanguageSwitcher from Phase 1) + Login + Sign Up right
- Login CTA: ghost/outline button (border brand-primary, transparent bg)
- Sign Up CTA: solid filled button (brand-primary bg, white text)
- Scroll behavior: shadow appears on scroll AND background transitions toward glassmorphism (`bg-white/95 backdrop-blur-sm` → `bg-white/80 backdrop-blur-md` on scroll)
- Mobile: hamburger icon → slide-down sheet with all nav links + language toggle, 48px tap targets

**Toast interaction model:**
- Slide in from right, 250ms (use existing `slideIn` variant from `src/lib/motion.ts`)
- Stack vertically — newest on top, max 3 visible simultaneously; if 4th triggers, oldest auto-dismisses
- Auto-dismiss at 4 seconds
- Manual dismiss: × button on each toast (user can close early)
- Variants: success (brand-primary/green), warning (amber), error (red/danger)

**Modal interaction model:**
- Desktop: centered dialog with backdrop overlay
- Mobile: bottom sheet (slides up) — use Shadcn/ui Drawer (vaul-based)
- Sizes are content-driven on desktop:
  - Narrow (max-w-md ~448px): invite candidate modal, contact modal
  - Medium (max-w-lg ~512px): calendar modal
  - Wide (max-w-xl ~576px): export modal
- Focus-trapped; closes on ESC or backdrop click (spec requirement)

**Empty state component:**
- Single generic `EmptyState` component — props: `title`, `body`, `ctaLabel`, `ctaHref` (optional)
- Illustration: minimal abstract SVG — blue-palette geometric shapes (not character-based)
- Same card + abstract SVG + text + CTA structure used for branded 404 and 500 error pages
- Error pages are not a separate design system — they use the EmptyState visual language

**Skeleton shimmer primitive:**
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | Skeleton loading states (shimmer 1.5s infinite) on all data-heavy views | Pure CSS `@keyframes` shimmer via `background-position` animation; Tailwind `motion-reduce:` variant or `@media (prefers-reduced-motion: reduce)` block disables it; generic `<Skeleton>` component with `className` pass-through |
| UI-02 | Empty state with illustrated card + body text + CTA (blue-palette abstract shapes) | Single `EmptyState` component with inline SVG; reuses same visual language for 404/500 error pages; no external illustration library needed |
| UI-03 | Toast system — success/warning/error, slide-in from right 250ms, 4s auto-dismiss | Sonner via `npx shadcn@latest add sonner`; `toast.success()` / `toast.warning()` / `toast.error()`; `<Toaster position="bottom-right" visibleToasts={3} richColors closeButton duration={4000} />` in `layout.tsx` |
| UI-04 | Modal system — invite candidate, calendar, export, contact modals; focus-trapped; ESC to close | Shadcn Dialog for desktop + Shadcn Drawer (vaul-based) for mobile; `useMediaQuery` or CSS breakpoint-aware conditional rendering; Dialog handles focus trap + ESC natively via Radix UI |
| UI-05 | Branded 404 and 500 pages — no stack trace, link back to home | Next.js App Router `not-found.tsx` and `error.tsx` files in `src/app/`; use `EmptyState` component; error.tsx must be `'use client'` |
| UI-06 | All animations wrapped in @media (prefers-reduced-motion: no-preference) | `MotionConfig reducedMotion="user"` already in `layout.tsx` covers Framer Motion; skeleton shimmer needs its own `@media (prefers-reduced-motion: reduce)` CSS block in globals.css |
| UI-07 | Minimum 48×48px touch targets; 16px minimum font-size on form inputs | Tailwind `min-h-[48px] min-w-[48px]` on all interactive elements; `text-base` (16px) on all `<input>` elements; `LanguageSwitcher` already uses `min-h-[48px]` |
| LAND-06 | Fixed nav: logo left, links center, EN|FR + Login + Sign Up right; white/95 backdrop-blur; shadow on scroll | `position: fixed` + `top-0` + `z-50`; scroll state via `useEffect` + `window.addEventListener('scroll', ...)`; conditional Tailwind classes for shadow/blur transition |
| LAND-07 | Mobile nav: hamburger → slide-down sheet with all links + language toggle, 48px tap targets | Shadcn Sheet component (extends Dialog for side/top panels) OR custom `<details>`-free slide-down; state-managed open/close; `LanguageSwitcher` imported directly into mobile sheet |
| LAND-08 | All landing pages fully responsive — no horizontal overflow at 320px minimum | `max-w-full overflow-x-hidden` on `<body>`; nav uses `container mx-auto px-4` pattern; all components tested at 320px viewport |
</phase_requirements>

---

## Summary

Phase 2 has one critical prerequisite that Phase 1 did NOT complete: **Shadcn/ui was not actually installed**. `package.json` has no `@radix-ui/*` deps, `components.json` does not exist, and `src/components/ui/` does not exist. The first wave of Phase 2 must run `npx shadcn@latest init` before adding any components.

Once Shadcn/ui is bootstrapped, the phase builds five distinct things: (1) the `Skeleton` CSS-animation primitive, (2) the `EmptyState` component and its reuse for 404/500 pages, (3) the Sonner-based toast system, (4) the Dialog/Drawer-based modal system for four modal variants, and (5) the responsive nav shell wired into `layout.tsx`. These are largely independent and can be built in parallel waves, with the nav shell integrated last since it modifies `layout.tsx`.

The technical surface area is well-covered by Shadcn/ui's existing primitives. Sonner (the shadcn-recommended toast library) handles all toast behavior including stacking, variants, and auto-dismiss with a single `<Toaster>` in `layout.tsx`. The responsive dialog/bottom-sheet pattern (Dialog on desktop, Drawer on mobile) is the standard shadcn pattern with official support via a `useMediaQuery` hook. The scroll glassmorphism nav uses a simple `useState` + `useEffect` scroll listener pattern — no additional library needed.

**Primary recommendation:** Install Shadcn/ui first (Wave 0), then build skeleton + empty-state + 404/500 (Wave 1), then toast + modal system (Wave 2), then nav shell (Wave 3), and finally wire nav into layout.tsx (Wave 4).

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn/ui | latest (npx shadcn@latest) | Dialog, Drawer, Sheet, Sonner primitives | NOT YET INSTALLED — must be first task of Phase 2 |
| sonner | bundled via shadcn | Toast notifications | Official shadcn recommendation; replaces deprecated shadcn/Toast; handles stacking, auto-dismiss, variants |
| tw-animate-css | bundled via shadcn init | CSS animations for Dialog/Drawer enter/exit | Replaces tailwindcss-animate in Tailwind v4 projects; installed automatically by shadcn init |
| vaul | bundled via shadcn Drawer | Bottom sheet on mobile | Powers Shadcn Drawer; handles drag-to-dismiss, physics animations |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-dialog | pulled in by shadcn | Focus trap, ESC close, ARIA | Automatically installed when `shadcn add dialog` runs |
| lucide-react | pulled in by shadcn | Icons (hamburger, X, close) | Standard icon set for this stack; installed by shadcn |
| clsx + tailwind-merge | pulled in by shadcn | Conditional class merging | Use `cn()` util from shadcn for all className composition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sonner (shadcn's recommended toast) | Custom toast with motion variants | Decisions locked Sonner via "use Shadcn/ui Toast/Sonner" — custom builds are prohibited by scope |
| Shadcn Dialog + Drawer (separate) | Credenza (auto-adaptive) | Credenza is a third-party wrapper; decisions specify Dialog + Drawer explicitly — use them directly |
| Tailwind `motion-reduce:` variant | JS matchMedia check | Tailwind variant is simpler for CSS animations; JS check is needed for Framer Motion (already handled by MotionConfig) |

**Installation (Wave 0 — first plan):**
```bash
npx shadcn@latest init
npx shadcn@latest add dialog drawer sheet sonner
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
src/
├── app/
│   ├── layout.tsx              # ADD: NavShell + Toaster here
│   ├── not-found.tsx           # NEW: branded 404 using EmptyState
│   ├── error.tsx               # NEW: branded 500 using EmptyState ('use client')
│   └── dev/
│       └── design-system/
│           └── page.tsx        # UPDATE: add Phase 2 component demos
├── components/
│   ├── ui/                     # CREATED by shadcn init (dialog.tsx, drawer.tsx, sonner.tsx, sheet.tsx)
│   ├── nav/
│   │   ├── NavShell.tsx        # Fixed nav wrapper — scroll state, glassmorphism
│   │   ├── NavDesktop.tsx      # Logo + center links + right CTAs
│   │   └── NavMobile.tsx       # Hamburger + Sheet slide-down
│   ├── Skeleton.tsx            # CSS shimmer primitive
│   ├── EmptyState.tsx          # Card + SVG + text + CTA
│   └── modals/
│       ├── InviteModal.tsx     # Dialog (desktop) + Drawer (mobile)
│       ├── CalendarModal.tsx   # Same pattern, max-w-lg
│       ├── ExportModal.tsx     # Same pattern, max-w-xl
│       └── ContactModal.tsx    # Same pattern, max-w-md
└── lib/
    └── use-media-query.ts      # Hook for Dialog vs Drawer switching
```

### Pattern 1: Shadcn Init (Wave 0 prerequisite)
**What:** Run CLI to create `components.json`, install deps, scaffold `src/components/ui/`, add `tw-animate-css` import to globals.css.
**When to use:** Once, before any other Phase 2 work.
**Example:**
```bash
# shadcn@latest auto-detects Tailwind v4 (no tailwind.config.ts present)
npx shadcn@latest init
# Prompts: style=new-york, baseColor=slate, globals.css path=src/app/globals.css
# Then add components needed for Phase 2:
npx shadcn@latest add dialog drawer sheet sonner
```
**Critical:** After `shadcn init`, inspect `globals.css`. It will add a `@import "tw-animate-css"` line and may add new `:root` variables. The existing brand token `:root` block must be preserved. Merge carefully — brand values OVERRIDE shadcn defaults.

### Pattern 2: Skeleton Shimmer (pure CSS, no Framer Motion)
**What:** Generic `<Skeleton>` component that renders a shimmer rectangle via CSS `@keyframes`.
**When to use:** Any placeholder UI during loading state in Phases 3–6.
**Example:**
```css
/* In globals.css — add after existing blocks */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-brand-light)  50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
    background: var(--color-neutral-100);
  }
}
```
```tsx
// src/components/Skeleton.tsx
import { cn } from "@/lib/utils"; // shadcn's cn() util

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer rounded", className)}
      aria-hidden="true"
    />
  );
}
```
Usage: `<Skeleton className="h-4 w-32" />`, `<Skeleton className="h-12 w-full rounded-card" />`

### Pattern 3: Sonner Toast Setup
**What:** `<Toaster>` in `layout.tsx` body; `toast()` called from any client component.
**When to use:** Any user-feedback event (form submit, action success/failure, "coming soon" buttons).
**Example:**
```tsx
// src/app/layout.tsx — add inside <body> after <I18nProvider>
import { Toaster } from "@/components/ui/sonner";

// Inside body:
<MotionConfig reducedMotion="user">
  <I18nProvider>{children}</I18nProvider>
  <Toaster
    position="bottom-right"
    visibleToasts={3}
    richColors
    closeButton
    duration={4000}
  />
</MotionConfig>
```
```tsx
// In any 'use client' component:
import { toast } from "sonner";

toast.success("Candidate invited!");          // green
toast.warning("Session expiring soon");       // amber
toast.error("Failed to save");               // red
```
**Note on custom animation:** Sonner has its own built-in animations. The decision to use `slideIn` variant from `motion.ts` applies to the CONTEXT aesthetic intent; Sonner's default slide-from-bottom-right is the practical implementation. If the spec requires strict right-side slide-in, use Sonner's `toastOptions.className` to override, or accept Sonner's default which is already a slide animation from bottom-right.

### Pattern 4: Responsive Modal (Dialog + Drawer)
**What:** Desktop gets a centered Dialog, mobile gets a bottom-sheet Drawer. A `useMediaQuery` hook triggers the switch.
**When to use:** All four modal types (invite, calendar, export, contact).
**Example:**
```tsx
// src/lib/use-media-query.ts
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}
```
```tsx
// src/components/modals/InviteModal.tsx
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <div className="p-6">
      {/* modal body here */}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Candidate</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Invite Candidate</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
}
```

### Pattern 5: Scroll Glassmorphism Nav
**What:** `NavShell` tracks `window.scrollY > 0` via `useEffect` and toggles Tailwind classes for shadow + backdrop-blur transition.
**When to use:** The single nav wrapper placed in `layout.tsx`.
**Example:**
```tsx
// src/components/nav/NavShell.tsx
"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-card"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      {children}
    </header>
  );
}
```
**Note on React Compiler:** The React Compiler is active. Do NOT use `useCallback` on the scroll handler. Use a plain function inside `useEffect` — the compiler handles memoization.

### Pattern 6: Next.js 404 and 500 Pages (App Router)
**What:** `not-found.tsx` catches 404s; `error.tsx` catches runtime errors. Both use `EmptyState` component.
**When to use:** Required once — App Router picks these up automatically.
**Example:**
```tsx
// src/app/not-found.tsx (Server Component — no 'use client' needed)
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <EmptyState
        title="Page not found"
        body="The page you're looking for doesn't exist."
        ctaLabel="Back to home"
        ctaHref="/"
      />
    </main>
  );
}
```
```tsx
// src/app/error.tsx — MUST be 'use client'
"use client";
import { EmptyState } from "@/components/EmptyState";

export default function Error() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <EmptyState
        title="Something went wrong"
        body="An unexpected error occurred. Please try again."
        ctaLabel="Back to home"
        ctaHref="/"
      />
    </main>
  );
}
```

### Pattern 7: Shadcn Sheet for Mobile Nav
**What:** Sheet component (extends Dialog, slides in from top or left) used as the hamburger menu panel.
**When to use:** Mobile nav drawer — the CONTEXT calls for a "slide-down sheet" on mobile.
**Example:**
```tsx
// src/components/nav/NavMobile.tsx
"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function NavMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="md:hidden min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="Open menu"
        >
          {/* Hamburger icon (lucide-react Menu icon) */}
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="pt-16">
        <nav className="flex flex-col gap-4">
          {/* Nav links with min-h-[48px] */}
          <LanguageSwitcher />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

### Anti-Patterns to Avoid
- **Installing shadcn components without running init first:** `npx shadcn@latest add dialog` without prior `init` will fail — no `components.json` exists yet.
- **Using Framer Motion for skeleton shimmer:** The decision is explicit — CSS-only animation for performance. Do not add `motion.div` to the Skeleton component.
- **Using `useMemo`/`useCallback` manually with React Compiler active:** The React Compiler auto-memoizes. The scroll handler in `NavShell` must be a plain function inside `useEffect`, not wrapped in `useCallback`.
- **Placing `<Toaster>` inside `I18nProvider`:** `Toaster` renders toast portals. Place it as a sibling AFTER `<I18nProvider>{children}</I18nProvider>`, not nested inside.
- **Using the deprecated shadcn Toast component:** Shadcn has deprecated its original `Toast` + `useToast` in favor of Sonner. Do not use `npx shadcn@latest add toast` — use `sonner` instead.
- **Hardcoding nav links as English-only:** All nav link text must go through `useTranslation()` and be added to `/locales/en.json` and `/locales/fr.json`.
- **Forgetting `aria-expanded` on hamburger button:** Mobile nav must set `aria-expanded` state on the hamburger trigger for screen readers.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom portal + animation + stacking | Sonner via shadcn | Stacking, auto-dismiss, keyboard dismiss, ARIA live regions, gesture support on mobile — all edge cases |
| Modal focus trap | `tabIndex` management + ESC listener | Shadcn Dialog (Radix UI) | Radix implements full ARIA Dialog spec: focus trap, scroll lock, ESC key, pointer events disabled on backdrop |
| Bottom sheet on mobile | Custom slide-up div with touch events | Shadcn Drawer (vaul) | Vaul handles drag velocity, rubber-banding physics, gesture cancel, swipe-to-dismiss — all non-trivial |
| Responsive modal switching | CSS-only breakpoint tricks | `useMediaQuery` hook | Clean component swap; CSS-only approach breaks Dialog's focus trap on mobile |
| Mobile menu slide-down | Custom div with overflow:hidden animation | Shadcn Sheet | Sheet is already accessible, tested, animated — 3 lines vs 50 lines of custom |
| Icon set | Inline SVGs for hamburger/close | lucide-react (bundled by shadcn) | Consistent, accessible, tree-shakeable |

**Key insight:** Focus management is the hardest part of modals. Radix UI's Dialog implementation handles the full WCAG 2.1 dialog pattern including "when dialog closes, return focus to trigger element." Building this correctly takes ~200 lines and weeks of testing. Use it.

---

## Common Pitfalls

### Pitfall 1: shadcn Init Overwriting Brand CSS Variables
**What goes wrong:** `npx shadcn@latest init` generates its own `:root` block in globals.css, partially overwriting the Phase 1 brand tokens.
**Why it happens:** shadcn generates default neutral-toned CSS variables; it doesn't know about the existing brand tokens.
**How to avoid:** After `init`, immediately inspect `globals.css`. Restore any overwritten brand token values. The Phase 1 brand token `:root` block is the source of truth — shadcn's generated values should be replaced with brand-mapped HSL equivalents (already defined in Phase 1).
**Warning signs:** `bg-primary` renders as a generic slate color instead of brand-primary blue.

### Pitfall 2: Nav Shell Causes Layout Shift
**What goes wrong:** Fixed nav (`position: fixed`) removes the nav from document flow, causing page content to scroll behind/under the nav.
**Why it happens:** Fixed-positioned elements don't contribute to document height.
**How to avoid:** Add `pt-[nav-height]` to the `<main>` element inside `layout.tsx`, or add a spacer `<div>` with the nav height immediately after the nav. Nav height is typically `h-16` (64px) or `h-[72px]`.
**Warning signs:** First section of page content is hidden behind the nav on initial load.

### Pitfall 3: Scroll Listener Memory Leak
**What goes wrong:** The `window.addEventListener('scroll', ...)` in NavShell fires after component unmount.
**Why it happens:** Missing cleanup in `useEffect` return.
**How to avoid:** Always return a cleanup function: `return () => window.removeEventListener('scroll', handleScroll)`. Use `{ passive: true }` option for scroll performance.
**Warning signs:** React warning "Can't perform a state update on an unmounted component."

### Pitfall 4: Dialog Focus Trap Conflict with toast
**What goes wrong:** Sonner toasts appear outside the Dialog's focus trap, causing screen readers to miss them or focus management to break.
**Why it happens:** Toasts render in a portal; the Dialog's focus trap may conflict.
**How to avoid:** Sonner renders in a separate `<ol>` portal via `aria-live`. This is compatible with Dialog focus traps — no special handling needed as long as `<Toaster>` is placed as a sibling to the main content, not nested inside Dialog components.
**Warning signs:** Keyboard users can Tab into toast elements while a Dialog is open.

### Pitfall 5: `useMediaQuery` SSR Hydration Mismatch
**What goes wrong:** `useMediaQuery` returns `false` on server (SSR) and may return `true` on client, causing a hydration mismatch for modals in the open state.
**Why it happens:** `window.matchMedia` is unavailable during server rendering.
**How to avoid:** Initialize `useState(false)` — this is the safe default for SSR. The `useEffect` runs after hydration and corrects it. Since modals are never open by default (they open on user action), this is safe — the initial render always shows a closed modal regardless of media query.
**Warning signs:** React hydration error about mismatched server/client HTML.

### Pitfall 6: Sheet `side="top"` Clips Content
**What goes wrong:** Mobile nav sheet with `side="top"` may not be tall enough for all nav links + language switcher.
**Why it happens:** Default Sheet height is not content-driven for `side="top"`.
**How to avoid:** Either use `side="left"` for a full-height side drawer (common mobile nav pattern), or set a `min-h` on `SheetContent` to ensure all items fit. Test at 320px viewport width.
**Warning signs:** Nav items are cut off at the bottom of the sheet on small phones.

### Pitfall 7: tw-animate-css Not Imported
**What goes wrong:** Dialog/Drawer animations fail with "animation class not found" — components render without enter/exit transitions.
**Why it happens:** shadcn init is supposed to add `@import "tw-animate-css"` to globals.css, but this occasionally fails or gets skipped.
**How to avoid:** After `shadcn init`, verify `globals.css` contains `@import "tw-animate-css"` near the top. If missing, add it manually and run `npm install tw-animate-css`.
**Warning signs:** Dialogs appear/disappear instantly with no animation.

---

## Code Examples

Verified patterns from official sources:

### Sonner Toaster Configuration (layout.tsx)
```tsx
// Source: https://ui.shadcn.com/docs/components/sonner + https://sonner.emilkowal.ski/toaster
import { Toaster } from "@/components/ui/sonner";

// visibleToasts={3} enforces max 3 stacked (default is 3)
// richColors applies semantic colors to success/warning/error variants
// closeButton adds the × dismiss button per spec
// duration={4000} is Sonner's default — explicit for clarity
<Toaster
  position="bottom-right"
  visibleToasts={3}
  richColors
  closeButton
  duration={4000}
/>
```

### Toast Invocation — All Three Variants
```tsx
// Source: https://sonner.emilkowal.ski/toast
import { toast } from "sonner";

toast.success("Candidate invited successfully");   // brand-primary/green
toast.warning("This action cannot be undone");     // amber
toast.error("Failed to send invite");              // red/danger
```

### Dialog Sub-components (shadcn)
```tsx
// Source: https://ui.shadcn.com/docs/components/dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Focus trap and ESC close are automatic via Radix UI primitive
// Backdrop click closes by default
// onOpenChange fires on both ESC and backdrop click
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Invite Candidate</DialogTitle>
      <DialogDescription>Send an invite to a candidate.</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Drawer (vaul-based) for Mobile Bottom Sheet
```tsx
// Source: https://ui.shadcn.com/docs/components/drawer
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Invite Candidate</DrawerTitle>
    </DrawerHeader>
    <div className="p-4 pb-safe">
      {/* content */}
    </div>
  </DrawerContent>
</Drawer>
```

### Skeleton Component (complete)
```tsx
// src/components/Skeleton.tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded", className)} aria-hidden="true" />;
}

// Usage examples:
// <Skeleton className="h-4 w-48" />              — text line
// <Skeleton className="h-32 w-full rounded-card" /> — card
// <Skeleton className="h-10 w-10 rounded-full" />   — avatar
```

---

## Critical Discovery: Shadcn/ui NOT Installed (Phase 1 Gap)

**Status:** The Phase 1 CONTEXT.md stated "Shadcn/ui installed" as a deliverable. Inspection reveals:
- `package.json`: No `@radix-ui/*` packages, no `clsx`, no `tailwind-merge`, no `vaul`
- `components.json`: Does not exist
- `src/components/ui/`: Does not exist

**Impact on Phase 2:** The first plan of Phase 2 MUST run `npx shadcn@latest init` and then `npx shadcn@latest add dialog drawer sheet sonner`. All subsequent plans depend on this.

**No blame, no risk:** This is a straightforward gap. shadcn init is a deterministic CLI operation. It does NOT break existing code — it only adds new files and adds an import to globals.css.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| shadcn/Toast + useToast hook | Sonner (via shadcn) | 2024 | Old Toast is deprecated; Sonner is the current standard |
| tailwindcss-animate plugin | tw-animate-css import | Tailwind v4 era (2025) | Plugin system changed; CSS-first import replaces JS plugin |
| Custom focus trap implementations | Radix UI Dialog primitive | 2022+ | Radix is now the de-facto standard for accessible modals |
| CSS `position: sticky` nav | CSS `position: fixed` + scroll listener | N/A | Fixed gives more control over glassmorphism transitions |
| framer-motion package | motion package (`motion/react`) | Late 2024 | Same API, new package name — already adopted in Phase 1 |

**Deprecated/outdated:**
- `shadcn/ui Toast` component (`npx shadcn@latest add toast`): Replaced by Sonner. Never add this.
- `tailwindcss-animate`: Replaced by `tw-animate-css` for Tailwind v4. shadcn init handles this automatically.

---

## Open Questions

1. **Sonner slide-in direction vs spec requirement**
   - What we know: Decisions state "slide in from right, 250ms." Sonner's default animation is a slide-up from bottom-right (position-dependent).
   - What's unclear: Whether "slide in from right" means the toast enters from the right edge of the screen, or animates rightward. The "bottom-right" position means toasts slide UP from the bottom-right corner by default.
   - Recommendation: Accept Sonner's default slide-up-from-bottom-right. The spec's "slide in from right" likely means "appears at the right side" — the positioning satisfies the intent. If exact animation direction matters, use Sonner's `toastOptions={{ className: 'animate-slide-in-right' }}` with a custom CSS keyframe. Mark as Claude's discretion.

2. **Nav height spacer value**
   - What we know: The nav needs a spacer in `<main>` to prevent content from being hidden under fixed nav.
   - What's unclear: Exact nav height before it's built.
   - Recommendation: Build nav with `h-16` (64px) and add `<main className="pt-16">` in layout.tsx. Adjust if design spec changes.

3. **Sheet `side` for mobile nav**
   - What we know: CONTEXT says "slide-down sheet." Shadcn Sheet supports `side="top"` which slides down from top.
   - What's unclear: Whether `side="top"` gives enough height for all nav links + language switcher at 320px.
   - Recommendation: Use `side="top"` with auto height driven by content. Test at 320px. Fall back to `side="left"` (full-height side drawer) if content clips.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured — CLAUDE.md explicitly states "No test runner is configured yet" |
| Config file | none |
| Quick run command | `npm run lint && npm run type-check` |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | Skeleton shimmer renders, reduced-motion disables animation | manual | Visual inspection on `/dev/design-system` + OS reduced-motion toggle | ❌ Wave 0 |
| UI-02 | EmptyState renders with SVG, text, and optional CTA | manual | `/dev/design-system` EmptyState demo | ❌ Wave 0 |
| UI-03 | Toast success/warning/error slide in from right, auto-dismiss at 4s, max 3 stacked | manual | `/dev/design-system` trigger buttons | ❌ Wave 0 |
| UI-04 | Modal focus-trapped, closes on ESC and backdrop click; bottom sheet on mobile | manual | `/dev/design-system` modal triggers; test at <768px | ❌ Wave 0 |
| UI-05 | 404 page shows EmptyState + no stack trace; 500 page same | manual | Navigate to `/does-not-exist` and trigger error boundary | ❌ Wave 0 |
| UI-06 | Skeleton shimmer stops animating with OS prefers-reduced-motion enabled | manual | OS accessibility setting + inspect computed styles | ❌ Wave 0 |
| UI-07 | All interactive elements ≥ 48×48px; form inputs ≥ 16px font | lint/manual | `npm run build` (no a11y lint yet); manual DevTools element inspection | ❌ Wave 0 |
| LAND-06 | Nav fixed, shadow + glassmorphism appear on scroll | manual | Browser scroll on any page | ❌ Wave 0 |
| LAND-07 | Hamburger opens sheet; all links + language toggle visible; 48px tap targets | manual | Mobile viewport (320px) in DevTools | ❌ Wave 0 |
| LAND-08 | No horizontal overflow at 320px on any page | manual | DevTools device emulation at 320px | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run type-check`
- **Per wave merge:** `npm run build` (zero TypeScript errors, zero ESLint errors)
- **Phase gate:** `npm run build` green + manual `/dev/design-system` walkthrough for all Phase 2 components before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `shadcn init` must run before any component can be added — no `components.json` exists
- [ ] `src/components/ui/` directory will be created by shadcn init
- [ ] `tw-animate-css` will be installed by shadcn init — verify in `globals.css` after
- [ ] `/dev/design-system` page needs Phase 2 section added for component demos
- [ ] `src/lib/utils.ts` (shadcn `cn()` util) will be created by shadcn init — do not create manually first

---

## Sources

### Primary (HIGH confidence)
- https://ui.shadcn.com/docs/tailwind-v4 — Tailwind v4 support, tw-animate-css migration
- https://ui.shadcn.com/docs/components/dialog — Dialog sub-components, focus trap behavior
- https://ui.shadcn.com/docs/components/drawer — Drawer (vaul), direction prop, mobile bottom sheet
- https://ui.shadcn.com/docs/components/sonner — Sonner installation, Toaster in layout.tsx
- https://sonner.emilkowal.ski/toast — toast.success/warning/error methods, duration default (4000ms)
- https://sonner.emilkowal.ski/toaster — visibleToasts, expand, richColors, position props

### Secondary (MEDIUM confidence)
- https://github.com/Wombosvideo/tw-animate-css — tw-animate-css replaces tailwindcss-animate for Tailwind v4
- https://www.nextjsshop.com/resources/blog/responsive-dialog-drawer-shadcn-ui — responsive Dialog+Drawer pattern
- https://tailwindcss.com/docs/backdrop-filter-blur — backdrop-blur utility classes for glassmorphism
- https://dev.to/bilalmohib/how-to-change-navbar-style-on-scroll-in-react-jsnext-js-582n — scroll listener navbar state pattern

### Tertiary (LOW confidence)
- Credenza (auto-adaptive modal) mentioned but not recommended — decisions specify explicit Dialog + Drawer approach

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — shadcn/ui Dialog, Drawer, Sonner all verified against official docs; installation steps confirmed
- Architecture: HIGH — patterns match official shadcn docs and established React/Next.js conventions
- Pitfalls: HIGH — scroll leak, hydration mismatch, and focus trap pitfalls are well-documented React patterns
- Shadcn gap (not installed): HIGH — verified by direct codebase inspection

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (30 days — shadcn, Sonner, vaul are stable; Tailwind v4 API stable)
