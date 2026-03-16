# Landing Pages Redesign Session

## Restart server command
```bash
bash "C:\Users\chris\.claude\plugins\cache\superpowers-dev\superpowers\5.0.2\skills\brainstorming\scripts\start-server.sh" --project-dir "C:\Users\chris\Downloads\Projects\CrismaTech\CrismTest\crismatest" --foreground &
```
Note: use --foreground & to survive on Windows/Git Bash

## Design Decisions (FINAL — approved by user)
- **Style**: Bold / Data-heavy (Datashake-inspired)
- **Color palette**: Keep existing blue — #1B4FD8 accent, #0F2A6B dark/navy
- **Scope**: Home page (`home` frame, id: `0BlIi`) only first. Other frames later if approved.

## File to edit
`design/landing-pages.pen` — frame `home` (id: `0BlIi`), 1440px wide

## Current home frame sections (existing node IDs)
- `iphSp` — nav (keep, but ADD language switcher)
- `5ZFaS` — hero (redesign)
- `j5K0L` — trustBar (redesign)
- `AYxmS` — whatIs (replace with "The Problem" section)
- `JB9QV` — steps (redesign → "The Solution" section)
- `PjyHP` — forCompanies (replace with stats row)
- `Gfyxy` — antiFraud (replace with CrismaScore section)
- `jPCvj` — testLibrary (remove / fold into other sections)
- `INfTY` — testimonials (redesign → large quote block)
- `UKGf9` — faq (redesign → decorated label + bold title)
- `Ayjxs` — finalCta (redesign → dark navy + dot grid)
- `0Dffa` — footer (keep as-is)

## Approved Homepage Redesign (section by section)

### 1. NAV — kept + language switcher added
- Keep existing layout
- ADD language switcher (FR/EN toggle) in navActions area (right side, before "Book a Demo")
- Style: small pill or flag+text dropdown, consistent with nav

### 2. HERO — full redesign
- White background (remove blue gradient)
- Left side (width ~580px):
  - Announcement badge: "🚀 Now with AI-powered scoring" (border, rounded, small)
  - Bold headline: "Stop guessing. Hire on **verified skills.**" (accent color on keyword)
  - Subtext: body copy about replacing resume screening
  - Two CTAs: filled blue "Book a demo ↗" + dashed ghost "Explore platform"
- Right side: product dashboard UI mockup (white card, tabbed, candidate score cards + stats)

### 3. TRUST BAR — redesign
- Label: "Powering better hiring for leading companies"
- Horizontal logo row, centered, clean

### 4. "THE PROBLEM" — NEW section (replaces whatIs)
- Section label with arrow decorators: → The Problem ←
- Bold large headline: "You're making hiring decisions on incomplete foundations"
- Subtext paragraph
- 3 problem cards (dashed red border): Résumé screening / Unstructured interviews / No skill validation

### 5. "THE SOLUTION" — redesign (from steps)
- Section label: → The Solution ←
- Left: headline with blue accent, body copy, numbered steps list (1-4)
- Right: product UI — candidate assessment ranking card (dark/light)

### 6. STATS ROW — redesign (replaces forCompanies)
- 4-column grid, border dividers
- Stats: ⚡ 10 min · 🎯 89% · 🔒 Anti-cheat · 📊 50+ tests

### 7. CRIMSASCORE — redesign (replaces antiFraud)
- Section label: → CrismaScore ←
- Left: headline, subtext, 3 feature rows with icons
- Right: dark navy card showing score breakdown bars

### 8. TESTIMONIALS — redesign
- Section label: → What customers say ←
- Large quote block (left) + colorful vertical person-label panel (right, 3 people)

### 9. FAQ — redesign
- Section label: → FAQs ←
- Bold title: "Your questions, answered."
- Accordion rows with + icon

### 10. FINAL CTA — redesign
- Full-width dark navy (#0F2A6B) background
- Dot grid texture (radial-gradient dots)
- Section label, bold title with blue accent, subtext
- Two buttons: white filled "Start for free ↗" + ghost outline "Book a demo"

### 11. FOOTER — keep as-is

## Implementation Approach
- Work section by section in `batch_design` calls (max 25 ops each)
- Use placeholder:true on the home frame while working
- Take screenshots after each section to verify
- Remove placeholder when done

## Existing Design Variables (from design/landing-pages.pen)
- Primary: #1B4FD8
- Dark: #0F2A6B
- Light bg: #EEF2FF
- Font: Inter
- Page width: 1440px
- Padding: [0, 120] horizontal on most sections

## Status
- [x] Design direction chosen: Bold/Data-heavy
- [x] Color: keep existing blue
- [x] Scope: home page first
- [x] Wireframe presented and approved
- [x] Implementation — COMPLETE (2026-03-15)
