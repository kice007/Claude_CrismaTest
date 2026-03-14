# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js dev mode)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Architecture

This is a **Next.js 16 App Router** project bootstrapped with `create-next-app`. It uses:

- **React 19** with the React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **TypeScript** with strict mode; path alias `@/*` maps to `./src/*`

### Structure

- `src/app/` — App Router root. `layout.tsx` sets up global fonts (Geist Sans + Geist Mono) and `globals.css`. `page.tsx` is the home route.
- `public/` — Static assets served at `/`

### Key notes

- The React Compiler is active — avoid patterns that would conflict with it (manual memoization with `useMemo`/`useCallback` is generally unnecessary).
- ESLint is configured with `eslint-config-next` (core-web-vitals + TypeScript rules).
- No backend, database, or API routes exist yet — this is a fresh scaffold.
