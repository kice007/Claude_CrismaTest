'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

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

interface CandidateCardProps {
  candidate: Candidate
  selected: boolean
  onSelect: () => void
  onClick: () => void
}

function scoreColor(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

function statusVariant(status: 'passed' | 'failed' | 'pending'): string {
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
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function CandidateCard({ candidate, selected, onSelect, onClick }: CandidateCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-4 space-y-3 transition-colors ${selected ? 'border-brand-primary bg-blue-50' : 'border-border'}`}>
      {/* Top row: avatar + name + role */}
      <button
        type="button"
        className="w-full flex items-center gap-3 min-h-[48px] text-left"
        onClick={onClick}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
          style={{ backgroundColor: candidate.avatar_color }}
        >
          {candidate.avatar_initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate">{candidate.full_name}</p>
          <p className="text-sm text-slate-500 truncate">{candidate.role}</p>
        </div>
      </button>

      {/* Score row */}
      <button
        type="button"
        className="w-full flex items-center gap-2 flex-wrap min-h-[40px] text-left"
        onClick={onClick}
      >
        <Badge className={scoreColor(candidate.crima_score)}>
          CrismaScore {candidate.crima_score}
        </Badge>
        <span className="text-slate-500 text-sm">
          Trust: {candidate.trust_score}<span className="text-slate-400">/100</span>
        </span>
        <Badge className={statusVariant(candidate.status)}>
          {statusLabel(candidate.status)}
        </Badge>
      </button>

      {/* Bottom row: date + checkbox */}
      <div className="flex items-center justify-between min-h-[40px]">
        <span className="text-sm text-slate-400">{formatDate(candidate.test_date)}</span>
        <div
          className="flex items-center gap-2 min-h-[48px] min-w-[48px] justify-end"
          onClick={e => e.stopPropagation()}
        >
          <label className="text-xs text-slate-500 cursor-pointer" htmlFor={`card-select-${candidate.id}`}>
            Select
          </label>
          <Checkbox
            id={`card-select-${candidate.id}`}
            checked={selected}
            onCheckedChange={onSelect}
            aria-label={`Select ${candidate.full_name}`}
          />
        </div>
      </div>
    </div>
  )
}
