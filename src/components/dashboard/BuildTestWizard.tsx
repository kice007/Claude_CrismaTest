'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CheckCircle2Icon, TrashIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/use-media-query'

// ─── Constants ────────────────────────────────────────────────────────────────

type WizardStep = 'role' | 'modules' | 'custom-questions' | 'generate' | 'preview' | 'success'


const ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Analyst',
  'UX Designer',
  'Sales Representative',
  'Marketing Manager',
  'Customer Support',
  'Operations Manager',
]

const MODULES = [
  'Logical Reasoning',
  'Communication',
  'Technical Skills',
  'Problem Solving',
  'Situational Judgment',
  'Verbal Reasoning',
  'Numerical Reasoning',
  'Personality Assessment',
]

const QUESTION_TYPES = ['Multiple Choice', 'Open Text', 'Ranking']

// ─── Add Question Modal Content ───────────────────────────────────────────────

interface AddQuestionContentProps {
  onSubmit: (question: { text: string; type: string }) => void
  onCancel: () => void
}

function AddQuestionContent({ onSubmit, onCancel }: AddQuestionContentProps) {
  const [text, setText] = useState('')
  const [type, setType] = useState('Multiple Choice')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit({ text: text.trim(), type })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-6">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700" htmlFor="question-text">
          Question
        </label>
        <Input
          id="question-text"
          placeholder="Enter your custom question..."
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700" htmlFor="question-type">
          Question Type
        </label>
        <Select value={type} onValueChange={(val: string | null) => setType(val ?? 'Multiple Choice')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_TYPES.map(qt => (
              <SelectItem key={qt} value={qt}>{qt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 min-h-[44px] rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
        >
          Add Question
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-h-[44px] rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Add Question Modal ───────────────────────────────────────────────────────

interface AddQuestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (question: { text: string; type: string }) => void
}

function AddQuestionModal({ open, onOpenChange, onSubmit }: AddQuestionModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  function handleSubmit(q: { text: string; type: string }) {
    onSubmit(q)
    onOpenChange(false)
  }

  function handleCancel() {
    onOpenChange(false)
  }

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add Custom Question</DialogTitle>
          </DialogHeader>
          <AddQuestionContent onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Custom Question</DrawerTitle>
        </DrawerHeader>
        <AddQuestionContent onSubmit={handleSubmit} onCancel={handleCancel} />
      </DrawerContent>
    </Drawer>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

interface StepIndicatorProps {
  current: number
  total: number
  label: string
}

function StepIndicator({ current, total, label }: StepIndicatorProps) {
  const progress = (current / total) * 100

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Step {current} of {total}</span>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-brand-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function BuildTestWizard() {
  const { t } = useTranslation('translation')
  const router = useRouter()

  const [step, setStep] = useState<WizardStep>('role')
  const [wizardData, setWizardData] = useState({
    role: '',
    modules: [] as string[],
    customQuestions: [] as { text: string; type: string }[],
  })
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)
  const [newTestId, setNewTestId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // ── Step 1: Role ─────────────────────────────────────────────────────────

  function renderRole() {
    return (
      <div>
        <StepIndicator current={1} total={4} label={t('dashboard.buildTest.steps.role')} />
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {t('dashboard.buildTest.steps.role')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ROLES.map(role => (
            <button
              key={role}
              type="button"
              onClick={() => setWizardData(d => ({ ...d, role }))}
              className={[
                'flex items-center justify-center min-h-[72px] rounded-xl border-2 px-3 py-4 text-sm font-medium text-center transition-all',
                wizardData.role === role
                  ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="button"
            disabled={!wizardData.role}
            onClick={() => setStep('modules')}
            className="min-h-[44px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('dashboard.buildTest.actions.next')}
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Modules ──────────────────────────────────────────────────────

  function toggleModule(mod: string) {
    setWizardData(d => ({
      ...d,
      modules: d.modules.includes(mod)
        ? d.modules.filter(m => m !== mod)
        : [...d.modules, mod],
    }))
  }

  function renderModules() {
    return (
      <div>
        <StepIndicator current={2} total={4} label={t('dashboard.buildTest.steps.modules')} />
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {t('dashboard.buildTest.steps.modules')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODULES.map(mod => (
            <label
              key={mod}
              className="flex items-center gap-3 min-h-[52px] px-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Checkbox
                checked={wizardData.modules.includes(mod)}
                onCheckedChange={() => toggleModule(mod)}
              />
              <span className="text-sm font-medium text-slate-700">{mod}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep('role')}
            className="min-h-[44px] px-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            {t('dashboard.buildTest.actions.back')}
          </button>
          <button
            type="button"
            disabled={wizardData.modules.length === 0}
            onClick={() => setStep('custom-questions')}
            className="min-h-[44px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('dashboard.buildTest.actions.next')}
          </button>
        </div>
      </div>
    )
  }

  // ── Step 3: Custom Questions ─────────────────────────────────────────────

  function handleAddQuestion(q: { text: string; type: string }) {
    if (wizardData.customQuestions.length >= 3) return
    setWizardData(d => ({ ...d, customQuestions: [...d.customQuestions, q] }))
  }

  function handleDeleteQuestion(idx: number) {
    setWizardData(d => ({
      ...d,
      customQuestions: d.customQuestions.filter((_, i) => i !== idx),
    }))
  }

  function renderCustomQuestions() {
    const atMax = wizardData.customQuestions.length >= 3

    return (
      <div>
        <StepIndicator current={3} total={4} label={t('dashboard.buildTest.steps.questions')} />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {t('dashboard.buildTest.steps.questions')}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Optional — up to 3 custom questions.
        </p>

        {wizardData.customQuestions.length > 0 && (
          <ul className="space-y-2 mb-4">
            {wizardData.customQuestions.map((q, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{q.text}</p>
                  <span className="inline-block mt-1 text-xs text-slate-400 bg-slate-100 rounded-md px-2 py-0.5">
                    {q.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(i)}
                  className="shrink-0 text-slate-400 hover:text-red-500 transition-colors mt-0.5"
                  aria-label="Remove question"
                >
                  <TrashIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          disabled={atMax}
          onClick={() => setAddQuestionOpen(true)}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 font-medium text-sm hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>+</span>
          {t('dashboard.buildTest.actions.addQuestion')}
          {atMax && <span className="text-xs text-slate-400">(max 3)</span>}
        </button>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep('modules')}
            className="min-h-[44px] px-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            {t('dashboard.buildTest.actions.back')}
          </button>
          <button
            type="button"
            onClick={() => setStep('generate')}
            className="min-h-[44px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
          >
            {t('dashboard.buildTest.actions.next')}
          </button>
        </div>

        <AddQuestionModal
          open={addQuestionOpen}
          onOpenChange={setAddQuestionOpen}
          onSubmit={handleAddQuestion}
        />
      </div>
    )
  }

  // ── Step 4: Generate ─────────────────────────────────────────────────────

  async function handleGenerate() {
    setGenerating(true)
    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: wizardData.role,
          name: `${wizardData.role} Assessment`,
          modules: wizardData.modules,
          customQuestions: wizardData.customQuestions,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setNewTestId(data.id)
      setStep('preview')
    } catch {
      toast.error(t('dashboard.errors.loadFailed'))
    } finally {
      setGenerating(false)
    }
  }

  function renderGenerate() {
    return (
      <div>
        <StepIndicator current={4} total={4} label={t('dashboard.buildTest.steps.generate')} />
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {t('dashboard.buildTest.steps.generate')}
        </h2>

        {/* Summary card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Role</p>
            <p className="text-base font-semibold text-slate-800">{wizardData.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Modules</p>
            <div className="flex flex-wrap gap-2">
              {wizardData.modules.map(mod => (
                <span
                  key={mod}
                  className="inline-flex items-center rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium px-3 py-1"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Custom Questions</p>
            <p className="text-sm text-slate-700">
              {wizardData.customQuestions.length === 0
                ? 'None added'
                : `${wizardData.customQuestions.length} question${wizardData.customQuestions.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep('custom-questions')}
            disabled={generating}
            className="min-h-[44px] px-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('dashboard.buildTest.actions.back')}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 min-h-[44px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating && (
              <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {t('dashboard.buildTest.actions.generate')}
          </button>
        </div>
      </div>
    )
  }

  // ── Preview ──────────────────────────────────────────────────────────────

  function renderPreview() {
    const totalQuestions = wizardData.modules.length * 3 + wizardData.customQuestions.length

    return (
      <div>
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Preview</span>
            <span className="font-medium text-slate-700">{t('dashboard.buildTest.steps.preview')}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-brand-primary w-full" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {t('dashboard.buildTest.steps.preview')}
        </h2>

        <div className="rounded-xl border border-slate-200 p-5 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Test Name</p>
            <p className="text-base font-semibold text-slate-800">{wizardData.role} Assessment</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Modules ({wizardData.modules.length})</p>
            <div className="flex flex-wrap gap-2">
              {wizardData.modules.map(mod => (
                <span
                  key={mod}
                  className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Estimated Questions</p>
            <p className="text-sm text-slate-700">
              ~{totalQuestions} questions across {wizardData.modules.length} module{wizardData.modules.length > 1 ? 's' : ''}
            </p>
          </div>
          {wizardData.customQuestions.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Custom Questions</p>
              <ul className="space-y-1">
                {wizardData.customQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-slate-400">→</span>
                    {q.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep('generate')}
            className="min-h-[44px] px-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            {t('dashboard.buildTest.actions.back')}
          </button>
          <button
            type="button"
            onClick={() => setStep('success')}
            className="min-h-[44px] px-6 rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
          >
            Looks Good — Continue
          </button>
        </div>
      </div>
    )
  }

  // ── Success Modal ────────────────────────────────────────────────────────

  function handleCopyLink() {
    const url = `${window.location.origin}/test/${newTestId}/intro`
    navigator.clipboard.writeText(url).then(() => {
      toast.success(t('dashboard.buildTest.copyLinkSuccess'))
    })
  }

  function handleSendToCandidates() {
    const url = `${window.location.origin}/test/${newTestId}/intro`
    const subject = encodeURIComponent('Test Invitation')
    const body = encodeURIComponent(
      `Hello,\n\nYou are invited to complete the ${wizardData.role} Assessment on CrismaTest.\n\nStart your test here: ${url}\n\nGood luck!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  function handleViewTest() {
    // Reset wizard state before navigating
    setStep('role')
    setWizardData({ role: '', modules: [], customQuestions: [] })
    setNewTestId(null)
    router.push('/dashboard/tests/' + newTestId)
  }

  function renderSuccessModal() {
    return (
      <Dialog open={step === 'success'} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <CheckCircle2Icon className="size-14 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {t('dashboard.buildTest.successTitle')}
              </h2>
              <p className="text-sm text-slate-500">
                {t('dashboard.buildTest.successBody')}
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full min-h-[44px] rounded-lg border border-brand-primary text-brand-primary font-medium text-sm hover:bg-brand-primary/5 transition-colors"
              >
                {t('dashboard.buildTest.actions.copyLink')}
              </button>
              <button
                type="button"
                onClick={handleSendToCandidates}
                className="w-full min-h-[44px] rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                {t('dashboard.buildTest.actions.sendToCandidates')}
              </button>
              <button
                type="button"
                onClick={handleViewTest}
                className="w-full min-h-[44px] rounded-lg bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
              >
                {t('dashboard.buildTest.actions.viewTest')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {step === 'role' && renderRole()}
      {step === 'modules' && renderModules()}
      {step === 'custom-questions' && renderCustomQuestions()}
      {step === 'generate' && renderGenerate()}
      {step === 'preview' && renderPreview()}
      {step === 'success' && renderSuccessModal()}
    </div>
  )
}
