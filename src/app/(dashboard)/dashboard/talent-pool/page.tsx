'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Search, LayoutGrid } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { TalentPoolCard } from '@/components/dashboard/TalentPoolCard'
import { FilterSheet, type FilterState } from '@/components/dashboard/FilterSheet'

interface TalentPoolEntry {
  id: string
  full_name: string
  role: string
  avatar_initials: string
  avatar_color: string
  crima_score: number
  trust_score: number
  status: string
  test_date: string
}

function buildQueryString(filters: FilterState): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.role) params.set('role', filters.role)
  if (filters.scoreMin) params.set('scoreMin', filters.scoreMin)
  if (filters.scoreMax) params.set('scoreMax', filters.scoreMax)
  const qs = params.toString()
  return qs ? '?' + qs : ''
}

function CardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 gap-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-full rounded-lg mt-auto" />
    </div>
  )
}

const FILTER_CHIPS = ['Role', 'Designer', 'Art+type', 'Product', 'Tester', '70-90', 'Status']

export default function TalentPoolPage() {
  const { t } = useTranslation('translation')
  const router = useRouter()

  const [candidates, setCandidates] = useState<TalentPoolEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    role: '',
    scoreMin: '',
    scoreMax: '',
    search: '',
  })
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [activeChips, setActiveChips] = useState<string[]>([])

  const fetchCandidates = useCallback((currentFilters: FilterState) => {
    setLoading(true)
    fetch('/api/talent-pool' + buildQueryString(currentFilters))
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to fetch')))
      .then((data: TalentPoolEntry[]) => setCandidates(data))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCandidates(filters)
  }, [filters, fetchCandidates])

  function toggleChip(chip: string) {
    setActiveChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )
  }

  function clearChips() {
    setActiveChips([])
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-[#0F172A]">{t('dashboard.talentPool.title')}</h1>
          <button
            type="button"
            onClick={() => router.push('/dashboard/build-test')}
            className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-[#2563EB] text-white font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            {t('dashboard.nav.buildTest')}
          </button>
        </div>

        {/* Search bar — full width */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder={t('dashboard.talentPool.search')}
            className="w-full pl-10 pr-4 rounded-lg border border-[#E2E8F0] bg-white text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Subtitle row */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-700">
            {t('dashboard.talentPoolPage.leadsCount', { count: candidates.length })}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-[#64748B]">{t('dashboard.talentPoolPage.sortBy')}</label>
              <select className="text-xs border border-[#E2E8F0] rounded bg-white px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]/30">
                <option>{t('dashboard.talentPoolPage.sortScore')}</option>
                <option>{t('dashboard.talentPoolPage.sortName')}</option>
                <option>{t('dashboard.talentPoolPage.sortDate')}</option>
              </select>
            </div>
            <button
              type="button"
              className="p-1.5 rounded border border-[#E2E8F0] bg-white text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
              aria-label="Toggle grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => toggleChip(chip)}
              className={[
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                activeChips.includes(chip)
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]',
              ].join(' ')}
            >
              {chip}
            </button>
          ))}
          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={clearChips}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Card grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex justify-center py-16">
            <EmptyState
              title={t('dashboard.talentPool.empty')}
              body={t('dashboard.talentPool.emptyHint')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map(candidate => (
              <TalentPoolCard
                key={candidate.id}
                candidate={candidate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  )
}
