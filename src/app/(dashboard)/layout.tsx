'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

// ─── Dashboard Route Group Layout ────────────────────────────────────────────
// Auth guard: redirects unauthenticated users to /login
// Wraps all /dashboard/* routes in the DashboardShell (sidebar + bottom tab bar)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return <DashboardShell>{children}</DashboardShell>
}
