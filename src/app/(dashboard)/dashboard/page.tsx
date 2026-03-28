'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CandidateTable } from '@/components/dashboard/CandidateTable'
import { CandidateCard } from '@/components/dashboard/CandidateCard'
import { InviteModal } from '@/components/modals/InviteModal'

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

export default function DashboardPage() {
  const { t } = useTranslation('translation')
  const router = useRouter()

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [scoreMin, setScoreMin] = useState('')
  const [scoreMax, setScoreMax] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter)
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      if (scoreMin) params.set('score_min', scoreMin)
      if (scoreMax) params.set('score_max', scoreMax)

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
  }, [debouncedSearch, roleFilter, statusFilter, scoreMin, scoreMax])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  function handleRowClick(id: string) {
    router.push(`/dashboard/candidates/${id}`)
  }

  function handleCompare() {
    router.push(`/dashboard/compare?ids=${selectedIds.join(',')}`)
  }

  // Unique roles from fetched candidates (plus static ones for filter)
  const roles = Array.from(new Set(candidates.map(c => c.role))).filter(Boolean)

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {t('dashboard.candidateTable.title')}
          </h1>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
          >
            {t('dashboard.candidateTable.actions.inviteCandidate')}
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder={t('dashboard.candidateTable.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val ?? 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('dashboard.candidateTable.filterRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.candidateTable.filterRole')}</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('dashboard.candidateTable.filterStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('dashboard.candidateTable.filterStatus')}</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min score"
              value={scoreMin}
              onChange={e => setScoreMin(e.target.value)}
              className="w-24 rounded-md border border-input bg-background px-3 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-ring"
              min={0}
              max={100}
            />
            <span className="text-slate-400 text-sm">–</span>
            <input
              type="number"
              placeholder="Max score"
              value={scoreMax}
              onChange={e => setScoreMax(e.target.value)}
              className="w-24 rounded-md border border-input bg-background px-3 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-ring"
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Compare Selected button */}
        {selectedIds.length >= 2 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCompare}
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-secondary transition-colors"
            >
              {t('dashboard.candidateTable.actions.compareSelected')} ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Desktop: CandidateTable */}
        <div className="hidden md:block">
          <CandidateTable
            candidates={candidates}
            loading={loading}
            onRowClick={handleRowClick}
            onSelectionChange={setSelectedIds}
            selectedIds={selectedIds}
          />
        </div>

        {/* Mobile: CandidateCard stack */}
        <div className="md:hidden space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer h-36 rounded-lg" />
            ))
          ) : candidates.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-center text-slate-500 text-sm">
                <p className="font-medium mb-1">{t('dashboard.candidateTable.empty')}</p>
                <p>{t('dashboard.candidateTable.emptyHint')}</p>
              </div>
            </div>
          ) : (
            candidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedIds.includes(candidate.id)}
                onSelect={() => {
                  if (selectedIds.includes(candidate.id)) {
                    setSelectedIds(selectedIds.filter(id => id !== candidate.id))
                  } else {
                    setSelectedIds([...selectedIds, candidate.id])
                  }
                }}
                onClick={() => handleRowClick(candidate.id)}
              />
            ))
          )}
        </div>
      </div>

      <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
