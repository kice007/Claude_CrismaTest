'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

// ─── All world countries (ISO 3166-1) ────────────────────────────────────────

const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
  'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
  'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'São Tomé and Príncipe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
  'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

// 7 rows visible before the scrollbar kicks in
const ITEM_H  = 40
const MAX_VIS = 7

interface Props {
  value:    string
  onChange: (v: string) => void
  hasError?: boolean
}

export function CountrySelect({ value, onChange, hasError }: Props) {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const containerRef        = useRef<HTMLDivElement>(null)
  const searchRef           = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : ALL_COUNTRIES

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Focus + reset query when dropdown opens
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => { setQuery(''); searchRef.current?.focus() }, 0)
    return () => clearTimeout(t)
  }, [open])

  const handleSelect = (country: string) => {
    onChange(country)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full h-11 flex items-center justify-between rounded-lg px-3.5 text-sm bg-white transition-all focus:outline-none ${
          open
            ? 'border-2 border-[#2563EB] ring-2 ring-[#2563EB]/15'
            : hasError
              ? 'border border-red-400'
              : 'border border-[#D1D5DB] hover:border-[#9CA3AF]'
        }`}
      >
        <span className={value ? 'text-[#111827]' : 'text-[#9CA3AF]'}>
          {value || 'Select country or region'}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#9CA3AF] flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E5E7EB] rounded-lg shadow-lg overflow-hidden">

          {/* Search bar */}
          <div className="p-2 border-b border-[#F3F4F6]">
            <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-2.5 py-1.5">
              <Search size={13} className="text-[#9CA3AF] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country..."
                className="flex-1 text-[13px] bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-[#9CA3AF] hover:text-[#374151] text-xs leading-none"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Country list — 7 rows visible, rest behind scrollbar */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: ITEM_H * MAX_VIS }}
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-[13px] text-[#9CA3AF] text-center">
                No country found
              </p>
            ) : (
              filtered.map((country) => {
                const selected = value === country
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3.5 text-[13px] text-left transition-colors ${
                      selected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                    }`}
                    style={{ height: ITEM_H }}
                  >
                    <span className={selected ? 'text-[#2563EB] font-medium' : 'text-[#374151]'}>
                      {country}
                    </span>
                    {selected && <Check size={13} className="text-[#2563EB] flex-shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
