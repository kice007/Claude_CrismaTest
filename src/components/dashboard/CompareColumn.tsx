'use client'

import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { SubScoreBars } from '@/components/dashboard/SubScoreBars'
import { FraudFlagsPanel } from '@/components/dashboard/FraudFlagsPanel'

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

interface CompareColumnProps {
  candidate: CandidateDetail
  isRecommended: boolean
}

export function CompareColumn({ candidate, isRecommended }: CompareColumnProps) {
  const { t } = useTranslation('translation')

  const videoScore = Math.round((candidate.logic_score + candidate.comms_score) / 2)

  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* Avatar + name + role */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
          style={{ backgroundColor: candidate.avatar_color }}
        >
          {candidate.avatar_initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-lg leading-tight">{candidate.full_name}</p>
          <p className="text-slate-500 text-sm mt-0.5">{candidate.role}</p>
        </div>
        {isRecommended && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            {t('dashboard.compare.recommended')}
          </span>
        )}
      </div>

      {/* Score gauge */}
      <div className="flex justify-center">
        <ScoreGauge score={candidate.crima_score} size={140} />
      </div>

      {/* Sub-scores */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {t('dashboard.compare.sections.subScores')}
        </h3>
        <SubScoreBars
          logic={candidate.logic_score}
          communication={candidate.comms_score}
          jobSkill={candidate.job_skill_score}
          trust={candidate.trust_score}
          video={videoScore}
        />
      </div>

      {/* Fraud flags */}
      <div>
        <FraudFlagsPanel
          severity={candidate.fraud_flag_severity}
          flagCount={candidate.fraud_flag_count}
        />
      </div>

      {/* Video thumbnail placeholder */}
      <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-200" />
        <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
          <Play className="w-5 h-5 text-brand-primary ml-0.5" fill="currentColor" />
        </div>
      </div>
    </div>
  )
}
