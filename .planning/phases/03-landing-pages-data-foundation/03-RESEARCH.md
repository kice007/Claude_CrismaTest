# Phase 3: Landing Pages + Data Foundation - Research

**Researched:** 2026-03-22
**Domain:** Next.js App Router landing pages, Supabase (schema + RLS + seed), Resend email API, in-memory rate limiting, varlock .env.schema
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Home page hero**
- Floating dashboard card: simplified mockup of the /dashboard candidate table — blurred/frosted edges, a few rows with avatar initials + CrismaScore chips visible. Shows the B2B product without live data.
- Hero CTAs (dual persona): "Take the Test" (primary, candidate-facing) + "See How It Works" (secondary ghost button, company-facing)
- Background: navy (brand-navy) with gradient as specced

**Home page sections**
- Full spec — all sections included: hero, trust bar marquee, what-is, 3-step process, for-companies feature grid, anti-fraud section, test library preview, testimonials, FAQ, footer
- Testimonials: 3 — renders as 3-column grid on desktop, carousel on mobile
- FAQ: 6-8 items — covers typical objections (cost, time, fraud, accuracy, privacy, integrations)

**Contact form fields + behavior**
- Fields exactly as specced: name (required), company (required), email (required), team size dropdown (1-10 / 11-50 / 51-200 / 200+, required), message (textarea, optional), GDPR consent checkbox (required to enable submit)
- Success state: existing Toast component slides in — "Message sent! We'll be in touch within 24 hours." — form resets to empty
- Rate-limit error (3/IP/hour): error toast — "Too many requests — please try again later." No stack trace, no technical detail (SEC-05 compliant)
- Validation feedback: inline field-level errors (red text below field) on blur/submit attempt

**Contact form email (Resend)**
- Format: plain-text admin notification
- To: admin email (env var)
- Subject: `New demo request from [Company]`
- Body: name, company, email (clickable mailto), team size, message, submission timestamp
- No HTML template — plain text only

**Seed data — candidates**
- Count: 40 mock candidates
- Score distribution: bell curve, 55-85 range — most cluster around 65-75, a few at 80-85, a few at 55-60
- Roles: 8 professional roles, ~5 candidates each
- Profiles: diverse, realistic names; initials-based avatars colored by role; varied fraud flag severity and status

**Seed data — questions**
- Count: ~100 questions
- Coverage: 6 question types × 8 roles, ~2 questions per type per role
- Language: full bilingual — every question has `text_en` and `text_fr` fields
- Claude writes realistic question text across all types (QCM, drag & drop, case study, simulation, audio/video, short text)

**Seed data — test templates**
- 8 templates, one per role
- Each template: role name, estimated duration (10-15 min), module list, slug, active=true

