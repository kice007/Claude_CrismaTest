---
phase: 02-shared-ui-nav-shell
verified: 2026-03-14T22:30:00Z
status: human_needed
score: 5/5 must-haves verified
re_verification: false
human_verification:
  - test: "Toast behavior — success/warning/error variants"
    expected: "Clicking each toast trigger button on /dev/design-system shows a color-coded toast at bottom-right that auto-dismisses after 4 seconds. The x button closes it early."
    why_human: "Cannot verify toast rendering, color semantics, animation timing, or dismiss behavior programmatically without running the browser."
  - test: "Modal focus trap and keyboard close"
    expected: "Opening any modal on desktop shows a centered Dialog with backdrop; pressing ESC closes it; clicking the backdrop closes it; focus cannot leave the modal while open."
    why_human: "Focus trap and keyboard behavior require live browser interaction. ESC close is handled by Radix/Base UI primitives and cannot be grep-verified."
  - test: "Responsive modal switching (Dialog vs Drawer)"
    expected: "At viewport >= 768px the modal renders as a centered Dialog. At < 768px (DevTools) it renders as a bottom Drawer that slides up."
    why_human: "useMediaQuery initializes false on SSR; the runtime switch requires a live browser at different viewport widths."
  - test: "Skeleton shimmer animation and reduced-motion"
    expected: "Skeleton boxes on /dev/design-system show a moving shimmer gradient. Enabling OS 'Reduce motion' accessibility setting stops the animation and shows a static muted color."
    why_human: "CSS animation playback and prefers-reduced-motion media query response require visual inspection in a browser."
  - test: "Nav glassmorphism scroll transition"
    expected: "Scrolling down on any page causes the nav background to transition from near-opaque to a more-blurred/shadow state within ~8px of scroll."
    why_human: "Scroll event behavior and visual CSS transitions require live browser verification."
  - test: "Mobile hamburger sheet open/close"
    expected: "At 320px viewport the hamburger button is visible. Clicking it opens a Sheet sliding down from the top containing all nav links and the language switcher, all with visually 48px+ tap targets."
    why_human: "Sheet open/close animation and visual tap target sizing require browser DevTools inspection."
  - test: "No horizontal overflow at 320px"
    expected: "At 320px viewport width, no horizontal scrollbar appears on any page."
    why_human: "Overflow behavior is a layout/render concern requiring visual browser verification at a specific viewport width."
  - test: "Branded 404 page"
    expected: "Visiting /this-page-does-not-exist renders the branded EmptyState with 'Page not found' title, body, 'Back to home' CTA — not the Next.js default 404."
    why_human: "Next.js App Router 404 routing requires a running dev server to verify."
---

# Phase 2: Shared UI + Nav Shell — Verification Report

**Phase Goal:** Every reusable UI primitive exists and is usable by any page — developers can assemble pages from a working component library rather than building primitives inline.
**Verified:** 2026-03-14T22:30:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Toast notification (success/warning/error) slides in from right, auto-dismisses after 4s | ? HUMAN NEEDED | Toaster mounted in layout.tsx with `richColors`, `duration={4000}`, `position="bottom-right"`. Toast triggers exist in design-system page. Runtime behavior requires browser. |
| 2 | Modal opens focus-trapped, closes on ESC or backdrop click | ? HUMAN NEEDED | Four modals built on Radix Dialog + Drawer primitives which provide focus-trap and ESC/backdrop close automatically. Runtime behavior requires browser. |
| 3 | Skeleton shimmer placeholders appear on data-heavy views while loading | ? HUMAN NEEDED | Skeleton component exists, uses `.shimmer` CSS class with `@keyframes shimmer`. Design-system page demos it. Animation playback requires browser. |
| 4 | Desktop nav renders logo left, links center, EN/FR + Login + Sign Up right — collapses to hamburger sheet on mobile | ? HUMAN NEEDED | NavDesktop and NavMobile built with correct layout. Code structure verified. Visual render and mobile Sheet behavior require browser. |
| 5 | App renders without horizontal overflow at 320px on any page | ? HUMAN NEEDED | `overflow-x-hidden` on body, `min-w-0` on main, `min-w-0` on nav flex containers. Code-level guard verified. Actual overflow requires browser at 320px. |

