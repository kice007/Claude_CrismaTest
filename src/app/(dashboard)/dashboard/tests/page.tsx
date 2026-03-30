'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  PencilRuler,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Eye,
  ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestTemplate {
  id: string
  name: string
  role: string
  modules: string[]
  duration: number
  status: 'active' | 'draft' | 'archived'
  created_at: string
  response_count: number
}

// ─── Static generic tests ──────────────────────────────────────────────────

const GENERIC_TESTS: TestTemplate[] = [
  { id: '1',  name: 'Full-Stack Engineer Screen',      role: 'Engineering',   modules: ['Logic', 'Job Skills'],               duration: 45, status: 'active',   created_at: '2026-01-10', response_count: 34 },
  { id: '2',  name: 'Data Analyst Assessment',         role: 'Data Science',  modules: ['Logic', 'Communication'],            duration: 40, status: 'active',   created_at: '2026-01-14', response_count: 22 },
  { id: '3',  name: 'Product Manager Fit Test',        role: 'Product',       modules: ['Communication', 'Job Skills'],       duration: 35, status: 'active',   created_at: '2026-01-18', response_count: 18 },
  { id: '4',  name: 'UX Designer Portfolio Review',    role: 'Design',        modules: ['Communication', 'Job Skills'],       duration: 30, status: 'draft',    created_at: '2026-01-22', response_count: 0  },
  { id: '5',  name: 'DevOps Culture & Tools Screen',   role: 'DevOps',        modules: ['Logic', 'Job Skills'],               duration: 40, status: 'active',   created_at: '2026-01-26', response_count: 11 },
  { id: '6',  name: 'Backend Engineer Deep Dive',      role: 'Engineering',   modules: ['Logic', 'Job Skills', 'Video'],      duration: 60, status: 'active',   created_at: '2026-02-02', response_count: 29 },
  { id: '7',  name: 'ML Engineer Evaluation',          role: 'Data Science',  modules: ['Logic', 'Job Skills'],               duration: 50, status: 'active',   created_at: '2026-02-06', response_count: 15 },
  { id: '8',  name: 'Frontend React Assessment',       role: 'Engineering',   modules: ['Logic', 'Job Skills'],               duration: 45, status: 'draft',    created_at: '2026-02-10', response_count: 0  },
  { id: '9',  name: 'Technical Recruiter Screen',      role: 'HR',            modules: ['Communication', 'Job Skills'],       duration: 25, status: 'active',   created_at: '2026-02-13', response_count: 8  },
  { id: '10', name: 'Sales Executive Fit Test',        role: 'Sales',         modules: ['Communication', 'Video'],            duration: 30, status: 'active',   created_at: '2026-02-17', response_count: 41 },
  { id: '11', name: 'Cloud Architect Screen',          role: 'DevOps',        modules: ['Logic', 'Job Skills', 'Video'],      duration: 55, status: 'archived', created_at: '2026-02-20', response_count: 7  },
  { id: '12', name: 'Data Engineer Pipeline Test',     role: 'Data Science',  modules: ['Logic', 'Job Skills'],               duration: 45, status: 'active',   created_at: '2026-02-24', response_count: 19 },
  { id: '13', name: 'iOS Developer Assessment',        role: 'Engineering',   modules: ['Logic', 'Job Skills'],               duration: 50, status: 'draft',    created_at: '2026-02-28', response_count: 0  },
  { id: '14', name: 'Customer Success Screen',         role: 'Sales',         modules: ['Communication', 'Video'],            duration: 25, status: 'active',   created_at: '2026-03-03', response_count: 27 },
  { id: '15', name: 'Brand Designer Evaluation',       role: 'Design',        modules: ['Communication', 'Job Skills'],       duration: 35, status: 'active',   created_at: '2026-03-06', response_count: 13 },
  { id: '16', name: 'Growth Product Manager Test',     role: 'Product',       modules: ['Logic', 'Communication'],            duration: 40, status: 'active',   created_at: '2026-03-09', response_count: 9  },
  { id: '17', name: 'Security Engineer Deep Dive',     role: 'Engineering',   modules: ['Logic', 'Job Skills', 'Video'],      duration: 60, status: 'archived', created_at: '2026-03-12', response_count: 5  },
  { id: '18', name: 'Analytics Lead Assessment',       role: 'Data Science',  modules: ['Logic', 'Communication', 'Video'],   duration: 50, status: 'active',   created_at: '2026-03-15', response_count: 16 },
  { id: '19', name: 'HR Business Partner Screen',      role: 'HR',            modules: ['Communication'],                     duration: 20, status: 'draft',    created_at: '2026-03-18', response_count: 0  },
  { id: '20', name: 'Enterprise AE Evaluation',        role: 'Sales',         modules: ['Communication', 'Job Skills'],       duration: 35, status: 'active',   created_at: '2026-03-21', response_count: 33 },
  { id: '21', name: 'Platform Engineer Screen',        role: 'DevOps',        modules: ['Logic', 'Job Skills'],               duration: 45, status: 'active',   created_at: '2026-03-24', response_count: 6  },
  { id: '22', name: 'Motion Designer Test',            role: 'Design',        modules: ['Job Skills', 'Video'],               duration: 30, status: 'draft',    created_at: '2026-03-27', response_count: 0  },
]

