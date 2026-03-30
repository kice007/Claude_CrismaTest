'use client'

import { useRouter } from 'next/navigation'

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
}

function scoreColorClasses(score: number): string {
  if (score >= 70) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

function formatDateShort(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatDateBadge(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function topPercent(score: number): string {
  if (score >= 90) return 'Top 3%'
  if (score >= 80) return 'Top 10%'
  if (score >= 70) return 'Top 20%'
  if (score >= 60) return 'Top 35%'
  return 'Top 50%'
}

export function TalentPoolCard({ candidate }: TalentPoolCardProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow cursor-default">

      {/* Top row: avatar + name/role + date badge */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: candidate.avatar_color }}
        >
          {candidate.avatar_initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#0F172A] truncate leading-tight text-sm">{candidate.full_name}</p>
          <p className="text-[#64748B] text-xs truncate mt-0.5">{candidate.role}</p>
        </div>
        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
          {formatDateBadge(candidate.test_date)}
        </span>
      </div>

      {/* Score row */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColorClasses(candidate.crima_score)}`}>
          CrismaScore {candidate.crima_score}
        </span>
        <span className="text-xs text-[#64748B]">
          Trust <span className="font-medium text-slate-700">{candidate.trust_score}%</span>
        </span>
        <span className="text-xs text-[#64748B]">
          Tests <span className="font-medium text-slate-700">3</span>
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-4 text-xs text-[#64748B]">
        <span className="font-medium text-slate-700">{topPercent(candidate.crima_score)}</span>
        <span>·</span>
        <span>3/4</span>
        <span>·</span>
        <span>{formatDateShort(candidate.test_date)}</span>
        <span>·</span>
        <span className="text-slate-400">Last invited</span>
      </div>

      {/* View profile button */}
      <button
        type="button"
        onClick={() => router.push(`/dashboard/talent-pool/${candidate.id}`)}
        className="mt-auto w-full min-h-[40px] rounded-lg border border-[#2563EB] text-[#2563EB] font-medium text-sm hover:bg-[#2563EB] hover:text-white transition-colors"
      >
        View profile
      </button>
    </div>
  )
}
