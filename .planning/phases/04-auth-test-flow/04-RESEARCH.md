# Phase 4: Auth + Test Flow - Research

**Researched:** 2026-03-23
**Domain:** Next.js 16 App Router — visual auth, multi-step form flows, browser media APIs, drag-and-drop, animation sequencing
**Confidence:** HIGH

---

## Summary

Phase 4 builds two parallel flows: a visual-only authentication system (sign-up → OTP → onboarding → dashboard; login → dashboard; forgot-password 3-step) and a full five-step candidate test journey (intro → user-info → check → questions → calculating → result). Both flows share the same routing foundation but are independently testable.

The most consequential discovery for this phase is that **Next.js 16 has renamed `middleware.ts` to `proxy.ts`** (as of v16.0.0). Protected-route enforcement for `/dashboard` and `/test/*` must use `src/proxy.ts`, not `middleware.ts`. Because auth is visual-only (localStorage `isLoggedIn`), the proxy cannot read localStorage at the edge — the canonical solution is to write a companion cookie (`crismatest_auth=1`) on login/signup and delete it on logout, then check that cookie in `proxy.ts`.

The test flow introduces three browser APIs that require special handling: `getUserMedia` for webcam/mic, `Web Audio API AnalyserNode` for the live mic-level bars, and `MediaRecorder` for the audio/video question type. All three must be wrapped in `'use client'` components with explicit permission-denied fallbacks. The drag-and-drop question type requires `@dnd-kit/core` + `@dnd-kit/sortable` (not currently installed). Canvas confetti for the result page requires `canvas-confetti` + `@types/canvas-confetti` (not currently installed).

**Primary recommendation:** Install dnd-kit and canvas-confetti first (Wave 0), establish the proxy.ts auth guard with cookie handshake, then build auth pages, then build test-flow pages in order.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | `/sign-up` form → OTP modal → onboarding step 1 → step 2 → all-set modal → localStorage `isLoggedIn=true` → redirect `/dashboard` | React state machine pattern for multi-step modal flow; form via react-hook-form + zod already in codebase |
| AUTH-02 | `/login` — email + password + remember me → sets isLoggedIn → forgot-password link | Simple form; remember-me sets cookie persistence duration |
| AUTH-03 | `/forgot-password` 3-step flow (email → OTP → new password) — any OTP accepted | Three route segments; any code validates in v1 |
| AUTH-04 | Logged-in nav avatar + dropdown (My Profile, Settings, Logout); logout clears isLoggedIn | NavShell needs `isLoggedIn` reactive state — AuthContext or custom hook reading localStorage |
| AUTH-05 | Protected routes `/dashboard` and `/test/*` redirect to `/login` if not logged in | `proxy.ts` cookie check (see critical finding above) |
| TEST-01 | `/test/[id]/intro` — split-panel (navy left, white card right), no NavShell | Full-screen layout group `(test)` in App Router that omits NavShell |
| TEST-01b | `/test/[id]/user-info` — split-panel form (5 fields), stores to sessionStorage `crismatest_candidate_info` | react-hook-form; sessionStorage write on submit |
| TEST-02 | `/test/[id]/check` — webcam preview + live mic bars + checklist; "I'm Ready" disabled until all 4 checked | `getUserMedia` + `AnalyserNode`; checklist state; requestAnimationFrame loop |
| TEST-03 | `/test/[id]/questions` — 6 format types, progress bar, countdown timer (amber at 1:00, red at 0:30), carousel | 6 sub-components; timer via `useInterval` or `useEffect`; drag-and-drop needs dnd-kit |
| TEST-04 | `/test/[id]/calculating` — dark-navy bg, particle animation, step list stagger, auto-redirect 5–7s | motion/react staggerChildren 0.3s; `setTimeout` redirect; neural-network bg via CSS/canvas |
| TEST-05 | `/test/[id]/result` — gauge 0→final 1.5s, 5 sub-score bars, confetti if score > 70; share/retake CTAs | `motion` animate on mount; `canvas-confetti`; score from sessionStorage |
</phase_requirements>

