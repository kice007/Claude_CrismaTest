'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  BookOpen, Calculator, Brain, MessageSquare, Lightbulb, Trophy, Code2, Heart,
  Check, X, Eye, ChevronDown, Link2, CheckCircle2, Plus, Trash2,
  AlignLeft, Video, List, GripVertical,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 'role' | 'modules' | 'custom-questions' | 'generate' | 'preview' | 'success'
type QType = 'Multiple choice' | 'Short answer' | 'Video response' | 'Ranking'

interface CustomQuestion {
  text: string
  type: QType
  options?: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
  'Product Manager', 'Software Engineer', 'UX Designer', 'Data Analyst',
  'Sales Representative', 'Marketing Manager', 'HR Manager', 'Finance Analyst',
]

const MODULES = [
  { id: 'verbal',     name: 'Verbal Reasoning',      Icon: BookOpen,      desc: '~8 questions'  },
  { id: 'numerical',  name: 'Numerical Reasoning',    Icon: Calculator,    desc: '~8 questions'  },
  { id: 'logical',    name: 'Logical Reasoning',      Icon: Brain,         desc: '~10 questions' },
  { id: 'comm',       name: 'Communication',          Icon: MessageSquare, desc: '~6 questions'  },
  { id: 'problem',    name: 'Problem Solving',        Icon: Lightbulb,     desc: '~8 questions'  },
  { id: 'leadership', name: 'Leadership',             Icon: Trophy,        desc: '~6 questions'  },
  { id: 'technical',  name: 'Technical Skills',       Icon: Code2,         desc: '~10 questions' },
  { id: 'emotional',  name: 'Emotional Intelligence', Icon: Heart,         desc: '~6 questions'  },
]

const MODULE_Q_COUNTS: Record<string, number> = {
  verbal: 8, numerical: 8, logical: 10, comm: 6, problem: 8, leadership: 6, technical: 10, emotional: 6,
}

const Q_TYPES: { type: QType; Icon: React.ElementType; desc: string }[] = [
  { type: 'Multiple choice', Icon: CheckCircle2, desc: 'Choose from options' },
  { type: 'Short answer',    Icon: AlignLeft,    desc: 'Written response'    },
  { type: 'Video response',  Icon: Video,        desc: 'Record an answer'    },
  { type: 'Ranking',         Icon: List,         desc: 'Order by preference' },
]

const STEP_TO_IDX: Record<WizardStep, number> = {
  role: 0, modules: 1, 'custom-questions': 2, generate: 3, preview: 3, success: 3,
}

// ─── Step Bar ──────────────────────────────────────────────────────────────────

