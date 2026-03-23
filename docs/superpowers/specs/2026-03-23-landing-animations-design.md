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

## Accessibility

Wrap the app root (e.g. `src/app/layout.tsx`) in `<MotionConfig reducedMotion="user">` from `motion/react`. This automatically collapses all `motion` animations to instant when the OS `prefers-reduced-motion` setting is enabled — covering both `SectionReveal` elements and bare `motion.div` stagger children without requiring per-component hooks.

`SectionReveal` additionally uses `useReducedMotion()` to set `transition: { duration: 0 }` as a fallback for its own `transition` prop override, keeping its explicit timing logic correct in all cases.

---

## Shared Animation Infrastructure

### `src/lib/animations.ts` — shared Motion variants

```ts
import type { Variants } from "motion/react";

// Leaf variants contain no `transition` key — timing is owned by the consumer.
// Exception: staggerContainer uses `transition.staggerChildren` which Motion reads
// exclusively from the variant (not from the top-level transition prop).
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }, // orchestration only, no easing here
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};
```

Leaf variants (`fadeUp`, `fadeIn`, `scaleUp`) contain **no `transition` key** — all easing/duration is owned by the consumer to prevent Motion's top-level `transition` prop from silently overriding variant-level values. `staggerContainer` is the sole exception: its `transition` carries only the orchestration key `staggerChildren`, never easing or duration.

### `src/components/ui/SectionReveal.tsx` — scroll reveal wrapper

`SectionReveal` is a thin wrapper for **single atomic elements** (one badge, one headline, one paragraph). It fires `whileInView` once and owns all transition configuration, including `prefers-reduced-motion`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

interface Props {
  children: React.ReactNode;
  variants: Variants;
  delay?: number;
  duration?: number;
  className?: string;
}