---

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react | ^12.36.0 | Scroll reveals, gauge animation, stagger steps, AnimatePresence | Already in use across all Phase 3 sections |
| react-hook-form | ^7.72.0 | All auth forms and user-info form | Already in codebase; standardSchemaResolver + zod v4 pattern established |
| zod | ^4.3.6 | Form validation schemas | Already in codebase; `standardSchemaResolver` from @hookform/resolvers v5 |
| sonner | ^2.0.7 | "Coming soon" toasts, permission-denied toasts | Already wired in layout.tsx Toaster |
| react-i18next | ^16.5.8 | All UI strings via `useTranslation()` | Mandatory per I18N-02; all text must go through it |
| @supabase/ssr | ^0.9.0 | Supabase data reads only — no auth writes | Browser + server clients already in src/lib/supabase.ts |

### New Dependencies to Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/core | ^6.x | Drag context, sensors, collision detection | TEST-03 drag-and-drop question type |
| @dnd-kit/sortable | ^8.x | `useSortable`, `SortableContext`, `arrayMove` | TEST-03 ranking via drag-and-drop |
| @dnd-kit/utilities | ^3.x | `CSS.Transform.toString()` | Required peer of @dnd-kit/sortable |
| canvas-confetti | ^1.9.x | Particle confetti burst | TEST-05 result page, score > 70 |
| @types/canvas-confetti | ^1.9.x | TypeScript types for canvas-confetti | devDependency — TypeScript strict mode |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @dnd-kit/sortable | react-beautiful-dnd | react-beautiful-dnd is unmaintained (archived 2023); dnd-kit is the ecosystem standard |
| canvas-confetti | react-confetti | canvas-confetti is lighter (imperative API, no re-renders); react-confetti requires DOM sizing |
| cookie for proxy auth | localStorage only | localStorage is unavailable at edge runtime — cookie is the only option for proxy.ts |

