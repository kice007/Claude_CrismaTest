'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Star, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Tab Items ────────────────────────────────────────────────────────────────

type TabItem =
  | { type: 'link'; key: string; href: string; icon: React.ElementType; exact: boolean }
  | { type: 'action'; key: string; icon: React.ElementType; onClick: () => void }

// ─── Component ───────────────────────────────────────────────────────────────

export function BottomTabBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const tabs: TabItem[] = [
    {
      type: 'link',
      key: 'dashboard.nav.dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      type: 'link',
      key: 'dashboard.nav.candidates',
      href: '/dashboard',
      icon: Users,
      exact: true,
    },
    {
      type: 'link',
      key: 'dashboard.nav.tests',
      href: '/dashboard/tests',
      icon: FileText,
      exact: false,
    },
    {
      type: 'link',
      key: 'dashboard.nav.talentPool',
      href: '/dashboard/talent-pool',
      icon: Star,
      exact: false,
    },
    {
      type: 'action',
      key: 'dashboard.nav.profile',
      icon: User,
      onClick: () => toast.info('Profile coming soon'),
    },
  ]

  return (
    <nav
      className="flex md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0F2A6B] z-50"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = tab.type === 'link' ? isActive(tab.href, tab.exact) : false
        const itemClass = cn(
          'flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors duration-150',
          active ? 'text-[#2563EB]' : 'text-slate-300'
        )

        if (tab.type === 'action') {
          return (
            <button
              key={tab.key}
              type="button"
              onClick={tab.onClick}
              className={itemClass}
            >
              <Icon size={20} className="shrink-0" />
              <span>{t(tab.key)}</span>
            </button>
          )
        }

        return (
          <Link key={tab.key} href={tab.href} className={itemClass}>
            <Icon size={20} className="shrink-0" />
            <span>{t(tab.key)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