export function SectionReveal({
  children,
  variants,
  delay = 0,
  duration = 0.4,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={
        reducedMotion ? { duration: 0 } : { delay, duration, ease: "easeOut" }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

For stagger contexts, the parent `motion.div` must own `initial`, `whileInView`, and `viewport`. Each child supplies its own `transition`. Complete example:

```tsx
// Parent — owns scroll trigger + stagger orchestration
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item) => (
    // Child — owns easing/duration via inline transition
    <motion.div
      key={item.id}
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Important distinction:** `SectionReveal` is for individual block elements only. For staggered lists (feature items, cards), use a `motion.div` with `staggerContainer` as the parent and `motion.div` + `fadeUp` on each child directly — do not nest `SectionReveal` inside a stagger parent.

---

## Section-by-Section Plan

### 1. Hero — `HeroLight.tsx` and `HeroDark.tsx`

Both files are separate and both need the same mount animations applied. The `dark` prop mechanism does not apply here.

All elements animate **on mount** (not on scroll — the hero is above the fold). Use `motion.div` with `initial` / `animate` and `transition: { delay }`.

| Element | Animation | Delay |
|---|---|---|
| Badge | fade down (y: -12 → 0, opacity 0→1) | 0ms |
| Headline line 1 | fade up | 100ms |
| Headline line 2 (blue) | fade up | 200ms |
| Subtitle | fade up | 300ms |
| CTA button 1 | fade up | 400ms |
| CTA button 2 | fade up | 480ms |
| Tabs row | fade in | 550ms |
| Dashboard image container | fade up + scale 0.97→1 | 650ms |

**Dashboard skeleton:**
- Add `const [loaded, setLoaded] = useState(false)` to the component
- Show a pulsing `animate-pulse bg-slate-100 rounded-xl` div (same size as the image container) when `!loaded`
- Pass `onLoad={() => setLoaded(true)}` directly as an inline callback on `<Image>` — do **not** wrap in `useCallback` (React Compiler is active)
- Remove the `priority` prop from `<Image>` in the animated version. `priority` causes Next.js to preload the image before hydration, which makes `onLoad` fire before the skeleton renders — causing an invisible flash. The skeleton itself serves as the loading indicator, so `priority` is redundant here.

### 2. TrustBar (`TrustBar.tsx`)

Replace the static flex row with a CSS infinite marquee.

**Implementation:**
- Add `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` to `globals.css`
- Render the `companies` array **twice** side by side so the loop wraps seamlessly
- The outer `section` gets the Tailwind `group` class
- The inner scrolling `div` gets `[animation:marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]`

**Dark mode color fix:** The current component hardcodes `color: "#2A4060"` on logo spans regardless of the `dark` prop. Update the span color to use the `dark` prop: `#4A6080` when dark, `#2A4060` when light.

### 3. All Scroll Sections

Applies to: `ProblemSection`, `SolutionSection`, `FeaturesSection`, `CrismaScoreSection`, `AntiFraudSection`, `TestLibrarySection`, `ContactSection`.

Pattern per section using `SectionReveal` for individual elements:
- **Badge** → `SectionReveal` with `fadeIn`
- **Headline** → `SectionReveal` with `fadeUp`, delay 0.1s
- **Body text** → `SectionReveal` with `fadeUp`, delay 0.15s
- **List items / cards** → parent `motion.div` with `staggerContainer` + `whileInView` + `viewport={{ once: true }}`; each child is a `motion.div` with `fadeUp` variant directly (not `SectionReveal`)

### 4. FAQ Section (`FaqSection.tsx`)

**Two separate animation concerns:**

**4a. Outer shell (badge + headline):** Apply the same `SectionReveal` pattern as all other scroll sections (badge `fadeIn`, headline `fadeUp` with 0.1s delay).

**4b. Accordion open/close:** The current component has no open/closed state. Add:
- `const [openIndex, setOpenIndex] = useState<number | null>(null)`
- Toggle: clicking a question sets `openIndex` to its index, or `null` if already open
- Wrap each answer in `<AnimatePresence>` and conditionally render a `<motion.div>` with `initial={{ height: 0, opacity: 0 }}` / `animate={{ height: "auto", opacity: 1 }}` / `exit={{ height: 0, opacity: 0 }}` / `transition={{ duration: 0.25, ease: "easeInOut" }}`

### 5. CTA Banner (`CtaBanner.tsx`)

- Headline → `SectionReveal` with `fadeUp` on viewport enter
- Subtext → `SectionReveal` with `fadeUp`, delay 0.1s
- Button row → parent `motion.div` with `staggerContainer`; each button is `motion.div` + `fadeUp`

### 6. Button States (global — all CTAs)

Applied directly via Tailwind on every `<a>` / `<button>` CTA. Replace any existing `transition-colors` with `transition-all` (broader, covers scale + shadow + color):

| Variant | Classes |
|---|---|
| Primary blue | `hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200` |
| Secondary outlined | `hover:opacity-80 active:scale-[0.97] transition-all duration-150` |

Note: existing `transition-colors` must be **replaced** (not appended) with `transition-all` to avoid specificity conflicts.

---

## File Changes Summary

| File | Change |
|---|---|
| `src/lib/animations.ts` | New — shared Motion variants |
| `src/components/ui/SectionReveal.tsx` | New — scroll reveal wrapper with reduced-motion support |
| `src/app/globals.css` | Add `@keyframes marquee` |
| `src/components/home/HeroLight.tsx` | Mount animations + image skeleton (remove `priority`) |
| `src/components/home/HeroDark.tsx` | Same mount animations as HeroLight (separate file) |
| `src/components/home/TrustBar.tsx` | Marquee scroll + dark mode color fix |
| `src/components/home/FaqSection.tsx` | Add open/close state + AnimatePresence accordion + outer shell reveal |
| `src/components/home/CtaBanner.tsx` | Scroll reveal + button states |
| `src/components/home/FeaturesSection.tsx` | Scroll reveal + stagger list |
| `src/components/home/ProblemSection.tsx` | Scroll reveal |
| `src/components/home/SolutionSection.tsx` | Scroll reveal |
| `src/components/home/CrismaScoreSection.tsx` | Scroll reveal |
| `src/components/home/AntiFraudSection.tsx` | Scroll reveal |
| `src/components/home/TestLibrarySection.tsx` | Scroll reveal |
| `src/components/home/ContactSection.tsx` | Scroll reveal |
| All CTA buttons (all files above) | Replace `transition-colors` → `transition-all` + hover/active scale |

---

## Constraints

- `viewport={{ once: true }}` on all scroll animations — no re-triggering on scroll back up
- `prefers-reduced-motion`: use `useReducedMotion()` in `SectionReveal`; set `transition: { duration: 0 }` when true
- React Compiler is active — no `useMemo`/`useCallback`; all callbacks must be plain inline functions
- No animation on `Footer` — it is purely informational
- All components that accept a `dark` prop continue to work correctly with animations applied
