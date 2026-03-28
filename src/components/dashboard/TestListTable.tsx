'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/Skeleton'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface TestTemplate {
  id: string
  role: string
  slug: string
  name: string
  modules: string[]
  duration: number
  status: 'active' | 'draft' | 'archived'
  created_at: string
  response_count: number
  shareable_link?: string
  custom_questions?: { text: string; type: string }[]
}

interface TestListTableProps {
  tests: TestTemplate[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  loading?: boolean
}

function statusClasses(status: 'active' | 'draft' | 'archived'): string {
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'draft') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-600'
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export function TestListTable({
  tests,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: TestListTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Test Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Modules</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responses</TableHead>
            <TableHead className="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map(test => (
            <TableRow
              key={test.id}
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => onView(test.id)}
            >
              <TableCell className="font-medium text-slate-900 min-w-[160px]">
                {test.name}
              </TableCell>
              <TableCell onClick={e => e.stopPropagation()}>
                <Badge className="bg-blue-100 text-blue-800">
                  {test.role}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {test.modules.length}
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {formatDate(test.created_at)}
              </TableCell>
              <TableCell>
                <Badge className={statusClasses(test.status)}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {test.response_count}
              </TableCell>
              <TableCell onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onView(test.id)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-primary transition-colors"
                    aria-label={`View ${test.name}`}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(test.id)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-brand-primary transition-colors"
                    aria-label={`Edit ${test.name}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(test.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                    aria-label={`Delete ${test.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
