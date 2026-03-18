# Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Design 6 new frames in `design/landing-pages.pen` — candidates-light, candidates-dark, companies-light, companies-dark, pricing-light, pricing-dark — matching the color palette of the existing home-light and home-dark frames.

**Architecture:** Build light variant first for each page type, then copy and recolor for the dark variant. Copy navbar/footer directly from the home frames. Design each page section by section with screenshot verification after each section. Commit after each completed frame pair.

**Tech Stack:** Pencil MCP tools (`batch_design`, `batch_get`, `get_screenshot`, `snapshot_layout`), shadcn-style UI components, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-03-18-landing-pages-design.md`

---

## Key Reference IDs (do not recreate these — copy them)

### home-dark frame: `Mnjjf` (x: -10741)
| Section | ID | Height |
|---------|-----|--------|
| Navbar | `dwG9D` | 72 |
| Hero | `R3oJ3` | 680 |
| Footer | `WdFFZ` | 306 |

### home-light frame: `jtIFY` (x: -8949)
| Section | ID | Height |
|---------|-----|--------|
| Navbar | `qD8sg` | 72 |
| Hero | `Mbfx0` | 1376 |
| Footer | `QTzIg` | 306 |

### Canvas Layout (place new frames here)
All frames: 1440px wide. Space frames ~352px apart horizontally.
```
home-dark (-10741)  home-light (-8949)  candidates-light (-7157)  candidates-dark (-5365)  companies-light (-3573)  companies-dark (-1781)  pricing-light (11)  pricing-dark (1803)
```

---

## Color Tokens (no variables defined — use hex directly)

### Light palette (match home-light)
- Background: `#FFFFFF`
- Surface/card: `#F8FAFC`
- Border: `#E2E8F0`
- Primary blue: `#2563EB`
- Primary blue hover: `#1D4ED8`
- Text primary: `#0F172A`
- Text secondary: `#64748B`
- Accent teal (free badge): `#0D9488`
- Green badge bg: `#DCFCE7`, text: `#166534`

### Dark palette (match home-dark)
- Background: `#0A0F1E`
- Alt section bg: `#0D1117` (very deep, used for secondary sections)
- Surface/card: `#111827`
- Border: `#1E293B`
- Primary: `#6366F1` (indigo/purple)
- Primary bright: `#818CF8`
- Primary dark-hover: `#4338CA`
- Text primary: `#F1F5F9`
- Text secondary: `#94A3B8`
- Accent teal: `#14B8A6`
- Light blue tint (dark): `#1E1B4B` (replaces all light-blue fills like `#DBEAFE`, `#E0E7FF`, `#EFF6FF`)

---

## Chunk 1: candidates-light

### Task 1.1 — Create placeholder frame

- [ ] Call `batch_design` to insert the candidates-light frame as a top-level placeholder:
```javascript
cl=I(document,{type:"frame",id:"candidates-light",name:"candidates-light",layout:"vertical",width:1440,height:"fit_content(4000)",x:-7157,y:0,fill:"#FFFFFF",placeholder:true,clip:true})
```

### Task 1.2 — Navbar (copy from home-light)

- [ ] Copy the navbar from home-light:
```javascript
nav=C("qD8sg","candidates-light",{width:"fill_container"})
```
- [ ] Take screenshot of candidates-light to verify navbar placed correctly.

### Task 1.3 — Hero section

- [ ] Insert hero section:
```javascript
hero=I("candidates-light",{type:"frame",layout:"vertical",width:"fill_container",height:"fit_content",padding:[80,80,80,80],gap:24,fill:{type:"gradient",gradientType:"linear",rotation:180,colors:[{color:"#EFF6FF",position:0},{color:"#FFFFFF",position:1}]},alignItems:"center"})
badge=I(hero,{type:"frame",layout:"horizontal",padding:[6,14,6,14],gap:8,fill:"#DBEAFE",cornerRadius:99,alignItems:"center"})
I(badge,{type:"icon_font",iconFontName:"sparkles",iconFontFamily:"lucide",width:14,height:14,fill:"#2563EB"})
I(badge,{type:"text",content:"Free for candidates",fontSize:12,fontWeight:"600",fill:"#2563EB"})
h1=I(hero,{type:"text",content:"Get discovered.\nGet hired.",textGrowth:"fixed-width",width:760,fontSize:64,fontWeight:"700",fill:"#0F172A",textAlign:"center",lineHeight:1.1})
sub=I(hero,{type:"text",content:"Build your CrismaScore and let top companies find you — completely free.",textGrowth:"fixed-width",width:560,fontSize:18,fill:"#64748B",textAlign:"center",lineHeight:1.6})
ctaRow=I(hero,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
btnPrimary=I(ctaRow,{type:"frame",layout:"horizontal",padding:[14,28,14,28],fill:"#2563EB",cornerRadius:8,alignItems:"center",gap:8})
I(btnPrimary,{type:"text",content:"Create free profile",fontSize:16,fontWeight:"600",fill:"#FFFFFF"})
btnSecondary=I(ctaRow,{type:"frame",layout:"horizontal",padding:[14,28,14,28],fill:"#FFFFFF",cornerRadius:8,alignItems:"center",gap:8,stroke:{fill:"#E2E8F0",thickness:1}})
I(btnSecondary,{type:"text",content:"See how it works",fontSize:16,fontWeight:"500",fill:"#0F172A"})
heroCard=I(hero,{type:"frame",layout:"vertical",width:480,height:200,fill:"#FFFFFF",cornerRadius:16,padding:24,gap:16,stroke:{fill:"#E2E8F0",thickness:1},effect:{type:"shadow",offset:{x:0,y:8},blur:32,color:"#0000001A"}})
cardTop=I(heroCard,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
avatarCircle=I(cardTop,{type:"ellipse",width:48,height:48,fill:"#DBEAFE"})
I(avatarCircle,{type:"text",content:"AK",fontSize:14,fontWeight:"700",fill:"#2563EB"})
cardInfo=I(cardTop,{type:"frame",layout:"vertical",gap:4})
I(cardInfo,{type:"text",content:"Alex Kim",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(cardInfo,{type:"text",content:"Full-Stack Developer",fontSize:12,fill:"#64748B"})
scoreBadge=I(cardTop,{type:"frame",layout:"horizontal",padding:[4,10,4,10],fill:"#2563EB",cornerRadius:99})
I(scoreBadge,{type:"text",content:"CrismaScore 94",fontSize:11,fontWeight:"700",fill:"#FFFFFF"})
skillRow=I(heroCard,{type:"frame",layout:"horizontal",gap:8})
skill1=I(skillRow,{type:"frame",layout:"horizontal",padding:[4,10,4,10],fill:"#F1F5F9",cornerRadius:6})
I(skill1,{type:"text",content:"React",fontSize:12,fill:"#475569"})
skill2=I(skillRow,{type:"frame",layout:"horizontal",padding:[4,10,4,10],fill:"#F1F5F9",cornerRadius:6})
I(skill2,{type:"text",content:"Node.js",fontSize:12,fill:"#475569"})
skill3=I(skillRow,{type:"frame",layout:"horizontal",padding:[4,10,4,10],fill:"#F1F5F9",cornerRadius:6})
I(skill3,{type:"text",content:"TypeScript",fontSize:12,fill:"#475569"})
matchBanner=I(heroCard,{type:"frame",layout:"horizontal",padding:[10,14,10,14],fill:"#DCFCE7",cornerRadius:8,gap:8,alignItems:"center"})
I(matchBanner,{type:"icon_font",iconFontName:"check-circle",iconFontFamily:"lucide",width:16,height:16,fill:"#16A34A"})
I(matchBanner,{type:"text",content:"3 companies matched today",fontSize:13,fill:"#166534",fontWeight:"500"})
```
- [ ] Screenshot hero to verify layout and visual quality.

### Task 1.4 — How it works (stepper)