### Claude's Discretion
- Exact copy for testimonials, FAQ items, what-is section, anti-fraud section, test library preview
- Trust bar company logos (use well-known company names as text, or placeholder SVG logos)
- Exact shimmer skeleton layouts per landing page section
- IP-based rate limiting implementation (in-memory vs. Supabase-backed — choose simplest that works for v1)
- Specific fraud flag combinations per candidate in seed data

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAND-01 | `/` Light Home page — implement frame `home-light` from `design/landing-pages.pen`; hero, features, social proof, pricing CTA, footer; responsive | Design context at `design_context/landing_pages/CrismaTest_LandingPage_Content.md` provides full copy. Existing codebase: NavShell auto-inherited, motion variants ready in `src/lib/motion.ts`, Skeleton + Toast components available. |
| LAND-02 | `/dark` Dark Home page — implement frame `home-dark` from `design/landing-pages.pen` | New route `src/app/dark/page.tsx`. Same sections as LAND-01 with dark color variant. `.dark` CSS class already defined in globals.css. |
| DATA-01 | Supabase schema — tables: `test_templates`, `mock_candidates`, `questions`, `contact_submissions`, `test_sessions` | SQL migration file pattern. `@supabase/supabase-js` already in package; `@supabase/ssr` needs install for SSR clients. |
| DATA-02 | RLS — all tables read-only via anon key; `contact_submissions` insert-only; `test_sessions` insert-only; email not exposed in candidates list | Standard Supabase RLS policy SQL — 4 targeted policies (SELECT/INSERT/UPDATE/DELETE) per table. |
| DATA-03 | Seed script (`npm run db:seed`) — 40 candidates, ~100 questions (EN+FR), 8 templates | Node.js seed script using `@supabase/supabase-js` with service role key. Add `db:seed` script to package.json. |
| DATA-10 | varlock `.env.schema` — all five env vars declared with `@required`/`@sensitive` tags | varlock v0.5.0 already installed. `.env.schema` exists (has placeholder only). Format verified from official docs. |
| SEC-01 | `.env` in `.gitignore` — never committed; service role key and Resend key used only in server-side API routes | `.gitignore` already has `.env*` (with `!.env.schema` exception). Verify no `.env` in git history. Server-only vars: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` — no `NEXT_PUBLIC_` prefix. |
</phase_requirements>

---

## Summary

Phase 3 delivers the two marketing pages and the data foundation. The codebase from Phases 1–2 provides a complete component library: NavShell, Toast, Skeleton, motion variants, i18n wiring, and brand tokens — all ready to use without modification. The home page (`src/app/page.tsx`) is currently a Next.js scaffold placeholder and must be fully replaced.

The primary technical risks are (1) the Supabase client setup — two distinct clients are needed (`@supabase/supabase-js` for the seed script and server routes with service role, `@supabase/ssr` for the contact API route using the anon key), and (2) the contact form API route which must coordinate validation (zod), rate limiting (in-memory Map), Supabase insert, and Resend email in a single POST handler without leaking errors.

The varlock `.env.schema` already has the correct file header but contains only a placeholder variable — it needs the five project vars added. The `.gitignore` already excludes `.env*` while keeping `.env.schema` tracked.

**Primary recommendation:** Build in wave order — i18n keys first, then home-light page, then home-dark (reuse components), then Supabase schema + RLS, then seed script, then contact API route, then .env.schema update. The contact form is the only real backend integration — everything else is React with seeded data.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/supabase-js` | already installed (see package.json) | Supabase JS client — used for seed script (service role) and admin operations | Official Supabase SDK |
| `@supabase/ssr` | ^0.5.x (needs install) | Supabase SSR client — creates cookie-aware server client for Next.js route handlers using anon key | Required for App Router API routes to work with RLS |
| `resend` | ^4.x (needs install) | Email send SDK — POST contact form triggers Resend notification | Official SDK, clean API, free tier |
| `zod` | ^3.x (needs install) | Schema validation for contact form API route | Industry standard, TypeScript-native, pairs with React Hook Form |
| `react-hook-form` | ^7.x (needs install) | Client-side form state, validation, field errors | Standard for React forms; avoids controlled-input re-render flood |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `sonner` | ^2.0.7 | Toast notifications | Contact form success/error feedback — use existing `toast()` call |
| `motion` | ^12.36.0 | Framer Motion v12 — page animations | Hero section, section scroll reveals, testimonial carousel |
| `varlock` | ^0.5.0 | .env.schema validation and type generation | Already in package.json; add vars to `.env.schema` |
| `lucide-react` | ^0.577.0 | Icons | Feature grid icons, social proof icons, footer social icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-hook-form` | Controlled `useState` per field | RHF avoids re-render per keystroke; better for 6-field form with real-time validation |
| In-memory rate limiter (Map) | `upstash/ratelimit` + Redis | Upstash requires Redis setup; Map is instant, sufficient for v1 low traffic |
| `@supabase/ssr` for API routes | `@supabase/supabase-js` createClient with anon key | `@supabase/ssr` handles cookies correctly for RLS; plain createClient works but bypasses cookie auth entirely — fine for contact form insert since RLS allows anon insert |

**Installation:**
```bash
npm install @supabase/supabase-js @supabase/ssr resend zod react-hook-form
```

> Note: `@supabase/supabase-js` may already be installed — verify in package.json before running.

---

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
src/
├── app/
│   ├── page.tsx                    # REPLACED — home-light full implementation
│   ├── dark/
│   │   └── page.tsx                # NEW — home-dark variant
│   └── api/
│       └── contact/
│           └── route.ts            # NEW — POST /api/contact
├── components/
│   ├── home/                       # NEW — landing page section components
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── WhatIsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── ForCompaniesSection.tsx
│   │   ├── AntifraudSection.tsx
│   │   ├── TestLibrarySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── ContactSection.tsx      # Embedded contact form — shared by both pages
│   │   ├── ContactForm.tsx         # Form component with RHF + zod client validation
│   │   └── FooterSection.tsx
│   └── home-dark/                  # OPTIONAL — only if dark needs unique section variants
├── lib/
│   ├── supabase.ts                 # NEW — browser client + server client exports
│   ├── rate-limiter.ts             # NEW — in-memory rate limiter Map
│   └── ...existing
locales/
├── en.json                         # ADD all landing page keys
└── fr.json                         # ADD all landing page keys
scripts/
└── seed.ts                         # NEW — npm run db:seed
supabase/
└── migrations/
    └── 001_initial_schema.sql      # NEW — CREATE TABLE + RLS policies
```

