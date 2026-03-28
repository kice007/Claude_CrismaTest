'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Star, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

// ─── Nav Items ───────────────────────────────────────────────────────────────

const navItems = [
  {
    key: 'dashboard.nav.dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    key: 'dashboard.nav.candidates',
    href: '/dashboard',
    icon: Users,
    exact: true,
  },
  {
    key: 'dashboard.nav.tests',
    href: '/dashboard/tests',
    icon: FileText,
    exact: false,
  },
  {
    key: 'dashboard.nav.talentPool',
    href: '/dashboard/talent-pool',
    icon: Star,
    exact: false,
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { logout } = useAuth()

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-full bg-[#0F2A6B]">
      {/* Logo area */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Image
          src="/images/logo.png"
          alt="CrismaTest logo"
          width={32}
          height={28}
          className="shrink-0"
        />
        <span className="font-bold text-[17px] tracking-[-0.3px] text-white">
          CrismaTest
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-3 pt-4" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150',
                active
                  ? 'border-l-2 border-[#2563EB] bg-[#2563EB]/10 text-white pl-[10px]'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span>{t(item.key)}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        {/* Avatar + name + plan badge */}
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-semibold shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-medium truncate">John Doe</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#93C5FD] text-[11px] font-medium">
              {t('dashboard.sidebar.plan')}
            </span>
          </div>
        </div>
        {/* Logout button */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
        >
          <LogOut size={18} className="shrink-0" />
          <span>{t('dashboard.nav.logout')}</span>
        </button>
      </div>
    </aside>
  )
}
