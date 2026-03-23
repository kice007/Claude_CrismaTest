# Landing Page Animations Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add polished, dynamic animations to the CrismaTest landing page — mount sequences on hero sections, scroll reveals on all content sections, a marquee TrustBar, animated FAQ accordion, and hover/active button states.

**Architecture:** A shared `animations.ts` defines Motion variants (no transition keys — timing owned by consumers). A `SectionReveal` client component wraps individual elements for `whileInView` scroll triggers. Hero sections use `motion.div` with `initial/animate` for mount animations. TrustBar uses CSS `@keyframes marquee`. FAQ gets `AnimatePresence` + `useState`. All CTAs get Tailwind hover/active scale classes.

**Tech Stack:** `motion/react` v12, Tailwind CSS v4, Next.js 16 App Router, React 19 (React Compiler active — **no `useMemo`/`useCallback`**, all event handlers must be plain inline functions)

**Pre-conditions (already done — no tasks needed):**
- `src/app/layout.tsx` already wraps the app in `<MotionConfig reducedMotion="user">` — accessibility is handled globally
- `src/app/globals.css` already has `@keyframes shimmer` for the skeleton pulse
- `src/app/globals.css` already has `@keyframes marquee` — but the value is wrong and is fixed in Task 3

---

## Chunk 1: Foundation

### Task 1: Create shared animation variants

**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Create `src/lib/animations.ts`** with the following content:

```ts
import type { Variants } from "motion/react";

// Leaf variants contain NO `transition` key — timing is owned by consumers
// (SectionReveal prop or inline `transition` on motion.div children).
// This prevents Motion's top-level `transition` prop from silently overriding variant values.
//
// Exception: staggerContainer carries `staggerChildren` which Motion reads
// exclusively from the variant's transition key (not from the element's transition prop).

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
  visible: { transition: { staggerChildren: 0.08 } }, // orchestration only
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};
```

- [ ] **Commit:**

```bash
git add src/lib/animations.ts
git commit -m "feat(animations): add shared Motion variant definitions"
```

---

### Task 2: Create SectionReveal component

**Files:**
- Create: `src/components/ui/SectionReveal.tsx`

- [ ] **Create `src/components/ui/SectionReveal.tsx`:**

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

/**
 * Wraps a single element with a whileInView scroll reveal.
 * Fires once (viewport={{ once: true }}), owns all transition timing.
 * useReducedMotion() collapses the animation to instant when OS reduced-motion is on.
 *
 * Use this for individual atoms: badge, headline, paragraph, button row.
 * Do NOT use inside a staggerContainer — use motion.div with variants directly there.
 */
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

- [ ] **Commit:**

```bash
git add src/components/ui/SectionReveal.tsx
git commit -m "feat(animations): add SectionReveal scroll-reveal wrapper component"
```

---

### Task 3: Fix globals.css marquee keyframe

**Files:**
- Modify: `src/app/globals.css`

The existing `@keyframes marquee` uses `translateX(-100%)` which would scroll the entire duplicated track out of view. With a duplicated logo array (2x logos side-by-side), `-50%` is correct — it translates exactly one set of logos, reaching the seamless loop point.

- [ ] **In `src/app/globals.css`, find and update the marquee keyframe:**

Change:
```css
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```