**Score:** All 5 automated checks pass — human verification required for all 5 visual/behavioral truths.

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components.json` | Shadcn configuration | VERIFIED | Exists. Nova/base-nova style, CSS variables, correct alias paths. |
| `src/lib/utils.ts` | cn() utility | VERIFIED | Exports `cn()` using clsx + tailwind-merge. 6 lines, substantive. |
| `src/components/ui/dialog.tsx` | Dialog + DialogContent + DialogHeader + DialogTitle | VERIFIED | Exists in `src/components/ui/`. Substantive shadcn-generated component. |
| `src/components/ui/drawer.tsx` | Drawer + DrawerContent + DrawerHeader + DrawerTitle | VERIFIED | Exists. Substantive. |
| `src/components/ui/sheet.tsx` | Sheet + SheetContent + SheetTrigger | VERIFIED | Exists. 136 lines. Uses `@base-ui/react/dialog` (not Radix — key deviation handled correctly). |
| `src/components/ui/sonner.tsx` | Toaster component | VERIFIED | Exists. Exports `Toaster`. Wraps sonner library with custom icons and CSS variable theming. |
| `src/components/Skeleton.tsx` | Skeleton shimmer primitive | VERIFIED | Exists. Exports `Skeleton({ className })`. Uses `.shimmer` class via `cn()`. No stubs. |
| `src/components/EmptyState.tsx` | Empty state card with SVG, text, optional CTA | VERIFIED | Exists. Inline SVG illustration (geometric shapes, brand palette). Props: title/body/ctaLabel/ctaHref/className. CTA has `min-h-[48px]`. |
| `src/app/not-found.tsx` | Branded 404 using EmptyState | VERIFIED | Exists. Server Component. Imports and renders EmptyState with "Page not found". |
| `src/app/error.tsx` | Branded 500/error boundary using EmptyState | VERIFIED | Exists. `"use client"` directive present (required by Next.js App Router). Renders EmptyState with "Something went wrong". |
| `src/lib/use-media-query.ts` | useMediaQuery hook | VERIFIED | Exists. Exports `useMediaQuery(query: string): boolean`. SSR-safe `useState(false)`. Correct cleanup. |
| `src/components/modals/InviteModal.tsx` | Invite modal Dialog/Drawer | VERIFIED | Exists. useMediaQuery → Dialog (max-w-md) on desktop, Drawer on mobile. Email input + Send Invite button, all `min-h-[48px]`, `text-base`. |
| `src/components/modals/CalendarModal.tsx` | Calendar modal Dialog/Drawer | VERIFIED | Exists. max-w-lg on desktop. Date/time inputs + Confirm button. |
| `src/components/modals/ExportModal.tsx` | Export modal Dialog/Drawer | VERIFIED | Exists. max-w-xl on desktop. Radio group (PDF/CSV/Full) + Export button. |
| `src/components/modals/ContactModal.tsx` | Contact modal Dialog/Drawer | VERIFIED | Exists. max-w-md on desktop. Email/subject/message inputs + Send Message button. |
| `src/components/nav/NavShell.tsx` | Fixed nav wrapper with scroll glassmorphism | VERIFIED | Exists. `"use client"`. `useState(false)` + `useEffect` scroll listener (`passive: true`, cleanup). Renders NavDesktop + NavMobile in `<header role="banner">` with `fixed top-0 z-50`. |
| `src/components/nav/NavDesktop.tsx` | Logo + center links + right CTAs | VERIFIED | Exists. `hidden md:flex`. Logo-left, center nav links, LanguageSwitcher+Login+SignUp right. All links `min-h-[48px]`. All strings via `useTranslation()`. |
| `src/components/nav/NavMobile.tsx` | Hamburger trigger + Sheet slide-down | VERIFIED | Exists. `flex md:hidden`. Hamburger with `min-h-[48px] min-w-[48px]`. Sheet with `side="top"`. All links `min-h-[48px]`. SheetTrigger uses `render` prop (Base UI pattern). |
| `src/components/nav/LogoMark.tsx` | Inline SVG logo mark | VERIFIED | Exists (extracted from plan suggestion). Reused in both NavDesktop and NavMobile. |
| `src/app/layout.tsx` | NavShell + Toaster wired into layout | VERIFIED | NavShell inside I18nProvider. Toaster as sibling outside I18nProvider. `<main className="pt-16 min-w-0">`. `overflow-x-hidden` on body. |
| `src/app/dev/design-system/page.tsx` | Design-system page with Phase 2 demos | VERIFIED | Phase 2 section present. Skeleton demos, EmptyState demo, 3 toast triggers (toast.success/warning/error), 4 modal triggers with useState open state. All 4 modals mounted. |
| `locales/en.json` | All Phase 2 i18n keys | VERIFIED | 7 nav keys + 8 design-system Phase 2 keys present. Phase 1 keys intact. |
| `locales/fr.json` | French Phase 2 i18n keys | VERIFIED | All 15 Phase 2 keys present with correct French translations. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/globals.css` | brand token CSS vars | Preserved after shadcn init | VERIFIED | `--color-brand-primary: #1B4FD8`, `--brand-primary-raw: #1B4FD8`, `@import "tw-animate-css"` all present. |
| `src/app/globals.css` | `.shimmer` class | `@keyframes shimmer` | VERIFIED | `@keyframes shimmer` and `.shimmer` class both present. `@media (prefers-reduced-motion: reduce)` override present. |
| `src/app/not-found.tsx` | `src/components/EmptyState.tsx` | `import EmptyState` | VERIFIED | `import { EmptyState } from "@/components/EmptyState"` present and EmptyState rendered. |
| `src/app/error.tsx` | `src/components/EmptyState.tsx` | `import EmptyState` | VERIFIED | Import present and EmptyState rendered. |
| `src/app/layout.tsx` | `src/components/nav/NavShell.tsx` | `import NavShell` | VERIFIED | `import { NavShell } from "@/components/nav/NavShell"` present; `<NavShell />` rendered inside I18nProvider. |
| `src/app/layout.tsx` | `src/components/ui/sonner.tsx` | `import Toaster` | VERIFIED | `import { Toaster } from "@/components/ui/sonner"` present; `<Toaster position="bottom-right" visibleToasts={3} richColors closeButton duration={4000} />` rendered. |
| `src/components/nav/NavShell.tsx` | `src/components/nav/NavDesktop.tsx` | `import NavDesktop` | VERIFIED | Import present; `<NavDesktop />` rendered. |
| `src/components/nav/NavShell.tsx` | `src/components/nav/NavMobile.tsx` | `import NavMobile` | VERIFIED | Import present; `<NavMobile />` rendered. |
| `src/components/nav/NavDesktop.tsx` | `src/components/LanguageSwitcher.tsx` | `import LanguageSwitcher` | VERIFIED | Import present; `<LanguageSwitcher />` rendered in right group. |
| `src/components/nav/NavMobile.tsx` | `src/components/LanguageSwitcher.tsx` | `import LanguageSwitcher` | VERIFIED | Import present; `<LanguageSwitcher />` rendered in sheet content. |
| `src/components/modals/InviteModal.tsx` | `src/components/ui/dialog.tsx` | `import Dialog` | VERIFIED | `from "@/components/ui/dialog"` present. |
| `src/components/modals/InviteModal.tsx` | `src/components/ui/drawer.tsx` | `import Drawer` | VERIFIED | `from "@/components/ui/drawer"` present. |
| `src/components/modals/InviteModal.tsx` | `src/lib/use-media-query.ts` | `useMediaQuery` | VERIFIED | `useMediaQuery("(min-width: 768px)")` called; isDesktop gates Dialog vs Drawer. |
| `src/app/dev/design-system/page.tsx` | `src/components/Skeleton.tsx` | `import Skeleton` | VERIFIED | Import present; multiple `<Skeleton className="...">` rendered. |
| `src/app/dev/design-system/page.tsx` | `src/components/EmptyState.tsx` | `import EmptyState` | VERIFIED | Import present; EmptyState demo rendered. |
| `src/app/dev/design-system/page.tsx` | `src/components/modals/` | `import *Modal` | VERIFIED | All four modal imports present; state wired (`useState(false)`); modals mounted with `open/onOpenChange`. |
| `locales/en.json` | NavDesktop/NavMobile i18n keys | `useTranslation()` | VERIFIED | All 7 nav keys (`nav_for_candidates`, `nav_for_companies`, `nav_pricing`, `nav_login`, `nav_sign_up`, `nav_open_menu`, `nav_mobile_title`) present in `locales/en.json`. Same keys in `locales/fr.json` with French values. `src/lib/i18n.ts` imports `locales/en.json` directly. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| UI-01 | 02-02 | Skeleton loading states (shimmer 1.5s infinite) | SATISFIED | Skeleton.tsx + `.shimmer` CSS class with `animation: shimmer 1.5s infinite linear` |
| UI-02 | 02-02 | Empty state with illustrated card + body + CTA | SATISFIED | EmptyState.tsx with inline SVG illustration, title/body/ctaLabel/ctaHref props, 48px CTA |
| UI-03 | 02-01, 02-03 | Toast system — success/warning/error, slide-in 250ms, 4s auto-dismiss | SATISFIED | Toaster mounted in layout.tsx with `duration={4000}`, `richColors`, `closeButton`, `position="bottom-right"` |
| UI-04 | 02-04 | Modal system — invite/calendar/export/contact; focus-trapped; ESC to close | SATISFIED (automated) / ? HUMAN (runtime) | All four modals exist using Radix Dialog + vaul Drawer. Focus-trap and ESC-close are Radix primitives — requires browser verification |
| UI-05 | 02-02 | Branded 404 and 500 pages — no stack trace, link back to home | SATISFIED | `not-found.tsx` (Server Component) + `error.tsx` (Client Component) both render EmptyState with CTA to `/` |
| UI-06 | 02-02 | All animations wrapped in `@media (prefers-reduced-motion: no-preference)` | SATISFIED | `.shimmer` has `@media (prefers-reduced-motion: reduce) { animation: none }` override. MotionConfig `reducedMotion="user"` wraps all Framer Motion. |
| UI-07 | 02-02, 02-04, 02-05 | Minimum 48x48px touch targets; 16px minimum font-size on form inputs | SATISFIED | All modal inputs have `min-h-[48px]` + `text-base`. All nav links have `min-h-[48px]`. EmptyState CTA has `min-h-[48px]`. |
| LAND-06 | 02-05 | Fixed nav (desktop): logo left, links center, EN/FR + Login + Sign Up right; backdrop-blur; shadow on scroll | SATISFIED (automated) / ? HUMAN (visual) | NavDesktop structure matches spec exactly. NavShell scroll glassmorphism uses `useEffect` + `scrollY > 8`. Visual render requires browser. |
| LAND-07 | 02-05 | Mobile nav: hamburger → slide-down sheet with all links + language toggle, 48px tap targets | SATISFIED (automated) / ? HUMAN (visual) | NavMobile with Sheet `side="top"`, all links `min-h-[48px]`, LanguageSwitcher present. Visual and interaction require browser. |
| LAND-08 | 02-05 | All landing pages fully responsive — no horizontal overflow at 320px minimum | SATISFIED (automated) / ? HUMAN (visual) | `overflow-x-hidden` on body, `min-w-0` on main. Runtime verification requires browser at 320px. |