**Installation:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities canvas-confetti
npm install --save-dev @types/canvas-confetti
```

---

## Architecture Patterns

### Critical: Next.js 16 — `proxy.ts` replaces `middleware.ts`

**Confirmed from official Next.js 16.2.1 docs (2026-03-20):** `middleware.ts` is deprecated in v16.0.0 and renamed to `proxy.ts`. The exported function is renamed from `middleware` to `proxy`. File location: `src/proxy.ts`.

```typescript
// src/proxy.ts  ← NOT src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('crismatest_auth')?.value === '1'
  const { pathname } = request.nextUrl

  const protectedPaths = ['/dashboard', '/test']
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/test/:path*'],
}
```

### Cookie Handshake for Visual Auth

Because `proxy.ts` runs at the edge and cannot access `localStorage`, auth must set a companion cookie alongside the localStorage flag.

**On login/signup (client component):**
```typescript
// Set both localStorage (for UI reactivity) and cookie (for proxy.ts guard)
localStorage.setItem('crismatest_isLoggedIn', 'true')
document.cookie = 'crismatest_auth=1; path=/; SameSite=Lax'
```

**On logout:**
```typescript
localStorage.removeItem('crismatest_isLoggedIn')
// Expire the cookie
document.cookie = 'crismatest_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
```

**AUTH-04 Nav State — AuthContext pattern:**
```typescript
// src/lib/auth-context.tsx  — 'use client'
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('crismatest_isLoggedIn') === 'true')
  }, [])
  // ... login/logout helpers
}
```
NavShell reads `useAuth()` to switch between logged-out (Login/Sign Up buttons) and logged-in (avatar + dropdown) states.

### App Router Layout Groups for Full-Screen Pages

Auth pages (`/sign-up`, `/login`, etc.) and test-flow pages (`/test/[id]/*`) must NOT render NavShell (confirmed in REQUIREMENTS.md: "no NavShell (full-screen focus mode per `introNote`)"). Use route groups:

```
src/app/
├── (marketing)/            # NavShell rendered — landing pages
│   └── layout.tsx          # (can reuse root layout if NavShell is conditional)
├── (auth)/                 # No NavShell, centered card layout
│   ├── layout.tsx          # min-h-screen, no pt-16
│   ├── sign-up/page.tsx
│   ├── login/page.tsx
│   └── forgot-password/
├── (test)/                 # No NavShell, full-screen
│   ├── layout.tsx          # min-h-screen, no pt-16, no padding
│   └── test/[id]/
└── layout.tsx              # Root — MotionConfig, I18nProvider, Toaster
```

**Alternative (simpler):** Keep root layout, add `pathname`-based conditional to NavShell to suppress itself for `(auth)` and `(test)` routes. NavShell already does this for `/dark` — extend the pattern.

The route-group approach is cleaner and avoids polluting NavShell with more path checks.

### Multi-Step Auth Flow (AUTH-01: sign-up)

Use a single `page.tsx` at `/sign-up` with local `step` state and `AnimatePresence` between steps. No separate routes for OTP, onboarding-step1/2, all-set-modal — all are modal overlays or step transitions within the sign-up page.

```typescript
type SignUpStep = 'form' | 'otp' | 'onboarding-1' | 'onboarding-2' | 'complete'
const [step, setStep] = useState<SignUpStep>('form')
```

### Webcam + Mic Pre-flight Check (TEST-02)

```typescript
// 'use client' — browser APIs only
useEffect(() => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      // Webcam: assign stream to video element via ref
      videoRef.current!.srcObject = stream
      // Mic: Web Audio API AnalyserNode for level bars
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      // requestAnimationFrame loop reads analyser.getByteFrequencyData()
    })
    .catch(() => {
      // Permission denied — show warning toast + retry button
      toast.error(t('test_check_permission_denied'))
    })
  return () => stream?.getTracks().forEach(t => t.stop()) // cleanup
}, [])
```

The mic-level bars animate based on `Uint8Array` from `analyser.getByteFrequencyData()` using `requestAnimationFrame`. Each frame, compute average volume and map to bar heights (5–8 bars, CSS height transition).

### Countdown Timer (TEST-03)

```typescript
const [timeRemaining, setTimeRemaining] = useState(totalSeconds)
const timerColor = timeRemaining <= 30 ? '#EF4444' : timeRemaining <= 60 ? '#F59E0B' : undefined

useEffect(() => {
  if (timeRemaining <= 0) return
  const id = setInterval(() => setTimeRemaining(t => t - 1), 1000)
  return () => clearInterval(id)
}, [timeRemaining])
```

Display in JetBrains Mono (`font-jetbrains-mono` CSS variable) with `MM:SS` formatting.

### dnd-kit Drag and Drop (TEST-03 — drag-and-drop question type)

```typescript
// 'use client'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
         className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-grab active:cursor-grabbing min-h-[48px]">
      <GripVertical size={16} className="text-slate-400" />
      {label}
    </div>
  )
}

// Parent question component:
const sensors = useSensors(useSensor(PointerSensor))
<DndContext sensors={sensors} collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (over && active.id !== over.id) {
                setItems(prev => arrayMove(prev, prev.indexOf(active.id), prev.indexOf(over.id)))
              }
            }}>
  <SortableContext items={items} strategy={verticalListSortingStrategy}>
    {items.map(id => <SortableItem key={id} id={id} label={labels[id]} />)}
  </SortableContext>
</DndContext>
```

Note: `DndContext` has no SSR issue in Next.js App Router with `'use client'`. No `DndContextWithNoSSR` wrapper needed for client components.

### Calculating Screen Animation (TEST-04)

```typescript
// motion/react staggerChildren for step list
const calcSteps = ['Analyzing responses.', 'Checking consistency.', 'Computing sub-scores.', 'Generating CrismaScore.']
// staggerContainer (already in src/lib/animations.ts) with 0.3s children delay
// After steps complete, useEffect with setTimeout for 5–7s auto-redirect:
useEffect(() => {
  const timer = setTimeout(() => router.push(`/test/${id}/result`), 6000)
  return () => clearTimeout(timer)
}, [])
```

Neural-network particle background: use a CSS-only approach (radial gradient dots + subtle animation) or a simple `<canvas>` with `requestAnimationFrame` drawing lines between moving particles. CSS approach is sufficient for a prototype and avoids adding a particle library.

### CrismaScore Gauge Animation (TEST-05)

Use `motion` `animate` with a `useMotionValue` + `useTransform` approach for the SVG arc gauge:

```typescript
import { useMotionValue, animate, useTransform } from 'motion/react'

const progress = useMotionValue(0)
const strokeDashoffset = useTransform(progress, [0, 100], [circumference, 0])

useEffect(() => {
  const controls = animate(progress, finalScore, {
    duration: 1.5,
    ease: 'easeOut',
  })
  return controls.stop
}, [finalScore])
```

The gauge is an SVG `<circle>` with `strokeDasharray={circumference}` and animated `strokeDashoffset`.

### Canvas Confetti (TEST-05)

```typescript
// 'use client'
import confetti from 'canvas-confetti'

useEffect(() => {
  if (score > 70) {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1B4FD8', '#3B6FE8', '#6366F1', '#FFFFFF'],
    })
  }
}, [score])
```

TypeScript import: `import confetti from 'canvas-confetti'` (works with `@types/canvas-confetti` installed).

### Anti-Patterns to Avoid

- **Using `middleware.ts`:** Renamed to `proxy.ts` in Next.js 16. Using old name will produce a silent no-op or build warning.
- **Reading localStorage in proxy.ts:** localStorage is unavailable at edge. Always use cookies for the proxy guard.
- **Calling `getUserMedia` in a Server Component:** Browser API — must be inside `'use client'` component with `useEffect`.
- **Calling `new AudioContext()` outside user gesture:** Some browsers require a user interaction before creating AudioContext. Create on the `getUserMedia` success path (called after user clicks "Check Permissions" button).
- **Hardcoding question count:** Load questions from sessionStorage or prop — the carousel must handle 12–18 questions.
- **Not stopping media tracks on unmount:** Always call `stream.getTracks().forEach(t => t.stop())` in useEffect cleanup to release the webcam/mic.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop ranking | Custom mouse event tracker | `@dnd-kit/sortable` | Keyboard accessibility, touch support, 48px target compliance built-in |
| Confetti burst | Canvas particle system | `canvas-confetti` | Edge cases: frame rate, particle physics, cleanup — trivial with the library |
| Form state + validation | Manual `useState` per field | `react-hook-form` + zod (already in codebase) | Already established pattern in Phase 3 contact form |
| Timer display format | `Math.floor(seconds / 60)` ad hoc | Use a `formatTime` util returning `MM:SS` | Consistency; reused across question types |
| Audio level calculation | Direct FFT math | `AnalyserNode.getByteFrequencyData()` + average | Web Audio API handles all FFT; just average the Uint8Array |

**Key insight:** The browser media APIs (getUserMedia, Web Audio, MediaRecorder) are feature-complete for prototype needs — there are no missing capabilities that require extra libraries.

---

## Common Pitfalls

### Pitfall 1: `proxy.ts` vs `middleware.ts`
**What goes wrong:** Creating `src/middleware.ts` instead of `src/proxy.ts` — protected routes never redirect, AUTH-05 appears to work in dev but silently fails.
**Why it happens:** All existing tutorials, GitHub examples, and LLM training data reference `middleware.ts`. The rename is new in Next.js 16.0.0 (March 2026).
**How to avoid:** Create `src/proxy.ts`, export `proxy` function (not `middleware`). Run `npm run build` to verify no deprecation warnings.
**Warning signs:** `/dashboard` is accessible when logged out; no 302 redirect in browser dev tools network tab.

### Pitfall 2: localStorage in proxy.ts
**What goes wrong:** Trying to read `localStorage.getItem('crismatest_isLoggedIn')` inside proxy.ts — throws `ReferenceError: localStorage is not defined`.
**Why it happens:** proxy.ts runs at Node.js/Edge runtime, not the browser.
**How to avoid:** Write `document.cookie = 'crismatest_auth=1; path=/'` alongside every `localStorage.setItem` call. Read the cookie in proxy.ts with `request.cookies.get('crismatest_auth')`.

### Pitfall 3: NavShell `pt-16` on full-screen test pages
**What goes wrong:** The root `layout.tsx` wraps `<main className="pt-16">` — test-flow pages (which have no NavShell) will have an unwanted 64px top gap.
**Why it happens:** Root layout assumes NavShell is always present.
**How to avoid:** Use App Router route groups `(auth)` and `(test)` with their own `layout.tsx` that omit `pt-16`. Or suppress `pt-16` on those routes via pathname check in root layout.

### Pitfall 4: AudioContext blocked by browser autoplay policy
**What goes wrong:** `new AudioContext()` created on component mount throws `DOMException: The AudioContext was not allowed to start`.
**Why it happens:** Browsers require user interaction before audio context creation.
**How to avoid:** Create the AudioContext inside the `.then()` callback of `getUserMedia()`, which is initiated by a user action (clicking "Check Permissions" or the page load being in response to a button click).

### Pitfall 5: MediaRecorder for audio/video question — codec compatibility
**What goes wrong:** `MediaRecorder` codec `video/webm;codecs=vp9` unsupported on Safari — recording silently fails.
**Why it happens:** Safari uses `video/mp4` by default.
**How to avoid:** Check `MediaRecorder.isTypeSupported()` and fall back:
```typescript
const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
  ? 'video/webm;codecs=vp9'
  : 'video/mp4'
```

### Pitfall 6: sessionStorage access on server
**What goes wrong:** Accessing `sessionStorage.getItem('crismatest_candidate_info')` in a Server Component throws `ReferenceError`.
**Why it happens:** sessionStorage is browser-only.
**How to avoid:** All sessionStorage reads must be in `'use client'` components inside `useEffect`.

### Pitfall 7: react-hook-form `standardSchemaResolver` pattern
**What goes wrong:** Using `zodResolver` from `@hookform/resolvers/zod` — throws module-not-found error.
**Why it happens:** @hookform/resolvers v5 removed the `/zod` sub-package (established in Phase 3 STATE.md).
**How to avoid:** Use `standardSchemaResolver` from `@hookform/resolvers`:
```typescript
import { standardSchemaResolver } from '@hookform/resolvers'
useForm({ resolver: standardSchemaResolver(myZodSchema) })
```

---

## Code Examples

Verified patterns from official sources and project codebase:

### proxy.ts — Protected Routes Guard
```typescript
// src/proxy.ts  (Source: Next.js 16.2.1 official docs, 2026-03-20)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get('crismatest_auth')?.value === '1'
  const { pathname } = request.nextUrl

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/test')) && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/test/:path*'],
}
```

### Auth Cookie Helpers (client)
```typescript
// src/lib/auth.ts  — 'use client' boundary enforced by callers
export function setAuthSession() {
  localStorage.setItem('crismatest_isLoggedIn', 'true')
  document.cookie = 'crismatest_auth=1; path=/; SameSite=Lax'
}

export function clearAuthSession() {
  localStorage.removeItem('crismatest_isLoggedIn')
  document.cookie = 'crismatest_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function getIsLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('crismatest_isLoggedIn') === 'true'
}
```

### formatTime util
```typescript
// src/lib/utils.ts addition
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
```

### Mic Level Bars — requestAnimationFrame loop
```typescript
// Inside useEffect after getUserMedia success
let animationId: number
const dataArray = new Uint8Array(analyser.frequencyBinCount)

const tick = () => {
  analyser.getByteFrequencyData(dataArray)
  const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
  setMicLevel(avg / 255) // 0–1 normalized
  animationId = requestAnimationFrame(tick)
}
animationId = requestAnimationFrame(tick)
return () => cancelAnimationFrame(animationId)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js v16.0.0 | File must be `src/proxy.ts`, function must be `proxy` |
| `export function middleware` | `export function proxy` | Next.js v16.0.0 | All Next.js tutorials pre-v16 use wrong filename |
| `zodResolver` from `@hookform/resolvers/zod` | `standardSchemaResolver` from `@hookform/resolvers` | @hookform/resolvers v5 | Already established in Phase 3 |
| `react-beautiful-dnd` | `@dnd-kit/sortable` | 2023 (rbd archived) | dnd-kit is the maintained ecosystem standard |

**Deprecated/outdated:**
- `middleware.ts`: Deprecated in Next.js 16 — renamed to `proxy.ts`. Using old name will not break immediately but triggers deprecation warning.
- `import { Variants } from 'motion/react'`: Still doesn't re-export in v12 — use `import type { Variants } from 'motion-dom'` (established in Phase 01 STATE.md decision).

---

## Open Questions

1. **Neural-network particle animation for calculating page (`calcBg`)**
   - What we know: Spec says "neural-network particle animation" — full-screen dark-navy background
   - What's unclear: Whether a CSS-only approach suffices for a prototype or a canvas implementation is expected
   - Recommendation: CSS radial-gradient dots with a subtle floating animation is sufficient for v1 prototype; saves a library install. Planner should scope this as "CSS particle illusion" not real canvas physics.

2. **Test data source for `/test/[id]`**
   - What we know: Phase 3 seeded `test_templates` and `questions` tables in Supabase; `/api/tests` and `/api/tests/[id]` are Phase 5 requirements
   - What's unclear: Phase 4 requires `/test/[id]/intro` to show real test data (role, modules, duration) — but the API routes are Phase 5
   - Recommendation: In Phase 4, seed a static `MOCK_TEST` object in a `src/lib/mock-data.ts` file that matches the Supabase schema shape; Phase 5 will replace with live API. This keeps Phase 4 self-contained.

3. **`/test/[id]` — what IDs are valid in Phase 4?**
   - What we know: Supabase has test templates with real IDs from seed script
   - What's unclear: Phase 4 should not require a running Supabase query
   - Recommendation: Use `id = 'sample'` as the default test ID for all Phase 4 development; the mock data file exports a single `MOCK_TEST` object regardless of `id` parameter.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no test runner configured (per CLAUDE.md) |
| Config file | None — Wave 0 gap |
| Quick run command | `npm run type-check` (TypeScript only) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Sign-up form submits and navigates to OTP step | manual | n/a | ❌ manual-only |
| AUTH-02 | Login sets cookie + localStorage + redirects | manual | n/a | ❌ manual-only |
| AUTH-03 | Forgot password 3-step completes to /login | manual | n/a | ❌ manual-only |
| AUTH-04 | Nav switches to avatar after login | manual | n/a | ❌ manual-only |
| AUTH-05 | /dashboard redirect when logged out | manual | `npm run type-check` (proxy.ts types) | ❌ manual-only |
| TEST-01 | Intro page renders split-panel | manual | n/a | ❌ manual-only |
| TEST-01b | user-info form stores to sessionStorage | manual | n/a | ❌ manual-only |
| TEST-02 | Webcam + mic permissions requested | manual | n/a | ❌ manual-only (browser API) |
| TEST-03 | All 6 question types render + timer colors | manual | n/a | ❌ manual-only |
| TEST-04 | Calculating auto-redirects after 5–7s | manual | n/a | ❌ manual-only |
| TEST-05 | Score gauge animates + confetti fires | manual | n/a | ❌ manual-only |
| - | TypeScript strict mode passes | automated | `npm run type-check` | ✅ exists |
| - | No lint errors | automated | `npm run lint` | ✅ exists |

**All Phase 4 requirements require browser interaction — manual QA is the validation gate.**

### Sampling Rate
- **Per task commit:** `npm run type-check`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Manual browser walkthrough of both complete flows (auth + test) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities canvas-confetti` + `@types/canvas-confetti`
- [ ] Create `src/proxy.ts` (protected routes guard)
- [ ] Create `src/lib/auth.ts` (setAuthSession / clearAuthSession / getIsLoggedIn helpers)
- [ ] Create `src/lib/mock-data.ts` (MOCK_TEST static object for Phase 4 test-flow development)
- [ ] Add auth + test i18n keys to `locales/en.json` and `locales/fr.json`

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.1 official docs (fetched 2026-03-20) — proxy.ts file convention, matcher config, cookie API, migration from middleware.ts
- MDN Web Docs — `MediaDevices.getUserMedia()`, `AnalyserNode`, `MediaRecorder`
- dnd-kit official docs (dndkit.com/presets/sortable) — package names, useSortable pattern, DndContext sensors
- Project STATE.md — established decisions: standardSchemaResolver, motion-dom Variants import, React Compiler active

### Secondary (MEDIUM confidence)
- WebSearch → canvas-confetti npm page — version 1.9.x, @types/canvas-confetti 1.9.0, imperative API
- Next.js authentication guide (nextjs.org/docs/app/guides/authentication) — optimistic vs secure check pattern
- auth0.com blog "Next.js 16: What's New for Authentication and Authorization" — proxy.ts confirmation

### Tertiary (LOW confidence)
- Various WebSearch results on mic level + requestAnimationFrame patterns — pattern confirmed against MDN AnalyserNode docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified against npm and official docs; dnd-kit and canvas-confetti are well-established
- Architecture: HIGH — proxy.ts confirmed from official Next.js 16.2.1 docs; cookie handshake is a standard pattern
- Pitfalls: HIGH — middleware→proxy rename verified from official docs; other pitfalls from direct codebase analysis and established Phase 3 decisions
- Browser APIs: MEDIUM — getUserMedia and AnalyserNode patterns verified against MDN; MediaRecorder codec fallback from general browser compatibility knowledge

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (Next.js 16 is stable; dnd-kit and canvas-confetti are stable libraries)