To:
```css
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

- [ ] **Commit:**

```bash
git add src/app/globals.css
git commit -m "fix(animations): correct marquee keyframe to -50% for duplicated logo loop"
```

---

## Chunk 2: Hero Sections + TrustBar

### Task 4: Animate HeroLight

**Files:**
- Modify: `src/components/home/HeroLight.tsx`

Add `"use client"` (needs `useState` for skeleton + `motion` for animations). Remove `priority` from `<Image>` (prevents onLoad racing the skeleton render).

- [ ] **Replace `src/components/home/HeroLight.tsx` with:**

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, Users, ClipboardList, Star } from "lucide-react";

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Candidates", active: false },
  { icon: ClipboardList, label: "Tests", active: false },
  { icon: Star, label: "Talent Pool", active: false },
];

export function HeroLight() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="w-full bg-white flex flex-col items-center gap-8 px-[120px] pt-20 pb-15">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]"
      >
        <div className="w-2 h-2 rounded bg-[#2563EB]" />
        <span className="text-[12px] font-medium text-[#1D4ED8]">AI Assessment platform</span>
      </motion.div>

      {/* Headline */}
      <div className="flex flex-col items-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="text-[56px] font-extrabold text-[#0F172A] text-center leading-[1.1] tracking-[-1.5px] max-w-[780px]"
        >
          The global standard
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="text-[56px] font-extrabold text-[#2563EB] text-center leading-[1.1] tracking-[-1.5px] max-w-[780px]"
        >
          for talent assessment
        </motion.h1>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        className="text-[18px] text-[#64748B] text-center leading-[1.6] max-w-[600px]"
      >
        AI-powered. Adaptive. Fraud-proof. Verified. The smartest way to evaluate candidates — and
        prove your skills to the world. One test. One score. Unlimited opportunities.
      </motion.p>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          href="/sign-up"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2563EB] text-white text-[15px] font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200 border-[1.5px] border-[#2563EB]"
        >
          Start a test <ArrowRight size={16} />
        </motion.a>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.48 }}
          href="#features"
          className="px-7 py-3.5 rounded-full bg-white text-[#334155] text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150 border-[1.5px] border-[#E2E8F0]"
        >
          For companies
        </motion.a>
      </div>

      {/* Tabs row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
        className="flex items-center justify-center border-b border-[#E2E8F0] w-full"
      >
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`flex items-center gap-1.5 px-6 py-4 text-[14px] cursor-pointer transition-colors ${
              tab.active
                ? "text-[#2563EB] font-semibold border-b-2 border-[#2563EB]"
                : "text-[#64748B]"
            }`}
          >
            <tab.icon size={tab.active ? 18 : 14} />
            {tab.label}
          </div>
        ))}
      </motion.div>

      {/* Dashboard image + skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="w-full rounded-xl overflow-hidden border border-[#E2E8F0] relative"
        style={{ height: 743 }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-100 rounded-xl" />
        )}
        <Image
          src="/images/dashboard.png"
          alt="CrismaTest dashboard"
          fill
          className="object-cover"
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/HeroLight.tsx
git commit -m "feat(animations): animate HeroLight — mount sequence + image skeleton"
```

---

### Task 5: Animate HeroDark

**Files:**
- Modify: `src/components/home/HeroDark.tsx`

Same pattern as HeroLight but for the dark split-layout hero. The 3-line headline is rendered from an array, so we add a `delay` per line. The image is on the right side.

Note on delays: HeroDark has a 3-line headline instead of 2, so the subtitle and CTA delays shift forward by ~0.1s compared to HeroLight (CTA1: 0.5 instead of 0.4, CTA2: 0.58 instead of 0.48). The image stays at 0.65. This is intentional — not a copy-paste error.

- [ ] **Replace `src/components/home/HeroDark.tsx` with:**

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const headlineLines = [
  { text: "The global standard", blue: false, delay: 0.1 },
  { text: "for talent", blue: false, delay: 0.2 },
  { text: "assessment.", blue: true, delay: 0.3 },
];