function StepBar({ step }: { step: WizardStep }) {
  const activeIdx = STEP_TO_IDX[step]
  const steps = [
    { label: 'Role' },
    { label: 'Modules' },
    { label: 'Custom questions' },
    { label: step === 'preview' ? 'Review & create' : 'Generate', showEye: step === 'preview' },
  ]

  return (
    <div style={{ display: 'flex', height: 56, width: '100%' }}>
      {steps.map((s, i) => {
        const isActive = i === activeIdx
        const isCompleted = i < activeIdx
        const isFirst = i === 0
        const isLast = i === steps.length - 1

        let bg = '#FFFFFF'
        let borderColor = '#E2E8F0'
        let textColor = '#64748B'
        if (isActive)   { bg = '#1B4FD8'; borderColor = '#1B4FD8'; textColor = '#FFFFFF' }
        else if (isCompleted) { bg = '#EFF6FF'; borderColor = '#BFDBFE'; textColor = '#1B4FD8' }

        const br = isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0'

        return (
          <div
            key={i}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 20px', background: bg,
              border: `1px solid ${borderColor}`,
              marginLeft: i > 0 ? -1 : 0,
              zIndex: isActive ? 2 : isCompleted ? 1 : 0,
              borderRadius: br, height: '100%',
              position: 'relative', boxSizing: 'border-box',
            }}
          >
            {isCompleted ? (
              <Check size={18} color="#1B4FD8" strokeWidth={2.5} />
            ) : isActive && s.showEye ? (
              <Eye size={18} color="#FFFFFF" />
            ) : (
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: isActive ? '#FFFFFF' : '#E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: isActive ? '#1B4FD8' : '#64748B',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: isActive || isCompleted ? 600 : 500, color: textColor }}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Role Dropdown ─────────────────────────────────────────────────────────────

function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width: 320 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', height: 48, background: '#FFFFFF',
          border: '1px solid #CBD5E1', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: value ? 500 : 400, color: value ? '#0F2A6B' : '#94A3B8' }}>
          {value || 'Select a role...'}
        </span>
        <ChevronDown
          size={16} color="#64748B"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: '100%',
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 100, overflow: 'hidden',
        }}>
          {ROLES.map(role => (
            <button
              key={role}
              type="button"
              onClick={() => { onChange(role); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 16px',
                background: role === value ? '#F0F4FF' : '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 14, color: role === value ? '#1B4FD8' : '#0F172A',
                fontWeight: role === value ? 500 : 400, textAlign: 'left',
              }}
            >
              {role}
              {role === value && <Check size={14} color="#1B4FD8" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Add Question Modal ────────────────────────────────────────────────────────

interface AddQModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onAdd: (q: CustomQuestion) => void
}

function AddQModal({ open, onOpenChange, onAdd }: AddQModalProps) {
  const [qType, setQType] = useState<QType>('Multiple choice')
  const [text, setText] = useState('')
  const [options, setOptions] = useState(['', '', ''])
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [rankItems, setRankItems] = useState(['', '', ''])

  function reset() {
    setQType('Multiple choice')
    setText('')
    setOptions(['', '', ''])
    setAllowMultiple(false)
    setRankItems(['', '', ''])
  }

  function handleAdd() {
    if (!text.trim()) return
    const q: CustomQuestion = { text: text.trim(), type: qType }
    if (qType === 'Multiple choice') q.options = options.filter(o => o.trim())
    if (qType === 'Ranking') q.options = rankItems.filter(o => o.trim())
    onAdd(q)
    reset()
    onOpenChange(false)
  }

  function handleClose() {
    reset()
    onOpenChange(false)
  }

  function updateOption(idx: number, val: string) {
    setOptions(prev => prev.map((o, i) => (i === idx ? val : o)))
  }

  function removeOption(idx: number) {
    setOptions(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[640px] p-0 gap-0 overflow-hidden"
      >
        {/* Header */}
        <div style={{
          height: 64, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B' }}>Add question</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              Define the type, text and settings for your new question
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              width: 32, height: 32, background: '#F3F4F6', border: 'none',
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Question type */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Question type</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {Q_TYPES.map(({ type, Icon, desc }) => {
              const sel = qType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQType(type)}
                  style={{
                    flex: 1, padding: 12, borderRadius: 8,
                    border: sel ? '2px solid #1B4FD8' : '1px solid #E5E7EB',
                    background: sel ? '#EEF2FF' : '#F9FAFB',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    gap: 6, alignItems: 'flex-start', textAlign: 'left',
                  }}
                >
                  <Icon size={18} color={sel ? '#1B4FD8' : '#9CA3AF'} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: sel ? '#1B4FD8' : '#374151' }}>{type}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Question text */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Question</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>Required</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. Which of the following best describes your management style?"
            style={{
              width: '100%', height: 84, padding: 12, borderRadius: 8,
              border: '1px solid #E5E7EB', background: '#F9FAFB',
              fontSize: 14, color: '#111827', resize: 'none', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* MC options */}
        {qType === 'Multiple choice' && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Answer Options</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>Min. 2 options</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #D1D5DB', background: '#fff', flexShrink: 0 }} />
                  <div style={{
                    flex: 1, height: 36, background: '#F9FAFB', border: '1px solid #E5E7EB',
                    borderRadius: 6, padding: '0 12px', display: 'flex', alignItems: 'center',
                  }}>
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => updateOption(idx, e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#111827', width: '100%' }}
                    />
                  </div>
                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <X size={16} color="#D1D5DB" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOptions(prev => [...prev, ''])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Plus size={14} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1B4FD8' }}>Add option</span>
              </button>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 16, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Allow multiple answers</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Candidates can select more than one</div>
              </div>
              <button
                type="button"
                onClick={() => setAllowMultiple(v => !v)}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: allowMultiple ? '#1B4FD8' : '#D1D5DB',
                  border: 'none', cursor: 'pointer', padding: 3,
                  display: 'flex', justifyContent: allowMultiple ? 'flex-end' : 'flex-start',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>
          </div>
        )}

        {/* Ranking items */}
        {qType === 'Ranking' && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Items to rank</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>Min. 2 items</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rankItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <GripVertical size={16} color="#D1D5DB" style={{ flexShrink: 0, cursor: 'grab' }} />
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, background: '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#64748B', flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{
                    flex: 1, height: 36, background: '#F9FAFB', border: '1px solid #E5E7EB',
                    borderRadius: 6, padding: '0 12px', display: 'flex', alignItems: 'center',
                  }}>
                    <input
                      type="text"
                      placeholder={`Item ${idx + 1}`}
                      value={item}
                      onChange={e => setRankItems(prev => prev.map((v, i) => i === idx ? e.target.value : v))}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#111827', width: '100%' }}
                    />
                  </div>
                  {rankItems.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setRankItems(prev => prev.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      <X size={16} color="#D1D5DB" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRankItems(prev => [...prev, ''])}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Plus size={14} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1B4FD8' }}>Add item</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          height: 64, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid #E5E7EB',
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{ padding: '10px 20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!text.trim()}
            onClick={handleAdd}
            style={{
              padding: '10px 20px', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              background: text.trim() ? '#1B4FD8' : '#E2E8F0',
              color: text.trim() ? '#FFFFFF' : '#94A3B8',
              cursor: text.trim() ? 'pointer' : 'default',
            }}
          >
            Add question
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function BuildTestWizard() {
  const router = useRouter()

  const [step, setStep] = useState<WizardStep>('role')
  const [wizardData, setWizardData] = useState({
    role: '',
    modules: [] as string[],
    customQuestions: [] as CustomQuestion[],
  })
  const [addQOpen, setAddQOpen] = useState(false)
  const [qFilter, setQFilter] = useState<'all' | QType>('all')
  const [newTestId, setNewTestId] = useState<string | null>(null)

  const [generating] = useState(false)
  const [testLink, setTestLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  function toggleModule(id: string) {
    setWizardData(d => ({
      ...d,
      modules: d.modules.includes(id) ? d.modules.filter(m => m !== id) : [...d.modules, id],
    }))
  }

  function addQuestion(q: CustomQuestion) {
    setWizardData(d => ({ ...d, customQuestions: [...d.customQuestions, q] }))
  }

  function deleteQuestion(idx: number) {
    setWizardData(d => ({ ...d, customQuestions: d.customQuestions.filter((_, i) => i !== idx) }))
  }

  function handleGenerate() {
    setStep('preview')
  }

  function handleCreate() {
    const mockId = 'demo'
    setNewTestId(mockId)
    setTestLink(`${window.location.origin}/test/${mockId}/intro`)
    setStep('success')
  }

  function handleCopyLink() {
    if (!testLink) return
    navigator.clipboard.writeText(testLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  function resetWizard() {
    setStep('role')
    setWizardData({ role: '', modules: [], customQuestions: [] })
    setNewTestId(null)
    setTestLink('')
    setLinkCopied(false)
  }

  function handleViewTest() {
    const id = newTestId
    resetWizard()
    router.push('/dashboard/tests/' + id)
  }

  function handleBackToDashboard() {
    resetWizard()
    router.push('/dashboard/tests')
  }

  const modulesTotal = wizardData.modules.reduce((s, id) => s + (MODULE_Q_COUNTS[id] ?? 8), 0)
  const totalQuestions = modulesTotal + wizardData.customQuestions.length

  // ── Step 1: Role ───────────────────────────────────────────────────────────

  function renderRole() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B', marginBottom: 8 }}>Select role</div>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>
            Choose the role you are hiring for to customize the assessment.
          </div>
          <RoleDropdown value={wizardData.role} onChange={r => setWizardData(d => ({ ...d, role: r }))} />
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8 }}>
            Available roles: {ROLES.join(', ')}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={!wizardData.role}
            onClick={() => setStep('modules')}
            style={{
              height: 44, padding: '0 24px',
              background: wizardData.role ? '#1B4FD8' : '#E2E8F0',
              border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              color: wizardData.role ? '#FFFFFF' : '#94A3B8',
              cursor: wizardData.role ? 'pointer' : 'default',
            }}
          >
            Next: Modules →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Modules ────────────────────────────────────────────────────────

  function renderModules() {
    const selectedCount = wizardData.modules.length
    const estimatedQ = wizardData.modules.reduce((s, id) => s + (MODULE_Q_COUNTS[id] ?? 8), 0)
    const rows: (typeof MODULES)[] = []
    for (let i = 0; i < MODULES.length; i += 2) rows.push(MODULES.slice(i, i + 2))

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B', marginBottom: 6 }}>Select modules</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>
            Choose the skill modules to include in your assessment. Selected modules determine the types of questions generated.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 16 }}>
              {row.map(mod => {
                const isSelected = wizardData.modules.includes(mod.id)
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    style={{
                      flex: 1, height: 88, padding: 16, borderRadius: 8,
                      border: `1px solid ${isSelected ? '#BFDBFE' : '#E2E8F0'}`,
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <mod.Icon size={22} color={isSelected ? '#1B4FD8' : '#94A3B8'} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? '#0F2A6B' : '#374151' }}>
                        {mod.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{mod.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            {selectedCount > 0
              ? `${selectedCount} module${selectedCount > 1 ? 's' : ''} selected · ~${estimatedQ} questions total`
              : 'No modules selected'}
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setStep('role')}
              style={{ height: 44, padding: '0 20px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={wizardData.modules.length === 0}
              onClick={() => setStep('custom-questions')}
              style={{
                height: 44, padding: '0 24px',
                background: wizardData.modules.length > 0 ? '#1B4FD8' : '#E2E8F0',
                border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                color: wizardData.modules.length > 0 ? '#FFFFFF' : '#94A3B8',
                cursor: wizardData.modules.length > 0 ? 'pointer' : 'default',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Custom Questions ───────────────────────────────────────────────

  const Q_FILTER_TABS: { label: string; value: 'all' | QType }[] = [
    { label: 'All',             value: 'all'             },
    { label: 'Multiple choice', value: 'Multiple choice' },
    { label: 'Short answer',    value: 'Short answer'    },
    { label: 'Video response',  value: 'Video response'  },
    { label: 'Ranking',         value: 'Ranking'         },
  ]

  function renderCustomQuestions() {
    const indexed = wizardData.customQuestions.map((q, i) => ({ ...q, originalIdx: i }))
    const filtered = qFilter === 'all' ? indexed : indexed.filter(q => q.type === qFilter)
    const count = wizardData.customQuestions.length

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B' }}>Custom Questions</div>
            <div style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
              Add your own questions to personalize the assessment alongside the generated ones.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAddQOpen(true)}
            style={{
              height: 40, padding: '0 16px', background: '#1B4FD8', border: 'none',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Plus size={16} color="#FFFFFF" />
            Add question
          </button>
        </div>

        {/* Type filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Q_FILTER_TABS.map(tab => {
            const tabCount = tab.value === 'all'
              ? count
              : wizardData.customQuestions.filter(q => q.type === tab.value).length
            const isActive = qFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setQFilter(tab.value)}
                style={{
                  height: 32, padding: '0 12px', borderRadius: 6,
                  background: isActive ? '#1B4FD8' : '#F1F5F9',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : '#64748B',
                }}
              >
                {tab.label}
                {(tab.value === 'all' || tabCount > 0) ? ` (${tabCount})` : ''}
              </button>
            )
          })}
        </div>

        {/* Question list */}
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
            {count === 0
              ? 'No custom questions yet. Click "Add question" to get started.'
              : 'No questions match this filter.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((q, fi) => (
              <div
                key={fi}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, height: 80,
                  padding: '0 16px', background: '#FFFFFF',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 14, background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#1B4FD8', flexShrink: 0,
                }}>
                  {q.originalIdx + 1}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.text}
                  </div>
                  <span style={{
                    display: 'inline-block', marginTop: 4,
                    background: '#F1F5F9', color: '#475569',
                    borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500,
                  }}>
                    {q.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteQuestion(q.originalIdx)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <Trash2 size={16} color="#94A3B8" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            {count > 0
              ? `${count} custom question${count > 1 ? 's' : ''} added`
              : 'Optional — add up to 10 custom questions'}
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={() => setStep('modules')}
              style={{ height: 44, padding: '0 20px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep('generate')}
              style={{ height: 44, padding: '0 24px', background: '#1B4FD8', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}
            >
              Next →
            </button>
          </div>
        </div>

        <AddQModal open={addQOpen} onOpenChange={setAddQOpen} onAdd={addQuestion} />
      </div>
    )
  }

  // ── Step 4a: Generate (Review & Generate) ──────────────────────────────────

  function renderGenerate() {
    const selectedModuleNames = MODULES.filter(m => wizardData.modules.includes(m.id)).map(m => m.name)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B', marginBottom: 6 }}>Review & Generate</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>
            Review your test configuration below and generate the final assessment link.
          </div>
        </div>

        {/* Two-column cards */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Summary card */}
          <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F2A6B' }}>Test summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Role</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{wizardData.role}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Modules</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedModuleNames.map(name => (
                    <span key={name} style={{ background: '#EFF6FF', color: '#1B4FD8', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Custom questions</div>
                <div style={{ fontSize: 14, color: '#0F172A' }}>
                  {wizardData.customQuestions.length === 0 ? 'None added' : `${wizardData.customQuestions.length} question${wizardData.customQuestions.length > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
            <div style={{ background: '#EFF6FF', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1B4FD8' }}>Total questions</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#0F2A6B' }}>~{totalQuestions}</span>
            </div>
          </div>

          {/* Settings card */}
          <div style={{ flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F2A6B' }}>Test settings</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Language',      value: 'English' },
                { label: 'Time limit',    value: '45 min'  },
                { label: 'Passing score', value: '70%'     },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  <span style={{ fontSize: 13, color: '#64748B' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              height: 52, padding: '0 40px',
              background: '#1B4FD8',
              border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 700, color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            Generate assessment
          </button>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>
            A unique link will be created for your candidates.
          </span>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setStep('custom-questions')}
            style={{
              height: 44, padding: '0 20px', background: '#FFFFFF', border: '1px solid #CBD5E1',
              borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151',
              cursor: generating ? 'default' : 'pointer', opacity: generating ? 0.5 : 1,
            }}
          >
            ← Back
          </button>
          <button
            type="button"
            style={{ height: 44, padding: '0 20px', background: '#FFFFFF', border: '1px solid #1B4FD8', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#1B4FD8', cursor: 'pointer' }}
          >
            Save draft
          </button>
        </div>
      </div>
    )
  }

  // ── Step 4b: Preview (Review & Create) ─────────────────────────────────────

  function renderPreview() {
    const selectedModules = MODULES.filter(m => wizardData.modules.includes(m.id))
    const placeholderQs = selectedModules.slice(0, 4).map(mod => ({
      text: `Sample ${mod.name} question for ${wizardData.role}`,
      type: 'Multiple choice' as QType,
      module: mod.name,
    }))
    const allQs = [
      ...placeholderQs,
      ...wizardData.customQuestions.map(q => ({ text: q.text, type: q.type, module: 'Custom' })),
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Eye size={22} color="#1B4FD8" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B' }}>Test preview</div>
          </div>
          <div style={{
            height: 28, padding: '0 12px', background: '#EFF6FF',
            borderRadius: 20, display: 'flex', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1B4FD8' }}>
              {allQs.length} questions · ~{totalQuestions} pts
            </span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#64748B' }}>
          Review all test specs and questions before finalizing. Once validated, a unique assessment link will be generated.
        </div>

        {/* Two-column */}
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Question list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingBottom: 10, borderBottom: '1px solid #E2E8F0',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Questions</span>
              <span style={{ fontSize: 12, color: '#64748B' }}>{allQs.length} total</span>
            </div>
            {allQs.map((q, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, height: 76,
                  padding: '0 16px', background: '#FFFFFF',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 14, background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#1B4FD8', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.text}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{ background: '#EFF6FF', color: '#1B4FD8', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500 }}>
                      {q.module}
                    </span>
                    <span style={{ background: '#F1F5F9', color: '#475569', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>
                      {q.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary column */}
          <div style={{ width: 276, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Test specs</div>
              {[
                { label: 'Role',      value: wizardData.role },
                { label: 'Modules',   value: `${wizardData.modules.length} selected` },
                { label: 'Questions', value: `~${totalQuestions}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Settings</div>
              {[
                { label: 'Language',      value: 'English' },
                { label: 'Time limit',    value: '45 min'  },
                { label: 'Passing score', value: '70%'     },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <button
            type="button"
            onClick={() => setStep('generate')}
            style={{ height: 44, padding: '0 20px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#374151', cursor: 'pointer' }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleCreate}
            style={{
              height: 52, padding: '0 40px', background: '#1B4FD8',
              border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, color: '#FFFFFF',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <CheckCircle2 size={20} color="#FFFFFF" />
            Validate &amp; create assessment
          </button>
        </div>
      </div>
    )
  }

  // ── Success Modal ──────────────────────────────────────────────────────────

  function renderSuccessModal() {
    const displayLink = testLink || (typeof window !== 'undefined'
      ? `${window.location.origin}/test/demo/intro`
      : 'crismatest.com/test/demo/intro')
    const shortLink = displayLink.replace(/^https?:\/\//, '')

    return (
      <Dialog open={step === 'success'} onOpenChange={() => {}}>
        <DialogContent showCloseButton={false} className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
          {/* Top */}
          <div style={{ padding: '40px 40px 32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={36} color="#16A34A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0F2A6B' }}>Assessment created!</div>
              <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
                Your test has been validated and a unique assessment link has been generated. Candidates will receive their invitations shortly.
              </div>
            </div>
            {/* Link box */}
            <div style={{
              width: '100%', height: 44, background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 8, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Link2 size={16} color="#1B4FD8" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1B4FD8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                {shortLink}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  height: 28, padding: '0 10px',
                  background: linkCopied ? '#DCFCE7' : '#EFF6FF',
                  border: 'none', borderRadius: 6,
                  fontSize: 12, fontWeight: 600,
                  color: linkCopied ? '#16A34A' : '#1B4FD8',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                {linkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#E2E8F0' }} />

          {/* Actions */}
          <div style={{ padding: '24px 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              type="button"
              onClick={handleViewTest}
              style={{
                width: '100%', height: 48, background: '#1B4FD8', border: 'none',
                borderRadius: 10, fontSize: 15, fontWeight: 700, color: '#FFFFFF',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Eye size={18} color="#FFFFFF" />
              View test details
            </button>
            <button
              type="button"
              onClick={handleBackToDashboard}
              style={{
                width: '100%', height: 44, background: '#FFFFFF',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 14, fontWeight: 500, color: '#64748B', cursor: 'pointer',
              }}
            >
              Back to dashboard
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100%', boxSizing: 'border-box' }}>
      {/* Page header */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#0F2A6B' }}>Build test</span>
      </div>

      {/* Step bar */}
      <div style={{ flexShrink: 0 }}>
        <StepBar step={step} />
      </div>

      {/* Content card */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: 32 }}>
        {step === 'role'             && renderRole()}
        {step === 'modules'          && renderModules()}
        {step === 'custom-questions' && renderCustomQuestions()}
        {step === 'generate'         && renderGenerate()}
        {step === 'preview'          && renderPreview()}
      </div>

      {renderSuccessModal()}
    </div>
  )
}