- [ ] Insert stepper section:
```javascript
stepper=I("candidates-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#F8FAFC",alignItems:"center"})
stepHeader=I(stepper,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(stepHeader,{type:"text",content:"How it works",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
I(stepHeader,{type:"text",content:"Four simple steps to land your next opportunity",fontSize:16,fill:"#64748B",textAlign:"center"})
// Stepper uses alignItems:"center" so connectors (2px height) auto-center between circles
stepsRow=I(stepper,{type:"frame",layout:"horizontal",gap:0,width:"fill_container",alignItems:"center"})
step1=I(stepsRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,16,0,16]})
circle1=I(step1,{type:"frame",layout:"horizontal",width:48,height:48,fill:"#2563EB",cornerRadius:99,alignItems:"center",justifyContent:"center"})
I(circle1,{type:"text",content:"1",fontSize:18,fontWeight:"700",fill:"#FFFFFF"})
I(step1,{type:"text",content:"Build your profile",fontSize:15,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(step1,{type:"text",content:"Add your skills, experience, and portfolio",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.5})
// Connector: no y property — auto-layout + alignItems:"center" on parent handles vertical centering
connector1=I(stepsRow,{type:"frame",width:48,height:2,fill:"#CBD5E1"})
step2=I(stepsRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,16,0,16]})
circle2=I(step2,{type:"frame",layout:"horizontal",width:48,height:48,fill:"#2563EB",cornerRadius:99,alignItems:"center",justifyContent:"center"})
I(circle2,{type:"text",content:"2",fontSize:18,fontWeight:"700",fill:"#FFFFFF"})
I(step2,{type:"text",content:"Take skill tests",fontSize:15,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(step2,{type:"text",content:"Prove your expertise with verified assessments",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.5})
connector2=I(stepsRow,{type:"frame",width:48,height:2,fill:"#CBD5E1"})
step3=I(stepsRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,16,0,16]})
circle3=I(step3,{type:"frame",layout:"horizontal",width:48,height:48,fill:"#2563EB",cornerRadius:99,alignItems:"center",justifyContent:"center"})
I(circle3,{type:"text",content:"3",fontSize:18,fontWeight:"700",fill:"#FFFFFF"})
I(step3,{type:"text",content:"Earn your CrismaScore",fontSize:15,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(step3,{type:"text",content:"Get a verified score companies trust",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.5})
connector3=I(stepsRow,{type:"frame",width:48,height:2,fill:"#CBD5E1"})
step4=I(stepsRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,16,0,16]})
circle4=I(step4,{type:"frame",layout:"horizontal",width:48,height:48,fill:"#2563EB",cornerRadius:99,alignItems:"center",justifyContent:"center"})
I(circle4,{type:"text",content:"4",fontSize:18,fontWeight:"700",fill:"#FFFFFF"})
I(step4,{type:"text",content:"Get matched",fontSize:15,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(step4,{type:"text",content:"Companies reach out to you directly",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.5})
```
- [ ] Screenshot the stepper section to verify horizontal step layout and connector centering.

### Task 1.5 — Benefits grid

```javascript
benefits=I("candidates-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#FFFFFF",alignItems:"center"})
bHeader=I(benefits,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(bHeader,{type:"text",content:"Everything you need to get hired",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
I(bHeader,{type:"text",content:"Built for modern candidates who want to stand out",fontSize:16,fill:"#64748B",textAlign:"center"})
bGrid=I(benefits,{type:"frame",layout:"horizontal",gap:24,width:"fill_container",alignItems:"start"})
bCard1=I(bGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
bIcon1=I(bCard1,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(bIcon1,{type:"icon_font",iconFontName:"target",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(bCard1,{type:"text",content:"AI-matched opportunities",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(bCard1,{type:"text",content:"Our algorithm matches you with roles that fit your CrismaScore, skills, and career goals.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
bCard2=I(bGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
bIcon2=I(bCard2,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(bIcon2,{type:"icon_font",iconFontName:"bell",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(bCard2,{type:"text",content:"Instant job notifications",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(bCard2,{type:"text",content:"Get notified the moment a company shortlists you or a new matching role is posted.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
bCard3=I(bGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
bIcon3=I(bCard3,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(bIcon3,{type:"icon_font",iconFontName:"globe",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(bCard3,{type:"text",content:"Reach global companies",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(bCard3,{type:"text",content:"From startups to enterprises — your profile is visible to companies worldwide looking for talent.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
```

### Task 1.6 — Testimonials

```javascript
testimonials=I("candidates-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#F8FAFC",alignItems:"center"})
tHeader=I(testimonials,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(tHeader,{type:"text",content:"Freelancers love CrismaTech",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
tRow=I(testimonials,{type:"frame",layout:"horizontal",gap:24,width:"fill_container",alignItems:"start"})
tCard1=I(tRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#FFFFFF",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1},effect:{type:"shadow",offset:{x:0,y:2},blur:8,color:"#0000000D"}})
I(tCard1,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(tCard1,{type:"text",content:"CrismaScore helped me land three interviews in my first week.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
tAuthor1=I(tCard1,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
tAvatar1=I(tAuthor1,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(tAvatar1,{type:"text",content:"AR",fontSize:13,fontWeight:"700",fill:"#2563EB"})
tInfo1=I(tAuthor1,{type:"frame",layout:"vertical",gap:2})
I(tInfo1,{type:"text",content:"Ana R.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(tInfo1,{type:"text",content:"UX Designer",fontSize:12,fill:"#64748B"})
tCard2=I(tRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#FFFFFF",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1},effect:{type:"shadow",offset:{x:0,y:2},blur:8,color:"#0000000D"}})
I(tCard2,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(tCard2,{type:"text",content:"I had offers from two companies before I even applied. The platform works.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
tAuthor2=I(tCard2,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
tAvatar2=I(tAuthor2,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(tAvatar2,{type:"text",content:"MT",fontSize:13,fontWeight:"700",fill:"#2563EB"})
tInfo2=I(tAuthor2,{type:"frame",layout:"vertical",gap:2})
I(tInfo2,{type:"text",content:"Malik T.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(tInfo2,{type:"text",content:"Backend Developer",fontSize:12,fill:"#64748B"})
tCard3=I(tRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#FFFFFF",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1},effect:{type:"shadow",offset:{x:0,y:2},blur:8,color:"#0000000D"}})
I(tCard3,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(tCard3,{type:"text",content:"The skill tests showed companies what my CV couldn't. My profile speaks for itself now.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
tAuthor3=I(tCard3,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
tAvatar3=I(tAuthor3,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(tAvatar3,{type:"text",content:"LM",fontSize:13,fontWeight:"700",fill:"#2563EB"})
tInfo3=I(tAuthor3,{type:"frame",layout:"vertical",gap:2})
I(tInfo3,{type:"text",content:"Lucia M.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(tInfo3,{type:"text",content:"Product Manager",fontSize:12,fill:"#64748B"})
```

### Task 1.7 — CTA Banner

```javascript
ctaBanner=I("candidates-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:24,fill:{type:"gradient",gradientType:"linear",rotation:135,colors:[{color:"#2563EB",position:0},{color:"#7C3AED",position:1}]},alignItems:"center"})
I(ctaBanner,{type:"text",content:"Start for free — no credit card required.",fontSize:36,fontWeight:"700",fill:"#FFFFFF",textAlign:"center"})
I(ctaBanner,{type:"text",content:"Join thousands of freelancers already getting discovered by top companies.",fontSize:16,fill:"#BFDBFE",textAlign:"center"})
ctaBtn=I(ctaBanner,{type:"frame",layout:"horizontal",padding:[14,32,14,32],fill:"#FFFFFF",cornerRadius:8,alignItems:"center",gap:8})
I(ctaBtn,{type:"text",content:"Join now",fontSize:16,fontWeight:"700",fill:"#2563EB"})
```

### Task 1.8 — Footer (copy from home-light) & remove placeholder

