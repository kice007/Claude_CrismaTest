# Phase 1: Foundation - Research

**Researched:** 2026-03-14
**Domain:** Design system tokens (Tailwind v4), Shadcn/ui, Typography (next/font), i18n (react-i18next), Framer Motion variants
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Colors are fully specified (brand-primary #1B4FD8, brand-secondary #3B6FE8, brand-navy #0F2A6B, brand-light #EEF2FF, brand-accent #6366F1, neutrals, success/warning/danger) — define all in `@theme` in globals.css (Tailwind v4 approach, not tailwind.config.ts)
- Standard Tailwind spacing scale — no custom spacing tokens in Phase 1
- Custom border-radius tokens in `@theme`: `--radius-card`, `--radius-chip`, `--radius-badge`
- Custom shadow tokens in `@theme`: `--shadow-card`, `--shadow-dropdown`, `--shadow-modal`
- Framer Motion shared variants library (`src/lib/motion.ts`): define `fadeIn`, `slideUp`, `slideIn`, `staggerChildren`, `scaleIn` with `@media (prefers-reduced-motion)` baked in
- Replace Geist Sans + Geist Mono (current scaffold defaults) with Inter + JetBrains Mono via `next/font/google`
- Update `layout.tsx` CSS variables and `@theme` references accordingly
- `font-display: swap` on both fonts (per DSYS-03)
- react-i18next with a custom App Router-compatible setup (NOT next-i18next — that targets Pages Router)
- Translation files at `/locales/en.json` and `/locales/fr.json`
- Phase 1 seeds only the keys needed for Phase 1 components (language switcher labels, any dev page strings)
- Language switcher component (`src/components/LanguageSwitcher.tsx`): EN|FR pill buttons on desktop, globe icon dropdown on mobile
- Language stored in localStorage, restored on next visit (I18N-04)
- Install Shadcn/ui CLI and override with brand CSS variables in globals.css
- CSS variable overrides go in `:root` block alongside brand tokens — not in a separate file
- Phase 1 only installs Shadcn; no individual components are added yet (phases 2+ add them as needed)
- Create `/dev/design-system` page — dev mode only: returns 404 in production (NODE_ENV check)

### Claude's Discretion
- Exact Framer Motion variant values (duration, easing, delay) — match the premium SaaS feel
- Specific border-radius and shadow token values — derive from design reference (v0-crisma-test-landing-page.vercel.app)
- i18next configuration details (detection order, fallback language, debug mode)
- Exact structure of the /dev/design-system page layout

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSYS-01 | Tailwind config extended with all brand tokens (colors, typography scale, spacing scale) | Tailwind v4 `@theme` / `@theme inline` pattern in globals.css — no tailwind.config.ts needed; CSS variable naming `--color-*` generates utilities |
| DSYS-02 | Shadcn/ui installed and overridden with brand tokens via CSS variables in globals.css | shadcn/ui now has full Tailwind v4 support; two-layer pattern: `:root` holds HSL/hex values, `@theme inline` maps them to Tailwind utilities |
| DSYS-03 | Inter + JetBrains Mono loaded via next/font with font-display: swap | `next/font/google` supports `display: 'swap'` and CSS variable mode; JetBrains_Mono is a variable font; pattern is established in existing layout.tsx |
| I18N-01 | react-i18next + next-i18next configured — /locales/en.json and /locales/fr.json with all UI strings | react-i18next client-only provider pattern works for App Router without URL routing; packages: i18next, react-i18next, i18next-browser-languagedetector |
| I18N-02 | Every component uses useTranslation() — zero hardcoded UI strings | Standard `useTranslation()` hook from react-i18next; enforced by convention in Phase 1 scope |
| I18N-03 | Language switcher component renders EN/FR pills on desktop, globe icon dropdown on mobile | Standalone client component; uses `i18n.changeLanguage()` for instant switch; Tailwind responsive classes for desktop/mobile variant |
| I18N-04 | Language switch is instant (no page reload), stored in localStorage, restored on next visit | i18next-browser-languagedetector with `detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }` |
| I18N-05 | Plurals implemented via i18next plural keys for candidate counts | i18next v4 plural format: `_one` / `_other` suffixes; `count` variable required in `t()` call |
| I18N-06 | Meta tags (lang attribute, og:locale) set per page | Dynamic `lang` attribute on `<html>` in layout.tsx driven by i18n state; `generateMetadata` for og:locale — client state must sync to server on navigation |
</phase_requirements>

---

## Summary

Phase 1 builds the invisible infrastructure every subsequent phase depends on: brand tokens, fonts, Shadcn/ui baseline, and the i18n framework. The project already uses Next.js 16 App Router with Tailwind v4 and `@theme inline` in globals.css — brand tokens extend this exact pattern without any new config files. Shadcn/ui as of February 2025 officially supports Tailwind v4 via the standard CLI; the two-layer variable pattern (`:root` for raw values, `@theme inline` for Tailwind utility mappings) is the established approach and avoids all prior CSS variable conflicts.

The i18n approach requires careful attention: react-i18next with a client-side-only setup (no URL routing, no `[lng]` directory segment) is the correct choice here. Language switching is instant via `i18n.changeLanguage()` and persists via `i18next-browser-languagedetector` caching to localStorage. The I18N-06 requirement (lang attribute and og:locale) has a complexity: those are server-rendered HTML attributes, but language state lives client-side. The pragmatic solution is to initialize from localStorage on the client and use a `useEffect` to update the `<html lang>` attribute dynamically — acceptable for a visual prototype.

For Framer Motion, the package has been renamed to `motion` (npm: `motion`, import from `motion/react`), though `framer-motion` remains available as a legacy alias. New projects should use the `motion` package. The `MotionConfig reducedMotion="user"` wrapper is the cleanest approach for global prefers-reduced-motion support, supplementing the shared variants file.

**Primary recommendation:** Use `npx shadcn@latest init` after confirming Tailwind v4 is detected; define all brand tokens under `@theme` in globals.css using `--color-brand-primary` naming; use react-i18next with i18next-browser-languagedetector in a `'use client'` provider wrapping the root layout body.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | ^4 (already installed) | Utility CSS | v4 CSS-first; no config file needed |
| shadcn/ui | latest (npx shadcn@latest) | Accessible component primitives | Official Tailwind v4 + React 19 support as of Feb 2025 |
| next/font/google | bundled with Next.js 16 | Font optimization | Zero CLS, self-hosted, built-in display:swap |
| i18next | ^24 | i18n core | De-facto standard, App Router compatible |
| react-i18next | ^15 | React bindings for i18next | Zero-reload language switching; works in 'use client' components |
| i18next-browser-languagedetector | ^8 | Auto-detect + localStorage persistence | Handles detection order, caching to localStorage automatically |
| motion | ^12 (was framer-motion) | Animation variants | Renamed package; `motion/react` import path for React 19 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| i18next-resources-to-backend | ^1 | Lazy-load translation JSON | Useful if translation files grow large; optional for Phase 1 with small files |
| @radix-ui/react-* | pulled in by shadcn | Unstyled primitives | Automatically installed when shadcn components are added |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-i18next | next-intl | next-intl is cleaner for URL-based locale routing; locked decision is localStorage, no URL change — react-i18next wins |
| react-i18next | next-i18next | next-i18next is Pages Router only; incompatible with App Router — eliminated |
| motion | framer-motion | framer-motion is the legacy alias and still works; motion is the current package name, same API |
| i18next-browser-languagedetector | manual localStorage read | Detector handles edge cases (SSR hydration, fallback order); worth the tiny dependency |

**Installation:**
```bash
npm install i18next react-i18next i18next-browser-languagedetector
npm install motion
# shadcn init handles its own deps
npx shadcn@latest init
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 additions)
```
src/
├── app/
│   ├── globals.css          # @theme brand tokens + shadcn CSS var overrides
│   ├── layout.tsx           # Inter + JetBrains Mono, I18nProvider wrapper
│   ├── page.tsx             # Unchanged
│   └── dev/
│       └── design-system/
│           └── page.tsx     # Dev-only validation artifact (NODE_ENV check)
├── components/
│   ├── ui/                  # shadcn components land here (empty in Phase 1)
│   ├── LanguageSwitcher.tsx # EN|FR pills (desktop), globe dropdown (mobile)
│   └── I18nProvider.tsx     # 'use client' wrapper initializing i18next
├── lib/
│   ├── motion.ts            # Shared Framer Motion variants
│   └── i18n.ts              # i18next init config (called by I18nProvider)
locales/
├── en.json                  # Phase 1 keys only
└── fr.json                  # Phase 1 keys only
```

### Pattern 1: Tailwind v4 Brand Tokens in globals.css

**What:** All brand design tokens defined in `@theme` block as CSS custom properties. Shadcn's semantic variables defined in `:root`, then mapped to Tailwind utilities via `@theme inline`.

**When to use:** Always — this is the single source of truth for all tokens.

**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

/* ─── Brand raw values ─── */
:root {
  /* Brand colors */
  --brand-primary-raw: #1B4FD8;
  --brand-secondary-raw: #3B6FE8;
  --brand-navy-raw: #0F2A6B;
  --brand-light-raw: #EEF2FF;
  --brand-accent-raw: #6366F1;

  /* Shadcn semantic overrides (using brand values) */
  --background: hsl(0 0% 100%);
  --foreground: hsl(222 47% 11%);
  --primary: hsl(221 77% 47%);        /* brand-primary */
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(221 77% 57%);      /* brand-secondary */
  --secondary-foreground: hsl(0 0% 100%);
  --accent: hsl(239 84% 67%);         /* brand-accent */
  --accent-foreground: hsl(0 0% 100%);
  --muted: hsl(221 30% 96%);
  --muted-foreground: hsl(222 20% 45%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222 47% 11%);
  --border: hsl(221 20% 88%);
  --input: hsl(221 20% 88%);
  --ring: hsl(221 77% 47%);
  --radius: 0.5rem;
}

/* ─── Tailwind utility generation ─── */
@theme inline {
  /* Fonts */
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);

  /* Brand colors → Tailwind bg-brand-primary, text-brand-navy, etc. */
  --color-brand-primary: #1B4FD8;
  --color-brand-secondary: #3B6FE8;
  --color-brand-navy: #0F2A6B;
  --color-brand-light: #EEF2FF;
  --color-brand-accent: #6366F1;

  /* Neutral scale */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-500: #64748b;
  --color-neutral-700: #334155;
  --color-neutral-900: #0f172a;

  /* Status colors */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  /* Shadcn semantic → Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Custom border-radius tokens */
  --radius-card: 0.75rem;   /* 12px */
  --radius-chip: 9999px;    /* pill */
  --radius-badge: 0.375rem; /* 6px */

  /* Custom shadow tokens */
  --shadow-card: 0 1px 3px 0 rgb(15 42 107 / 0.08), 0 4px 16px -2px rgb(15 42 107 / 0.06);
  --shadow-dropdown: 0 4px 16px -2px rgb(15 42 107 / 0.12), 0 1px 4px 0 rgb(15 42 107 / 0.06);
  --shadow-modal: 0 20px 48px -8px rgb(15 42 107 / 0.2), 0 4px 16px -4px rgb(15 42 107 / 0.1);
}
```

**Key insight on `@theme inline`:** Use `@theme inline` (not bare `@theme`) whenever the token value references another CSS variable with `var()`. Without `inline`, Tailwind generates a static utility that resolves at compile time; with `inline`, it generates a utility that references the CSS variable at runtime, enabling dynamic theming.

### Pattern 2: next/font with CSS Variables

**What:** Load fonts with `variable` option to emit a CSS custom property, then reference it in `@theme inline`.

**When to use:** Required for Tailwind v4 font utilities to work correctly.

**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then in `@theme inline`:
```css
--font-sans: var(--font-inter);
--font-mono: var(--font-jetbrains-mono);
```

**Note:** `JetBrains_Mono` is the exact export name in `next/font/google`. It is a variable font (supports weights 100–800) — no explicit `weight` array needed.

### Pattern 3: react-i18next Client-Only Provider

**What:** Initialize i18next once in a `'use client'` provider component wrapping the root layout body. No URL segments, no middleware, no server-side translation.

**When to use:** When language switching must be instant (no reload) and stored in localStorage without URL changes — exactly I18N-04.

**Example:**
```tsx
// src/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "../../locales/en.json";
import frTranslations from "../../locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "crismatest_lang",
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;
```

```tsx
// src/components/I18nProvider.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Sync lang attribute to <html> after language change
  useEffect(() => {
    const updateLang = (lng: string) => {
      document.documentElement.lang = lng;
    };
    i18n.on("languageChanged", updateLang);
    updateLang(i18n.language);
    return () => i18n.off("languageChanged", updateLang);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

```tsx
// layout.tsx body wrapping
<body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
  <I18nProvider>{children}</I18nProvider>
</body>
```

**Critical:** The `import "@/lib/i18n"` in the provider triggers initialization exactly once. The `'use client'` boundary keeps all i18next code client-side only (no server-side import issues).

### Pattern 4: LanguageSwitcher Component

**What:** Standalone component with responsive variants — pill buttons (desktop) and globe dropdown (mobile).

**When to use:** Drop-in ready; Phase 2 places it in the nav.

**Example:**
```tsx
// src/components/LanguageSwitcher.tsx
"use client";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <>
      {/* Desktop: EN|FR pills */}
      <div className="hidden md:flex items-center gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${i18n.resolvedLanguage === lang.code
                ? "bg-brand-primary text-white"
                : "text-neutral-500 hover:text-brand-primary"
              }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Mobile: globe dropdown — implementation detail at Claude's discretion */}
      <div className="flex md:hidden">
        {/* Globe icon + dropdown */}
      </div>
    </>
  );
}
```

### Pattern 5: Shared Framer Motion Variants

**What:** Central `src/lib/motion.ts` defining all animation variants. Uses `MotionConfig reducedMotion="user"` at layout level plus inline reduced-motion fallbacks.

**When to use:** All animated components in phases 2–6 import from this file.

**Example:**
```tsx
// src/lib/motion.ts
// Source: https://motion.dev/docs/react
import type { Variants } from "motion/react";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
```

```tsx
// layout.tsx — wrap body content with MotionConfig
import { MotionConfig } from "motion/react";

