'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { Eye } from 'lucide-react'

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

interface CandidateTableProps {
  candidates: Candidate[]
  loading?: boolean
  onRowClick: (id: string) => void
  onSelectionChange: (ids: string[]) => void
  selectedIds?: string[]
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
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export function CandidateTable({
  candidates,
  loading = false,
  onRowClick,
  onSelectionChange,
  selectedIds = [],
}: CandidateTableProps) {
  const allSelected = candidates.length > 0 && selectedIds.length === candidates.length

  function toggleAll() {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(candidates.map(c => c.id))
    }
  }

  function toggleOne(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(sid => sid !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded" />
        ))}
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <EmptyState
          title="No candidates found"
          body="Adjust your filters or invite candidates to take a test"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all candidates"
              />
            </TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>CrismaScore</TableHead>
            <TableHead>Trust Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Test Date</TableHead>
            <TableHead className="w-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map(candidate => (
            <TableRow
              key={candidate.id}
              className="cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <TableCell
                className="pl-4"
                onClick={e => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedIds.includes(candidate.id)}
                  onCheckedChange={() => toggleOne(candidate.id)}
                  aria-label={`Select ${candidate.full_name}`}
                />
              </TableCell>
              <TableCell
                onClick={() => onRowClick(candidate.id)}
                className="min-w-[160px]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                    style={{ backgroundColor: candidate.avatar_color }}
                  >
                    {candidate.avatar_initials}
                  </div>
                  <span className="font-medium text-slate-900">{candidate.full_name}</span>
                </div>
              </TableCell>
              <TableCell onClick={() => onRowClick(candidate.id)} className="text-slate-600">
                {candidate.role}
              </TableCell>
              <TableCell onClick={() => onRowClick(candidate.id)}>
                <Badge className={scoreColor(candidate.crima_score)}>
                  {candidate.crima_score}
                </Badge>
              </TableCell>
              <TableCell onClick={() => onRowClick(candidate.id)} className="text-slate-600">
                {candidate.trust_score}<span className="text-slate-400">/100</span>
              </TableCell>
              <TableCell onClick={() => onRowClick(candidate.id)}>
                <Badge className={statusVariant(candidate.status)}>
                  {statusLabel(candidate.status)}
                </Badge>
              </TableCell>
              <TableCell onClick={() => onRowClick(candidate.id)} className="text-slate-500 text-sm">
                {formatDate(candidate.test_date)}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onRowClick(candidate.id)}
                  className="p-2 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-primary transition-colors"
                  aria-label={`View ${candidate.full_name}`}
                >
                  <Eye size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