```javascript
footer=C("QTzIg","candidates-light",{width:"fill_container"})
U("candidates-light",{placeholder:false})
```
- [ ] Take full screenshot of `candidates-light` frame. Verify all sections are complete and visually polished.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: candidates-light landing page frame"`

---

## Chunk 2: candidates-dark

### Task 2.1 — Create placeholder frame (copy from light, then recolor)

- [ ] Copy candidates-light as the base:
```javascript
cd=C("candidates-light",document,{id:"candidates-dark",name:"candidates-dark",x:-5365,y:0,placeholder:true})
```

### Task 2.2 — Recolor dark background sections

Use `replace_all_matching_properties` to swap light colors to dark across the whole frame:

- [ ] Swap page background white to dark:
```javascript
// Replace section fills sequentially using batch_design updates
// Main bg
U("candidates-dark",{fill:"#0A0F1E"})
```

- [ ] Batch-update each section's fill color, text colors, card colors to dark palette. Use `snapshot_layout` on `candidates-dark` to get section IDs, then:
```javascript
// For each top-level section:
// - Section fill: #111827 (cards/surfaces) or #0A0F1E (page bg)
// - Text primary: #F1F5F9
// - Text secondary: #94A3B8
// - Borders: #1E293B
// - Primary accent: #6366F1
// - Badge fills: #1E1B4B (indigo dark)
// - CTA gradient: #4F46E5 → #7C3AED
```

- [ ] Use `replace_all_matching_properties` for bulk color swaps:
  - `#FFFFFF` (section bg) → `#111827`
  - `#F8FAFC` (alt section bg) → `#0D1117`
  - `#0F172A` (text primary) → `#F1F5F9`
  - `#64748B` (text secondary) → `#94A3B8`
  - `#E2E8F0` (border) → `#1E293B`
  - `#2563EB` (primary) → `#6366F1`
  - `#1D4ED8` (primary hover) → `#4338CA`
  - `#DBEAFE` (light badge bg) → `#1E1B4B`
  - `#E0E7FF` (lavender avatar) → `#1E1B4B`
  - `#EFF6FF` (hero gradient start) → `#0A0F1E`
  - `#BFDBFE` (light muted text) → `#A5B4FC`
  - `#F1F5F9` (skill pill bg) → `#1E293B`
  - `#475569` (skill pill text) → `#94A3B8`
  - `#DCFCE7` (green badge bg) → `#064E3B`
  - `#166534` (green badge text) → `#34D399`
  - `#16A34A` (green icon) → `#34D399`
  - `#F0FDFA` (teal callout bg) → `#042F2E`

- [ ] Remove placeholder:
```javascript
U("candidates-dark",{placeholder:false})
```
- [ ] Screenshot `candidates-dark` — verify dark theme is correctly applied.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: candidates-dark landing page frame"`

---

## Chunk 3: companies-light

### Task 3.1 — Create placeholder frame

```javascript
col=I(document,{type:"frame",id:"companies-light",name:"companies-light",layout:"vertical",width:1440,height:"fit_content(4000)",x:-3573,y:0,fill:"#FFFFFF",placeholder:true,clip:true})
```

### Task 3.2 — Navbar

```javascript
nav=C("qD8sg","companies-light",{width:"fill_container"})
```

### Task 3.3 — Hero

```javascript
hero=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",height:"fit_content",padding:[80,80,80,80],gap:24,fill:{type:"gradient",gradientType:"linear",rotation:180,colors:[{color:"#EFF6FF",position:0},{color:"#FFFFFF",position:1}]},alignItems:"center"})
badge=I(hero,{type:"frame",layout:"horizontal",padding:[6,14,6,14],gap:8,fill:"#DBEAFE",cornerRadius:99,alignItems:"center"})
I(badge,{type:"icon_font",iconFontName:"building-2",iconFontFamily:"lucide",width:14,height:14,fill:"#2563EB"})
I(badge,{type:"text",content:"Trusted by 500+ companies",fontSize:12,fontWeight:"600",fill:"#2563EB"})
I(hero,{type:"text",content:"Hire the right talent,\nfaster.",textGrowth:"fixed-width",width:760,fontSize:64,fontWeight:"700",fill:"#0F172A",textAlign:"center",lineHeight:1.1})
I(hero,{type:"text",content:"Browse pre-scored candidates and build your team with confidence.",textGrowth:"fixed-width",width:560,fontSize:18,fill:"#64748B",textAlign:"center",lineHeight:1.6})
ctaRow=I(hero,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
btnPrimary=I(ctaRow,{type:"frame",layout:"horizontal",padding:[14,28,14,28],fill:"#2563EB",cornerRadius:8,alignItems:"center",gap:8})
I(btnPrimary,{type:"text",content:"Start hiring",fontSize:16,fontWeight:"600",fill:"#FFFFFF"})
btnSecondary=I(ctaRow,{type:"frame",layout:"horizontal",padding:[14,28,14,28],fill:"#FFFFFF",cornerRadius:8,alignItems:"center",gap:8,stroke:{fill:"#E2E8F0",thickness:1}})
I(btnSecondary,{type:"text",content:"See a demo",fontSize:16,fontWeight:"500",fill:"#0F172A"})
dashCard=I(hero,{type:"frame",layout:"vertical",width:560,gap:12,fill:"#FFFFFF",cornerRadius:16,padding:24,stroke:{fill:"#E2E8F0",thickness:1},effect:{type:"shadow",offset:{x:0,y:8},blur:32,color:"#0000001A"}})
dashTitle=I(dashCard,{type:"frame",layout:"horizontal",gap:8,alignItems:"center"})
I(dashTitle,{type:"icon_font",iconFontName:"users",iconFontFamily:"lucide",width:18,height:18,fill:"#2563EB"})
I(dashTitle,{type:"text",content:"Talent Pool — 3 new matches",fontSize:14,fontWeight:"600",fill:"#0F172A"})
cRow1=I(dashCard,{type:"frame",layout:"horizontal",gap:12,padding:[10,12,10,12],fill:"#F8FAFC",cornerRadius:8,alignItems:"center"})
I(cRow1,{type:"ellipse",width:36,height:36,fill:"#DBEAFE"})
cRow1Info=I(cRow1,{type:"frame",layout:"vertical",gap:2,width:"fill_container"})
I(cRow1Info,{type:"text",content:"Alex Kim",fontSize:13,fontWeight:"600",fill:"#0F172A"})
I(cRow1Info,{type:"text",content:"Full-Stack · React, Node.js",fontSize:12,fill:"#64748B"})
cRow1Badge=I(cRow1,{type:"frame",layout:"horizontal",padding:[3,8,3,8],fill:"#2563EB",cornerRadius:99})
I(cRow1Badge,{type:"text",content:"94",fontSize:11,fontWeight:"700",fill:"#FFFFFF"})
cRow2=I(dashCard,{type:"frame",layout:"horizontal",gap:12,padding:[10,12,10,12],fill:"#F8FAFC",cornerRadius:8,alignItems:"center"})
I(cRow2,{type:"ellipse",width:36,height:36,fill:"#E0E7FF"})
cRow2Info=I(cRow2,{type:"frame",layout:"vertical",gap:2,width:"fill_container"})
I(cRow2Info,{type:"text",content:"Lucia M.",fontSize:13,fontWeight:"600",fill:"#0F172A"})
I(cRow2Info,{type:"text",content:"Product · Strategy, Roadmap",fontSize:12,fill:"#64748B"})
cRow2Badge=I(cRow2,{type:"frame",layout:"horizontal",padding:[3,8,3,8],fill:"#2563EB",cornerRadius:99})
I(cRow2Badge,{type:"text",content:"88",fontSize:11,fontWeight:"700",fill:"#FFFFFF"})
```
- [ ] Screenshot hero to verify dashboard card visual.

### Task 3.4 — Trust logos bar