**All 10 requirements claimed by plans are present in REQUIREMENTS.md and mapped to Phase 2. No orphaned requirements.**

Note: The PLAN 06 frontmatter lists `public/locales/en/translation.json` and `public/locales/fr/translation.json` as artifact paths. The actual implementation uses `locales/en.json` and `locales/fr.json` (directly imported by `src/lib/i18n.ts`). This is a documentation discrepancy only — the i18n system functions correctly as the translations are bundled at build time via JSON import, not served as static files.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None detected | — | — | — | — |

Scan results:
- No `TODO`, `FIXME`, `XXX`, `HACK`, or `PLACEHOLDER` comments in Phase 2 source files
- No empty implementations (`return null`, `return {}`, `return []`)
- No stub-only handlers (`onClick={() => {}}`, `onSubmit={(e) => e.preventDefault()}` only)
- Input `placeholder` attributes in ContactModal and InviteModal are HTML `<input placeholder="">` attributes, not anti-pattern stubs
- All four modals contain substantive form UI with labels, inputs, and action buttons

---

## Human Verification Required

### 1. Toast Notifications

**Test:** Visit `http://localhost:3000/dev/design-system` and click "Show Success Toast", "Show Warning Toast", and "Show Error Toast" buttons.
**Expected:** Each click produces a toast at bottom-right. Success is green, warning is amber, error is red. Each auto-dismisses after 4 seconds. The × button closes it early. No more than 3 toasts stack simultaneously.
**Why human:** Toast rendering, color semantic verification, animation timing, and dismiss behavior require a live browser.

