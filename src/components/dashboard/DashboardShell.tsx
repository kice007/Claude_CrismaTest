'use client'

import { Sidebar } from './Sidebar'
import { BottomTabBar } from './BottomTabBar'

// ─── Component ───────────────────────────────────────────────────────────────

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    // fixed inset-0 z-50: overlays the global NavShell (belt-and-suspenders layer 1)
    <div className="fixed inset-0 z-50 bg-white flex">
      {/* Sidebar: 240px on desktop, hidden on mobile (handled inside Sidebar component) */}
      <Sidebar />

      {/* Main content area: fills remaining width, scrollable */}
      <main className="flex-1 overflow-y-auto p-6 pb-14 md:pb-6">
        {children}
      </main>

      {/* Mobile bottom tab bar: positions itself as fixed bottom-0 */}
      <BottomTabBar />
    </div>
  )
}