```javascript
trust=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[40,80,40,80],gap:24,fill:"#F8FAFC",alignItems:"center"})
I(trust,{type:"text",content:"Trusted by teams at",fontSize:14,fill:"#94A3B8",fontWeight:"500",textAlign:"center"})
logoRow=I(trust,{type:"frame",layout:"horizontal",gap:48,alignItems:"center",justifyContent:"center",width:"fill_container"})
logos=["Acme Corp","Globex","Initech","Umbrella Co","Hooli","Dunder Mifflin"]
// Insert 6 logo wordmarks as styled text frames:
l1=I(logoRow,{type:"text",content:"Acme Corp",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
l2=I(logoRow,{type:"text",content:"Globex",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
l3=I(logoRow,{type:"text",content:"Initech",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
l4=I(logoRow,{type:"text",content:"Umbrella Co",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
l5=I(logoRow,{type:"text",content:"Hooli",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
l6=I(logoRow,{type:"text",content:"Dunder Mifflin",fontSize:18,fontWeight:"700",fill:"#CBD5E1"})
```

### Task 3.5 — Features (3-col cards)

```javascript
features=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#FFFFFF",alignItems:"center"})
fHeader=I(features,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(fHeader,{type:"text",content:"Everything your hiring team needs",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
I(fHeader,{type:"text",content:"Powerful tools built around verified candidate data",fontSize:16,fill:"#64748B",textAlign:"center"})
fGrid=I(features,{type:"frame",layout:"horizontal",gap:24,width:"fill_container",alignItems:"start"})
fc1=I(fGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
fi1=I(fc1,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(fi1,{type:"icon_font",iconFontName:"bar-chart-2",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(fc1,{type:"text",content:"CrismaScore filtering",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(fc1,{type:"text",content:"Filter by verified skill scores, not just résumés. Find exactly who you need in seconds.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
fc2=I(fGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
fi2=I(fc2,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(fi2,{type:"icon_font",iconFontName:"layers",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(fc2,{type:"text",content:"Bulk screening tools",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(fc2,{type:"text",content:"Review dozens of candidates at once with side-by-side comparison and batch actions.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
fc3=I(fGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
fi3=I(fc3,{type:"frame",width:44,height:44,fill:"#DBEAFE",cornerRadius:10,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(fi3,{type:"icon_font",iconFontName:"users-2",iconFontFamily:"lucide",width:22,height:22,fill:"#2563EB"})
I(fc3,{type:"text",content:"Team collaboration",fontSize:16,fontWeight:"600",fill:"#0F172A"})
I(fc3,{type:"text",content:"Invite teammates, leave notes, and align on hiring decisions together in one place.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
```

### Task 3.6 — How it works (3-step)

```javascript
hiw=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#F8FAFC",alignItems:"center"})
hiwHeader=I(hiw,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(hiwHeader,{type:"text",content:"Hire in three steps",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
hiwRow=I(hiw,{type:"frame",layout:"horizontal",gap:0,width:"fill_container",alignItems:"start"})
hw1=I(hiwRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,24,0,24]})
hc1=I(hw1,{type:"frame",width:56,height:56,fill:"#2563EB",cornerRadius:16,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(hc1,{type:"icon_font",iconFontName:"file-text",iconFontFamily:"lucide",width:24,height:24,fill:"#FFFFFF"})
I(hw1,{type:"text",content:"Post a role",fontSize:16,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(hw1,{type:"text",content:"Describe the position and required skills. Takes under 5 minutes.",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.6})
hArrow1=I(hiwRow,{type:"frame",layout:"horizontal",width:48,height:56,alignItems:"center",justifyContent:"center"})
I(hArrow1,{type:"icon_font",iconFontName:"arrow-right",iconFontFamily:"lucide",width:20,height:20,fill:"#CBD5E1"})
hw2=I(hiwRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,24,0,24]})
hc2=I(hw2,{type:"frame",width:56,height:56,fill:"#2563EB",cornerRadius:16,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(hc2,{type:"icon_font",iconFontName:"search",iconFontFamily:"lucide",width:24,height:24,fill:"#FFFFFF"})
I(hw2,{type:"text",content:"Browse scored talent",fontSize:16,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(hw2,{type:"text",content:"Instantly see candidates ranked by CrismaScore and fit for your role.",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.6})
hArrow2=I(hiwRow,{type:"frame",layout:"horizontal",width:48,height:56,alignItems:"center",justifyContent:"center"})
I(hArrow2,{type:"icon_font",iconFontName:"arrow-right",iconFontFamily:"lucide",width:20,height:20,fill:"#CBD5E1"})
hw3=I(hiwRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,alignItems:"center",padding:[0,24,0,24]})
hc3=I(hw3,{type:"frame",width:56,height:56,fill:"#2563EB",cornerRadius:16,layout:"horizontal",alignItems:"center",justifyContent:"center"})
I(hc3,{type:"icon_font",iconFontName:"badge-check",iconFontFamily:"lucide",width:24,height:24,fill:"#FFFFFF"})
I(hw3,{type:"text",content:"Make an offer",fontSize:16,fontWeight:"600",fill:"#0F172A",textAlign:"center"})
I(hw3,{type:"text",content:"Reach out directly and close your hire — no middleman, no delays.",textGrowth:"fixed-width",width:"fill_container",fontSize:13,fill:"#64748B",textAlign:"center",lineHeight:1.6})
```
- [ ] Screenshot the how-it-works section to verify 3-step flow with arrow connectors.

### Task 3.7 — Testimonials (company HR voices)

```javascript
ctests=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#FFFFFF",alignItems:"center"})
ctHeader=I(ctests,{type:"frame",layout:"vertical",gap:12,alignItems:"center"})
I(ctHeader,{type:"text",content:"Hiring teams trust CrismaTech",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
ctRow=I(ctests,{type:"frame",layout:"horizontal",gap:24,width:"fill_container",alignItems:"start"})
ctc1=I(ctRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
I(ctc1,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(ctc1,{type:"text",content:"We cut our screening time by 60% in the first month. The CrismaScore filter is a game-changer.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
cta1=I(ctc1,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
cav1=I(cta1,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(cav1,{type:"text",content:"SK",fontSize:13,fontWeight:"700",fill:"#2563EB"})
cai1=I(cta1,{type:"frame",layout:"vertical",gap:2})
I(cai1,{type:"text",content:"Sarah K.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(cai1,{type:"text",content:"Head of Talent · Acme Corp",fontSize:12,fill:"#64748B"})
ctc2=I(ctRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
I(ctc2,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(ctc2,{type:"text",content:"CrismaScore gave us objective data to back every hiring decision. No more gut-feel hires.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
cta2=I(ctc2,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
cav2=I(cta2,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(cav2,{type:"text",content:"JL",fontSize:13,fontWeight:"700",fill:"#2563EB"})
cai2=I(cta2,{type:"frame",layout:"vertical",gap:2})
I(cai2,{type:"text",content:"James L.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(cai2,{type:"text",content:"HR Director · Globex",fontSize:12,fill:"#64748B"})
ctc3=I(ctRow,{type:"frame",layout:"vertical",width:"fill_container",gap:16,padding:28,fill:"#F8FAFC",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1}})
I(ctc3,{type:"icon_font",iconFontName:"quote",iconFontFamily:"lucide",width:24,height:24,fill:"#2563EB"})
I(ctc3,{type:"text",content:"The best tool we've added to our recruiting stack. Candidates are genuinely better prepared.",textGrowth:"fixed-width",width:"fill_container",fontSize:15,fill:"#0F172A",lineHeight:1.6})
cta3=I(ctc3,{type:"frame",layout:"horizontal",gap:12,alignItems:"center"})
cav3=I(cta3,{type:"ellipse",width:40,height:40,fill:"#DBEAFE"})
I(cav3,{type:"text",content:"PN",fontSize:13,fontWeight:"700",fill:"#2563EB"})
cai3=I(cta3,{type:"frame",layout:"vertical",gap:2})
I(cai3,{type:"text",content:"Priya N.",fontSize:14,fontWeight:"600",fill:"#0F172A"})
I(cai3,{type:"text",content:"Recruiter · Hooli",fontSize:12,fill:"#64748B"})
```

