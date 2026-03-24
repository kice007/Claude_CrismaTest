// src/app/(test)/layout.tsx
// Route group for full-screen test-flow pages — no NavShell, no pt-16, no padding.
// Pages in this group: /test/[id]/intro, /user-info, /check, /questions, /calculating, /result
export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