// Inside RootLayout body:
<MotionConfig reducedMotion="user">
  <I18nProvider>{children}</I18nProvider>
</MotionConfig>
```

**Note on package name:** The package is `motion` (npm: `motion`). Import as `import { motion, MotionConfig } from "motion/react"`. The old `framer-motion` package still works as a compatibility shim but new installs should use `motion`.

### Pattern 6: shadcn/ui Init with Tailwind v4

**What:** Run the CLI which auto-detects Tailwind v4 and configures CSS variables correctly.

**When to use:** One-time init step. No manual config file editing needed if init completes successfully.

**Steps:**
```bash
# shadcn as of Feb 2025 supports Tailwind v4 natively
npx shadcn@latest init
# When prompted for tailwind config path: leave blank (Tailwind v4 has no config file)
# When prompted for CSS variables: Yes
# When prompted for globals.css path: src/app/globals.css
```

After init, shadcn writes its own `:root` variables. **These must be replaced/merged with brand overrides** — the brand `:root` values take precedence. The existing Next.js scaffold `--background`/`--foreground` defaults will conflict and must be removed before shadcn init, or overwritten after.

### Pattern 7: i18next Plurals (I18N-05)

**What:** Standard i18next v4 plural key format with `_one` / `_other` suffixes.

**Example JSON:**
```json
{
  "candidate_count_one": "{{count}} candidate",
  "candidate_count_other": "{{count}} candidates"
}
```

**French (same suffixes, different rules — `_one` covers 0 and 1):**
```json
{
  "candidate_count_one": "{{count}} candidat",
  "candidate_count_other": "{{count}} candidats"
}
```

**Usage:**
```tsx
t("candidate_count", { count: 3 }) // → "3 candidates" (en) / "3 candidats" (fr)
```

### Anti-Patterns to Avoid
- **Putting font weight arrays on variable fonts:** JetBrains Mono is a variable font — do NOT specify `weight: ['400', '700']`. Just import it without weight; all weights are available.
- **Using `@theme` (not `@theme inline`) for `var()` references:** Without `inline`, Tailwind resolves the variable at compile time and a CSS variable reference like `var(--font-inter)` won't work correctly at runtime.
- **Importing i18n config in Server Components:** The i18next init file uses browser APIs (localStorage). It must only ever be imported inside `'use client'` components or client-only modules.
- **Shadcn CSS variable conflict:** The default Next.js scaffold uses hex for `--background`/`--foreground`. Shadcn expects HSL. Before or after init, ensure the `:root` block uses consistent format (pick HSL throughout for shadcn compatibility).
- **Hardcoding `lang="en"` in root layout.tsx `<html>`:** After adding i18n, the `lang` attribute must be managed dynamically via the I18nProvider `useEffect` pattern.
- **next-i18next in App Router:** next-i18next is Pages Router only. Using it in App Router causes runtime errors. Never install it in this project.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading + CLS prevention | Custom font-face + preload links | `next/font/google` | Handles self-hosting, preloading, font-display, fallback sizing automatically |
| Language detection + localStorage persistence | Manual `localStorage.getItem('lang')` in useEffect | `i18next-browser-languagedetector` | Handles detection order, SSR edge cases, hydration mismatch prevention |
| Plural form rules per language | Custom count-to-form mapping function | i18next plural keys (`_one`, `_other`) | CLDR plural rules are language-specific and complex; i18next handles all 50+ languages |
| Component library styling baseline | Custom CSS reset + component primitives | `shadcn/ui` on Radix UI | Handles accessibility, keyboard navigation, ARIA attributes, focus management |
| Animation reduced-motion handling | Per-component `window.matchMedia` checks | `MotionConfig reducedMotion="user"` + shared variants | Single declaration propagates to all child motion components |

**Key insight:** Every item here has hidden complexity that takes 10x longer to get right than it appears. Language detection edge cases (navigator.languages array, htmlTag sync, SSR hydration) alone justify the `i18next-browser-languagedetector` dependency.

---

## Common Pitfalls

### Pitfall 1: shadcn Init Overwrites Custom Token Work
**What goes wrong:** Running `npx shadcn@latest init` after defining brand tokens may overwrite or partially conflict with the globals.css `:root` block.
**Why it happens:** shadcn generates its own `:root` block with default neutral colors.
**How to avoid:** Either run shadcn init FIRST (clean), then add brand tokens on top; or run it and carefully merge. Recommended order: shadcn init → replace shadcn color values with brand-mapped HSL equivalents.
**Warning signs:** `--primary` is shadcn blue (oklch) instead of brand-primary (#1B4FD8).

### Pitfall 2: @theme inline vs @theme Confusion
**What goes wrong:** Using `@theme` (without `inline`) for tokens that reference `:root` CSS variables produces Tailwind utilities that don't update when the variable changes at runtime.
**Why it happens:** Without `inline`, Tailwind inlines the resolved value at build time.
**How to avoid:** Always use `@theme inline` when the token value is `var(--something)`. Use bare `@theme` only for literal values.
**Warning signs:** Color utilities work but don't respond to `.dark` class or theme changes.

### Pitfall 3: i18next Importing on Server
**What goes wrong:** `i18next-browser-languagedetector` accesses `window` and `localStorage` — importing the i18n config file in a Server Component throws "localStorage is not defined".
**Why it happens:** Next.js App Router server components have no browser APIs.
**How to avoid:** Keep `src/lib/i18n.ts` import exclusively inside `'use client'` components. Never import it from `layout.tsx` directly (layout is a Server Component) — only import from `I18nProvider.tsx` which is `'use client'`.
**Warning signs:** Build error "ReferenceError: localStorage is not defined" during `next build`.

### Pitfall 4: React Compiler Conflicts with Manual Memoization
**What goes wrong:** The React Compiler (babel-plugin-react-compiler) is active in this project. Using `useMemo`, `useCallback`, or `React.memo` manually can cause compiler warnings or unexpected behavior.
**Why it happens:** The React Compiler auto-memoizes; manual hints conflict.
**How to avoid:** Do not use `useMemo`/`useCallback` in Phase 1 components. Let the compiler handle it. This is documented in CLAUDE.md.
**Warning signs:** React DevTools shows double-memoization or the compiler emits opt-out warnings.

### Pitfall 5: JetBrains Mono Export Name Typo
**What goes wrong:** `import { JetBrainsMono } from "next/font/google"` fails — the font isn't found.
**Why it happens:** The correct export name uses an underscore: `JetBrains_Mono`.
**How to avoid:** Use `import { JetBrains_Mono } from "next/font/google"`.
**Warning signs:** Module not found or TypeScript error on the import.

### Pitfall 6: I18N-06 lang Attribute — Server vs Client Gap
**What goes wrong:** The `<html lang="en">` in layout.tsx is server-rendered and static; after client hydration, the language may be `fr` (from localStorage) but the HTML lang attribute stays `"en"`.
**Why it happens:** Server renders with default lang; client has different language from localStorage.
**How to avoid:** Use `useEffect` in I18nProvider to call `document.documentElement.lang = i18n.language` after hydration, and subscribe to `i18n.on('languageChanged', ...)`.
**Warning signs:** Screen readers announcing the wrong language; `document.documentElement.lang` showing `"en"` when FR is active.

### Pitfall 7: Dark Mode CSS Conflict
**What goes wrong:** The existing globals.css has a `@media (prefers-color-scheme: dark)` block setting `--background: #0a0a0a` using hex. Shadcn expects HSL. These will conflict.
**Why it happens:** Next.js scaffold uses hex; shadcn uses HSL.
**How to avoid:** Remove the dark mode block from globals.css when adding brand tokens (dark mode is out of scope per REQUIREMENTS.md v1 — light mode only). Keep only `:root` light values.
**Warning signs:** Background color mismatch in dark OS mode.