### Task 3.8 — CTA Banner + Footer

```javascript
coBanner=I("companies-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:24,fill:{type:"gradient",gradientType:"linear",rotation:135,colors:[{color:"#1D4ED8",position:0},{color:"#6D28D9",position:1}]},alignItems:"center"})
I(coBanner,{type:"text",content:"See your first shortlist in 24 hours.",fontSize:36,fontWeight:"700",fill:"#FFFFFF",textAlign:"center"})
I(coBanner,{type:"text",content:"No setup fees. No long-term contracts. Cancel anytime.",fontSize:16,fill:"#BFDBFE",textAlign:"center"})
coBannerBtn=I(coBanner,{type:"frame",layout:"horizontal",padding:[14,32,14,32],fill:"#FFFFFF",cornerRadius:8,alignItems:"center",gap:8})
I(coBannerBtn,{type:"text",content:"Start hiring today",fontSize:16,fontWeight:"700",fill:"#1D4ED8"})
ftr=C("QTzIg","companies-light",{width:"fill_container"})
U("companies-light",{placeholder:false})
```
- [ ] Screenshot full `companies-light` frame.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: companies-light landing page frame"`

---

## Chunk 4: companies-dark

### Task 4.1 — Copy and recolor

```javascript
cod=C("companies-light",document,{id:"companies-dark",name:"companies-dark",x:-1781,y:0,placeholder:true})
```
- [ ] Apply same dark color swap as candidates-dark (see Chunk 2, Task 2.2 color map)
- [ ] Remove placeholder: `U("companies-dark",{placeholder:false})`
- [ ] Screenshot `companies-dark`.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: companies-dark landing page frame"`

---

## Chunk 5: pricing-light

### Task 5.1 — Create placeholder

```javascript
pl=I(document,{type:"frame",id:"pricing-light",name:"pricing-light",layout:"vertical",width:1440,height:"fit_content(5000)",x:11,y:0,fill:"#FFFFFF",placeholder:true,clip:true})
```

### Task 5.2 — Navbar

```javascript
C("qD8sg","pricing-light",{width:"fill_container"})
```

### Task 5.3 — Hero with billing toggle

```javascript
pHero=I("pricing-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,32,80],gap:24,fill:"#FFFFFF",alignItems:"center"})
I(pHero,{type:"text",content:"Simple pricing for every team",fontSize:52,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
I(pHero,{type:"text",content:"Start free for candidates. Scale with your team.",fontSize:18,fill:"#64748B",textAlign:"center"})
toggle=I(pHero,{type:"frame",layout:"horizontal",gap:0,fill:"#F1F5F9",cornerRadius:8,padding:4})
monthly=I(toggle,{type:"frame",layout:"horizontal",padding:[8,20,8,20],fill:"#FFFFFF",cornerRadius:6,alignItems:"center",effect:{type:"shadow",offset:{x:0,y:1},blur:3,color:"#0000001A"}})
I(monthly,{type:"text",content:"Monthly",fontSize:14,fontWeight:"600",fill:"#0F172A"})
annual=I(toggle,{type:"frame",layout:"horizontal",padding:[8,20,8,20],cornerRadius:6,alignItems:"center",gap:8})
I(annual,{type:"text",content:"Annual",fontSize:14,fontWeight:"500",fill:"#64748B"})
saveBadge=I(annual,{type:"frame",layout:"horizontal",padding:[2,8,2,8],fill:"#DCFCE7",cornerRadius:99})
I(saveBadge,{type:"text",content:"-20%",fontSize:11,fontWeight:"700",fill:"#166534"})
```

### Task 5.4 — Free candidate callout

```javascript
freeBanner=I("pricing-light",{type:"frame",layout:"horizontal",width:"fill_container",padding:[16,80,16,80],gap:12,fill:"#F0FDFA",alignItems:"center",justifyContent:"center"})
I(freeBanner,{type:"icon_font",iconFontName:"gift",iconFontFamily:"lucide",width:20,height:20,fill:"#0D9488"})
I(freeBanner,{type:"text",content:"Always free for candidates & freelancers",fontSize:15,fontWeight:"600",fill:"#0F172A"})
I(freeBanner,{type:"text",content:"—",fontSize:15,fill:"#64748B"})
I(freeBanner,{type:"text",content:"No account needed to explore opportunities.",fontSize:15,fill:"#64748B"})
```

### Task 5.5 — Pricing cards (3 tiers)