// ─── Constants ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 10
const ROW_HEIGHT = 56

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active',       value: 'active' },
  { label: 'Draft',        value: 'draft' },
  { label: 'Archived',     value: 'archived' },
]

const ALL_ROLES = Array.from(new Set(GENERIC_TESTS.map(t => t.role))).sort()

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateStr }
}

function StatusBadge({ status }: { status: TestTemplate['status'] }) {
  const { t } = useTranslation()
  const map = {
    active:   { bg: '#DCFCE7', color: '#16A34A', label: t('dashboard.tests.status.active') },
    draft:    { bg: '#FEF3C7', color: '#92400E', label: t('dashboard.tests.status.draft') },
    archived: { bg: '#F1F5F9', color: '#475569', label: t('dashboard.tests.status.archived') },
  }
  const s = map[status]
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 12, padding: '3px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

// ─── Single-select dropdown ────────────────────────────────────────────────

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  const label = value === 'all' ? (placeholder ?? options[0]?.label) : (options.find(o => o.value === value)?.label ?? placeholder)

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
          height: 36, padding: '0 14px', display: 'flex', alignItems: 'center',
          gap: 8, cursor: 'pointer', fontSize: 13,
          color: value === 'all' ? '#64748B' : '#0F172A',
          fontWeight: value === 'all' ? 400 : 500, whiteSpace: 'nowrap',
        }}
      >
        {label}
        <ChevronDown size={14} color="#64748B" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden' }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 14px', background: opt.value === value ? '#F0F4FF' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, color: opt.value === value ? '#1B4FD8' : '#0F172A', fontWeight: opt.value === value ? 500 : 400, textAlign: 'left', gap: 16 }}
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

// ─── Multi-select role dropdown with search ────────────────────────────────

