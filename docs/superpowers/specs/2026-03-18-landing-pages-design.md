# Landing Pages Design Spec
**Date:** 2026-03-18
**File:** `design/landing-pages.pen`
**Status:** Approved

## Overview

CrismaTech is an HR/recruiting platform. The platform is **free for candidates/freelancers** and **paid for companies**. Key differentiator: the **CrismaScore** — a proprietary skill-test-based rating that candidates earn and companies use to filter talent.

This spec covers 6 new frames to be added to `landing-pages.pen`, matching the existing `home-light` and `home-dark` color schemes.

> **Scope:** Desktop only (1440px wide). Mobile frames are a separate future task.

---

## Design System

- **Dark frames** match `home-dark`: deep navy/dark blue background, purple/blue accents, white text
- **Light frames** match `home-light`: white/light background, blue accent colors, dark text
- **Components**: Modern shadcn-style UI — cards, badges, steppers, toggles, comparison tables, contact forms
- **Typography**: Consistent with home frames (Geist Sans)
- **Navbar**: Identical across all pages (same links, same primary CTA "Get started") — no per-page CTA variation
- **Footer**: Same as home

---

## Frame 1 & 2: candidates-light / candidates-dark

### Purpose
Convert freelancers/job-seekers into registered users. Emphasize that it's **completely free** and that the CrismaScore gives them a competitive edge.

### Sections

| # | Section | Details |
|---|---------|---------|
| 1 | **Navbar** | Same as home (links: For Candidates, For Companies, Pricing; CTA: "Get started") |
| 2 | **Hero** | Headline: "Get discovered. Get hired." Subheadline: "Build your CrismaScore and let top companies find you — completely free." CTA button: "Create free profile". Visual: profile card mockup with CrismaScore badge |
| 3 | **How it works** | Horizontal stepper, 4 steps: (1) Build your profile → (2) Take skill tests → (3) Earn your CrismaScore → (4) Get matched with companies |
| 4 | **Benefits grid** | 3-column card grid: "AI-matched opportunities" / "Instant job notifications" / "Reach global companies" |
| 5 | **Testimonials** | 3 freelancer quote cards. Sample: "CrismaScore helped me land three interviews in my first week." — Ana R., UX Designer / "I had offers from two companies before I even applied." — Malik T., Backend Dev / "The skill tests showed companies what my CV couldn't." — Lucia M., Product Manager |
| 6 | **CTA banner** | Headline: "Start for free — no credit card required." Button: "Join now" |
| 7 | **Footer** | Same as home |

---

## Frame 3 & 4: companies-light / companies-dark

### Purpose
Convert HR managers/recruiters into paying customers. Emphasize speed, quality of talent via CrismaScore, and team tools.

### Sections

| # | Section | Details |
|---|---------|---------|
| 1 | **Navbar** | Same as home |
| 2 | **Hero** | Headline: "Hire the right talent, faster." Subheadline: "Browse pre-scored candidates and build your team with confidence." CTA: "Start hiring". Visual: talent pool dashboard preview |
| 3 | **Trust logos** | 6 placeholder company logos in grayscale monochrome: Acme Corp, Globex, Initech, Umbrella Co, Hooli, Dunder Mifflin (styled as clean wordmarks) |
| 4 | **Features** | 3-column cards: "CrismaScore filtering — filter by verified skill score, not just résumés" / "Bulk screening tools — review dozens of candidates at once with side-by-side comparison" / "Team collaboration — invite teammates, leave notes, and align on decisions together" |
| 5 | **How it works** | 3-step flow: (1) Post a role → (2) Browse scored talent → (3) Make an offer |
| 6 | **Testimonials** | 3 recruiter/HR quote cards. Sample: "We cut our screening time by 60% in the first month." — Sarah K., Head of Talent @ Acme / "CrismaScore gave us objective data to back hiring decisions." — James L., HR Director @ Globex / "The best tool we've added to our recruiting stack." — Priya N., Recruiter @ Hooli |
| 7 | **CTA banner** | Headline: "See your first shortlist in 24 hours." Button: "Start hiring today" |
| 8 | **Footer** | Same as home |

---

## Frame 5 & 6: pricing-light / pricing-dark

### Purpose
Convert company visitors into subscribers. Show clear value at each tier, call out free access for candidates, and capture enterprise leads via contact form.

### Pricing Tiers (placeholder values, pending product decision)

| Tier | Price | Target |
|------|-------|--------|
| Starter | $49/mo | Small teams, early hiring |
| Growth | $149/mo | Scaling companies |
| Enterprise | Custom | Large orgs, compliance needs |

### Sections

| # | Section | Details |
|---|---------|---------|
| 1 | **Navbar** | Same as home |
| 2 | **Hero** | Headline: "Simple pricing for every team." Monthly/Annual billing toggle (annual shows "-20%" badge) |
| 3 | **Free callout** | Full-width banner placed **above** pricing cards, teal/green accent background: "Always free for candidates & freelancers — no account needed to explore" |
| 4 | **Pricing cards** | 3 cards side by side. Growth card highlighted as "Most popular" with accent border. **Starter $49/mo** — 5 active roles/mo, basic keyword filters, email support, 1 seat / **Growth $149/mo** — unlimited roles, full CrismaScore access, advanced filters, 5 team seats, priority support / **Enterprise Custom** — unlimited roles, CrismaScore + custom weighting, SSO, API access, dedicated CSM, custom seats |
| 5 | **Feature table** | Comparison grid — rows below, cols = Starter / Growth / Enterprise |
| 6 | **Contact form** | Enterprise inquiry: Name, Company name, Work email, Team size (dropdown: 1–10, 11–50, 51–200, 200+), Message, Submit CTA "Request a demo" |
| 7 | **FAQ** | 5 questions: "Can I change or cancel my plan?" / "Is there a free trial?" / "How does billing work?" / "What counts as an active role?" / "Do I need a credit card to start?" |
| 8 | **Footer** | Same as home |

### Feature Table Rows

| Feature | Starter | Growth | Enterprise |
|---------|---------|--------|------------|
| Active roles/month | 5 | Unlimited | Unlimited |
| CrismaScore access | Basic view | Full access | Full access + custom weighting |
| Candidate filters | Keyword only | Score, skills, location, availability | All filters + custom criteria |
| Team seats | 1 | 5 | Custom |
| Bulk screening | — | ✓ | ✓ |
| Side-by-side comparison | — | ✓ | ✓ |
| Analytics & reports | — | ✓ | Advanced |
| API access | — | — | ✓ |
| SSO | — | — | ✓ |
| Dedicated CSM | — | — | ✓ |
| Support | Email | Priority email | 24/7 dedicated |
| Integrations (ATS, Slack) | — | ✓ | ✓ |

---

## Execution Notes

- Create placeholder frames immediately for all 6 frames before styling
- Dark variants use the same layout as light variants, only colors differ — build light first, then copy+recolor for dark
- Copy home navbar/footer structure into each new frame rather than rebuilding
- Use shadcn-style components: Badge, Card, Button, Tabs (billing toggle), Table, Input, Textarea, Select
- Reuse any existing reusable components from `components.pen` where applicable
- Each frame: 1440px wide, height fits content
- Stepper on candidates page: horizontal, numbered circles connected by line
- Testimonial cards: avatar circle, quote text, name + role below, subtle card shadow
- Pricing cards: rounded corners, shadow, feature list with checkmarks, prominent CTA button per card
