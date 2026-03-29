'use client'
import { useEffect, useRef, useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

export function AuthLangToggle() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGS.find((l) => l.code === i18n.resolvedLanguage) ?? LANGS[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-slate-700 transition-colors"
      >
        <Globe size={15} />
        <span>{current.label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-md py-1 min-w-[130px] z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(l.code)
                setOpen(false)
              }}
              className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-slate-50 transition-colors ${
                current.code === l.code ? 'text-[#1B4FD8] font-medium' : 'text-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
