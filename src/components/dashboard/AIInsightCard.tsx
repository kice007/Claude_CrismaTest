'use client'

import { useTranslation } from 'react-i18next'

interface AIInsightCardProps {
  candidateName: string
  score: number
}

function getBullets(score: number): string[] {
  if (score >= 70) {
    return [
      'Strong analytical reasoning demonstrated across logic modules — top percentile performance.',
      'Excellent communication skills: clear structure, persuasive tone, and strong written fluency.',
      'Recommended for senior role consideration — candidate profile aligns with high-performer benchmarks.',
    ]
  }
  if (score >= 50) {
    return [
      'Solid foundational skills with room for growth in advanced reasoning tasks.',
      'May benefit from onboarding support to strengthen job-specific knowledge areas.',
      'Consider for mid-level roles where mentorship and growth trajectory are valued.',
    ]
  }
  return [
    'Further evaluation recommended — score indicates areas needing development before role placement.',
    'Shows potential in communication and basic problem-solving despite lower overall score.',
    'Consider entry-level positions or structured training programs aligned to candidate strengths.',
  ]
}

export function AIInsightCard({ candidateName, score }: AIInsightCardProps) {
  const { t } = useTranslation('translation')
  const bullets = getBullets(score)

  return (
    <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm-.75-8.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          {t('dashboard.candidateDetail.sections.aiInsight')}
        </h3>
      </div>

      <p className="text-xs text-slate-500 italic">
        Based on {candidateName}&apos;s CrismaScore of {score}/100
      </p>

      <ul className="space-y-2">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  )
}