export function HeroDark() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      className="w-full flex"
      style={{
        height: 680,
        background: "linear-gradient(180deg, #040D1E 0%, #071A38 100%)",
      }}
    >
      {/* Left */}
      <div
        className="flex flex-col justify-center gap-6 shrink-0"
        style={{ width: 563, padding: "80px 0 80px 80px" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="self-start flex items-center gap-2 rounded-full text-[12px] font-medium"
          style={{
            background: "#0C2040",
            border: "1px solid #1E3A5F",
            padding: "6px 12px",
            color: "#60A5FA",
          }}
        >
          AI Assessment platform
          <ArrowUpRight size={14} />
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col w-full">
          {headlineLines.map(({ text, blue, delay }) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay }}
              className="text-[52px] font-extrabold leading-[1.1] tracking-[-1.5px]"
              style={{ color: blue ? "#2563EB" : "#FFFFFF" }}
            >
              {text}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          className="text-[16px] leading-[1.6]"
          style={{ color: "#8FA8C8" }}
        >
          AI-powered. Adaptive. Fraud-proof. Verified. The smartest way to evaluate candidates — and
          prove your skills to the world. One test. One score. Unlimited opportunities.
        </motion.p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            href="/sign-up"
            className="flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "14px 24px" }}
          >
            Start a test <ArrowUpRight size={16} />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.58 }}
            href="#features"
            className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ color: "#8FA8C8", border: "1px solid #1E3A5F", padding: "14px 24px" }}
          >
            For companies
          </motion.a>
        </div>
      </div>

      {/* Right — image + skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="flex-1 flex items-center justify-center"
        style={{ padding: "48px 80px 48px 48px" }}
      >
        <div className="w-full rounded-xl overflow-hidden relative" style={{ height: 460 }}>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-800 rounded-xl" />
          )}
          <Image
            src="/images/dashboard.png"
            alt="CrismaTest dashboard"
            fill
            className="object-cover"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/HeroDark.tsx
git commit -m "feat(animations): animate HeroDark — mount sequence + image skeleton"
```

---

### Task 6: TrustBar marquee + dark mode fix

**Files:**
- Modify: `src/components/home/TrustBar.tsx`

Duplicate the companies array for a seamless loop. The outer `section` gets `group` so the inner track can pause on hover. Fix the hardcoded logo color to respect the `dark` prop.

- [ ] **Replace `src/components/home/TrustBar.tsx` with:**

```tsx
"use client";

const companies = [
  "NexaTech",
  "ZestyBite",
  "CozyNest",
  "Energetix",
  "DigiMinds",
  "VitalFit",
  "Eleganza",
];

// Duplicate for seamless marquee loop
const doubled = [...companies, ...companies];

export function TrustBar({ dark = false }: { dark?: boolean }) {
  return (
    <section
      className="group w-full flex flex-col items-center justify-center gap-5 overflow-hidden"
      style={{
        height: 120,
        background: dark ? "#040D1E" : "#FFFFFF",
        borderTop: `1px solid ${dark ? "#0F2648" : "#F1F5F9"}`,
        borderBottom: `1px solid ${dark ? "#0F2648" : "#F1F5F9"}`,
        padding: "0 80px",
      }}
    >
      <span className="text-[13px] text-center" style={{ color: dark ? "#4A6080" : "#94A3B8" }}>
        Trusted by leading companies worldwide
      </span>

      {/* Marquee track: translate -50% = one full logo set (seamless loop) */}
      <div className="flex w-full overflow-hidden">
        <div className="flex items-center gap-12 [animation:marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[14px] font-semibold tracking-[0.5px] whitespace-nowrap"
              style={{ color: dark ? "#4A6080" : "#2A4060" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/TrustBar.tsx
git commit -m "feat(animations): TrustBar infinite marquee + fix dark mode logo color"
```

---

## Chunk 3: Scroll Sections

### Task 7: Animate ProblemSection

**Files:**
- Modify: `src/components/home/ProblemSection.tsx`

Add `"use client"` (uses `motion.div` directly for stagger). Convert `FeatureCard` to a `motion.div` so it participates in stagger. Wrap left-column text in `SectionReveal`. Wrap card columns in `staggerContainer`.

- [ ] **Replace `src/components/home/ProblemSection.tsx` with:**

```tsx
"use client";
import { type ElementType } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  Zap,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Video,
} from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: BrainCircuit,
    title: "Job-specific skills",
    desc: "Tailored questions matched to the exact role being tested",
  },
  {
    icon: Zap,
    title: "Logic & problem-solving",
    desc: "Evaluate critical thinking and analytical capabilities under pressure",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    desc: "Assess written and verbal clarity, structure, and tone",
  },
  {
    icon: UserCheck,
    title: "Behavioral indicators",
    desc: "Understand work style, motivation, and cultural alignment",
  },
  {
    icon: ShieldCheck,
    title: "Anti-fraud consistency",
    desc: "Advanced AI detection ensures responses are genuine and unassisted",
  },
  {
    icon: Video,
    title: "Video responses (optional)",
    desc: "Optional video questions for deeper candidate insight",
  },
];

