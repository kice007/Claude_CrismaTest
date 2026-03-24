// src/app/(auth)/layout.tsx
// Route group for full-screen auth pages — no NavShell, no pt-16.
// Pages in this group: /sign-up, /login, /forgot-password, /forgot-password/verify, /forgot-password/reset
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
