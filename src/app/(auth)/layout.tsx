// src/app/(auth)/layout.tsx
// Route group for full-screen auth pages — no NavShell, no pt-16.
// Pages in this group: /sign-up, /login, /forgot-password, /forgot-password/verify, /forgot-password/reset
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // -mt-16 cancels the pt-16 added by the root layout's <main>, allowing auth
  // pages to start at the very top of the viewport (no NavShell on auth routes).
  return (
    <div className="-mt-16">
      {children}
    </div>
  )
}
