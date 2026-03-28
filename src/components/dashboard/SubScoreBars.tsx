'use client'

import { useTranslation } from 'react-i18next'

interface SubScoreBarsProps {
  logic: number
  communication: number
  jobSkill: number
  trust: number
  video: number
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-500 font-mono">{score}<span className="text-slate-300">/100</span></span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function SubScoreBars({ logic, communication, jobSkill, trust, video }: SubScoreBarsProps) {
  const { t } = useTranslation('translation')

  const bars = [
    { label: t('dashboard.candidateDetail.scores.logic'), score: logic },
    { label: t('dashboard.candidateDetail.scores.communication'), score: communication },
    { label: t('dashboard.candidateDetail.scores.jobSkill'), score: jobSkill },
    { label: t('dashboard.candidateDetail.scores.trust'), score: trust },
    { label: t('dashboard.candidateDetail.scores.video'), score: video },
  ]

  return (
    <div className="space-y-4">
      {bars.map(bar => (
        <ScoreBar key={bar.label} label={bar.label} score={bar.score} />
      ))}
    </div>
  )
}