function FeatureCard({ icon: Icon, title, desc }: { icon: ElementType; title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-2 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] p-4"
    >
      <Icon size={20} className="text-[#2563EB]" />
      <span className="text-[14px] font-bold text-[#0F172A]">{title}</span>
      <span className="text-[12px] text-[#64748B] leading-[1.5]">{desc}</span>
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" className="w-full bg-white" style={{ padding: 80 }}>
      <div className="flex gap-16 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col justify-center gap-5 shrink-0" style={{ width: 500 }}>
          <SectionReveal variants={fadeIn}>
            <div className="self-start flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
              <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
              <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
                What is CrismaTest?
              </span>
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.1}>
            <h2
              className="text-[36px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-1px]"
              style={{ maxWidth: 460 }}
            >
              The world&apos;s first AI-powered adaptive test designed for real-world hiring.
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.15}>
            <p className="text-[16px] text-[#64748B] leading-[1.6]" style={{ maxWidth: 440 }}>
              CrismaTest isn&apos;t a quiz. It&apos;s a complete evaluation system that measures what
              actually matters — the skills, reasoning, and reliability that make someone great at
              their job.
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.2}>
            <p className="text-[18px] font-bold text-[#0F172A]">All in just 10–15 minutes.</p>
          </SectionReveal>
        </div>

        {/* Right: 2-column staggered feature cards */}
        <div className="flex flex-1 gap-4">
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.slice(0, 3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </motion.div>
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.slice(3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/ProblemSection.tsx
git commit -m "feat(animations): ProblemSection — scroll reveal + stagger feature cards"
```

---

### Task 8: Animate SolutionSection

**Files:**
- Modify: `src/components/home/SolutionSection.tsx`

Left column: `SectionReveal` for badge, headline, subtitle, CTA. Right column: stagger the 3 step cards.

- [ ] **Replace `src/components/home/SolutionSection.tsx` with:**

```tsx
"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const steps = [
  {
    num: "1",
    title: "Take the test",
    desc: "Adaptive, dynamic, and secure. Complete your AI-powered assessment in just 10–15 minutes from any device.",
  },
  {
    num: "2",
    title: "Get your CrismaScore",
    desc: "Receive a universal score from 0–100 measuring your skills and potential — broken down into LogicScore, CommsScore, JobSkillScore, and TrustScore.",
  },
  {
    num: "3",
    title: "Share it everywhere",
    desc: "Use your CrismaScore when applying to jobs anywhere in the world — on CrismaWork, LinkedIn, Indeed, and with any employer worldwide.",
  },
];

export function SolutionSection({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#040D1E" : "#F8FAFC";
  const cardBg = dark ? "#0C1E38" : "#FFFFFF";
  const cardBorder = dark ? "#1E3A5F" : "#e2e8f0";
  const titleColor = dark ? "#FFFFFF" : "#0F172A";
  const descColor = dark ? "#8FA8C8" : "#64748B";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const badgeBg = dark ? "#0C2040" : "#EFF6FF";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563EB";

  return (
    <section id="solution" className="w-full" style={{ background: bg, padding: 80 }}>
      <div className="flex gap-12 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col justify-center gap-6 shrink-0" style={{ width: 480 }}>
          <SectionReveal variants={fadeIn}>
            <div
              className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
            >
              <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
              For candidates
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.1}>
            <h2
              className="text-[40px] font-extrabold leading-[1.15] tracking-[-1px]"
              style={{ color: headlineColor, maxWidth: 440 }}
            >
              3 steps. 10 minutes. One global score.
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.15}>
            <p className="text-[16px] leading-[1.6]" style={{ color: subColor, maxWidth: 400 }}>
              From test to verified score in minutes. Your CrismaScore is portable, universal, and
              trusted by employers worldwide.
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.2}>
            <a
              href="/sign-up"
              className="self-start flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
              style={{ padding: "14px 28px" }}
            >
              Get your CrismaScore <ArrowRight size={16} />
            </a>
          </SectionReveal>
        </div>

        {/* Right: staggered step cards */}
        <motion.div
          className="flex flex-col flex-1 gap-4"
          style={{ paddingLeft: 48 }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-3.5 rounded-xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <span
                className="text-[88px] font-black leading-none opacity-45"
                style={
                  dark
                    ? {
                        background: "linear-gradient(180deg, #D0DFE8 0%, #3D5570 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : { color: "#1d4ed8" }
                }
              >
                {step.num}
              </span>
              <span className="text-[17px] font-bold" style={{ color: titleColor }}>
                {step.title}
              </span>
              <span className="text-[14px] leading-[1.6]" style={{ color: descColor }}>
                {step.desc}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/SolutionSection.tsx
git commit -m "feat(animations): SolutionSection — scroll reveal + stagger step cards"
```

---

### Task 9: Animate FeaturesSection

**Files:**
- Modify: `src/components/home/FeaturesSection.tsx`

Badge + headline + subtitle: `SectionReveal`. The two checklist columns: stagger containers with `motion.div` children for each list item.

- [ ] **Replace `src/components/home/FeaturesSection.tsx` with:**

```tsx
"use client";
import { motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const col1 = [
  "Filter candidates instantly — rank applicants by CrismaScore the moment results come in",
  "Reduce interview time by 70% — only meet pre-qualified candidates who passed your assessment",
  "Eliminate fraud & ChatGPT misuse — AI proctoring detects cheating attempts in real time",
  "Compare candidates objectively — side-by-side score breakdowns remove bias and enable data-driven decisions",
];

const col2 = [
  "Use adaptive job-specific tests — tests automatically adjust based on role requirements",
  "Add optional video questions — assess communication and presence with integrated video modules",
  "Access a global talent pool — browse verified candidates who have completed CrismaTest",
];

export function FeaturesSection({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#040D1E" : "#FFFFFF";
  const badgeBg = dark ? "#0C2040" : "#EFF6FF";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563eb";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const checkColor = dark ? "#60A5FA" : "#2563EB";
  const textColor = dark ? "#E2E8F0" : "#475569";
  const ctaSecondaryStyle = dark
    ? { border: "1px solid #1E3A5F", color: "#8FA8C8" }
    : { border: "1px solid #E2E8F0", color: "#0F172A" };

  return (
    <section
      id="features"
      className="w-full flex flex-col gap-12"
      style={{ background: bg, padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          For companies
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[42px] font-extrabold leading-[1.15] tracking-[-1px]"
          style={{ color: headlineColor }}
        >
          Screen 10x faster. With 90% more accuracy.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] leading-[1.6]" style={{ color: subColor }}>
          Stop spending hours reviewing resumes that don&apos;t tell the full story. CrismaTest gives
          you objective, fraud-proof scores in under 15 minutes — so you can focus on the candidates
          who actually qualify.
        </p>
      </SectionReveal>

      {/* Feature lists — stagger each column independently */}
      <div className="flex gap-12 w-full">
        <motion.div
          className="flex flex-col flex-1 gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col1.map((text) => (
            <motion.div
              key={text}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <CircleCheck
                size={18}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {text}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col flex-1 gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col2.map((text) => (
            <motion.div
              key={text}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <CircleCheck
                size={18}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTAs */}
      <motion.div
        className="flex items-center gap-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="/sign-up"
          className="flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
          style={{ padding: "14px 24px" }}
        >
          {dark ? "Try CrismaTest for Teams" : "Try CrismaTest for teams"}
        </motion.a>
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="#contact"
          className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
          style={{ padding: "14px 24px", ...ctaSecondaryStyle }}
        >
          {dark ? "Request a Demo" : "Request a demo"}
        </motion.a>
      </motion.div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/FeaturesSection.tsx
git commit -m "feat(animations): FeaturesSection — scroll reveal + stagger checklist items"
```

---

### Task 10: Animate CrismaScoreSection

**Files:**
- Modify: `src/components/home/CrismaScoreSection.tsx`

Badge + headline + subtitle: `SectionReveal`. Row 1 cards (3 items): stagger container. Row 2 cards (2 items): stagger container. Footer tagline: `SectionReveal`.

- [ ] **Replace `src/components/home/CrismaScoreSection.tsx` with:**

```tsx
"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const row1 = [
  {
    key: "logic",
    title: "Logic score",
    desc: "Reasoning ability, pattern recognition, and analytical problem-solving",
    img: "/images/scores/logic.png",
  },
  {
    key: "comm",
    title: "Communication score",
    desc: "Written and verbal clarity, analysis, tone, and persuasiveness",
    img: "/images/scores/communication.png",
  },
  {
    key: "job",
    title: "Job skill score",
    desc: "Role-specific technical and practical AI-readiness",
    img: "/images/scores/jobskill.png",
  },
];

export function CrismaScoreSection() {
  return (
    <section
      id="crismascore"
      className="w-full bg-white flex flex-col items-center gap-10"
      style={{ padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
            The CrismaScore
          </span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px] max-w-[800px]">
          A single, universal score that companies trust.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[640px]">
          CrismaScore is not just a number. It&apos;s a verified, portable, AI-generated profile of a
          candidate&apos;s real capabilities — built from five dimensions of evaluation.
        </p>
      </SectionReveal>

      {/* Score cards */}
      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1264 }}>
        {/* Row 1: 3 cards — stagger */}
        <motion.div
          className="flex gap-4 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {row1.map((score) => (
            <motion.div
              key={score.key}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
            >
              <div className="relative w-full" style={{ height: 220 }}>
                <Image src={score.img} alt={score.title} fill className="object-contain p-4" />
              </div>
              <div className="flex flex-col gap-2 px-5 py-4">
                <span className="text-[15px] font-bold text-[#1E293B]">{score.title}</span>
                <span className="text-[12px] text-[#64748B]">{score.desc}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 2: 2 cards — stagger */}
        <motion.div
          className="flex gap-4 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
            style={{ flex: 2 }}
          >
            <div className="relative w-full" style={{ height: 260 }}>
              <Image
                src="/images/scores/trust.png"
                alt="Trust score"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              <span className="text-[15px] font-bold text-[#1E293B]">Trust score</span>
              <span className="text-[12px] text-[#64748B]">
                Anti-fraud stability — consistency, behavioral patterns, and AI-verified authenticity
              </span>
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
          >
            <div className="relative w-full" style={{ height: 260 }}>
              <Image
                src="/images/scores/video.png"
                alt="Video score"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              <span className="text-[15px] font-bold text-[#1E293B]">Video score (optional)</span>
              <span className="text-[12px] text-[#64748B]">
                Communication clarity, presence, and clarity from video responses
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p className="text-[14px] italic text-[#94A3B8] text-center">
          One test. One score. Trusted by recruiters worldwide.
        </p>
      </SectionReveal>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/CrismaScoreSection.tsx
git commit -m "feat(animations): CrismaScoreSection — scroll reveal + stagger score cards"
```

---

### Task 11: Animate AntiFraudSection

**Files:**
- Modify: `src/components/home/AntiFraudSection.tsx`

Badge + headline + subtitle + footer: `SectionReveal`. Detection cards (2 rows of 3): each row is a stagger container.

- [ ] **Replace `src/components/home/AntiFraudSection.tsx` with:**

```tsx
"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const detections = [
  { img: "/images/antifraud/faces.png", label: "Multiple faces detected" },
  { img: "/images/antifraud/eye_off.png", label: "Looking away from screen" },
  { img: "/images/antifraud/windows.png", label: "Multiple tabs or windows" },
  { img: "/images/antifraud/keyboard.png", label: "Unusual typing or input patterns" },
  { img: "/images/antifraud/clipboard.png", label: "Copy/paste anomalies" },
  { img: "/images/antifraud/assist.png", label: "Signs of external assistance" },
];

function DetectionCard({
  img,
  label,
  dark,
}: {
  img: string;
  label: string;
  dark: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex items-center gap-2.5 rounded-lg"
      style={{
        background: dark ? "#0C1E38" : "rgba(255,255,255,0.7)",
        border: `1px solid ${dark ? "#1E3A5F" : "#BFDBFE"}`,
        padding: "14px 16px",
      }}
    >
      <Image src={img} alt={label} width={16} height={16} className="shrink-0" />
      <span
        className="text-[13px] font-medium"
        style={{ color: dark ? "#E2E8F0" : "#374151" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function AntiFraudSection({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#040D1E" : "#EFF6FF";
  const badgeBg = dark ? "#0C2040" : "#DBEAFE";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563EB";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const footerColor = dark ? "#4A6080" : "#64748B";

  return (
    <section
      className="w-full flex flex-col items-center gap-12"
      style={{ background: bg, padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          Anti-Fraud technology
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[42px] font-extrabold text-center leading-[1.15] tracking-[-1px] max-w-[800px]"
          style={{ color: headlineColor }}
        >
          No more cheating. No more uncertainty.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p
          className="text-[16px] text-center leading-[1.6] max-w-[640px]"
          style={{ color: subColor }}
        >
          CrismaTest uses real-time AI proctoring to ensure every score reflects genuine, unassisted
          performance. Every session is monitored, analyzed, and verified — transparently.
        </p>
      </SectionReveal>

      {/* Detection grid: 2 staggered rows of 3 */}
      <div className="flex flex-col gap-3 w-full">
        <motion.div
          className="flex gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detections.slice(0, 3).map((d) => (
            <DetectionCard key={d.label} {...d} dark={!!dark} />
          ))}
        </motion.div>
        <motion.div
          className="flex gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detections.slice(3).map((d) => (
            <DetectionCard key={d.label} {...d} dark={!!dark} />
          ))}
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p
          className="text-[14px] italic text-center max-w-[640px]"
          style={{ color: footerColor }}
        >
          All detected behaviors are flagged transparently in the candidate&apos;s report. No hidden
          penalties — just honest data for better decisions.
        </p>
      </SectionReveal>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/AntiFraudSection.tsx
git commit -m "feat(animations): AntiFraudSection — scroll reveal + stagger detection cards"
```

---

### Task 12: Animate TestLibrarySection

**Files:**
- Modify: `src/components/home/TestLibrarySection.tsx`

Badge + headline + subtitle: `SectionReveal`. Category cards: stagger container. Browse button: `SectionReveal`.

- [ ] **Replace `src/components/home/TestLibrarySection.tsx` with:**

```tsx
"use client";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const categories = [
  {
    dotColor: "#1D4ED8",
    label: "TECHNOLOGY & SUPPORT",
    chips: [
      { text: "Customer support", textColor: "#1D4ED8", bg: "#EFF6FF" },
      { text: "Virtual assistant", textColor: "#1D4ED8", bg: "#EFF6FF" },
      { text: "Software developer", textColor: "#1D4ED8", bg: "#EFF6FF" },
    ],
  },
  {
    dotColor: "#7C3AED",
    label: "BUSINESS & GROWTH",
    chips: [
      { text: "Marketing", textColor: "#7C3AED", bg: "#F5F3FF" },
      { text: "Sales", textColor: "#7C3AED", bg: "#F5F3FF" },
      { text: "Data analysis", textColor: "#7C3AED", bg: "#F5F3FF" },
    ],
  },
  {
    dotColor: "#059669",
    label: "OPERATIONS & FINANCE",
    chips: [
      { text: "Operations", textColor: "#059669", bg: "#ECFDF5" },
      { text: "Finance", textColor: "#059669", bg: "#ECFDF5" },
      {
        text: "More coming soon…",
        textColor: "#94A3B8",
        bg: "#F8FAFC",
        border: "#E2E8F0",
        italic: true,
      },
    ],
  },
] as const;

export function TestLibrarySection() {
  return (
    <section
      id="tests"
      className="w-full bg-[#F8FAFC] flex flex-col items-center gap-10"
      style={{ padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
            Pre-built assessments
          </span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px] max-w-[800px]">
          Role-ready tests for every position.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[620px]">
          Choose from our growing library of job-specific assessments — each designed to evaluate the
          exact skills that matter for that role.
        </p>
      </SectionReveal>

      {/* Category cards — stagger */}
      <motion.div
        className="flex gap-4 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.label}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-4 rounded-xl bg-white border border-[#E2E8F0] p-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded" style={{ background: cat.dotColor }} />
              <span className="text-[11px] font-semibold text-[#64748B] tracking-[0.5px]">
                {cat.label}
              </span>
            </div>
            <div className="h-px bg-[#E2E8F0] w-full" />
            <div className="flex flex-col gap-2">
              {cat.chips.map((chip) => (
                <div
                  key={chip.text}
                  className="self-start px-3 py-1.5 rounded-full"
                  style={{
                    background: chip.bg,
                    border: "border" in chip ? `1px solid ${chip.border}` : undefined,
                  }}
                >
                  <span
                    className={`text-[13px] font-medium${"italic" in chip && chip.italic ? " italic" : ""}`}
                    style={{ color: chip.textColor }}
                  >
                    {chip.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <button className="px-7 py-3 rounded-lg border-[1.5px] border-[#CBD5E1] text-[15px] font-semibold text-[#334155] hover:opacity-80 active:scale-[0.97] transition-all duration-150">
          Browse all tests
        </button>
      </SectionReveal>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/TestLibrarySection.tsx
git commit -m "feat(animations): TestLibrarySection — scroll reveal + stagger category cards"
```

---

## Chunk 4: FAQ + CTA + Contact + Button States

### Task 13: Animate FaqSection

**Files:**
- Modify: `src/components/home/FaqSection.tsx`

Two concerns: (a) outer shell badge + headline get `SectionReveal`, (b) accordion needs `useState` for open/close + `AnimatePresence` for animated height.

- [ ] **Replace `src/components/home/FaqSection.tsx` with:**

```tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp } from "@/lib/animations";

const faqs = [
  {
    q: "How accurate is the test?",
    a: "CrismaTest combines six evaluation dimensions — logic, communication, job skills, behavioral indicators, anti-fraud consistency, and optional video — to produce a holistic score with significantly higher predictive validity than traditional CV screening.",
  },
  {
    q: "How long does it take?",
    a: "Most candidates complete the full test in 10 to 15 minutes. The adaptive format means the test adjusts to your responses — no two sessions are identical.",
  },
  {
    q: "How is cheating prevented?",
    a: "CrismaTest uses real-time AI proctoring that monitors webcam activity, tab switching, typing patterns, copy/paste behavior, audio environment, and secondary screen usage. Any anomalies are flagged in the candidate's TrustScore breakdown.",
  },
  {
    q: "Can companies customize the test?",
    a: "Yes. Companies on Starter, Pro, and Enterprise plans can use the Test Builder to select specific modules, adjust question focus, and add up to 3 custom questions — all without any technical configuration.",
  },
  {
    q: "Can I reuse my CrismaScore?",
    a: "Absolutely. Your CrismaScore is valid for 12 months. You can share it via a unique profile link, embed it on LinkedIn, or send it directly to any employer — anywhere in the world. Free plan candidates receive 2 free retests.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-white flex flex-col gap-12" style={{ padding: 80 }}>
      {/* Outer shell — scroll reveal */}
      <SectionReveal variants={fadeIn}>
        <div className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">FAQ</span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-1px]">
          Frequently asked questions
        </h2>
      </SectionReveal>

      {/* Accordion */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="flex flex-col w-full"
            style={i < faqs.length - 1 ? { borderBottom: "1px solid #E2E8F0" } : {}}
          >
            <button
              className="flex items-center justify-between w-full py-6 text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-[16px] font-bold text-[#0F172A]">{faq.q}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-[24px] text-[#2563EB] font-light leading-none ml-4 shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[14px] text-[#64748B] leading-[1.6] pb-6">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/FaqSection.tsx
git commit -m "feat(animations): FaqSection — AnimatePresence accordion + scroll reveal shell"
```

---

### Task 14: Animate CtaBanner

**Files:**
- Modify: `src/components/home/CtaBanner.tsx`

Headline + subtext: `SectionReveal`. Buttons: stagger container.

- [ ] **Replace `src/components/home/CtaBanner.tsx` with:**

```tsx
"use client";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CtaBanner({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#071428" : "#1D4ED8";
  const subColor = dark ? "#8FA8C8" : "#BFDBFE";

  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-8"
      style={{ background: bg, height: 360, padding: "0 120px" }}
    >
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionReveal variants={fadeUp}>
          <h2 className="text-[44px] font-extrabold text-white text-center leading-[1.15] tracking-[-1px] max-w-[640px]">
            Take the test. Get your score. Open more doors.
          </h2>
        </SectionReveal>

        <SectionReveal variants={fadeUp} delay={0.1}>
          <p className="text-[14px] text-center" style={{ color: subColor }}>
            Join thousands of candidates who have already validated their skills with CrismaTest. Free
            to start.
          </p>
        </SectionReveal>

        <motion.div
          className="flex items-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            href="/sign-up"
            className="rounded-lg text-[15px] font-bold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "14px 28px" }}
          >
            Get your CrismaScore
          </motion.a>
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            href="#features"
            className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ padding: "14px 28px", border: "1px solid #1E3A5F", color: "#8FA8C8" }}
          >
            For companies
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/CtaBanner.tsx
git commit -m "feat(animations): CtaBanner — scroll reveal + stagger buttons"
```

---

### Task 15: Animate ContactSection

**Files:**
- Modify: `src/components/home/ContactSection.tsx`

Badge + headline + subtitle: `SectionReveal`. The form container: single `SectionReveal` wrapping the entire form. Submit button: replace `transition-colors` with full hover/active states.

- [ ] **Replace `src/components/home/ContactSection.tsx` with:**

```tsx
"use client";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp } from "@/lib/animations";

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[14px] font-semibold text-[#374151]">{label}</label>
      <div
        className="flex items-center rounded-lg bg-white border-[1.5px] border-[#E2E8F0] px-3.5 focus-within:border-[#2563EB] transition-colors"
        style={{ height: 44 }}
      >
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-[#374151] placeholder:text-[#9CA3AF] outline-none"
        />
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full flex flex-col items-center gap-12"
      style={{ background: "#F8FAFC", padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">Contact</span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[40px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px]">
          Get in touch
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[18px] text-[#64748B] text-center leading-[1.6] max-w-[560px]">
          Have a question or want to learn more? We&apos;d love to hear from you.
        </p>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.2} className="w-full max-w-[680px]">
        <div className="flex flex-col gap-5 w-full">
          <FormField label="Full Name" placeholder="Your full name" />
          <FormField label="Email Address" placeholder="your@email.com" type="email" />
          <FormField label="Subject" placeholder="What's this about?" />
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#374151]">Message</label>
            <textarea
              placeholder="Tell us how we can help..."
              className="w-full rounded-lg bg-white border-[1.5px] border-[#E2E8F0] p-3.5 text-[14px] text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] resize-none transition-colors"
              style={{ height: 140 }}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[10px] bg-[#2563EB] text-white text-[16px] font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200 flex items-center justify-center"
            style={{ padding: "14px 28px" }}
          >
            Send message
          </button>
        </div>
      </SectionReveal>
    </section>
  );
}
```

- [ ] **Commit:**

```bash
git add src/components/home/ContactSection.tsx
git commit -m "feat(animations): ContactSection — scroll reveal + button hover states"
```

---

### Task 16: Verify the full page

No test runner is configured. Verify visually using the dev server.

- [ ] **Start the dev server:**

```bash
npm run dev
```

- [ ] **Open `http://localhost:3000` and verify:**
  - Hero badge fades down, then headline lines slide up in sequence, then subtitle, then CTAs, then tabs, then dashboard image
  - Dashboard image shows a pulsing skeleton until the image loads
  - TrustBar scrolls as a smooth marquee; hovering pauses it
  - All sections (Problem, Solution, Features, CrismaScore, AntiFraud, TestLibrary) reveal when scrolled into view
  - Feature cards, step cards, detection cards, score cards stagger in with 80ms between each
  - FAQ items toggle open/close with animated height; the + rotates to ×
  - CTA Banner and Contact section reveal on scroll
  - All primary blue buttons glow and scale on hover; all buttons shrink slightly on click
  - Open `http://localhost:3000/dark` and verify the same animations work on the dark page

- [ ] **Run lint to catch any TypeScript issues:**

```bash
npm run lint
```

- [ ] **If lint passes with no errors, create a final summary commit:**

```bash
git add src/lib/animations.ts src/components/ui/SectionReveal.tsx src/app/globals.css src/components/home/HeroLight.tsx src/components/home/HeroDark.tsx src/components/home/TrustBar.tsx src/components/home/ProblemSection.tsx src/components/home/SolutionSection.tsx src/components/home/FeaturesSection.tsx src/components/home/CrismaScoreSection.tsx src/components/home/AntiFraudSection.tsx src/components/home/TestLibrarySection.tsx src/components/home/FaqSection.tsx src/components/home/CtaBanner.tsx src/components/home/ContactSection.tsx
git commit -m "feat(animations): complete landing page animation system

- Shared Motion variants in src/lib/animations.ts
- SectionReveal scroll-reveal wrapper with reduced-motion support
- Hero mount sequences (HeroLight + HeroDark) with image skeleton
- TrustBar infinite CSS marquee with hover pause
- Scroll reveals + stagger animations on all 9 content sections
- FaqSection AnimatePresence accordion with open/close state
- CtaBanner + ContactSection scroll reveals
- Hover/active button states across all CTAs"
```