### Pattern 1: Two Supabase Client Variants

The project needs two distinct client modes:

**Browser client** — used in client components (ContactForm future direct use, not needed here since form posts to API route):
```typescript
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server client** — used in API route handlers (contact form POST):
```typescript
// src/lib/supabase.ts (server variant)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Admin client** — used ONLY in seed script and server-side admin operations (bypasses RLS):
```typescript
// scripts/seed.ts (top-level — not exported from src/lib)
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
)
```

> CRITICAL: `SUPABASE_SERVICE_ROLE_KEY` must never have `NEXT_PUBLIC_` prefix — it must stay server-only.

### Pattern 2: Contact Form API Route

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createServerSupabaseClient } from '@/lib/supabase'
import { applyRateLimiter } from '@/lib/rate-limiter'

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  email: z.string().email(),
  teamSize: z.enum(['1-10', '11-50', '51-200', '200+']),
  message: z.string().max(2000).optional(),
  gdprConsent: z.literal(true),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // 1. Rate limit check (3/IP/hour)
  const rateLimitResult = applyRateLimiter(req, 3, 3600)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // 2. Parse and validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  }

  const { name, company, email, teamSize, message } = parsed.data

  // 3. Insert to Supabase
  const supabase = await createServerSupabaseClient()
  const { error: dbError } = await supabase
    .from('contact_submissions')
    .insert({ name, company, email, team_size: teamSize, message })

  if (dbError) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  // 4. Send Resend notification
  await resend.emails.send({
    from: `CrismaTest <noreply@${process.env.NEXT_PUBLIC_APP_URL}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `New demo request from ${company}`,
    text: [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Team size: ${teamSize}`,
      `Message: ${message ?? '(none)'}`,
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n'),
  })

  return NextResponse.json({ success: true }, { status: 200 })
}
```

> NOTE: Do NOT re-throw Resend errors as 500 — if email fails after DB insert succeeds, still return 200. Log the error server-side only. The form submission is captured regardless.

### Pattern 3: In-Memory Rate Limiter

```typescript
// src/lib/rate-limiter.ts
import { NextRequest } from 'next/server'

interface RateEntry {
  count: number
  expiresAt: number
}

const cache = new Map<string, RateEntry>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache) {
    if (now > entry.expiresAt) cache.delete(key)
  }
}, 5 * 60 * 1000)

export function applyRateLimiter(
  req: NextRequest,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const entry = cache.get(ip)

  if (!entry || now > entry.expiresAt) {
    cache.set(ip, { count: 1, expiresAt: now + windowSeconds * 1000 })
    return { allowed: true }
  }

  if (entry.count < maxRequests) {
    cache.set(ip, { ...entry, count: entry.count + 1 })
    return { allowed: true }
  }

  return { allowed: false }
}
```

> Limitation: in-memory Map resets on each serverless function cold start. Acceptable for v1 (low traffic, not a high-security endpoint). Upgrade to Redis/Upstash in v2 if needed.

### Pattern 4: varlock .env.schema Format

```
# This env file uses @env-spec - see https://varlock.dev/env-spec for more info
#
# @defaultRequired=infer @defaultSensitive=false
# @generateTypes(lang=ts, path=env.d.ts)
# ----------

# Supabase project URL — safe to expose
# @required @sensitive=false
# @example="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_URL=""