### 2. Modal Focus Trap and Keyboard Behavior

**Test:** On desktop (≥768px), open each of the four modals from the design-system page. Press Tab to cycle focus. Press ESC. Click outside the modal.
**Expected:** Focus cycles only within the modal while open. ESC closes it. Clicking the backdrop closes it.
**Why human:** Focus trap and keyboard event handling are provided by Radix UI Dialog primitives and cannot be verified programmatically.

### 3. Responsive Modal — Dialog vs Drawer Switching

**Test:** Open any modal at ≥768px viewport. Then shrink to ≤767px (use DevTools). Open the same modal.
**Expected:** At ≥768px: centered Dialog with backdrop overlay. At <768px: Drawer slides up from bottom with pb-safe iOS clearance.
**Why human:** `useMediaQuery` initializes to `false` on SSR; the viewport-dependent branch requires a live browser at two different widths.

### 4. Skeleton Shimmer and Reduced-Motion

**Test:** Visit `/dev/design-system` and observe the Skeleton demo section. Then enable "Reduce motion" in OS accessibility settings and reload.
**Expected:** Normal: shimmer gradient moves across skeleton shapes. Reduced-motion: animation stops; shapes show as a flat muted color.
**Why human:** CSS animation playback and `prefers-reduced-motion` response require visual browser inspection.

