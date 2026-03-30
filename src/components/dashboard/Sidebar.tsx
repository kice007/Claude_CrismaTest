'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardList, Star, Settings, LogOut, ChevronUp, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { labelKey: 'dashboard.nav.dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { labelKey: 'dashboard.nav.candidates', href: '/dashboard/candidates', icon: Users, exact: false },
  { labelKey: 'dashboard.nav.tests', href: '/dashboard/tests', icon: ClipboardList, exact: false },
  { labelKey: 'dashboard.nav.talentPool', href: '/dashboard/talent-pool', icon: Star, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-full bg-[#0F172A] py-6 px-4 gap-2">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 h-10 w-full shrink-0">
        <Image
          src="/images/logo.png"
          alt="CrismaTest logo"
          width={42}
          height={36}
          className="shrink-0 object-contain"
        />
        <span className="font-bold text-base text-white leading-none">CrismaTest</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col w-full mt-6" style={{ gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center w-full rounded-lg shrink-0',
                active ? 'bg-[#1B4FD8]' : 'hover:bg-white/5'
              )}
              style={{ gap: 10, height: 48, padding: '0 12px' }}
            >
              <Icon
                size={20}
                className={cn('shrink-0', active ? 'text-white' : 'text-[#94A3B8]')}
              />
              <span
                className={cn(
                  'text-[14px] leading-none',
                  active ? 'text-white font-semibold' : 'text-[#94A3B8] font-normal'
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Profile footer with popup */}
      <div ref={menuRef} className="relative shrink-0">

        {/* Popup menu */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '4px 0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              zIndex: 50,
            }}
          >
            {/* Language switcher */}
            <div
              className="flex items-center w-full"
              style={{ gap: 10, padding: '10px 14px', borderBottom: '1px solid #334155' }}
            >
              <Globe size={15} color="#94A3B8" />
              <div className="flex items-center" style={{ gap: 4 }}>
                {(['en', 'fr'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => i18n.changeLanguage(lang)}
                    style={{
                      background: i18n.resolvedLanguage === lang ? '#1B4FD8' : 'transparent',
                      border: i18n.resolvedLanguage === lang ? 'none' : '1px solid #475569',
                      borderRadius: 6,
                      color: i18n.resolvedLanguage === lang ? '#fff' : '#94A3B8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '3px 10px',
                      lineHeight: '18px',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); router.push('/dashboard/settings') }}
              className="flex items-center w-full hover:bg-white/5 transition-colors"
              style={{ gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Settings size={15} color="#94A3B8" />
              <span style={{ fontSize: 13, color: '#E2E8F0' }}>{t('dashboard.nav.settings')}</span>
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); logout() }}
              className="flex items-center w-full hover:bg-white/5 transition-colors"
              style={{ gap: 10, padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <LogOut size={15} color="#F87171" />
              <span style={{ fontSize: 13, color: '#F87171' }}>{t('dashboard.nav.logout')}</span>
            </button>
          </div>
        )}

        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setMenuOpen(v => !v)}
          className={cn('flex items-center w-full rounded-lg transition-colors', menuOpen ? 'bg-white/5' : 'hover:bg-white/5')}
          style={{ gap: 10, height: 56, padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div
            className="shrink-0 rounded-[18px]"
            style={{ width: 36, height: 36, backgroundColor: '#3B6FE8' }}
          />
          <div className="flex flex-row items-center flex-1 min-w-0" style={{ gap: 6 }}>
            <span className="text-white font-semibold truncate text-[13px] leading-none">
              Acme Corp
            </span>
            <div
              className="flex items-center justify-center rounded-[9px] shrink-0"
              style={{ width: 36, height: 18, backgroundColor: '#6366F1' }}
            >
              <span className="text-white font-bold text-[10px] leading-none">Pro</span>
            </div>
          </div>
          <ChevronUp
            size={14}
            color="#94A3B8"
            style={{
              flexShrink: 0,
              transform: menuOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
      </div>
    </aside>
  )
}