```javascript
pCards=I("pricing-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[48,80,80,80],gap:0,fill:"#FFFFFF",alignItems:"center"})
pGrid=I(pCards,{type:"frame",layout:"horizontal",gap:24,width:"fill_container",alignItems:"start"})
// Starter card
sc=I(pGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:0,fill:"#FFFFFF",cornerRadius:16,stroke:{fill:"#E2E8F0",thickness:1}})
scHeader=I(sc,{type:"frame",layout:"vertical",padding:[28,28,24,28],gap:8,fill:"#F8FAFC",cornerRadius:[16,16,0,0]})
I(scHeader,{type:"text",content:"Starter",fontSize:18,fontWeight:"700",fill:"#0F172A"})
I(scHeader,{type:"text",content:"For small teams making their first hires",fontSize:13,fill:"#64748B",textGrowth:"fixed-width",width:"fill_container",lineHeight:1.5})
scPrice=I(scHeader,{type:"frame",layout:"horizontal",gap:4,alignItems:"end"})
I(scPrice,{type:"text",content:"$49",fontSize:40,fontWeight:"800",fill:"#0F172A"})
I(scPrice,{type:"text",content:"/month",fontSize:14,fill:"#64748B"})
scFeatures=I(sc,{type:"frame",layout:"vertical",padding:[24,28,28,28],gap:12})
scFeats=["5 active roles/month","Basic keyword filters","Email support","1 team seat"]
f1=I(scFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(f1,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(f1,{type:"text",content:"5 active roles/month",fontSize:14,fill:"#0F172A"})
f2=I(scFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(f2,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(f2,{type:"text",content:"Basic keyword filters",fontSize:14,fill:"#0F172A"})
f3=I(scFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(f3,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(f3,{type:"text",content:"Email support",fontSize:14,fill:"#0F172A"})
f4=I(scFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(f4,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(f4,{type:"text",content:"1 team seat",fontSize:14,fill:"#0F172A"})
scCta=I(sc,{type:"frame",layout:"horizontal",padding:[0,28,28,28]})
scBtn=I(scCta,{type:"frame",layout:"horizontal",padding:[12,0,12,0],fill:"#F1F5F9",cornerRadius:8,alignItems:"center",justifyContent:"center",width:"fill_container"})
I(scBtn,{type:"text",content:"Get started",fontSize:15,fontWeight:"600",fill:"#0F172A"})
// Growth card (highlighted — "Most popular")
gc=I(pGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:0,fill:"#FFFFFF",cornerRadius:16,stroke:{fill:"#2563EB",thickness:2},effect:{type:"shadow",offset:{x:0,y:8},blur:24,color:"#2563EB26"}})
gcPopBadge=I(gc,{type:"frame",layout:"horizontal",padding:[6,0,0,0],alignItems:"center",justifyContent:"center"})
gcBadge=I(gcPopBadge,{type:"frame",layout:"horizontal",padding:[4,16,4,16],fill:"#2563EB",cornerRadius:[0,0,8,8]})
I(gcBadge,{type:"text",content:"Most popular",fontSize:11,fontWeight:"700",fill:"#FFFFFF"})
gcHeader=I(gc,{type:"frame",layout:"vertical",padding:[20,28,24,28],gap:8,fill:"#EFF6FF",cornerRadius:[0,0,0,0]})
I(gcHeader,{type:"text",content:"Growth",fontSize:18,fontWeight:"700",fill:"#0F172A"})
I(gcHeader,{type:"text",content:"For scaling companies that need full power",fontSize:13,fill:"#64748B",textGrowth:"fixed-width",width:"fill_container",lineHeight:1.5})
gcPrice=I(gcHeader,{type:"frame",layout:"horizontal",gap:4,alignItems:"end"})
I(gcPrice,{type:"text",content:"$149",fontSize:40,fontWeight:"800",fill:"#2563EB"})
I(gcPrice,{type:"text",content:"/month",fontSize:14,fill:"#64748B"})
gcFeatures=I(gc,{type:"frame",layout:"vertical",padding:[24,28,28,28],gap:12})
gf1=I(gcFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(gf1,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(gf1,{type:"text",content:"Unlimited active roles",fontSize:14,fill:"#0F172A"})
gf2=I(gcFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(gf2,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(gf2,{type:"text",content:"Full CrismaScore access + advanced filters",fontSize:14,fill:"#0F172A"})
gf3=I(gcFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(gf3,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(gf3,{type:"text",content:"5 team seats",fontSize:14,fill:"#0F172A"})
gf4=I(gcFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(gf4,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(gf4,{type:"text",content:"Bulk screening & side-by-side comparison",fontSize:14,fill:"#0F172A"})
gf5=I(gcFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(gf5,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(gf5,{type:"text",content:"Priority support + ATS integrations",fontSize:14,fill:"#0F172A"})
gcCta=I(gc,{type:"frame",layout:"horizontal",padding:[0,28,28,28]})
gcBtn=I(gcCta,{type:"frame",layout:"horizontal",padding:[12,0,12,0],fill:"#2563EB",cornerRadius:8,alignItems:"center",justifyContent:"center",width:"fill_container"})
I(gcBtn,{type:"text",content:"Get started",fontSize:15,fontWeight:"600",fill:"#FFFFFF"})
// Enterprise card
ec=I(pGrid,{type:"frame",layout:"vertical",width:"fill_container",gap:0,fill:"#FFFFFF",cornerRadius:16,stroke:{fill:"#E2E8F0",thickness:1}})
ecHeader=I(ec,{type:"frame",layout:"vertical",padding:[28,28,24,28],gap:8,fill:"#0A0F1E",cornerRadius:[16,16,0,0]})
I(ecHeader,{type:"text",content:"Enterprise",fontSize:18,fontWeight:"700",fill:"#F1F5F9"})
I(ecHeader,{type:"text",content:"For large orgs with compliance & custom needs",fontSize:13,fill:"#94A3B8",textGrowth:"fixed-width",width:"fill_container",lineHeight:1.5})
ecPrice=I(ecHeader,{type:"frame",layout:"horizontal",gap:4,alignItems:"end"})
I(ecPrice,{type:"text",content:"Custom",fontSize:32,fontWeight:"800",fill:"#F1F5F9"})
ecFeatures=I(ec,{type:"frame",layout:"vertical",padding:[24,28,28,28],gap:12})
ef1=I(ecFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(ef1,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(ef1,{type:"text",content:"Unlimited roles + custom weighting",fontSize:14,fill:"#0F172A"})
ef2=I(ecFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(ef2,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(ef2,{type:"text",content:"SSO + API access",fontSize:14,fill:"#0F172A"})
ef3=I(ecFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(ef3,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(ef3,{type:"text",content:"Custom team seats",fontSize:14,fill:"#0F172A"})
ef4=I(ecFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(ef4,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(ef4,{type:"text",content:"Dedicated Customer Success Manager",fontSize:14,fill:"#0F172A"})
ef5=I(ecFeatures,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(ef5,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
I(ef5,{type:"text",content:"24/7 dedicated support",fontSize:14,fill:"#0F172A"})
ecCta=I(ec,{type:"frame",layout:"horizontal",padding:[0,28,28,28]})
ecBtn=I(ecCta,{type:"frame",layout:"horizontal",padding:[12,0,12,0],fill:"#0A0F1E",cornerRadius:8,alignItems:"center",justifyContent:"center",width:"fill_container"})
I(ecBtn,{type:"text",content:"Contact sales",fontSize:15,fontWeight:"600",fill:"#FFFFFF"})
```
- [ ] Screenshot pricing cards to verify 3-column layout, highlighted Growth card.

### Task 5.6 — Feature comparison table

```javascript
table=I("pricing-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[48,80,80,80],gap:32,fill:"#F8FAFC",alignItems:"center"})
I(table,{type:"text",content:"Compare all features",fontSize:28,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
tWrap=I(table,{type:"frame",layout:"vertical",width:"fill_container",fill:"#FFFFFF",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1},clip:true})
// Header row
tHead=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
I(tHead,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20]})
thS=I(tHead,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(thS,{type:"text",content:"Starter",fontSize:13,fontWeight:"700",fill:"#0F172A"})
thG=I(tHead,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#EFF6FF"})
I(thG,{type:"text",content:"Growth",fontSize:13,fontWeight:"700",fill:"#2563EB"})
thE=I(tHead,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(thE,{type:"text",content:"Enterprise",fontSize:13,fontWeight:"700",fill:"#0F172A"})
// Data rows — alternating fill
rows=[["Active roles/month","5","Unlimited","Unlimited"],["CrismaScore access","Basic view","Full access","Full + custom weighting"],["Candidate filters","Keyword only","Score, skills, location","All filters + custom"],["Team seats","1","5","Custom"],["Bulk screening","—","✓","✓"],["Side-by-side comparison","—","✓","✓"],["Analytics & reports","—","✓","Advanced"],["API access","—","—","✓"],["SSO","—","—","✓"],["Dedicated CSM","—","—","✓"],["Support","Email","Priority email","24/7 dedicated"],["ATS & Slack integrations","—","✓","✓"]]
// Insert row 1 (light bg):
r1=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r1Label=I(r1,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r1Label,{type:"text",content:"Active roles/month",fontSize:13,fill:"#0F172A"})
r1s=I(r1,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r1s,{type:"text",content:"5",fontSize:13,fill:"#64748B",textAlign:"center"})
r1g=I(r1,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r1g,{type:"text",content:"Unlimited",fontSize:13,fill:"#2563EB",fontWeight:"600",textAlign:"center"})
r1e=I(r1,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r1e,{type:"text",content:"Unlimited",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 2:
r2=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r2Label=I(r2,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r2Label,{type:"text",content:"CrismaScore access",fontSize:13,fill:"#0F172A"})
r2s=I(r2,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r2s,{type:"text",content:"Basic view",fontSize:13,fill:"#64748B",textAlign:"center"})
r2g=I(r2,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r2g,{type:"text",content:"Full access",fontSize:13,fill:"#2563EB",fontWeight:"600",textAlign:"center"})
r2e=I(r2,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r2e,{type:"text",content:"Full + custom weighting",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 3: Candidate filters
r3=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r3Lbl=I(r3,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r3Lbl,{type:"text",content:"Candidate filters",fontSize:13,fill:"#0F172A"})
r3s=I(r3,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r3s,{type:"text",content:"Keyword only",fontSize:13,fill:"#64748B",textAlign:"center"})
r3g=I(r3,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r3g,{type:"text",content:"Score, skills, location",fontSize:13,fill:"#2563EB",fontWeight:"600",textAlign:"center"})
r3e=I(r3,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r3e,{type:"text",content:"All + custom criteria",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 4: Team seats
r4=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r4Lbl=I(r4,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r4Lbl,{type:"text",content:"Team seats",fontSize:13,fill:"#0F172A"})
r4s=I(r4,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r4s,{type:"text",content:"1",fontSize:13,fill:"#64748B",textAlign:"center"})
r4g=I(r4,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r4g,{type:"text",content:"5",fontSize:13,fill:"#2563EB",fontWeight:"600",textAlign:"center"})
r4e=I(r4,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r4e,{type:"text",content:"Custom",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 5: Bulk screening (—/✓/✓)
r5=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r5Lbl=I(r5,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r5Lbl,{type:"text",content:"Bulk screening",fontSize:13,fill:"#0F172A"})
r5s=I(r5,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r5s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r5g=I(r5,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r5g,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
r5e=I(r5,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r5e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
// Row 6: Side-by-side comparison (—/✓/✓)
r6=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r6Lbl=I(r6,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r6Lbl,{type:"text",content:"Side-by-side comparison",fontSize:13,fill:"#0F172A"})
r6s=I(r6,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r6s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r6g=I(r6,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r6g,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
r6e=I(r6,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r6e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
// Row 7: Analytics & reports (—/✓/Advanced)
r7=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r7Lbl=I(r7,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r7Lbl,{type:"text",content:"Analytics & reports",fontSize:13,fill:"#0F172A"})
r7s=I(r7,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r7s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r7g=I(r7,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r7g,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
r7e=I(r7,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r7e,{type:"text",content:"Advanced",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 8: API access (—/—/✓)
r8=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r8Lbl=I(r8,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r8Lbl,{type:"text",content:"API access",fontSize:13,fill:"#0F172A"})
r8s=I(r8,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r8s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r8g=I(r8,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r8g,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r8e=I(r8,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r8e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
// Row 9: SSO (—/—/✓)
r9=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r9Lbl=I(r9,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r9Lbl,{type:"text",content:"SSO",fontSize:13,fill:"#0F172A"})
r9s=I(r9,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r9s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r9g=I(r9,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r9g,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r9e=I(r9,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r9e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
// Row 10: Dedicated CSM (—/—/✓)
r10=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r10Lbl=I(r10,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r10Lbl,{type:"text",content:"Dedicated CSM",fontSize:13,fill:"#0F172A"})
r10s=I(r10,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r10s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r10g=I(r10,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r10g,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r10e=I(r10,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r10e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
// Row 11: Support (Email / Priority email / 24/7)
r11=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#FFFFFF"})
r11Lbl=I(r11,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r11Lbl,{type:"text",content:"Support",fontSize:13,fill:"#0F172A"})
r11s=I(r11,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r11s,{type:"text",content:"Email",fontSize:13,fill:"#64748B",textAlign:"center"})
r11g=I(r11,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F8FBFF"})
I(r11g,{type:"text",content:"Priority email",fontSize:13,fill:"#2563EB",fontWeight:"600",textAlign:"center"})
r11e=I(r11,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r11e,{type:"text",content:"24/7 dedicated",fontSize:13,fill:"#64748B",textAlign:"center"})
// Row 12: ATS & Slack integrations (—/✓/✓)
r12=I(tWrap,{type:"frame",layout:"horizontal",width:"fill_container",fill:"#F8FAFC"})
r12Lbl=I(r12,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,20,14,20],alignItems:"center"})
I(r12Lbl,{type:"text",content:"ATS & Slack integrations",fontSize:13,fill:"#0F172A"})
r12s=I(r12,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r12s,{type:"text",content:"—",fontSize:13,fill:"#94A3B8",textAlign:"center"})
r12g=I(r12,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center",fill:"#F0F7FF"})
I(r12g,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
r12e=I(r12,{type:"frame",layout:"horizontal",width:180,padding:[14,20,14,20],alignItems:"center",justifyContent:"center"})
I(r12e,{type:"icon_font",iconFontName:"check",iconFontFamily:"lucide",width:16,height:16,fill:"#2563EB"})
```

