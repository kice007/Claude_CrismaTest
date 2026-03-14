# Phase 3: Landing Pages + Data Foundation - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

All five marketing pages (/, /for-candidates, /for-companies, /pricing, /contact) live and bilingual. Supabase schema created, seeded with realistic data, and the contact form posts to Supabase + Resend. Auth, test flow, and dashboard are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Home page hero
- Floating dashboard card: simplified mockup of the /dashboard candidate table — blurred/frosted edges, a few rows with avatar initials + CrismaScore chips visible. Shows the B2B product without live data.
- Hero CTAs (dual persona): "Take the Test" (primary, candidate-facing) + "See How It Works" (secondary ghost button, company-facing)
- Background: navy (brand-navy) with gradient as specced

### Home page sections
- Full spec — all sections included: hero, trust bar marquee, what-is, 3-step process, for-companies feature grid, anti-fraud section, test library preview, testimonials, FAQ, footer
- Testimonials: 3 — renders as 3-column grid on desktop, carousel on mobile
- FAQ: 6-8 items — covers typical objections (cost, time, fraud, accuracy, privacy, integrations)

### Pricing page
- Layout: 4 plan cards side by side (not a comparison table)
- Recommended plan: Pro ($149) — taller card, brand-primary colored border, "Most Popular" badge
- Annual billing toggle: 20% discount, toggle updates all card prices live (e.g. $49 → $39/mo billed annually), "Save 20%" badge on the toggle itself
- Plan features: Claude defines sensible feature tiers — Free (5 tests/mo, basic reporting), Starter (50 tests/mo, PDF export, email support), Pro (unlimited tests, anti-fraud proctoring, team seats, API access), Enterprise (custom everything + SSO + dedicated support)
- "Get Started" CTAs on paid plans link to /checkout/[plan]; Enterprise shows "Contact Us" → /contact

### Contact form fields + behavior
- Fields exactly as specced: name (required), company (required), email (required), team size dropdown (1-10 / 11-50 / 51-200 / 200+, required), message (textarea, optional), GDPR consent checkbox (required to enable submit)
- Success state: existing Toast component slides in — "Message sent! We'll be in touch within 24 hours." — form resets to empty
- Rate-limit error (3/IP/hour): error toast — "Too many requests — please try again later." No stack trace, no technical detail (SEC-05 compliant)
- Validation feedback: inline field-level errors (red text below field) on blur/submit attempt

### Contact form email (Resend)
- Format: plain-text admin notification
- To: admin email (env var)
- Subject: `New demo request from [Company]`
- Body: name, company, email (clickable mailto), team size, message, submission timestamp
- No HTML template — plain text only

### Seed data — candidates
- Count: 40 mock candidates (within the 30-50 spec range)
- Score distribution: bell curve, 55-85 range — most cluster around 65-75, a few at 80-85, a few at 55-60
- Roles: 8 professional roles, ~5 candidates each — Software Engineer, Product Manager, Sales Rep, Customer Support, Marketing Manager, Data Analyst, UX Designer, Operations Manager
- Profiles: diverse, realistic names (mix of French, English, African, Asian names); initials-based avatars colored by role; varied fraud flag severity (Low/Medium/High) and status (Pending/Reviewed/Hired/Rejected)

### Seed data — questions
- Count: ~100 questions (within the 80-120 spec range)
- Coverage: 6 question types × 8 roles, ~2 questions per type per role
- Language: full bilingual — every question has `text_en` and `text_fr` fields (required by DATA-03)
- Claude writes realistic question text across all types (QCM, drag & drop, case study, simulation, audio/video prompt, short text)

### Seed data — test templates
- 8 templates, one per role
- Each template: role name, estimated duration (10-15 min), module list, slug, active=true

### Claude's Discretion
- Exact copy for testimonials, FAQ items, what-is section, anti-fraud section, test library preview
- Trust bar company logos (use well-known company names as text, or placeholder SVG logos)
- Exact shimmer skeleton layouts per landing page section
- IP-based rate limiting implementation (in-memory vs. Supabase-backed — choose simplest that works for v1)
- Specific fraud flag combinations per candidate in seed data

</decisions>

<specifics>
## Specific Ideas

- Hero floating card should feel like a product screenshot — not a chart or gauge. The dashboard table view (candidate list with CrismaScore chips) is the most compelling B2B visual. Frosted/blurred edges so it doesn't look like a raw screenshot.
- Pricing Pro plan card should feel "lifted" — slightly taller, with a brand-primary top border accent (common SaaS pattern). The "Most Popular" badge sits at the top of the card.
- Annual toggle: the price switch should feel instant and smooth — use state with animated number transition if feasible, otherwise just swap the text.
- Contact form consent checkbox: "I agree to CrismaTest's Privacy Policy and consent to being contacted about my request." — links to /privacy (static page, not in scope for Phase 3 — link can 404 for now).
- Seed candidate email format: `firstname.lastname@company-mock.com` — clearly fake but well-formed.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/nav/NavShell.tsx`: all landing pages automatically inherit the fixed nav — no nav work needed in this phase
- `src/components/EmptyState.tsx`: available for any empty sections or edge cases
- `src/components/Skeleton.tsx`: compose layout-specific skeleton screens per page section (per Phase 2 decision)
- `src/lib/motion.ts`: `fadeIn`, `slideUp`, `staggerChildren` variants ready — hero animations, testimonial cards, FAQ accordion all use these
- `src/components/modals/ContactModal.tsx`: already built in Phase 2 — /contact page may reuse or adapt this pattern for the full-page form
- All toast/modal components: already built and ready — contact form success/error states use existing `toast()` call

### Established Patterns
- All strings via `useTranslation()` — landing page copy goes into `/locales/en.json` and `/locales/fr.json` before use (established Phase 1, enforced Phase 2)
- Framer Motion variants from `src/lib/motion.ts` — all new animations import from here, not defined inline
- Tailwind v4 `@theme inline` in `globals.css` — any new tokens follow this pattern
- Mobile bottom sheet for modals — contact form modal variant uses Drawer (Phase 2 decision), though /contact is a full page form not a modal
- 48×48px touch targets and 16px min font on inputs — required on all form elements

### Integration Points
- `/locales/en.json` and `/locales/fr.json`: all landing page copy added here before components are built
- `src/app/page.tsx`: home route (currently placeholder) — becomes the full home page
- New routes: `src/app/for-candidates/page.tsx`, `src/app/for-companies/page.tsx`, `src/app/pricing/page.tsx`, `src/app/contact/page.tsx`
- `src/app/api/contact/route.ts`: new API route for POST /api/contact
- Supabase client: needs `src/lib/supabase.ts` (client + server variants) for API routes and seed script

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-landing-pages-data-foundation*
*Context gathered: 2026-03-14*
