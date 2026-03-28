'use client'

import { useTranslation } from 'react-i18next'

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

interface TalentPoolCardProps {
  candidate: TalentPoolEntry
  onClick: () => void
}

function scoreColorClasses(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function TalentPoolCard({ candidate, onClick }: TalentPoolCardProps) {
  const { t } = useTranslation('translation')

  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-default"
    >
      {/* Avatar + name + role */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
          style={{ backgroundColor: candidate.avatar_color }}
        >
          {candidate.avatar_initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate leading-tight">{candidate.full_name}</p>
          <p className="text-slate-600 text-sm truncate mt-0.5">{candidate.role}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColorClasses(candidate.crima_score)}`}>
          {candidate.crima_score}
        </span>
        <span className="text-xs text-slate-400">CrismaScore</span>
      </div>
      <p className="text-xs text-slate-500 mb-1">
        Trust Score: <span className="font-medium text-slate-700">{candidate.trust_score}</span>
      </p>

      {/* Last test date */}
      <p className="text-xs text-slate-400 mb-5">
        {formatDate(candidate.test_date)}
      </p>

      {/* Contact button */}
      <button
        type="button"
        onClick={onClick}
        className="mt-auto w-full min-h-[48px] rounded-lg border border-brand-primary text-brand-primary font-medium text-sm hover:bg-brand-primary hover:text-white transition-colors"
      >
        {t('dashboard.talentPool.contact')}
      </button>
    </div>
  )
}
