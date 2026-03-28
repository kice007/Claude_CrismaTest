'use client'

import { useTranslation } from 'react-i18next'

interface FraudFlagsPanelProps {
  severity: 'none' | 'low' | 'medium' | 'high'
  flagCount: number
  flags?: string[]
}

const MOCK_FLAGS: Record<'low' | 'medium' | 'high', string[]> = {
  low: ['Tab switch detected (1×)'],
  medium: ['Tab switch detected (2×)', 'Eye movement anomaly'],
  high: ['Tab switch detected (2×)', 'Eye movement anomaly', 'Multiple faces detected'],
}

function severityClasses(severity: 'none' | 'low' | 'medium' | 'high') {
  switch (severity) {
    case 'none': return 'bg-slate-100 text-slate-600'
    case 'low': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-amber-100 text-amber-800'
    case 'high': return 'bg-red-100 text-red-800'
  }
}

function severityDot(severity: 'none' | 'low' | 'medium' | 'high') {
  switch (severity) {
    case 'none': return 'bg-slate-400'
    case 'low': return 'bg-green-500'
    case 'medium': return 'bg-amber-500'
    case 'high': return 'bg-red-500'
  }
}

export function FraudFlagsPanel({ severity, flagCount, flags }: FraudFlagsPanelProps) {
  const { t } = useTranslation('translation')

  const resolvedFlags = flags && flags.length > 0
    ? flags
    : severity !== 'none'
      ? MOCK_FLAGS[severity] ?? []
      : []

  const severityLabel = t(`dashboard.candidateDetail.fraudSeverity.${severity}`)

  return (
    <div className="rounded-lg border border-border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {t('dashboard.candidateDetail.sections.fraudFlags')}
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${severityClasses(severity)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${severityDot(severity)}`} />
          {severityLabel}
          {flagCount > 0 && ` (${flagCount})`}
        </span>
      </div>

      {resolvedFlags.length > 0 ? (
        <ul className="space-y-1.5">
          {resolvedFlags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              {flag}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 italic">No fraud flags detected</p>
      )}
    </div>
  )
}
