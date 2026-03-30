'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  PencilRuler,
  ArrowRight,
  Check,
  X,
} from 'lucide-react'

const PAGE_SIZE = 10
const ROW_HEIGHT = 56

interface Candidate {
  id: string
  full_name: string
  role: string
  avatar_initials: string
  avatar_color: string
  crima_score: number
  trust_score: number
  fraud_flag_severity: 'none' | 'low' | 'medium' | 'high'
  fraud_flag_count: number
  status: 'passed' | 'failed' | 'pending'
  test_date: string
}

const SCORE_RANGE_VALUES = ['all', '90-100', '75-89', '60-74', '0-59'] as const

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function StatusBadge({ status }: { status: Candidate['status'] }) {
  const { t } = useTranslation()
  const map = {
    passed: { bg: '#DCFCE7', color: '#16A34A', label: t('dashboard.status.reviewed') },
    pending: { bg: '#FEF3C7', color: '#92400E', label: t('dashboard.status.pending') },
    failed: { bg: '#FEE2E2', color: '#991B1B', label: t('dashboard.status.failed') },
  }
  const s = map[status] ?? map.pending
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 12,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  )
}

interface DropdownOption {
  label: string
  value: string
}

// Single-select dropdown (used for Score range)
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: DropdownOption[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)
  const label = selected && selected.value !== 'all' ? selected.label : (placeholder ?? options[0]?.label)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          background: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          height: 36,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontSize: 13,
          color: value === 'all' ? '#64748B' : '#0F172A',
          fontWeight: value === 'all' ? 400 : 500,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
        <ChevronDown
          size={14}
          color="#64748B"
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: '100%',
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '9px 14px',
                background: opt.value === value ? '#F0F4FF' : '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                color: opt.value === value ? '#1B4FD8' : '#0F172A',
                fontWeight: opt.value === value ? 500 : 400,
                textAlign: 'left',
                gap: 16,
              }}
            >
              {opt.label}
              {opt.value === value && <Check size={13} color="#1B4FD8" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Multi-select role dropdown with internal search
function RoleDropdown({
  roles,
  selected,
  onToggle,
}: {
  roles: string[]
  selected: string[]
  onToggle: (role: string) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  const filtered = roles.filter(r => r.toLowerCase().includes(query.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          background: selected.length > 0 ? '#EEF2FF' : '#fff',
          border: selected.length > 0 ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
          borderRadius: 8,
          height: 36,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontSize: 13,
          color: selected.length > 0 ? '#1B4FD8' : '#64748B',
          fontWeight: selected.length > 0 ? 600 : 400,
          whiteSpace: 'nowrap',
        }}
      >
        {t('dashboard.candidateTable.columns.role')}
        {selected.length > 0 && (
          <span style={{
            background: '#1B4FD8',
            color: '#fff',
            borderRadius: 10,
            fontSize: 11,
            fontWeight: 700,
            padding: '1px 7px',
            lineHeight: '18px',
          }}>
            {selected.length}
          </span>
        )}
        <ChevronDown
          size={14}
          color={selected.length > 0 ? '#1B4FD8' : '#64748B'}
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: 240,
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '6px 10px',
            }}>
              <Search size={13} color="#94A3B8" />
              <input
                ref={searchRef}
                type="text"
                placeholder={t('dashboard.candidateTable.searchRoles')}
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 13,
                  color: '#0F172A',
                  flex: 1,
                  minWidth: 0,
                }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={12} color="#94A3B8" />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 14px', color: '#94A3B8', fontSize: 13 }}>{t('dashboard.candidateTable.noRolesFound')}</div>
            ) : (
              filtered.map(role => {
                const isSelected = selected.includes(role)
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onToggle(role)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 14px',
                      background: isSelected ? '#F0F4FF' : '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      color: isSelected ? '#1B4FD8' : '#0F172A',
                      fontWeight: isSelected ? 500 : 400,
                      textAlign: 'left',
                      gap: 8,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {role}
                    </span>
                    {isSelected && <Check size={13} color="#1B4FD8" />}
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

export default function CandidatesPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const scoreRanges = [
    { label: t('dashboard.candidateTable.allScores'), value: 'all' },
    { label: '90–100', value: '90-100' },
    { label: '75–89', value: '75-89' },
    { label: '60–74', value: '60-74' },
    { label: t('dashboard.candidateTable.below60'), value: '0-59' },
  ]

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [scoreRange, setScoreRange] = useState('all')
  const [page, setPage] = useState(1)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilters, scoreRange])

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/candidates?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setCandidates(Array.isArray(data) ? data : [])
      } else {
        setCandidates([])
      }
    } catch {
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  function handleCompare() {
    router.push(`/dashboard/compare?ids=${selectedIds.join(',')}`)
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 5) return prev
      return [...prev, id]
    })
  }

  // Unique roles from fetched candidates
  const roles = Array.from(new Set(candidates.map(c => c.role))).filter(Boolean).sort()

  function toggleRole(role: string) {
    setRoleFilters(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  function removeRole(role: string) {
    setRoleFilters(prev => prev.filter(r => r !== role))
  }

  // Client-side filters: role → score range
  const roleFiltered = roleFilters.length === 0
    ? candidates
    : candidates.filter(c => roleFilters.includes(c.role))

  const scoreFiltered = roleFiltered.filter(c => {
    if (scoreRange === 'all') return true
    if (scoreRange === '90-100') return c.crima_score >= 90
    if (scoreRange === '75-89') return c.crima_score >= 75 && c.crima_score <= 89
    if (scoreRange === '60-74') return c.crima_score >= 60 && c.crima_score <= 74
    if (scoreRange === '0-59') return c.crima_score < 60
    return true
  })

  const totalResults = scoreFiltered.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = scoreFiltered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id))

  return (
    <div
      style={{
        background: '#EEF2FF',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      {/* 1. Header */}
      <div
        style={{
          height: 72,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#EEF2FF',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#0F2A6B', fontSize: 24, fontWeight: 700 }}>{t('dashboard.candidateTable.title')}</span>

        <button
          type="button"
          onClick={() => router.push('/dashboard/build-test')}
          style={{
            background: '#1B4FD8',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <PencilRuler size={20} color="#fff" />
          {t('dashboard.nav.buildTest')}
        </button>
      </div>

      {/* 2. Toolbar */}
      <div
        style={{
          height: 52,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#EEF2FF',
          flexShrink: 0,
        }}
      >
        {/* Role filter */}
        <RoleDropdown roles={roles} selected={roleFilters} onToggle={toggleRole} />

        {/* Score range */}
        <CustomDropdown
          options={scoreRanges}
          value={scoreRange}
          onChange={setScoreRange}
          placeholder={t('dashboard.candidateTable.scoreRange')}
        />

        {/* Search box */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            height: 36,
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
          }}
        >
          <Search size={14} color="#94A3B8" />
          <input
            type="text"
            placeholder={t('dashboard.candidateTable.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#0F172A',
              fontSize: 13,
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* 3. Active role filter chips */}
      {roleFilters.length > 0 && (
        <div
          style={{
            padding: '0 32px 8px 32px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {roleFilters.map(role => (
            <div
              key={role}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#fff',
                border: '1px solid #C7D2FE',
                borderRadius: 20,
                padding: '4px 10px 4px 12px',
                fontSize: 12,
                color: '#1B4FD8',
                fontWeight: 500,
              }}
            >
              {role}
              <button
                type="button"
                onClick={() => removeRole(role)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={12} color="#6366F1" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Table outer */}
      <div style={{ padding: '8px 32px 8px 32px' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          {/* Table header row */}
          <div
            style={{
              height: 44,
              background: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: 52, display: 'flex', justifyContent: 'center', flexShrink: 0 }} />
            <div style={{ width: 220, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.candidate')}
            </div>
            <div style={{ width: 150, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.role')}
            </div>
            <div style={{ width: 110, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.score')}
            </div>
            <div style={{ width: 90, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.trust')}
            </div>
            <div style={{ width: 110, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.status')}
            </div>
            <div style={{ width: 120, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              {t('dashboard.candidateTable.columns.date')}
            </div>
            <div style={{ flex: 1, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, display: 'flex', justifyContent: 'flex-end' }}>
              {t('dashboard.candidateTable.columns.actions')}
            </div>
          </div>

          {/* Data rows — fixed height for exactly PAGE_SIZE rows */}
          <div style={{ height: PAGE_SIZE * ROW_HEIGHT }}>
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 56,
                    borderBottom: '1px solid #F1F5F9',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    gap: 12,
                  }}
                >
                  <div style={{ height: 16, borderRadius: 4, background: '#E2E8F0', flex: 1, opacity: 0.6 }} />
                </div>
              ))
            ) : scoreFiltered.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                  color: '#94A3B8',
                  fontSize: 14,
                }}
              >
                {t('dashboard.candidateTable.empty')}
              </div>
            ) : (
              paginated.map(candidate => {
                const isSelected = selectedIds.includes(candidate.id)
                return (
                  <div
                    key={candidate.id}
                    style={{
                      height: 56,
                      borderBottom: '1px solid #F1F5F9',
                      background: isSelected ? '#F0F4FF' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{ width: 52, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => toggleSelect(candidate.id)}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          border: isSelected ? 'none' : '2px solid #E2E8F0',
                          background: isSelected ? '#1B4FD8' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={10} color="#fff" strokeWidth={3} />}
                      </button>
                    </div>

                    {/* Candidate */}
                    <div
                      style={{ width: 220, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, cursor: 'pointer' }}
                      onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: candidate.avatar_color || '#6366F1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {candidate.avatar_initials ||
                          candidate.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ color: '#0F172A', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {candidate.full_name}
                        </span>
                        <span style={{ color: '#94A3B8', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {candidate.role}
                        </span>
                      </div>
                    </div>

                    {/* Role pill */}
                    <div style={{ width: 150, padding: '0 12px', flexShrink: 0 }}>
                      <span style={{ background: '#EEF2FF', color: '#6366F1', borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {candidate.role}
                      </span>
                    </div>

                    {/* CrismaScore */}
                    <div style={{ width: 110, padding: '0 12px', flexShrink: 0 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          background: '#1B4FD8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {candidate.crima_score}
                      </div>
                    </div>

                    {/* Trust */}
                    <div style={{ width: 90, padding: '0 12px', color: '#0F172A', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                      {candidate.trust_score}%
                    </div>

                    {/* Status */}
                    <div style={{ width: 110, padding: '0 12px', flexShrink: 0 }}>
                      <StatusBadge status={candidate.status} />
                    </div>

                    {/* Date */}
                    <div style={{ width: 120, padding: '0 12px', color: '#64748B', fontSize: 12, flexShrink: 0 }}>
                      {formatDate(candidate.test_date)}
                    </div>

                    {/* Actions */}
                    <div style={{ flex: 1, padding: '0 12px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}
                        style={{
                          background: '#fff',
                          border: '1px solid #E2E8F0',
                          borderRadius: 6,
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          fontSize: 12,
                          color: '#0F172A',
                          fontWeight: 500,
                        }}
                      >
                        {t('dashboard.candidateTable.viewProfile')}
                        <ArrowRight size={13} color="#0F172A" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination footer */}
          <div
            style={{
              height: 48,
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#64748B', fontSize: 13 }}>
              {loading
                ? 'Loading…'
                : totalResults === 0
                  ? '0 results'
                  : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, totalResults)} of ${totalResults}`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                style={{
                  width: 32,
                  height: 32,
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: safePage <= 1 ? 'default' : 'pointer',
                  opacity: safePage <= 1 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={14} color="#64748B" />
              </button>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                style={{
                  width: 32,
                  height: 32,
                  background: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: safePage >= totalPages ? 'default' : 'pointer',
                  opacity: safePage >= totalPages ? 0.4 : 1,
                }}
              >
                <ChevronRight size={14} color="#64748B" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Compare bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            height: 68,
            background: '#fff',
            borderTop: '1px solid #E2E8F0',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={16} color="#6366F1" />
            <span style={{ color: '#0F172A', fontSize: 13, fontWeight: 600 }}>
              {t('dashboard.candidateTable.selectedCount', { count: selectedIds.length })}
            </span>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectedCandidates.slice(0, 3).map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: c.avatar_color || '#6366F1',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    marginLeft: i === 0 ? 0 : -8,
                    position: 'relative',
                    zIndex: 3 - i,
                  }}
                >
                  {(c.avatar_initials || c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase())}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                color: '#475569',
                fontSize: 12,
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#94A3B8', fontSize: 12 }}>
              {t('dashboard.candidateTable.compareHint')}
            </span>
            <button
              type="button"
              onClick={handleCompare}
              disabled={selectedIds.length < 2}
              style={{
                background: selectedIds.length >= 2 ? '#1B4FD8' : '#94A3B8',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: selectedIds.length >= 2 ? 'pointer' : 'default',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t('dashboard.candidateTable.compareNow')}
              <ArrowRight size={14} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