### Task 5.7 — Contact form (Enterprise inquiry)

```javascript
contactSection=I("pricing-light",{type:"frame",layout:"horizontal",width:"fill_container",padding:[80,80,80,80],gap:80,fill:"#FFFFFF",alignItems:"start"})
contactLeft=I(contactSection,{type:"frame",layout:"vertical",gap:24,width:"fill_container"})
entBadge=I(contactLeft,{type:"frame",layout:"horizontal",padding:[6,14,6,14],gap:8,fill:"#0A0F1E",cornerRadius:99,alignItems:"center",width:"fit_content"})
I(entBadge,{type:"icon_font",iconFontName:"building-2",iconFontFamily:"lucide",width:14,height:14,fill:"#FFFFFF"})
I(entBadge,{type:"text",content:"Enterprise",fontSize:12,fontWeight:"600",fill:"#FFFFFF"})
I(contactLeft,{type:"text",content:"Talk to our team",fontSize:32,fontWeight:"700",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container",lineHeight:1.2})
I(contactLeft,{type:"text",content:"Get a custom plan, a live demo, or answers to your questions. We respond within 24 hours.",textGrowth:"fixed-width",width:"fill_container",fontSize:16,fill:"#64748B",lineHeight:1.6})
perks=I(contactLeft,{type:"frame",layout:"vertical",gap:12})
pk1=I(perks,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(pk1,{type:"icon_font",iconFontName:"check-circle",iconFontFamily:"lucide",width:18,height:18,fill:"#2563EB"})
I(pk1,{type:"text",content:"No commitment required",fontSize:14,fill:"#0F172A"})
pk2=I(perks,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(pk2,{type:"icon_font",iconFontName:"check-circle",iconFontFamily:"lucide",width:18,height:18,fill:"#2563EB"})
I(pk2,{type:"text",content:"Custom onboarding for your team",fontSize:14,fill:"#0F172A"})
pk3=I(perks,{type:"frame",layout:"horizontal",gap:10,alignItems:"center"})
I(pk3,{type:"icon_font",iconFontName:"check-circle",iconFontFamily:"lucide",width:18,height:18,fill:"#2563EB"})
I(pk3,{type:"text",content:"Dedicated support from day one",fontSize:14,fill:"#0F172A"})
contactRight=I(contactSection,{type:"frame",layout:"vertical",gap:20,width:"fill_container",padding:32,fill:"#F8FAFC",cornerRadius:16,stroke:{fill:"#E2E8F0",thickness:1}})
// Name field
nameField=I(contactRight,{type:"frame",layout:"vertical",gap:6})
I(nameField,{type:"text",content:"Full name",fontSize:13,fontWeight:"500",fill:"#0F172A"})
nameInput=I(nameField,{type:"frame",layout:"horizontal",width:"fill_container",height:44,padding:[0,14,0,14],fill:"#FFFFFF",cornerRadius:8,stroke:{fill:"#E2E8F0",thickness:1},alignItems:"center"})
I(nameInput,{type:"text",content:"Jane Smith",fontSize:14,fill:"#94A3B8"})
// Company field
companyField=I(contactRight,{type:"frame",layout:"vertical",gap:6})
I(companyField,{type:"text",content:"Company name",fontSize:13,fontWeight:"500",fill:"#0F172A"})
companyInput=I(companyField,{type:"frame",layout:"horizontal",width:"fill_container",height:44,padding:[0,14,0,14],fill:"#FFFFFF",cornerRadius:8,stroke:{fill:"#E2E8F0",thickness:1},alignItems:"center"})
I(companyInput,{type:"text",content:"Acme Corp",fontSize:14,fill:"#94A3B8"})
// Email field
emailField=I(contactRight,{type:"frame",layout:"vertical",gap:6})
I(emailField,{type:"text",content:"Work email",fontSize:13,fontWeight:"500",fill:"#0F172A"})
emailInput=I(emailField,{type:"frame",layout:"horizontal",width:"fill_container",height:44,padding:[0,14,0,14],fill:"#FFFFFF",cornerRadius:8,stroke:{fill:"#E2E8F0",thickness:1},alignItems:"center"})
I(emailInput,{type:"text",content:"jane@acme.com",fontSize:14,fill:"#94A3B8"})
// Team size dropdown
sizeField=I(contactRight,{type:"frame",layout:"vertical",gap:6})
I(sizeField,{type:"text",content:"Team size",fontSize:13,fontWeight:"500",fill:"#0F172A"})
sizeInput=I(sizeField,{type:"frame",layout:"horizontal",width:"fill_container",height:44,padding:[0,14,0,14],fill:"#FFFFFF",cornerRadius:8,stroke:{fill:"#E2E8F0",thickness:1},alignItems:"center",justifyContent:"space_between"})
I(sizeInput,{type:"text",content:"Select team size",fontSize:14,fill:"#94A3B8"})
I(sizeInput,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:16,height:16,fill:"#64748B"})
// Message textarea
msgField=I(contactRight,{type:"frame",layout:"vertical",gap:6})
I(msgField,{type:"text",content:"Message",fontSize:13,fontWeight:"500",fill:"#0F172A"})
msgInput=I(msgField,{type:"frame",layout:"vertical",width:"fill_container",height:120,padding:14,fill:"#FFFFFF",cornerRadius:8,stroke:{fill:"#E2E8F0",thickness:1}})
I(msgInput,{type:"text",content:"Tell us about your hiring needs...",fontSize:14,fill:"#94A3B8"})
// Submit button
submitBtn=I(contactRight,{type:"frame",layout:"horizontal",width:"fill_container",padding:[14,0,14,0],fill:"#2563EB",cornerRadius:8,alignItems:"center",justifyContent:"center",gap:8})
I(submitBtn,{type:"text",content:"Request a demo",fontSize:15,fontWeight:"600",fill:"#FFFFFF"})
I(submitBtn,{type:"icon_font",iconFontName:"arrow-right",iconFontFamily:"lucide",width:16,height:16,fill:"#FFFFFF"})
```