---

## Code Examples

Verified patterns from official sources:

### JetBrains Mono — Correct Import
```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // No weight needed — JetBrains_Mono is a variable font
});
```

### i18next changeLanguage — Instant Switch
```tsx
// Source: https://www.i18next.com/overview/api
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  // This triggers re-render of ALL useTranslation() consumers immediately
  // AND writes to localStorage via the detector's cache
  return (
    <button onClick={() => i18n.changeLanguage("fr")}>FR</button>
  );
}
```

### Tailwind v4 Color Token — Correct Naming
```css
/* Source: https://tailwindcss.com/docs/theme */
/* Generates: bg-brand-primary, text-brand-primary, border-brand-primary etc. */
@theme {
  --color-brand-primary: #1B4FD8;
}
/* Usage in JSX: className="bg-brand-primary" */
```

### shadcn CSS Variable Mapping (two-layer pattern)
```css
/* Source: https://ui.shadcn.com/docs/tailwind-v4 */
/* Layer 1: semantic values in :root */
:root {
  --primary: hsl(221 77% 47%);  /* maps to brand-primary #1B4FD8 */
}
/* Layer 2: Tailwind utility via @theme inline */
@theme inline {
  --color-primary: var(--primary);
  /* Generates: bg-primary, text-primary, border-primary etc. */
}
```

