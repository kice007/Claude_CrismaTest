'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { TestListTable } from '@/components/dashboard/TestListTable'
import { EmptyState } from '@/components/EmptyState'

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

export default function TestsPage() {
  const { t } = useTranslation('translation')
  const router = useRouter()

  const [tests, setTests] = useState<TestTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchTests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.set('search', debouncedSearch)
      const res = await fetch(`/api/tests?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setTests(Array.isArray(data) ? data : [])
      } else {
        setTests([])
      }
    } catch {
      setTests([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  function handleView(id: string) {
    router.push(`/dashboard/tests/${id}`)
  }

  function handleEdit(id: string) {
    router.push(`/dashboard/tests/${id}`)
  }

  function handleDeleteRequest(id: string) {
    setDeleteTarget(id)
    setDeleteModalOpen(true)
  }

  function handleDeleteCancel() {
    setDeleteTarget(null)
    setDeleteModalOpen(false)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/tests/${deleteTarget}`, { method: 'DELETE' })
      if (res.ok) {
        setTests(prev => prev.filter(t => t.id !== deleteTarget))
        setDeleteTarget(null)
        setDeleteModalOpen(false)
      } else {
        toast.error(t('dashboard.errors.loadFailed'))
      }
    } catch {
      toast.error(t('dashboard.errors.loadFailed'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {t('dashboard.tests.title')}
          </h1>
          <button
            type="button"
            onClick={() => router.push('/dashboard/build-test')}
            className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
          >
            {t('dashboard.tests.buildNew')}
          </button>
        </div>

        {/* Search bar */}
        <Input
          placeholder={t('dashboard.tests.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* Tests table or empty state */}
        {!loading && tests.length === 0 ? (
          <div className="flex justify-center py-12">
            <EmptyState
              title={t('dashboard.tests.empty')}
              body={t('dashboard.tests.emptyHint')}
              ctaLabel={t('dashboard.tests.buildNew')}
              ctaHref="/dashboard/build-test"
            />
          </div>
        ) : (
          <TestListTable
            tests={tests}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={open => { if (!open) handleDeleteCancel() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.tests.deleteConfirm')}</DialogTitle>
            <DialogDescription>{t('dashboard.tests.deleteWarning')}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleDeleteCancel}
              className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg border border-border bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              {t('dashboard.tests.deleteCancel')}
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {t('dashboard.tests.deleteConfirmBtn')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
