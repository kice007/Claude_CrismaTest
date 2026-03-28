'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, Copy, Share2, Pencil, Trash2, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/Skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useMediaQuery } from '@/lib/use-media-query'

interface Question {
  id?: string
  text: string
  type: string
}

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
  questions?: Question[]
}

interface EditData {
  name: string
  modules: string[]
  customQuestions: { text: string; type: string }[]
}

const ALL_MODULES = [
  'Logic & Reasoning',
  'Communication',
  'Job Skills',
  'Behavioral',
  'Video Responses',
]

function statusClasses(status: 'active' | 'draft' | 'archived'): string {
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'draft') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-600'
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// Share modal content shared between Dialog and Drawer
function ShareModalContent({
  shareableLink,
  onCopyLink,
  onSendToCandidates,
  t,
}: {
  shareableLink: string
  onCopyLink: () => void
  onSendToCandidates: () => void
  t: (key: string) => string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          {t('dashboard.testDetail.shareableLink')}
        </label>
        <div className="flex gap-2">
          <Input value={shareableLink} readOnly className="flex-1 text-sm" />
          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-border bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          >
            <Copy size={14} />
            {t('dashboard.testDetail.copyLink')}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={onSendToCandidates}
        className="w-full inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
      >
        {t('dashboard.testDetail.sendToCandidates')}
      </button>
    </div>
  )
}

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useTranslation('translation')
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [test, setTest] = useState<TestTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<EditData>({ name: '', modules: [], customQuestions: [] })

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [saveSuccessModalOpen, setSaveSuccessModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  useEffect(() => {
    async function fetchTest() {
      setLoading(true)
      try {
        const res = await fetch(`/api/tests/${id}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (res.ok) {
          const data = await res.json()
          setTest(data)
          setEditData({
            name: data.name ?? '',
            modules: data.modules ?? [],
            customQuestions: data.custom_questions ?? [],
          })
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchTest()
  }, [id])

  function handleCopyLink() {
    const link = test?.shareable_link ?? `${window.location.origin}/test/${id}/intro`
    navigator.clipboard.writeText(link).then(() => {
      toast.success(t('dashboard.testDetail.copyLinkSuccess'))
    }).catch(() => {
      toast.error(t('dashboard.errors.loadFailed'))
    })
  }

  function handleSendToCandidates() {
    const link = test?.shareable_link ?? `${window.location.origin}/test/${id}/intro`
    const mailto = `mailto:?subject=${encodeURIComponent('Test Invitation')}&body=${encodeURIComponent(`Complete your assessment at ${link}`)}`
    window.open(mailto, '_blank')
  }

  function handleStartEdit() {
    if (!test) return
    setEditData({
      name: test.name,
      modules: [...test.modules],
      customQuestions: test.custom_questions ? [...test.custom_questions] : [],
    })
    setEditMode(true)
  }

  function handleCancelEdit() {
    setEditMode(false)
    if (test) {
      setEditData({
        name: test.name,
        modules: [...test.modules],
        customQuestions: test.custom_questions ? [...test.custom_questions] : [],
      })
    }
  }

  async function handleSave() {
    if (!test) return
    setSaving(true)
    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editData.name,
          modules: editData.modules,
          custom_questions: editData.customQuestions,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setTest(updated)
        setEditMode(false)
        setSaveSuccessModalOpen(true)
      } else {
        toast.error(t('dashboard.errors.loadFailed'))
      }
    } catch {
      toast.error(t('dashboard.errors.loadFailed'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteConfirm() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/dashboard/tests')
      } else {
        toast.error(t('dashboard.errors.loadFailed'))
        setDeleteModalOpen(false)
      }
    } catch {
      toast.error(t('dashboard.errors.loadFailed'))
      setDeleteModalOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  function toggleModule(module: string) {
    setEditData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module],
    }))
  }

  function addCustomQuestion() {
    setEditData(prev => ({
      ...prev,
      customQuestions: [...prev.customQuestions, { text: '', type: 'text' }],
    }))
  }

  function updateCustomQuestion(index: number, field: 'text' | 'type', value: string) {
    setEditData(prev => {
      const updated = [...prev.customQuestions]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, customQuestions: updated }
    })
  }

  function removeCustomQuestion(index: number) {
    setEditData(prev => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index),
    }))
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // Not found state
  if (notFound || !test) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-4xl mx-auto w-full space-y-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/tests')}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={16} />
            {t('dashboard.testDetail.back')}
          </button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xl font-semibold text-slate-700 mb-2">Test not found</p>
            <p className="text-slate-400 text-sm">
              This test may have been removed or the link is incorrect.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const shareableLink = test.shareable_link ?? `${typeof window !== 'undefined' ? window.location.origin : ''}/test/${test.id}/intro`
  const questionsToShow = test.questions ? (showAllQuestions ? test.questions : test.questions.slice(0, 5)) : []
  const hasMoreQuestions = test.questions && test.questions.length > 5

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">

        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push('/dashboard/tests')}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} />
          {t('dashboard.testDetail.back')}
        </button>

        {/* Header */}
        {editMode ? (
          /* Edit mode header */
          <div className="rounded-lg border border-border bg-white p-5 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700" htmlFor="edit-name">
                Test Name
              </label>
              <Input
                id="edit-name"
                value={editData.name}
                onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg font-semibold"
                placeholder="Test name"
              />
            </div>

            {/* Module checkboxes */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">{t('dashboard.testDetail.sections.modules')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_MODULES.map(module => (
                  <label
                    key={module}
                    className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={editData.modules.includes(module)}
                      onChange={() => toggleModule(module)}
                      className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                    />
                    {module}
                  </label>
                ))}
              </div>
            </div>

            {/* Custom questions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">{t('dashboard.testDetail.sections.customQuestions')}</p>
              <div className="space-y-2">
                {editData.customQuestions.map((q, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      value={q.text}
                      onChange={e => updateCustomQuestion(index, 'text', e.target.value)}
                      placeholder="Question text"
                      className="flex-1"
                    />
                    <select
                      value={q.type}
                      onChange={e => updateCustomQuestion(index, 'type', e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="text">Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="video">Video</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeCustomQuestion(index)}
                      className="p-2 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                      aria-label="Remove question"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCustomQuestion}
                className="inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-secondary transition-colors"
              >
                <Plus size={14} />
                {t('dashboard.buildTest.actions.addQuestion')}
              </button>
            </div>

            {/* Edit action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editData.name.trim()}
                className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors disabled:opacity-50"
              >
                {t('dashboard.testDetail.saveChanges')}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg border border-border bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                {t('dashboard.testDetail.cancelEdit')}
              </button>
            </div>
          </div>
        ) : (
          /* View mode header */
          <div className="rounded-lg border border-border bg-white p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{test.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{formatDate(test.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-blue-100 text-blue-800">{test.role}</Badge>
                <Badge className={statusClasses(test.status)}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Shareable link */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                {t('dashboard.testDetail.shareableLink')}
              </label>
              <div className="flex gap-2">
                <Input value={shareableLink} readOnly className="flex-1 text-sm text-slate-600" />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-border bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <Copy size={14} />
                  {t('dashboard.testDetail.copyLink')}
                </button>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border border-border bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>

            {/* Candidate responses */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500">{t('dashboard.testDetail.responses')}:</span>
              <span className="font-semibold text-slate-900">{test.response_count}</span>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-brand-primary hover:text-brand-secondary underline text-sm transition-colors"
              >
                {t('dashboard.testDetail.viewResponses')}
              </button>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-lg border border-border bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                <Pencil size={14} />
                {t('dashboard.testDetail.editTest')}
              </button>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-lg border border-red-200 bg-white text-red-600 font-medium text-sm hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                {t('dashboard.testDetail.deleteTest')}
              </button>
              <button
                type="button"
                onClick={handleSendToCandidates}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
              >
                {t('dashboard.testDetail.sendToCandidates')}
              </button>
            </div>
          </div>
        )}

        {/* Tabs: Details + Questions */}
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">{t('dashboard.testDetail.sections.details')}</TabsTrigger>
            {test.questions && test.questions.length > 0 && (
              <TabsTrigger value="questions">Questions</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="rounded-lg border border-border bg-white p-5 space-y-4">
              {/* Modules */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {t('dashboard.testDetail.sections.modules')}
                </h3>
                {test.modules.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {test.modules.map((module, i) => (
                      <Badge key={i} className="bg-blue-50 text-blue-700 border border-blue-200">
                        {module}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No modules configured</p>
                )}
              </div>

              {/* Custom questions */}
              {test.custom_questions && test.custom_questions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t('dashboard.testDetail.sections.customQuestions')}
                  </h3>
                  <div className="space-y-2">
                    {test.custom_questions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-slate-400 shrink-0">{i + 1}.</span>
                        <span className="text-slate-700 flex-1">{q.text}</span>
                        <Badge className="bg-slate-100 text-slate-600 shrink-0">{q.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {test.questions && test.questions.length > 0 && (
            <TabsContent value="questions" className="mt-4">
              <div className="rounded-lg border border-border bg-white p-5 space-y-3">
                {questionsToShow.map((q, i) => (
                  <div key={q.id ?? i} className="flex items-start gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 shrink-0 w-6">{i + 1}.</span>
                    <span className="text-slate-700 flex-1">{q.text}</span>
                    <Badge className="bg-slate-100 text-slate-600 shrink-0">{q.type}</Badge>
                  </div>
                ))}
                {hasMoreQuestions && !showAllQuestions && (
                  <button
                    type="button"
                    onClick={() => setShowAllQuestions(true)}
                    className="text-sm text-brand-primary hover:text-brand-secondary underline transition-colors"
                  >
                    View all {test.questions!.length} questions
                  </button>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Share modal — Dialog (desktop) / Drawer (mobile) */}
      {isDesktop ? (
        <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('dashboard.testDetail.shareableLink')}</DialogTitle>
              <DialogDescription>
                Share this test with candidates via link or email.
              </DialogDescription>
            </DialogHeader>
            <ShareModalContent
              shareableLink={shareableLink}
              onCopyLink={() => {
                handleCopyLink()
                setShareModalOpen(false)
              }}
              onSendToCandidates={() => {
                handleSendToCandidates()
                setShareModalOpen(false)
              }}
              t={t}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={shareModalOpen} onOpenChange={setShareModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t('dashboard.testDetail.shareableLink')}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6 pb-safe">
              <ShareModalContent
                shareableLink={shareableLink}
                onCopyLink={() => {
                  handleCopyLink()
                  setShareModalOpen(false)
                }}
                onSendToCandidates={() => {
                  handleSendToCandidates()
                  setShareModalOpen(false)
                }}
                t={t}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Save success modal */}
      <Dialog open={saveSuccessModalOpen} onOpenChange={setSaveSuccessModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('dashboard.testDetail.editSuccess')}</DialogTitle>
            <DialogDescription>
              Your test has been updated successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSaveSuccessModalOpen(false)}
              className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={open => { if (!open) setDeleteModalOpen(false) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.tests.deleteConfirm')}</DialogTitle>
            <DialogDescription>{t('dashboard.tests.deleteWarning')}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
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
