# Landing Page Animations — Design Spec

**Date:** 2026-03-23
**Style:** Polished & Dynamic
**Library:** `motion/react` v12 (already installed) + Tailwind CSS hover utilities

---

## Goals

- Make the static landing page feel alive and modern without distracting from content
- Reinforce trust and professionalism through smooth, well-timed motion
- Add interactive feedback on all buttons and links
- Implement a marquee TrustBar and skeleton loader for the hero dashboard image

---

## Shared Animation Infrastructure

Create `src/lib/animations.ts` with reusable Motion variants:

```ts
// Fade up (used by most sections)
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Fade in (no Y movement)
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Stagger container
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// Scale up (for hero image)
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
}
```

A shared `<SectionReveal>` wrapper component (`src/components/ui/SectionReveal.tsx`) wraps any child with `whileInView` + `viewport={{ once: true }}` so scroll animations only fire once.

---

## Section-by-Section Plan

### 1. Hero (`HeroLight.tsx`)

All elements animate on mount (not scroll — hero is above the fold).

| Element | Animation | Delay |
|---|---|---|
| Badge | fade down (y: -12 → 0) | 0ms |
| Headline line 1 | fade up | 100ms |
| Headline line 2 (blue) | fade up | 200ms |
| Subtitle | fade up | 300ms |
| CTA button 1 | fade up | 400ms |
| CTA button 2 | fade up | 480ms |
| Tabs row | fade in | 550ms |
| Dashboard image | fade up + scale 0.97→1 | 650ms |

**Dashboard skeleton:** Show a pulsing `animate-pulse` gray rect (`bg-slate-100`) until the `<Image>` `onLoad` fires. Use a local `useState(false)` → `setLoaded(true)` on image load.

### 2. TrustBar (`TrustBar.tsx`)

Replace the static flex row with a CSS infinite marquee:
- Duplicate the logos array so the list wraps seamlessly
- Use a `@keyframes marquee` animation in `globals.css` translating from `0` to `-50%`
- Speed: `30s linear infinite`
- Pause on hover: `animation-play-state: paused` via CSS group hover

### 3. All Scroll Sections

Applies to: `ProblemSection`, `SolutionSection`, `FeaturesSection`, `CrismaScoreSection`, `AntiFraudSection`, `TestLibrarySection`, `ContactSection`, `CtaBanner`

Pattern per section:
- **Badge** → `fadeIn`, viewport trigger
- **Headline** → `fadeUp`, delay 0.1s after badge
- **Body text** → `fadeUp`, delay 0.15s
- **List items / cards** → wrapped in `staggerContainer`, each child uses `fadeUp`

### 4. Button States (global)

Applied directly via Tailwind classes on every `<a>` / `<button>` CTA:

| Variant | Classes added |
|---|---|
| Primary blue | `hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200` |
| Secondary outlined | `hover:opacity-80 active:scale-[0.97] transition-all duration-150` |

### 5. FAQ Accordion (`FaqSection.tsx`)

Replace manual show/hide with Motion `AnimatePresence` + animated height:
- Each answer wraps in `<motion.div>` with `initial={{ height: 0, opacity: 0 }}` / `animate={{ height: "auto", opacity: 1 }}`
- `exit={{ height: 0, opacity: 0 }}`
- Duration: 250ms ease

### 6. CTA Banner (`CtaBanner.tsx`)

- Headline → `fadeUp` on viewport enter
- Subtext → `fadeUp`, delay 0.1s
- Buttons → stagger `fadeUp`, delay 0.2s / 0.28s

---

## File Changes Summary

| File | Change |
|---|---|
| `src/lib/animations.ts` | New — shared Motion variants |
| `src/components/ui/SectionReveal.tsx` | New — scroll reveal wrapper |
| `src/app/globals.css` | Add `@keyframes marquee` |
| `src/components/home/HeroLight.tsx` | Mount animations + skeleton |
| `src/components/home/TrustBar.tsx` | Marquee scroll |
| `src/components/home/FaqSection.tsx` | AnimatePresence accordion |
| `src/components/home/CtaBanner.tsx` | Scroll reveal + button states |
| `src/components/home/FeaturesSection.tsx` | Scroll reveal + stagger list |
| `src/components/home/ProblemSection.tsx` | Scroll reveal |
| `src/components/home/SolutionSection.tsx` | Scroll reveal |
| `src/components/home/CrismaScoreSection.tsx` | Scroll reveal |
| `src/components/home/AntiFraudSection.tsx` | Scroll reveal |
| `src/components/home/TestLibrarySection.tsx` | Scroll reveal |
| `src/components/home/ContactSection.tsx` | Scroll reveal |
| All CTA buttons | Tailwind hover/active classes |

---

## Constraints

- `viewport={{ once: true }}` on all scroll animations — no re-triggering on scroll back up
- No animation on `Footer` — it's purely informational
- React Compiler is active — no `useMemo`/`useCallback`; Motion handles its own memoization
- Dark page (`/dark`) shares the same components — all animations work identically
