'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Search } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { TalentPoolCard } from '@/components/dashboard/TalentPoolCard'
import { FilterSheet, type FilterState } from '@/components/dashboard/FilterSheet'
import { ContactModal } from '@/components/modals/ContactModal'

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
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-5 shadow-sm gap-3">
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
      <Skeleton className="h-12 w-full rounded-lg mt-auto" />
    </div>
  )
}

export default function TalentPoolPage() {
  const { t } = useTranslation('translation')

  const [candidates, setCandidates] = useState<TalentPoolEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    role: '',
    scoreMin: '',
    scoreMax: '',
    search: '',
  })
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  // Contact modal state
  const [contactTarget, setContactTarget] = useState<TalentPoolEntry | null>(null)
  const [contactEmail, setContactEmail] = useState<string | null>(null)
  const [contactEmailLoading, setContactEmailLoading] = useState(false)

  const fetchCandidates = useCallback((currentFilters: FilterState) => {
    setLoading(true)
    fetch('/api/talent-pool' + buildQueryString(currentFilters))
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed to fetch')))
      .then((data: TalentPoolEntry[]) => setCandidates(data))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchCandidates(filters)
  }, [filters, fetchCandidates])

  function handleCardClick(candidate: TalentPoolEntry) {
    // Open modal immediately
    setContactTarget(candidate)
    setContactEmailLoading(true)
    setContactEmail(null)

    // Fetch email in background via /api/candidates/[id]
    fetch('/api/candidates/' + candidate.id)
      .then(r => r.ok ? r.json() : null)
      .then((full: { email?: string } | null) => setContactEmail(full?.email ?? null))
      .catch(() => setContactEmail(null))
      .finally(() => setContactEmailLoading(false))
  }

  function handleContactModalClose(open: boolean) {
    if (!open) {
      setContactTarget(null)
      setContactEmail(null)
      setContactEmailLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.talentPool.title')}</h1>
          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Desktop filter bar */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={t('dashboard.talentPool.search')}
              className="w-full pl-9 pr-3 rounded-md border border-input bg-background text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            type="text"
            value={filters.role}
            onChange={e => setFilters(prev => ({ ...prev, role: e.target.value }))}
            placeholder={t('dashboard.talentPool.filterRole')}
            className="rounded-md border border-input bg-background px-3 text-base min-h-[44px] w-40 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.scoreMin}
              onChange={e => setFilters(prev => ({ ...prev, scoreMin: e.target.value }))}
              placeholder="Min"
              min="0"
              max="100"
              className="rounded-md border border-input bg-background px-3 text-base min-h-[44px] w-20 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-slate-400 text-sm">–</span>
            <input
              type="number"
              value={filters.scoreMax}
              onChange={e => setFilters(prev => ({ ...prev, scoreMax: e.target.value }))}
              placeholder="Max"
              min="0"
              max="100"
              className="rounded-md border border-input bg-background px-3 text-base min-h-[44px] w-20 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Card grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex justify-center py-16">
            <EmptyState
              title={t('dashboard.talentPool.empty')}
              body={t('dashboard.talentPool.emptyHint')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {candidates.map(candidate => (
              <TalentPoolCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => handleCardClick(candidate)}
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

      {/* Contact modal */}
      <ContactModal
        open={contactTarget !== null}
        onOpenChange={handleContactModalClose}
        candidateName={contactTarget?.full_name}
        candidateEmail={contactEmail ?? undefined}
        candidateEmailLoading={contactEmailLoading}
      />
    </div>
  )
}