### Dev-Only Page Pattern
```tsx
// src/app/dev/design-system/page.tsx
import { notFound } from "next/navigation";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound(); // Returns 404 in production
  }

  return (
    <div>
      {/* Design system validation content */}
    </div>
  );
}
```

### Framer Motion — Correct Package Import (2025)
```tsx
// Package: npm install motion
// Import from motion/react (not framer-motion) for new projects
import { motion, MotionConfig } from "motion/react";
import type { Variants } from "motion/react";
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.ts for design tokens | `@theme` in CSS (globals.css) | Tailwind v4 (Jan 2025) | No JS config file; everything in CSS |
| `framer-motion` package | `motion` package (`motion/react` import) | Late 2024 | Same API; new package name |
| next-i18next for App Router | react-i18next with client provider | Next.js 13+ (App Router era) | next-i18next targets Pages Router only |
| `@theme` for all tokens | `@theme inline` for `var()` references | Tailwind v4 | Enables runtime CSS variable resolution |
| Manual HSL values in shadcn | OKLCH in newer shadcn | Feb 2025 update | shadcn init may generate OKLCH; accept it or convert |

**Deprecated/outdated:**
- `tailwind.config.ts` color tokens: Tailwind v4 CSS-first; no config file needed for colors
- `next-i18next`: Pages Router only — never use in this App Router project
- `framer-motion` (old package): Superseded by `motion`; `framer-motion` still works but is a compatibility shim

---

## Open Questions

1. **shadcn Init OKLCH vs Brand Hex values**
   - What we know: shadcn as of Feb 2025 generates OKLCH color values. Brand colors are defined as hex (#1B4FD8 etc.).
   - What's unclear: Whether to convert brand hex to OKLCH for consistency, or use hex directly in `:root` and let shadcn generate OKLCH for its own semantic vars.
   - Recommendation: Use HSL for shadcn semantic vars (as shadcn theming docs recommend) and hex for brand-specific tokens in `@theme`. Both are valid CSS. Do not convert everything to OKLCH unless a strong aesthetic reason emerges.

2. **I18N-06 og:locale with client-side-only i18n**
   - What we know: `og:locale` meta tag is set via Next.js `generateMetadata()` which runs server-side. Client language state (localStorage) is not available server-side.
   - What's unclear: How to dynamically set `og:locale` per language without URL-based routing.
   - Recommendation: Accept a static default `og:locale: "en_US"` for Phase 1 (acceptable for a prototype). Full dynamic og:locale requires either URL-based routing (locked out by decisions) or a cookie-based SSR handshake. Log this as a known limitation. Requirements state this is in scope but the architecture constraints make it a best-effort implementation.

3. **React Compiler + i18next hooks compatibility**
   - What we know: React Compiler (babel-plugin-react-compiler 1.0.0) is active. react-i18next hooks are standard hooks.
   - What's unclear: Whether the compiler has any known issues with `useTranslation()` specifically.
   - Recommendation: React Compiler works with standard hooks. `useTranslation()` is a standard hook pattern and should be compatible. If issues arise, the component can opt out with `"use no memo"`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured — CLAUDE.md explicitly states "No test runner is configured yet" |
| Config file | none — see Wave 0 |
| Quick run command | `npm run lint` (ESLint only, no test runner) |
| Full suite command | `npm run build` (build validation as smoke test) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSYS-01 | Brand color tokens generate correct CSS utilities | manual | Visual inspection on /dev/design-system | ❌ Wave 0 |
| DSYS-02 | Shadcn components use brand CSS variables | manual | Visual inspection on /dev/design-system | ❌ Wave 0 |
| DSYS-03 | Inter and JetBrains Mono load with font-display:swap | manual | Chrome DevTools Network + Computed Styles | ❌ Wave 0 |
| I18N-01 | en.json and fr.json load correctly | manual | /dev/design-system language toggle | ❌ Wave 0 |
| I18N-02 | Zero hardcoded UI strings in JSX | lint/grep | `grep -r "\"[A-Z]" src/components src/app --include="*.tsx"` | ❌ Wave 0 |
| I18N-03 | LanguageSwitcher renders correctly at both breakpoints | manual | Browser resize on /dev/design-system | ❌ Wave 0 |
| I18N-04 | Language persists across browser refresh | manual | Switch to FR, refresh, verify FR is active | ❌ Wave 0 |
| I18N-05 | Plural keys work for EN and FR | manual | /dev/design-system plural demo | ❌ Wave 0 |
| I18N-06 | html[lang] updates on language switch | manual/script | `document.documentElement.lang` in DevTools console | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run lint && npm run build`
- **Per wave merge:** `npm run build` (zero TypeScript errors, zero ESLint errors)
- **Phase gate:** `npm run build` green + manual /dev/design-system walkthrough before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No test runner configured — `npm run build` + `npm run lint` serve as the automated gate
- [ ] `/dev/design-system` page must be created as the primary visual validation artifact for all 9 requirements
- [ ] Consider adding `npm run type-check` script (`tsc --noEmit`) to package.json for faster type validation than full build