# Supabase anon/public key — safe to expose (protected by RLS)
# @required @sensitive=false
# @example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Supabase service role key — NEVER expose to client
# @required @sensitive
# @example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY=""

# Resend API key — server-only
# @required @sensitive
# @example="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RESEND_API_KEY=""

# Public app base URL (used for email from address construction)
# @required @sensitive=false
# @example="https://crismatest.com"
NEXT_PUBLIC_APP_URL=""
```

### Pattern 5: i18n Key Addition

All landing page strings MUST be added to both `/locales/en.json` and `/locales/fr.json` BEFORE building page components. Key naming convention (established Phases 1–2):

- Namespace: flat keys, snake_case
- Prefix sections: `home_hero_`, `home_trust_`, `home_what_is_`, `home_how_it_works_`, `home_companies_`, `home_antifraid_`, `home_tests_`, `home_testimonials_`, `home_faq_`, `home_footer_`, `contact_form_`
- FAQ items: `home_faq_q1`, `home_faq_a1`, `home_faq_q2`, etc.
- Testimonials: `home_testimonial_1_name`, `home_testimonial_1_role`, `home_testimonial_1_company`, `home_testimonial_1_quote`

Component usage pattern (established):
```typescript
"use client";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();
  return <h1>{t("home_hero_headline")}</h1>;
}
```

> `src/lib/i18n.ts` is client-only (uses localStorage). Server Components cannot call `useTranslation()`. All landing page sections that use translations MUST have `"use client"` directive.

### Pattern 6: Dark Page Route

```typescript
// src/app/dark/page.tsx
// Shares all section components with page.tsx — only visual differences
// are background color (brand-navy instead of white) and text color inversions.

import { HeroSection } from "@/components/home/HeroSection"
// ... other section imports

export default function DarkHomePage() {
  return (
    <div className="bg-brand-navy min-h-screen">
      <HeroSection variant="dark" />
      {/* ... */}
    </div>
  )
}
```

Recommended approach: pass a `variant?: "light" | "dark"` prop to each section component. The home-light page passes no variant (defaults to light). The dark page passes `variant="dark"`. This avoids duplicating component files.

### Pattern 7: Supabase Schema SQL

```sql
-- supabase/migrations/001_initial_schema.sql

-- contact_submissions
CREATE TABLE contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  team_size text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- mock_candidates
CREATE TABLE mock_candidates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  avatar_initials text NOT NULL,
  avatar_color text NOT NULL,
  crima_score integer NOT NULL,
  logic_score integer NOT NULL,
  comms_score integer NOT NULL,
  job_skill_score integer NOT NULL,
  trust_score integer NOT NULL,
  fraud_flag_severity text NOT NULL CHECK (fraud_flag_severity IN ('Low','Medium','High')),
  fraud_flag_count integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('Pending','Reviewed','Hired','Rejected')),
  test_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- questions
CREATE TABLE questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('qcm','dragdrop','casestudy','simulation','audiovideo','shorttext')),
  text_en text NOT NULL,
  text_fr text NOT NULL,
  options_en jsonb,
  options_fr jsonb,
  correct_answer jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- test_templates
CREATE TABLE test_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  duration_minutes integer NOT NULL,
  modules jsonb NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- test_sessions (for future phases)
CREATE TABLE test_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id uuid REFERENCES test_templates(id),
  candidate_info jsonb NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  score integer,
  sub_scores jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

-- contact_submissions: anon INSERT only (no SELECT — privacy)
CREATE POLICY "anon_insert_contact" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- mock_candidates: anon SELECT only (no email in list — see DATA-02)
-- Note: email column exclusion is handled at the API layer (GET /api/candidates
-- returns select without email). RLS allows full row read for authenticated roles.
CREATE POLICY "anon_read_candidates" ON mock_candidates
  FOR SELECT TO anon USING (true);

-- questions: anon SELECT only
CREATE POLICY "anon_read_questions" ON questions
  FOR SELECT TO anon USING (true);

-- test_templates: anon SELECT only
CREATE POLICY "anon_read_templates" ON test_templates
  FOR SELECT TO anon USING (true);