### Task 5.8 — FAQ section

```javascript
faq=I("pricing-light",{type:"frame",layout:"vertical",width:"fill_container",padding:[80,80,80,80],gap:48,fill:"#F8FAFC",alignItems:"center"})
I(faq,{type:"text",content:"Frequently asked questions",fontSize:36,fontWeight:"700",fill:"#0F172A",textAlign:"center"})
faqList=I(faq,{type:"frame",layout:"vertical",gap:0,width:720,fill:"#FFFFFF",cornerRadius:12,stroke:{fill:"#E2E8F0",thickness:1},clip:true})
fqs=[["Can I change or cancel my plan?","Yes. You can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the start of your next billing cycle."],["Is there a free trial?","New company accounts get a 14-day free trial of the Growth plan — no credit card required."],["How does billing work?","You are billed monthly or annually depending on your plan. Annual billing gives you a 20% discount. All payments are processed securely via Stripe."],["What counts as an active role?","An active role is any open position you've published on CrismaTech that is currently accepting applications."],["Do I need a credit card to start?","No. Candidates never need a credit card. Companies on a trial or free Starter tier don't either."]]
// FAQ uses divider frames between items (not directional stroke, which isn't reliably supported)
// Pattern: item frame (no stroke) → 1px divider frame → item frame → ...
fq1=I(faqList,{type:"frame",layout:"vertical",width:"fill_container",padding:[20,24,20,24],gap:10})
fq1Top=I(fq1,{type:"frame",layout:"horizontal",width:"fill_container",alignItems:"center",justifyContent:"space_between",gap:16})
I(fq1Top,{type:"text",content:"Can I change or cancel my plan?",fontSize:15,fontWeight:"600",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container"})
I(fq1Top,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:18,height:18,fill:"#64748B"})
I(fq1,{type:"text",content:"Yes. You can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the start of your next billing cycle.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
I(faqList,{type:"frame",width:"fill_container",height:1,fill:"#E2E8F0"})
fq2=I(faqList,{type:"frame",layout:"vertical",width:"fill_container",padding:[20,24,20,24],gap:10})
fq2Top=I(fq2,{type:"frame",layout:"horizontal",width:"fill_container",alignItems:"center",justifyContent:"space_between",gap:16})
I(fq2Top,{type:"text",content:"Is there a free trial?",fontSize:15,fontWeight:"600",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container"})
I(fq2Top,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:18,height:18,fill:"#64748B"})
I(fq2,{type:"text",content:"New company accounts get a 14-day free trial of the Growth plan — no credit card required.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
I(faqList,{type:"frame",width:"fill_container",height:1,fill:"#E2E8F0"})
fq3=I(faqList,{type:"frame",layout:"vertical",width:"fill_container",padding:[20,24,20,24],gap:10})
fq3Top=I(fq3,{type:"frame",layout:"horizontal",width:"fill_container",alignItems:"center",justifyContent:"space_between",gap:16})
I(fq3Top,{type:"text",content:"How does billing work?",fontSize:15,fontWeight:"600",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container"})
I(fq3Top,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:18,height:18,fill:"#64748B"})
I(fq3,{type:"text",content:"You are billed monthly or annually depending on your plan. Annual billing gives you a 20% discount. All payments are processed securely via Stripe.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
I(faqList,{type:"frame",width:"fill_container",height:1,fill:"#E2E8F0"})
fq4=I(faqList,{type:"frame",layout:"vertical",width:"fill_container",padding:[20,24,20,24],gap:10})
fq4Top=I(fq4,{type:"frame",layout:"horizontal",width:"fill_container",alignItems:"center",justifyContent:"space_between",gap:16})
I(fq4Top,{type:"text",content:"What counts as an active role?",fontSize:15,fontWeight:"600",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container"})
I(fq4Top,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:18,height:18,fill:"#64748B"})
I(fq4,{type:"text",content:"An active role is any open position you've published on CrismaTech that is currently accepting applications.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
I(faqList,{type:"frame",width:"fill_container",height:1,fill:"#E2E8F0"})
fq5=I(faqList,{type:"frame",layout:"vertical",width:"fill_container",padding:[20,24,20,24],gap:10})
fq5Top=I(fq5,{type:"frame",layout:"horizontal",width:"fill_container",alignItems:"center",justifyContent:"space_between",gap:16})
I(fq5Top,{type:"text",content:"Do I need a credit card to start?",fontSize:15,fontWeight:"600",fill:"#0F172A",textGrowth:"fixed-width",width:"fill_container"})
I(fq5Top,{type:"icon_font",iconFontName:"chevron-down",iconFontFamily:"lucide",width:18,height:18,fill:"#64748B"})
I(fq5,{type:"text",content:"No. Candidates never need a credit card. Companies on a trial or free Starter tier don't either.",textGrowth:"fixed-width",width:"fill_container",fontSize:14,fill:"#64748B",lineHeight:1.6})
```

### Task 5.9 — Footer & remove placeholder

```javascript
C("QTzIg","pricing-light",{width:"fill_container"})
U("pricing-light",{placeholder:false})
```
- [ ] Full screenshot of `pricing-light`. Verify pricing cards, feature table, contact form, and FAQ all look correct.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: pricing-light landing page frame"`

---

## Chunk 6: pricing-dark

### Task 6.1 — Copy and recolor

```javascript
pd=C("pricing-light",document,{id:"pricing-dark",name:"pricing-dark",x:1803,y:0,placeholder:true})
```
- [ ] Apply full dark color swap (same map as Chunk 2, Task 2.2).
- [ ] Additionally for pricing-specific overrides:
  - Pricing card dark header (`#0A0F1E`) → keep as-is (already the page background color)
  - Growth card highlighted border: `#2563EB` → `#6366F1`
  - Growth card accent fill `#EFF6FF` → `#1E1B4B`
  - Free callout banner `#F0FDFA` → `#042F2E`
  - FAQ list bg `#FFFFFF` → `#111827`
- [ ] Remove placeholder: `U("pricing-dark",{placeholder:false})`
- [ ] Full screenshot of `pricing-dark`.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: pricing-dark landing page frame"`

---

## Final Step

- [ ] Screenshot all 6 frames together to confirm visual consistency.
- [ ] Commit: `git add design/landing-pages.pen && git commit -m "design: complete landing pages — candidates, companies, pricing (light+dark)"`
