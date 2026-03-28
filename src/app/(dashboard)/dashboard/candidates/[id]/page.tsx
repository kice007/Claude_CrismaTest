'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/Skeleton'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { SubScoreBars } from '@/components/dashboard/SubScoreBars'
import { FraudFlagsPanel } from '@/components/dashboard/FraudFlagsPanel'
import { AIInsightCard } from '@/components/dashboard/AIInsightCard'
import { CalendarModal } from '@/components/modals/CalendarModal'

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
  phone: string
  company: string
  job_title: string
  logic_score: number
  comms_score: number
  job_skill_score: number
}

function statusClasses(status: 'passed' | 'failed' | 'pending'): string {
  if (status === 'passed') return 'bg-green-100 text-green-800'
  if (status === 'failed') return 'bg-red-100 text-red-800'
  return 'bg-slate-100 text-slate-600'
}

function statusLabel(status: 'passed' | 'failed' | 'pending'): string {
  if (status === 'passed') return 'Passed'
  if (status === 'failed') return 'Failed'
  return 'Pending'
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useTranslation('translation')
  const router = useRouter()

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true)
      try {
        const res = await fetch(`/api/candidates/${id}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (res.ok) {
          const data = await res.json()
          setCandidate(data)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidate()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !candidate) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-5xl mx-auto w-full space-y-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={16} />
            {t('dashboard.candidateDetail.back')}
          </button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xl font-semibold text-slate-700 mb-2">Candidate not found</p>
            <p className="text-slate-400 text-sm">
              This candidate may have been removed or the link is incorrect.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const videoScore = Math.round((candidate.logic_score + candidate.comms_score) / 2)

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} />
          {t('dashboard.candidateDetail.back')}
        </button>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: gauge + sub-scores + fraud flags */}
          <div className="space-y-4">
            {/* Score card */}
            <div className="rounded-lg border border-border bg-white p-6 flex flex-col items-center">
              <h2 className="text-sm font-semibold text-slate-500 mb-4">
                {t('dashboard.candidateDetail.scores.crimaScore')}
              </h2>
              <ScoreGauge score={candidate.crima_score} size={160} />
            </div>

            {/* Sub-scores card */}
            <div className="rounded-lg border border-border bg-white p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Sub-Scores</h3>
              <SubScoreBars
                logic={candidate.logic_score}
                communication={candidate.comms_score}
                jobSkill={candidate.job_skill_score}
                trust={candidate.trust_score}
                video={videoScore}
              />
            </div>

            {/* Fraud flags */}
            <FraudFlagsPanel
              severity={candidate.fraud_flag_severity}
              flagCount={candidate.fraud_flag_count}
            />
          </div>

          {/* Right column: header card + AI insight + actions */}
          <div className="space-y-4">
            {/* Candidate header card */}
            <div className="rounded-lg border border-border bg-white p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                  style={{ backgroundColor: candidate.avatar_color }}
                >
                  {candidate.avatar_initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">
                    {candidate.full_name}
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">{candidate.role}</p>
                  {candidate.company && (
                    <p className="text-slate-400 text-xs mt-0.5">{candidate.company}</p>
                  )}
                </div>
                <Badge className={statusClasses(candidate.status)}>
                  {statusLabel(candidate.status)}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                {/* Email — clickable mailto */}
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-brand-primary hover:underline truncate"
                  >
                    {candidate.email}
                  </a>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-slate-400 text-xs w-3.5 text-center shrink-0">📞</span>
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
                  <span>Test date:</span>
                  <span className="text-slate-500">{formatDate(candidate.test_date)}</span>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <AIInsightCard
              candidateName={candidate.full_name}
              score={candidate.crima_score}
            />

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
              >
                {t('dashboard.candidateDetail.inviteToInterview')}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${candidate.email}?subject=${encodeURIComponent(t('dashboard.candidateDetail.emailSubject'))}`
                }}
                className="flex-1 inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg border border-border bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors gap-2"
              >
                <Mail size={14} />
                {t('dashboard.candidateDetail.emailCandidate')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
    </div>
  )
}