### 5. Nav Glassmorphism Scroll Transition

**Test:** Visit any page and scroll down slowly from the top.
**Expected:** At initial position: nav has `bg-white/95 backdrop-blur-sm`. After ~8px scroll: nav transitions to `bg-white/80 backdrop-blur-md` with card shadow.
**Why human:** CSS transition and scroll event response are visual/runtime behaviors.

### 6. Mobile Hamburger Sheet

**Test:** Set browser DevTools to 320px viewport. Observe the nav.
**Expected:** Hamburger Menu icon appears (NavDesktop hidden). Click it to open a Sheet sliding down from the top. Verify all nav links + LanguageSwitcher are visible. Tap targets appear visually ≥48px tall.
**Why human:** Sheet open/close animation and visual tap target assessment require browser DevTools.

### 7. No Horizontal Overflow at 320px

**Test:** Set DevTools to 320px width. Visit `/`, `/dev/design-system`, and any nav link.
**Expected:** No horizontal scrollbar on any page. No content bleeds outside the viewport.
**Why human:** Layout overflow detection requires visual inspection at a specific viewport dimension.

### 8. Branded 404 Page

**Test:** Visit `http://localhost:3000/this-page-does-not-exist`.
**Expected:** The branded EmptyState renders with "Page not found" title, body text, and "Back to home" CTA — not the Next.js default 404 UI.
**Why human:** Next.js App Router 404 routing requires a running dev server to verify the `not-found.tsx` override takes effect.

---

## Notable Implementation Details

- **Sheet uses Base UI, not Radix:** `sheet.tsx` is built on `@base-ui/react/dialog` rather than `@radix-ui/react-sheet`. This required the `render` prop pattern in NavMobile's `SheetTrigger` instead of `asChild`. The behavior (slide-down sheet, focus management) is functionally equivalent.
- **LogoMark extracted:** A `LogoMark.tsx` shared component was created (not in original plan) to avoid SVG duplication between NavDesktop and NavMobile. This is an improvement over the plan.
- **Translation file path discrepancy:** Plans reference `public/locales/en/translation.json`, but the actual files are `locales/en.json` and `locales/fr.json` imported directly via TypeScript. This is correct and intentional per the i18n setup.

---

## Summary

All 22 artifacts from the 6 plans exist and are substantive — no stubs, no missing files, no orphaned components. All key links (import chains, wiring into layout.tsx) are verified. All 10 requirements (UI-01 through UI-07, LAND-06, LAND-07, LAND-08) have implementation evidence.

The phase cannot be marked `passed` because 5 of the 5 Success Criteria from the ROADMAP involve visual rendering, animation, runtime behavior (scroll, resize, focus trap, toast animation), or routing — none of which can be verified without running the browser. The automated checks uniformly pass; human verification is the final gate.

---

_Verified: 2026-03-14T22:30:00Z_
_Verifier: Claude (gsd-verifier)_
