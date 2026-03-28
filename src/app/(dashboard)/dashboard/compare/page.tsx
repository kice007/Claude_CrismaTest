'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Download } from 'lucide-react'
import { Skeleton } from '@/components/Skeleton'
import { CompareColumn } from '@/components/dashboard/CompareColumn'

interface CandidateDetail {
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
  email: string
  phone?: string
  company?: string
  job_title?: string
  logic_score: number
  comms_score: number
  job_skill_score: number
}

function CompareColumnSkeleton() {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="w-36 h-36 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="w-full aspect-video rounded-lg" />
    </div>
  )
}

function AddCandidatePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 min-h-[400px] text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <span className="text-slate-400 text-2xl font-light">+</span>
      </div>
      <p className="text-slate-400 text-sm">Add candidate</p>
    </div>
  )
}

function ComparePageInner() {
  const { t } = useTranslation('translation')
  const router = useRouter()
  const searchParams = useSearchParams()

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  const [candidates, setCandidates] = useState<CandidateDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ids.length === 0) return

    setLoading(true)
    setError(null)

    Promise.all(
      ids.map(id =>
        fetch('/api/candidates/' + id).then(r => {
          if (!r.ok) throw new Error('Failed to fetch candidate ' + id)
          return r.json() as Promise<CandidateDetail>
        })
      )
    )
      .then(data => setCandidates(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('ids')])

  // Badge logic: find max crima_score; all candidates with that score get the badge
  const maxScore = candidates.length > 0
    ? Math.max(...candidates.map(c => c.crima_score))
    : -1

  if (ids.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('dashboard.compare.back')}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-slate-500 text-lg">{t('dashboard.compare.noIds')}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 inline-flex items-center gap-2 min-h-[48px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
            >
              {t('dashboard.compare.back')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('dashboard.compare.back')}
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.compare.title')}</h1>
          </div>
          <a
            href="/crima-compare-report.pdf"
            download
            className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-lg border border-brand-primary text-brand-primary font-medium text-sm hover:bg-brand-primary hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('dashboard.compare.exportReport')}
          </a>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Compare grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CompareColumnSkeleton key={i} />)
            : Array.from({ length: 3 }).map((_, i) => {
                const candidate = candidates[i]
                if (candidate) {
                  return (
                    <CompareColumn
                      key={candidate.id}
                      candidate={candidate}
                      isRecommended={candidate.crima_score === maxScore}
                    />
                  )
                }
                return <AddCandidatePlaceholder key={i} />
              })
          }
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ComparePageInner />
    </Suspense>
  )
}
