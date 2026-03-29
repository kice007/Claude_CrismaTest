'use client'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Language-agnostic IDs paired with their translation keys
const SIZE_OPTIONS = [
  { id: '1_10',    tk: 'auth_signup_company_size_1_10' },
  { id: '11_50',   tk: 'auth_signup_company_size_11_50' },
  { id: '51_200',  tk: 'auth_signup_company_size_51_200' },
  { id: '201_500', tk: 'auth_signup_company_size_201_500' },
  { id: '500_plus',tk: 'auth_signup_company_size_500_plus' },
]

interface Props {
  value: string        // stores the option ID
  onChange: (v: string) => void
}

export function SizeSelect({ value, onChange }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const selectedLabel = SIZE_OPTIONS.find((o) => o.id === value)
    ? t(SIZE_OPTIONS.find((o) => o.id === value)!.tk)
    : ''

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm bg-white transition-colors focus:outline-none ${
          open
            ? 'border-[#1B4FD8] ring-2 ring-[#1B4FD8]/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={selectedLabel ? 'text-slate-700' : 'text-slate-400'}>
          {selectedLabel || t('auth_signup_size_placeholder')}
        </span>
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setOpen(false) }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors"
            >
              <span className={value === opt.id ? 'text-[#1B4FD8] font-medium' : 'text-slate-700'}>
                {t(opt.tk)}
              </span>
              {value === opt.id && <Check size={13} className="text-[#1B4FD8]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