function RoleDropdown({
  roles,
  selected,
  onToggle,
}: {
  roles: string[]
  selected: string[]
  onToggle: (role: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery('') }
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
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
          borderRadius: 8, height: 36, padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          fontSize: 13, color: selected.length > 0 ? '#1B4FD8' : '#64748B',
          fontWeight: selected.length > 0 ? 600 : 400, whiteSpace: 'nowrap',
        }}
      >
        Role
        {selected.length > 0 && (
          <span style={{ background: '#1B4FD8', color: '#fff', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '1px 7px', lineHeight: '18px' }}>
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} color={selected.length > 0 ? '#1B4FD8' : '#64748B'} style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 240, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 10px' }}>
              <Search size={13} color="#94A3B8" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search roles..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#0F172A', flex: 1, minWidth: 0 }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={12} color="#94A3B8" />
                </button>
              )}
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '12px 14px', color: '#94A3B8', fontSize: 13 }}>No roles found</div>
              : filtered.map(role => {
                const isSel = selected.includes(role)
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onToggle(role)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 14px', background: isSel ? '#F0F4FF' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, color: isSel ? '#1B4FD8' : '#0F172A', fontWeight: isSel ? 500 : 400, textAlign: 'left', gap: 8 }}
                  >
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role}</span>
                    {isSel && <Check size={13} color="#1B4FD8" />}
                  </button>
                )
              })
            }
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TestsPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const statusOptions = [
    { label: t('dashboard.tests.allStatuses'), value: 'all' },
    { label: t('dashboard.tests.status.active'), value: 'active' },
    { label: t('dashboard.tests.status.draft'), value: 'draft' },
    { label: t('dashboard.tests.status.archived'), value: 'archived' },
  ]

  const [search, setSearch] = useState('')
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  function toggleRole(role: string) {
    setRoleFilters(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])
    setPage(1)
  }

  function removeRole(role: string) {
    setRoleFilters(prev => prev.filter(r => r !== role))
    setPage(1)
  }

  function handleStatusChange(v: string) {
    setStatusFilter(v)
    setPage(1)
  }

  function handleSearchChange(v: string) {
    setSearch(v)
    setPage(1)
  }

  // Filter chain
  const filtered = GENERIC_TESTS.filter(t => {
    if (roleFilters.length > 0 && !roleFilters.includes(t.role)) return false
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!t.name.toLowerCase().includes(q) && !t.role.toLowerCase().includes(q)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div style={{ background: '#EEF2FF', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>

      {/* Header */}
      <div style={{ height: 72, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EEF2FF', flexShrink: 0 }}>
        <span style={{ color: '#0F2A6B', fontSize: 24, fontWeight: 700 }}>{t('dashboard.tests.title')}</span>
        <button
          type="button"
          onClick={() => router.push('/dashboard/build-test')}
          style={{ background: '#1B4FD8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          <PencilRuler size={18} color="#fff" />
          {t('dashboard.nav.buildTest')}
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ height: 52, padding: '0 32px', display: 'flex', alignItems: 'center', gap: 12, background: '#EEF2FF', flexShrink: 0 }}>
        <RoleDropdown roles={ALL_ROLES} selected={roleFilters} onToggle={toggleRole} />

        <CustomDropdown options={statusOptions} value={statusFilter} onChange={handleStatusChange} placeholder={t('dashboard.tests.statusPlaceholder')} />

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Search size={14} color="#94A3B8" />
          <input
            type="text"
            placeholder={t('dashboard.tests.searchPlaceholder')}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', color: '#0F172A', fontSize: 13, flex: 1 }}
          />
        </div>
      </div>

      {/* Role chips */}
      {roleFilters.length > 0 && (
        <div style={{ padding: '0 32px 8px 32px', display: 'flex', flexWrap: 'wrap', gap: 8, flexShrink: 0 }}>
          {roleFilters.map(role => (
            <div key={role} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #C7D2FE', borderRadius: 20, padding: '4px 10px 4px 12px', fontSize: 12, color: '#1B4FD8', fontWeight: 500 }}>
              {role}
              <button type="button" onClick={() => removeRole(role)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <X size={12} color="#6366F1" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ padding: '8px 32px 8px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ height: 44, background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 260, padding: '0 20px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.name')}</div>
            <div style={{ width: 130, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.role')}</div>
            <div style={{ width: 180, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.modules')}</div>
            <div style={{ width: 90,  padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.duration')}</div>
            <div style={{ width: 100, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.status')}</div>
            <div style={{ width: 120, padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.created')}</div>
            <div style={{ width: 90,  padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{t('dashboard.tests.columns.responses')}</div>
            <div style={{ flex: 1,   padding: '0 12px', color: '#64748B', fontSize: 12, fontWeight: 600, display: 'flex', justifyContent: 'flex-end' }}>{t('dashboard.tests.columns.actions')}</div>
          </div>

          {/* Body — fixed height for PAGE_SIZE rows */}
          <div style={{ height: PAGE_SIZE * ROW_HEIGHT }}>
            {filtered.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 14 }}>
                {t('dashboard.tests.notFound')}
              </div>
            ) : (
              paginated.map(test => (
                <div
                  key={test.id}
                  style={{ height: ROW_HEIGHT, borderBottom: '1px solid #F1F5F9', background: '#fff', display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  onClick={() => router.push(`/dashboard/tests/${test.id}`)}
                >
                  {/* Name */}
                  <div style={{ width: 260, padding: '0 20px', flexShrink: 0 }}>
                    <span style={{ color: '#0F172A', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {test.name}
                    </span>
                  </div>

                  {/* Role pill */}
                  <div style={{ width: 130, padding: '0 12px', flexShrink: 0 }}>
                    <span style={{ background: '#EEF2FF', color: '#6366F1', borderRadius: 12, padding: '3px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {test.role}
                    </span>
                  </div>

                  {/* Modules */}
                  <div style={{ width: 180, padding: '0 12px', flexShrink: 0, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {test.modules.map(m => (
                      <span key={m} style={{ background: '#F1F5F9', color: '#475569', borderRadius: 6, padding: '2px 8px', fontSize: 11, whiteSpace: 'nowrap' }}>{m}</span>
                    ))}
                  </div>

                  {/* Duration */}
                  <div style={{ width: 90, padding: '0 12px', flexShrink: 0, color: '#475569', fontSize: 13 }}>
                    {t('dashboard.tests.durationMin', { n: test.duration })}
                  </div>

                  {/* Status */}
                  <div style={{ width: 100, padding: '0 12px', flexShrink: 0 }}>
                    <StatusBadge status={test.status} />
                  </div>

                  {/* Created */}
                  <div style={{ width: 120, padding: '0 12px', flexShrink: 0, color: '#64748B', fontSize: 12 }}>
                    {formatDate(test.created_at)}
                  </div>

                  {/* Responses */}
                  <div style={{ width: 90, padding: '0 12px', flexShrink: 0, color: '#0F172A', fontSize: 13, fontWeight: 600 }}>
                    {test.response_count}
                  </div>

                  {/* Actions */}
                  <div style={{ flex: 1, padding: '0 12px', display: 'flex', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/tests/${test.id}`)}
                      style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#0F172A', fontWeight: 500 }}
                    >
                      <Eye size={13} color="#64748B" />
                      {t('dashboard.tests.viewBtn')}
                      <ArrowRight size={12} color="#0F172A" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination footer */}
          <div style={{ height: 48, background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B', fontSize: 13 }}>
              {filtered.length === 0
                ? '0 results'
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                style={{ width: 32, height: 32, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: safePage <= 1 ? 'default' : 'pointer', opacity: safePage <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={14} color="#64748B" />
              </button>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                style={{ width: 32, height: 32, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: safePage >= totalPages ? 'default' : 'pointer', opacity: safePage >= totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={14} color="#64748B" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