*(All Phase 1 requirements are infrastructure/visual — automated unit tests would require a test runner not yet in scope. Build validation + the /dev/design-system page cover all success criteria.)*

---

## Sources

### Primary (HIGH confidence)
- https://tailwindcss.com/docs/theme — `@theme` directive, CSS variable naming convention, `@theme inline` vs bare `@theme`
- https://nextjs.org/docs/app/getting-started/fonts — `next/font/google`, `display: 'swap'`, CSS variable mode, App Router pattern
- https://ui.shadcn.com/docs/tailwind-v4 — shadcn/ui Tailwind v4 support, two-layer CSS variable pattern
- https://ui.shadcn.com/docs/theming — full list of shadcn CSS variables (--primary, --secondary, --accent, etc.)
- https://www.i18next.com/translation-function/plurals — i18next v4 plural key format (`_one` / `_other`)

### Secondary (MEDIUM confidence)
- https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4 — Feb 2025 CLI update confirms Tailwind v4 + React 19 support
- https://www.luisball.com/blog/shadcn-ui-with-tailwind-v4 — confirmed two-layer globals.css pattern
- https://www.locize.com/blog/i18n-next-app-router/ — react-i18next App Router approach (locize official blog)
- https://motion.dev — package rename to `motion`, `motion/react` import path

### Tertiary (LOW confidence)
- https://iamsannyrai.medium.com — localStorage-only i18n (403, could not verify) — confirmed by i18next-browser-languagedetector docs instead
- https://medium.com/@muhammadfahreza — Tailwind v4 undocumented features (single source, partially verified against official docs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against official docs; versions confirmed in package.json
- Architecture: HIGH — patterns verified against official Tailwind v4, Next.js, and shadcn docs
- Pitfalls: HIGH — cross-referenced against known GitHub issues and official documentation
- i18n (I18N-06 og:locale): MEDIUM — limitation acknowledged; workaround documented

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (30 days — Tailwind v4 and shadcn are stable; i18next API stable)