-- test_sessions: anon INSERT only
CREATE POLICY "anon_insert_sessions" ON test_sessions
  FOR INSERT TO anon WITH CHECK (true);
```

### Anti-Patterns to Avoid

- **Exposing service role key client-side:** Never use `SUPABASE_SERVICE_ROLE_KEY` in any file imported by a Client Component or any file with a `NEXT_PUBLIC_` variable name. Service role bypasses ALL RLS.
- **Putting translations in Server Components:** `useTranslation()` requires `"use client"` — the i18n setup uses localStorage (browser-only). All page sections that render text strings must be Client Components.
- **Single monolithic page.tsx:** `src/app/page.tsx` becomes very large if all sections are inlined. Extract each section to `src/components/home/` so it's manageable and testable independently.
- **Hardcoding strings in JSX:** All text goes through `t()` — zero hardcoded UI strings is the established rule from Phases 1–2. This includes button labels, error messages, and section headings.
- **Dark mode via CSS class toggle on `<html>`:** The `/dark` route is a separate URL, not a theme toggle. Do NOT use `next-themes` for this — it would affect the whole app. Apply dark classes directly on the page wrapper div.
- **Resend errors causing form submission failure:** The email is a notification, not the primary action. If Resend fails, the DB insert already succeeded. Return 200 and log the Resend error server-side only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state + validation | Custom useState per field + custom validator | `react-hook-form` + `zod` | RHF handles touched/dirty/error state, re-render optimization, and ref-based inputs; zod provides type-safe schemas reusable for client and server |
| Email sending | `nodemailer` + SMTP config | `resend` SDK | Resend handles deliverability, DKIM, SPF automatically; nodemailer requires SMTP server management |
| Supabase client creation | Manual fetch to Supabase REST | `@supabase/ssr` | Handles cookie propagation for RLS, TypeScript types, and retry logic |
| Toast notifications | Custom useState toast | Existing `toast()` from `sonner` (already wired) | Toaster already in layout.tsx — just call `toast.success()` or `toast.error()` |
| Scroll-reveal animations | `IntersectionObserver` + manual state | `motion` + existing variants from `src/lib/motion.ts` | `fadeIn`, `slideUp`, `staggerChildren` variants are already defined |
| Marquee animation | JS position tracking | CSS `animation: marquee` with `@keyframes` | Pure CSS marquee is more performant for trust bar logos |

**Key insight:** Phases 1–2 pre-built the entire component and animation foundation specifically so Phase 3 assembles, not rebuilds.

---

## Common Pitfalls

### Pitfall 1: i18n Keys Missing in One Locale File
**What goes wrong:** Component renders translation key string (`"home_hero_headline"`) instead of text in one language.
**Why it happens:** Keys added to `en.json` but forgotten in `fr.json` (or vice versa).
**How to avoid:** Add keys to BOTH files in the same task. Run an i18n audit (grep for all `t("home_`) keys and verify both files have them) before marking the wave complete.
**Warning signs:** Untranslated keys visible in FR mode during dev.

### Pitfall 2: "use client" Missing on Section Components
**What goes wrong:** Next.js build error — `localStorage is not defined` or `useTranslation must be used within I18nextProvider`.
**Why it happens:** `src/lib/i18n.ts` is client-only (browser APIs). Any component using `useTranslation()` must be a Client Component.
**How to avoid:** Every file in `src/components/home/` that calls `useTranslation()` must start with `"use client"`.
**Warning signs:** Build fails during `npm run build` with hydration errors.

### Pitfall 3: Service Role Key Accidentally in Client Bundle
**What goes wrong:** The service role key (`SUPABASE_SERVICE_ROLE_KEY`) appears in the browser bundle, giving any user full database admin access.
**Why it happens:** Variable used in a file that gets imported by a Client Component, or named with `NEXT_PUBLIC_` prefix by mistake.
**How to avoid:** (a) No `NEXT_PUBLIC_` prefix on service role key. (b) Admin supabase client created only in server-only files (`route.ts`, `scripts/seed.ts`). (c) After build, check `.next/static/` for key string.
**Warning signs:** `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` appearing anywhere in the codebase.

### Pitfall 4: `.env` Accidentally Committed
**What goes wrong:** Real Supabase keys appear in git history.
**Why it happens:** Developer creates `.env` before checking `.gitignore`.
**How to avoid:** `.gitignore` already has `.env*` (with `!.env.schema` exception). Verify with `git status` — `.env` must never appear as an untracked file once created. Run `git log --all --full-history -- .env` to confirm it has never been committed.
**Warning signs:** `git status` shows `.env` as a tracked or staged file.

### Pitfall 5: Rate Limiter Resets on Cold Start
**What goes wrong:** In-memory Map is empty after each serverless function restart — rate limit is bypassed when the function scales.
**Why it happens:** Next.js on serverless platforms (Vercel) may run multiple function instances; each has its own Map.
**How to avoid:** For v1 this is acceptable — document it and accept the limitation. The rate limiter is a good-faith DDoS/abuse guard, not a hard security boundary. The real protection is Supabase's rate limits on database connections.
**Warning signs:** If submission count in `contact_submissions` table far exceeds expected, upgrade to Redis-backed rate limiter.

### Pitfall 6: Resend `from` Address Not Verified
**What goes wrong:** Resend rejects the send call with a domain verification error.
**Why it happens:** The `from` domain must be verified in the Resend dashboard before sending.
**How to avoid:** For development, use `onboarding@resend.dev` (Resend's test address that works without domain verification). For production, configure the actual domain. Make `from` address configurable via an env var or code constant that can be swapped.
**Warning signs:** Resend SDK returns `{ error: { name: 'validation_error', message: 'domain not verified' } }`.

### Pitfall 7: Dark Page Inheriting Wrong Nav Background
**What goes wrong:** The white nav (`bg-white/95`) looks wrong against the navy page background.
**Why it happens:** `NavShell` is always white (LAND-06 requirement). The dark home page has a dark body but the nav is intentionally white — this is correct per design spec.
**How to avoid:** Accept the white nav on `/dark`. The nav is a shared component and not modified for the dark variant. If the design requires a dark nav on `/dark`, that's a design decision not covered by the current spec.

---

## Code Examples

### Framer Motion Section Reveal (using existing variants)
```typescript
// Source: src/lib/motion.ts (existing variants)
"use client";
import { motion } from "motion/react";
import { staggerChildren, slideUp } from "@/lib/motion";

export function WhatIsSection() {
  const { t } = useTranslation();
  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature) => (
        <motion.div key={feature.key} variants={slideUp}>
          {/* card content */}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Supabase Seed Script Pattern
```typescript
// scripts/seed.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()  // loads .env

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
)

async function seed() {
  // Clear existing seed data
  await supabase.from('mock_candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert candidates
  const { error } = await supabase.from('mock_candidates').insert(CANDIDATES)
  if (error) { console.error('Seed failed:', error.message); process.exit(1) }

  console.log('Seed complete')
}

seed()
```

Add to `package.json`:
```json
"db:seed": "npx tsx scripts/seed.ts"
```

This requires `tsx` for TypeScript execution: `npm install -D tsx`.

### ContactForm with React Hook Form + Zod
```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";  // existing wired Toaster

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Invalid email"),
  teamSize: z.enum(["1-10", "11-50", "51-200", "200+"], { required_error: "Select team size" }),
  message: z.string().optional(),
  gdprConsent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 429) {
      toast.error(t("contact_form_rate_limit_error"));
      return;
    }
    if (!res.ok) {
      toast.error(t("contact_form_error"));
      return;
    }
    toast.success(t("contact_form_success"));
    reset();
  };
  // ...
}
```

Note: `@hookform/resolvers` is a peer package needed to use zod with react-hook-form: `npm install @hookform/resolvers`.

---

## Existing Codebase — What's Ready to Use

This is the most important section for the planner. Phase 3 does NOT rebuild anything from Phases 1–2.

| Asset | Location | How to Use in Phase 3 |
|-------|----------|----------------------|
| `NavShell` | `src/components/nav/NavShell.tsx` | Already in `layout.tsx` — every page inherits it automatically. No work needed. |
| `Skeleton` | `src/components/Skeleton.tsx` | `<Skeleton className="h-8 w-full" />` — compose into section skeletons during async operations |
| `toast()` | `sonner` (Toaster in layout.tsx) | `import { toast } from "sonner"` — call `toast.success("...")` or `toast.error("...")` |
| `fadeIn`, `slideUp`, `staggerChildren` | `src/lib/motion.ts` | Import and apply as `variants` on `motion.div` elements |
| Brand tokens | `src/app/globals.css` (`@theme inline`) | `bg-brand-navy`, `text-brand-primary`, `bg-brand-light`, `text-brand-accent`, `bg-brand-secondary` — all available as Tailwind classes |
| CSS shadows | `src/app/globals.css` | `shadow-[var(--shadow-card)]`, `shadow-[var(--shadow-modal)]` — use for floating hero card |
| CSS shimmer | `src/app/globals.css` (`.shimmer` class) | Hero card loading state, section skeletons |
| `ContactModal` | `src/components/modals/ContactModal.tsx` | Reference only — Phase 3 uses an EMBEDDED form (in ContactSection), not a modal |
| `.dark` CSS vars | `src/app/globals.css` | Dark page uses `className="dark"` on wrapper — Shadcn semantic vars auto-switch |
| `useMediaQuery` | `src/lib/use-media-query.ts` | Testimonials carousel vs grid (mobile detection) |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Auth helpers deprecated; `@supabase/ssr` is the official SSR package |
| `createRouteHandlerClient()` | `createServerClient()` from `@supabase/ssr` | 2024 | Simpler API, same cookie handling |
| `createClientComponentClient()` | `createBrowserClient()` from `@supabase/ssr` | 2024 | Direct replacement |
| `pages/api/` routes | `app/api/[route]/route.ts` | Next.js 13 | App Router — use `NextRequest`/`NextResponse`, export named `POST`/`GET` functions |
| `ts-node` for scripts | `tsx` | 2023 | `tsx` is faster, no config file needed for TypeScript execution |
| React Hook Form v6 | React Hook Form v7 | 2022 | Different API — use `register`, `handleSubmit`, `formState.errors` (v7 API) |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Do not install — replaced by `@supabase/ssr`
- `next-i18next`: Not used in this project — project uses `react-i18next` directly (simpler, no static generation needed)
- `pages/api/*.ts`: Not used — project is App Router only

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None configured — CLAUDE.md explicitly states "No test runner is configured yet" |
| Config file | None |
| Quick run command | `npm run type-check` (tsc --noEmit) — catches type errors |
| Full suite command | `npm run build` (Next.js build — catches compile errors, missing env validation, route errors) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAND-01 | `/` renders without layout breaks | smoke (manual) | `npm run build` (build green) | ❌ Wave 0 — no test infra |
| LAND-02 | `/dark` renders without layout breaks | smoke (manual) | `npm run build` | ❌ Wave 0 |
| DATA-01 | Supabase tables exist with correct schema | integration (manual: check Supabase dashboard) | manual-only | ❌ |
| DATA-02 | RLS policies correct (anon insert on contact, anon read on others) | integration (manual: Supabase SQL editor) | manual-only | ❌ |
| DATA-03 | `npm run db:seed` populates tables with correct counts | smoke | `npm run db:seed` — exits 0 = pass | ❌ Wave 0 |
| DATA-10 | `.env.schema` has all 5 vars | static check | `cat .env.schema | grep -c @required` ≥ 5 | ❌ — schema exists but vars not added |
| SEC-01 | `.env` absent from git history | static check | `git log --all -- .env` returns empty | ✅ (verify) |

### Sampling Rate

- **Per task commit:** `npm run type-check` (zero TypeScript errors)
- **Per wave merge:** `npm run build` (full build green, no route errors)
- **Phase gate:** Build green + manual smoke of `/`, `/dark`, contact form submit, `npm run db:seed` output verified

### Wave 0 Gaps

- [ ] No test runner configured — this is an accepted project decision per CLAUDE.md
- [ ] Validation for this phase relies on: TypeScript type-check, Next.js build, manual smoke testing, and seed script exit code
- [ ] If a test runner is added in a future phase, retroactive tests for LAND-01/LAND-02 would be: Playwright smoke tests for `/` and `/dark` at 320px and 1440px widths

---

## Open Questions

1. **Resend `from` address for development**
   - What we know: Resend requires domain verification for custom `from` addresses; `onboarding@resend.dev` works without verification
   - What's unclear: Whether the developer has a verified domain set up in Resend
   - Recommendation: Default to `onboarding@resend.dev` in the code with a comment to swap to the real address post-domain-verification. Make it a constant `RESEND_FROM_ADDRESS` in the API route.

2. **Supabase project setup**
   - What we know: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not yet in `.env` (the file doesn't exist yet)
   - What's unclear: Whether a Supabase project already exists or needs to be created
   - Recommendation: The plan should include a Wave 0 task: "Create Supabase project, copy URL and keys to `.env`, run migration SQL in Supabase SQL editor." This is a manual setup step that must precede all other Supabase tasks.

3. **Home-light vs home-dark section-level differences**
   - What we know: The spec says "dark variant of home page" — implies same sections with inverted colors
   - What's unclear: Whether any sections are structurally different (different layout, different copy) or purely color-inverted
   - Recommendation: Implement home-light fully, then create home-dark as a wrapper that passes `variant="dark"` to each section. If a section needs a different layout on dark, add a `dark` branch inside the component rather than duplicating it.

4. **`ADMIN_EMAIL` env var not in the five declared vars**
   - What we know: The contact form sends to an admin email address; the current env var list in DATA-10 has exactly 5 vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`
   - What's unclear: Is the admin email a 6th env var, or should it be hardcoded/derived from another var?
   - Recommendation: Add `ADMIN_EMAIL` as a 6th env var in `.env.schema` (with `@required @sensitive=false`). The requirements say "all five environment variables" but the admin email is clearly needed for Resend. This is a minor spec gap — add it and document it.

---

## Design Reference Available

The full landing page copy spec exists at `design_context/landing_pages/CrismaTest_LandingPage_Content.md`. This file contains:
- All 9 section structures with headline, sub-headline, body copy, and CTAs
- All 7 FAQ questions and answers
- Trust bar company names (NexaTech, ZestyBite, CozyNest, Energetix, DigiMinds, VitalFit, Eleganza)
- Feature grid content for "What is CrismaTest?" (6 cards)
- "For Companies" feature list (7 items, 2-column grid)
- CrismaScore breakdown (5 score types)
- Anti-fraud detection grid (8 detection types, 4-column 2-row)
- Test category grid (9 categories, 3-column)
- Footer column structure (4 columns)

The CONTEXT.md adds testimonials (3) as a requirement not in the original content doc — those must be written by Claude during implementation.

---

## Sources

### Primary (HIGH confidence)
- `design_context/landing_pages/CrismaTest_LandingPage_Content.md` — full landing page copy and structure
- `.planning/phases/03-landing-pages-data-foundation/03-CONTEXT.md` — locked decisions and scope
- `src/app/globals.css` — existing brand tokens, CSS vars, shimmer class
- `src/lib/motion.ts` — existing animation variants
- `src/lib/i18n.ts` — i18n setup and localStorage key
- `package.json` — installed packages and versions
- `locales/en.json`, `locales/fr.json` — existing translation key format
- [varlock Schema docs](https://varlock.dev/guides/schema/) — .env.schema format, decorators

### Secondary (MEDIUM confidence)
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) — plain text email pattern, App Router route example
- [Supabase SSR client docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client) — createBrowserClient, createServerClient patterns
- [Supabase RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security) — policy SQL syntax
- [FreeCodeCamp in-memory rate limiter](https://www.freecodecamp.org/news/how-to-build-an-in-memory-rate-limiter-in-nextjs/) — Map-based rate limiter pattern

### Tertiary (LOW confidence — verify before use)
- Service role key client creation pattern (`createClient` with `auth: { persistSession: false }`) — from community discussions, not official docs. Verify against current `@supabase/supabase-js` docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries either already installed or are official SDKs with clear docs
- Architecture: HIGH — based on existing codebase patterns (Phases 1–2) plus official Supabase/Resend docs
- Pitfalls: HIGH — most derived from decisions already documented in STATE.md and codebase patterns
- Seed data structure: MEDIUM — schema is informed by DATA requirements; exact column names may need adjustment to match what Phase 5 API routes expect

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (30 days — stable libraries; Supabase SSR API changes rarely)
