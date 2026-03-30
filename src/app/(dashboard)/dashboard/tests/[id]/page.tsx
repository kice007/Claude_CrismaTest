'use client'

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Share2, Pencil, Users, TrendingUp, CheckCircle2, FileText,
  Info, List, Settings2, Activity, CirclePlus, Trash2, Copy,
  Mail, MessageSquare, QrCode, Timer, Link, Eye, X, ChevronDown,
  AlignLeft, Video, Plus,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useMediaQuery } from '@/lib/use-media-query'

// ─── Types ─────────────────────────────────────────────────────────────────

interface Question {
  id?: string
  text: string
  type: 'multiple_choice' | 'short_answer' | 'video' | 'ranking'
}

interface TestDetail {
  id: string
  name: string
  role: string
  slug?: string
  modules: string[]
  duration: number
  status: 'active' | 'draft' | 'archived'
  created_at: string
  response_count: number
  description?: string
  avg_score?: number
  completion_rate?: number
  shareable_link?: string
  questions?: Question[]
  custom_questions?: { text: string; type: string }[]
}

interface EditState {
  name: string
  role: string
  description: string
  duration: string
  pass_threshold: number
  time_limit: boolean
  randomize: boolean
  anti_cheat: boolean
  questions: Question[]
}

// ─── Static fallback data ──────────────────────────────────────────────────

const GENERIC_TESTS: TestDetail[] = [
  { id: '1', name: 'Full-Stack Engineer Screen', role: 'Engineering', modules: ['Logic', 'Job Skills'], duration: 45, status: 'active', created_at: '2026-01-10', response_count: 34 },
  { id: '2', name: 'Data Analyst Assessment', role: 'Data Science', modules: ['Logic', 'Communication'], duration: 40, status: 'active', created_at: '2026-01-14', response_count: 22 },
  { id: '3', name: 'Product Manager Fit Test', role: 'Product', modules: ['Communication', 'Job Skills'], duration: 35, status: 'active', created_at: '2026-01-18', response_count: 18 },
  { id: '4', name: 'UX Designer Portfolio Review', role: 'Design', modules: ['Communication', 'Job Skills'], duration: 30, status: 'draft', created_at: '2026-01-22', response_count: 0 },
  { id: '5', name: 'DevOps Culture & Tools Screen', role: 'DevOps', modules: ['Logic', 'Job Skills'], duration: 40, status: 'active', created_at: '2026-01-26', response_count: 11 },
  { id: '6', name: 'Backend Engineer Deep Dive', role: 'Engineering', modules: ['Logic', 'Job Skills', 'Video'], duration: 60, status: 'active', created_at: '2026-02-02', response_count: 29 },
  { id: '7', name: 'ML Engineer Evaluation', role: 'Data Science', modules: ['Logic', 'Job Skills'], duration: 50, status: 'active', created_at: '2026-02-06', response_count: 15 },
  { id: '8', name: 'Frontend React Assessment', role: 'Engineering', modules: ['Logic', 'Job Skills'], duration: 45, status: 'draft', created_at: '2026-02-10', response_count: 0 },
  { id: '9', name: 'Technical Recruiter Screen', role: 'HR', modules: ['Communication', 'Job Skills'], duration: 25, status: 'active', created_at: '2026-02-13', response_count: 8 },
  { id: '10', name: 'Sales Executive Fit Test', role: 'Sales', modules: ['Communication', 'Video'], duration: 30, status: 'active', created_at: '2026-02-17', response_count: 41 },
  { id: '11', name: 'Cloud Architect Screen', role: 'DevOps', modules: ['Logic', 'Job Skills', 'Video'], duration: 55, status: 'archived', created_at: '2026-02-20', response_count: 7 },
  { id: '12', name: 'Data Engineer Pipeline Test', role: 'Data Science', modules: ['Logic', 'Job Skills'], duration: 45, status: 'active', created_at: '2026-02-24', response_count: 19 },
  { id: '13', name: 'iOS Developer Assessment', role: 'Engineering', modules: ['Logic', 'Job Skills'], duration: 50, status: 'draft', created_at: '2026-02-28', response_count: 0 },
  { id: '14', name: 'Customer Success Screen', role: 'Sales', modules: ['Communication', 'Video'], duration: 25, status: 'active', created_at: '2026-03-03', response_count: 27 },
  { id: '15', name: 'Brand Designer Evaluation', role: 'Design', modules: ['Communication', 'Job Skills'], duration: 35, status: 'active', created_at: '2026-03-06', response_count: 13 },
  { id: '16', name: 'Growth Product Manager Test', role: 'Product', modules: ['Logic', 'Communication'], duration: 40, status: 'active', created_at: '2026-03-09', response_count: 9 },
  { id: '17', name: 'Security Engineer Deep Dive', role: 'Engineering', modules: ['Logic', 'Job Skills', 'Video'], duration: 60, status: 'archived', created_at: '2026-03-12', response_count: 5 },
  { id: '18', name: 'Analytics Lead Assessment', role: 'Data Science', modules: ['Logic', 'Communication', 'Video'], duration: 50, status: 'active', created_at: '2026-03-15', response_count: 16 },
  { id: '19', name: 'HR Business Partner Screen', role: 'HR', modules: ['Communication'], duration: 20, status: 'draft', created_at: '2026-03-18', response_count: 0 },
  { id: '20', name: 'Enterprise AE Evaluation', role: 'Sales', modules: ['Communication', 'Job Skills'], duration: 35, status: 'active', created_at: '2026-03-21', response_count: 33 },
  { id: '21', name: 'Platform Engineer Screen', role: 'DevOps', modules: ['Logic', 'Job Skills'], duration: 45, status: 'active', created_at: '2026-03-24', response_count: 6 },
  { id: '22', name: 'Motion Designer Test', role: 'Design', modules: ['Job Skills', 'Video'], duration: 30, status: 'draft', created_at: '2026-03-27', response_count: 0 },
]

const QUESTION_POOL: Record<string, Question[]> = {
  Logic: [
    { text: 'Which pattern comes next in the sequence: 2, 4, 8, 16, ___?', type: 'multiple_choice' },
    { text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?', type: 'multiple_choice' },
    { text: 'A train travels 60 miles at 60 mph, then 60 miles at 30 mph. What is the average speed?', type: 'multiple_choice' },
    { text: 'Rank the following problem-solving strategies from most to least effective.', type: 'ranking' },
  ],
  Communication: [
    { text: 'Describe a time when you had to communicate complex information to a non-technical audience.', type: 'short_answer' },
    { text: 'How would you handle a disagreement with a colleague about project direction?', type: 'short_answer' },
    { text: 'Introduce yourself and explain why you are interested in this role.', type: 'video' },
    { text: 'Which of the following best describes active listening in a professional context?', type: 'multiple_choice' },
  ],
  'Job Skills': [
    { text: 'Describe your approach to managing competing deadlines.', type: 'short_answer' },
    { text: 'Which of the following best describes an agile sprint retrospective?', type: 'multiple_choice' },
    { text: 'Rank the following project management methodologies from most to least familiar.', type: 'ranking' },
    { text: 'Walk us through a project where you had to learn a new skill quickly.', type: 'short_answer' },
  ],
  Video: [
    { text: 'Walk us through your portfolio and highlight your most impactful project.', type: 'video' },
    { text: 'Describe your ideal work environment and how you contribute to team culture.', type: 'video' },
  ],
  Behavioral: [
    { text: 'Tell us about a time you failed and what you learned from it.', type: 'short_answer' },
    { text: 'Describe a situation where you had to lead a team under pressure.', type: 'short_answer' },
  ],
}

function buildMockTest(base: TestDetail): TestDetail {
  const n = parseInt(base.id, 10)
  const questions: Question[] = []
  base.modules.forEach(mod => {
    const pool = QUESTION_POOL[mod] ?? []
    questions.push(...pool.slice(0, 2))
  })
  const deduped = questions.filter((q, i, arr) => arr.findIndex(x => x.text === q.text) === i)
  return {
    ...base,
    description: `Core competency assessment for ${base.role} candidates covering key skills and domain knowledge.`,
    avg_score: 65 + (n * 7) % 25,
    completion_rate: 75 + (n * 5) % 20,
    shareable_link: `https://crismatest.com/assess/${base.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${base.id}`,
    questions: deduped.length > 0 ? deduped : [
      { text: 'Describe your most significant professional achievement.', type: 'short_answer' },
      { text: 'How do you prioritize tasks when everything seems urgent?', type: 'short_answer' },
    ],
    custom_questions: [],
  }
}

function getMockTest(id: string): TestDetail | null {
  const base = GENERIC_TESTS.find(t => t.id === id)
  if (!base) return null
  return buildMockTest(base)
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return dateStr }
}

const TYPE_META: Record<string, { bg: string; color: string; label: string }> = {
  multiple_choice: { bg: '#EEF2FF', color: '#1B4FD8', label: 'Multiple choice' },
  short_answer: { bg: '#FEF3C7', color: '#92400E', label: 'Short answer' },
  video: { bg: '#F0FDF4', color: '#15803D', label: 'Video response' },
  ranking: { bg: '#FAF5FF', color: '#7E22CE', label: 'Ranking' },
}

function TypePill({ type }: { type: string }) {
  const meta = TYPE_META[type] ?? { bg: '#F1F5F9', color: '#475569', label: type }
  return (
    <span style={{ background: meta.bg, color: meta.color, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {meta.label}
    </span>
  )
}

function StatusBadge({ status }: { status: 'active' | 'draft' | 'archived' }) {
  const map = {
    active: { bg: '#DCFCE7', color: '#15803D' },
    draft: { bg: '#FEF3C7', color: '#92400E' },
    archived: { bg: '#F1F5F9', color: '#475569' },
  }
  const s = map[status]
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 10, padding: '3px 8px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const FILTER_TABS = ['All', 'Multiple choice', 'Short answer', 'Video response', 'Ranking'] as const
const TAB_TO_TYPE: Record<string, string> = {
  'Multiple choice': 'multiple_choice',
  'Short answer': 'short_answer',
  'Video response': 'video',
  'Ranking': 'ranking',
}

const DURATION_OPTIONS = ['2 minutes', '3 minutes', '5 minutes', '10 minutes', '15 minutes']

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [test, setTest] = useState<TestDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const [editMode, setEditMode] = useState(false)
  const [editState, setEditState] = useState<EditState>({
    name: '', role: '', description: '', duration: '5 minutes',
    pass_threshold: 70, time_limit: true, randomize: true, anti_cheat: false,
    questions: [],
  })

  const [activeTab, setActiveTab] = useState<string>('All')
  const [shareOpen, setShareOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [durationOpen, setDurationOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/tests/${id}`)
        if (res.ok) {
          const data = await res.json()
          const enriched = buildMockTest({ ...getMockTest(id)!, ...data })
          setTest(enriched)
          initEdit(enriched)
        } else {
          const fallback = getMockTest(id)
          setTest(fallback)
          if (fallback) initEdit(fallback)
        }
      } catch {
        const fallback = getMockTest(id)
        setTest(fallback)
        if (fallback) initEdit(fallback)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  function initEdit(t: TestDetail) {
    setEditState({
      name: t.name,
      role: t.role,
      description: t.description ?? '',
      duration: `${t.duration >= 10 ? t.duration : 5} minutes`,
      pass_threshold: 70,
      time_limit: true,
      randomize: true,
      anti_cheat: false,
      questions: t.questions ? [...t.questions] : [],
    })
  }

  const shareableLink = test?.shareable_link
    ?? (typeof window !== 'undefined' ? `${window.location.origin}/test/${id}/intro` : '')

  function handleCopyLink() {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copied to clipboard')
    }).catch(() => toast.error('Failed to copy link'))
  }

  function handleStartEdit() {
    if (!test) return
    initEdit(test)
    setEditMode(true)
  }

  function handleDiscard() {
    setEditMode(false)
    if (test) initEdit(test)
  }

  async function handleSave() {
    if (!test) return
    setSaving(true)
    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editState.name,
          modules: test.modules,
          custom_questions: editState.questions
            .filter(q => !test.questions?.find(tq => tq.text === q.text))
            .map(q => ({ text: q.text, type: q.type })),
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setTest(prev => prev ? { ...prev, ...updated, name: editState.name } : prev)
      } else {
        setTest(prev => prev ? { ...prev, name: editState.name, role: editState.role, description: editState.description } : prev)
      }
    } catch {
      setTest(prev => prev ? { ...prev, name: editState.name, role: editState.role, description: editState.description } : prev)
    } finally {
      setSaving(false)
      setEditMode(false)
      setSuccessOpen(true)
    }
  }

  async function handleDeleteConfirm() {
    setDeleting(true)
    try {
      await fetch(`/api/tests/${id}`, { method: 'DELETE' })
    } catch { /* best effort */ }
    router.push('/dashboard/tests')
  }

  function addQuestion() {
    setEditState(prev => ({
      ...prev,
      questions: [...prev.questions, { text: '', type: 'short_answer' }],
    }))
  }

  function removeQuestion(idx: number) {
    setEditState(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }))
  }

  function updateQuestion(idx: number, text: string) {
    setEditState(prev => {
      const qs = [...prev.questions]
      qs[idx] = { ...qs[idx], text }
      return { ...prev, questions: qs }
    })
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: '#EEF2FF', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #E5E7EB', height: 72, display: 'flex', alignItems: 'center' }}>
          <div style={{ height: 20, width: 200, background: '#D1D5DB', borderRadius: 6 }} />
        </div>
        <div style={{ padding: '24px 32px', display: 'flex', gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ flex: 1, height: 88, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB' }} />
          ))}
        </div>
        <div style={{ flex: 1, margin: '0 32px 32px', background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB' }} />
      </div>
    )
  }

  if (!test) {
    return (
      <div style={{ background: '#EEF2FF', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#0F2A6B', fontSize: 18, fontWeight: 700 }}>Test not found</p>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>This test may have been removed.</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard/tests')}
            style={{ marginTop: 16, background: '#1B4FD8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Back to Tests
          </button>
        </div>
      </div>
    )
  }

  const filteredQuestions = (test.questions ?? []).filter(q => {
    if (activeTab === 'All') return true
    return q.type === TAB_TO_TYPE[activeTab]
  })

  const typeCounts: Record<string, number> = {}
    ; (test.questions ?? []).forEach(q => { typeCounts[q.type] = (typeCounts[q.type] ?? 0) + 1 })

  // ── Edit mode ────────────────────────────────────────────────────────────

  if (editMode) {
    return (
      <div style={{ background: '#EEF2FF', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Edit header */}
        <div style={{ background: '#fff', height: 64, padding: '0 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Tests</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F2A6B' }}>Edit: {test.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={handleDiscard}
              style={{ height: 40, padding: '0 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              Discard changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !editState.name.trim()}
              style={{ height: 40, padding: '0 20px', borderRadius: 8, border: 'none', background: saving ? '#93A9F5' : '#1B4FD8', color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: !editState.name.trim() ? 0.5 : 1 }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Edit body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

            {/* Info card */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={16} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Test information</span>
              </div>
              <div style={{ height: 1, background: '#E2E8F0' }} />
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Test name</label>
                  <input
                    type="text"
                    value={editState.name}
                    onChange={e => setEditState(prev => ({ ...prev, name: e.target.value }))}
                    style={{ height: 40, borderRadius: 8, border: '1px solid #D1D5DB', padding: '0 12px', fontSize: 13, color: '#0F172A', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Role / Position</label>
                  <input
                    type="text"
                    value={editState.role}
                    onChange={e => setEditState(prev => ({ ...prev, role: e.target.value }))}
                    style={{ height: 40, borderRadius: 8, border: '1px solid #D1D5DB', padding: '0 12px', fontSize: 13, color: '#0F172A', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Description</label>
                <textarea
                  value={editState.description}
                  onChange={e => setEditState(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{ borderRadius: 8, border: '1px solid #D1D5DB', padding: 12, fontSize: 13, color: '#0F172A', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                />
              </div>
            </div>

            {/* Questions card */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ height: 44, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <List size={16} color="#1B4FD8" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Questions</span>
                </div>
                <span style={{ background: '#EFF6FF', color: '#1B4FD8', borderRadius: 20, padding: '0 10px', height: 22, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 600 }}>
                  {editState.questions.length} questions
                </span>
              </div>
              <div>
                {editState.questions.map((q, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, height: 58, padding: '0 20px', borderBottom: '1px solid #F1F5F9', background: i % 2 === 1 ? '#FAFAFA' : '#fff' }}
                  >
                    <div style={{ minWidth: 24, height: 24, borderRadius: 12, padding: '0 5px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1B4FD8' }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        type="text"
                        value={q.text}
                        onChange={e => updateQuestion(i, e.target.value)}
                        placeholder="Question text…"
                        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#111827', fontWeight: 500 }}
                      />
                      <TypePill type={q.type} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setAddQuestionOpen(true)}
                  style={{ width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <CirclePlus size={16} color="#1B4FD8" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1B4FD8' }}>Add Question</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right column */}
          <div style={{ width: 296, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Settings card */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 22 }}>
                <Settings2 size={16} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Test settings</span>
              </div>
              <div style={{ height: 1, background: '#E2E8F0' }} />

              {/* Duration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Duration (per question)</label>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setDurationOpen(v => !v)}
                    style={{ width: '100%', height: 40, borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 14, color: '#0F2A6B' }}
                  >
                    <span>{editState.duration}</span>
                    <ChevronDown size={16} color="#94A3B8" />
                  </button>
                  {durationOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 10, overflow: 'hidden' }}>
                      {DURATION_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => { setEditState(prev => ({ ...prev, duration: opt })); setDurationOpen(false) }}
                          style={{ width: '100%', height: 38, padding: '0 12px', background: opt === editState.duration ? '#F0F4FF' : '#fff', border: 'none', cursor: 'pointer', fontSize: 13, color: opt === editState.duration ? '#1B4FD8' : '#0F172A', textAlign: 'left', fontWeight: opt === editState.duration ? 600 : 400 }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pass threshold */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Pass threshold</label>
                <div style={{ height: 40, borderRadius: 8, border: '1px solid #1B4FD8', background: '#fff', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0F2A6B' }}>{editState.pass_threshold}%</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>min passing score</span>
                </div>
              </div>

              <div style={{ height: 1, background: '#F1F5F9' }} />

              {/* Toggles */}
              {([
                { key: 'time_limit', label: 'Time limit', sub: '45 min per candidate' },
                { key: 'randomize', label: 'Randomize order', sub: null },
                { key: 'anti_cheat', label: 'Anti-Cheat mode', sub: null },
              ] as const).map(({ key, label, sub }) => {
                const on = editState[key] as boolean
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</div>
                      {sub && <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditState(prev => ({ ...prev, [key]: !on }))}
                      style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#1B4FD8' : '#CBD5E1', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start', flexShrink: 0, transition: 'background 0.15s' }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff' }} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Status card */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 22 }}>
                <Activity size={16} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>Test Status</span>
              </div>
              <div style={{ height: 1, background: '#E2E8F0' }} />
              {[
                { label: 'Current status', value: <StatusBadge status={test.status} /> },
                { label: 'Candidates invited', value: <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>{test.response_count}</span> },
                { label: 'Completions', value: <span style={{ fontSize: 13, fontWeight: 700, color: '#0F2A6B' }}>{Math.round(test.response_count * (test.completion_rate ?? 80) / 100)} / {test.response_count}</span> },
                { label: 'Created', value: <span style={{ fontSize: 13, fontWeight: 500, color: '#0F2A6B' }}>{formatDate(test.created_at)}</span> },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
                  {value}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Save success modal */}
        <SaveSuccessModal
          open={successOpen}
          onViewDetails={() => { setSuccessOpen(false) }}
          onBackToDashboard={() => { setSuccessOpen(false); router.push('/dashboard') }}
        />

        {/* Add question modal */}
        <AddQuestionModal
          open={addQuestionOpen}
          onClose={() => setAddQuestionOpen(false)}
          onAdd={q => setEditState(prev => ({ ...prev, questions: [...prev.questions, q] }))}
        />
      </div>
    )
  }

  // ── View mode ────────────────────────────────────────────────────────────

  return (
    <div style={{ background: '#EEF2FF', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Detail header */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F2A6B', lineHeight: 1.3 }}>{test.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#6B7280', fontSize: 12 }}>{test.role}</span>
            <span style={{ color: '#9CA3AF', fontSize: 12 }}>·</span>
            <span style={{ color: '#6B7280', fontSize: 12 }}>Created {formatDate(test.created_at)}</span>
            <StatusBadge status={test.status} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            <Share2 size={15} color="#374151" />
            Share
          </button>
          <button
            type="button"
            onClick={handleStartEdit}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 8, border: 'none', background: '#1B4FD8', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            <Pencil size={15} color="#fff" />
            Edit test
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '20px 32px', display: 'flex', gap: 16, flexShrink: 0 }}>
        {[
          {
            icon: <Users size={16} color="#6B7280" />,
            label: 'Total Candidates',
            value: test.response_count,
            sub: `${Math.round(test.response_count * 0.25)} completed this week`,
            valueColor: '#0F2A6B',
          },
          {
            icon: <TrendingUp size={16} color="#6B7280" />,
            label: 'Avg Score',
            value: `${test.avg_score ?? 72}%`,
            sub: '+4% vs last test',
            valueColor: '#059669',
          },
          {
            icon: <CheckCircle2 size={16} color="#6B7280" />,
            label: 'Completion Rate',
            value: `${test.completion_rate ?? 84}%`,
            sub: `${Math.round(test.response_count * (test.completion_rate ?? 84) / 100)} of ${test.response_count} candidates`,
            valueColor: '#1B4FD8',
          },
          {
            icon: <FileText size={16} color="#6B7280" />,
            label: 'Questions',
            value: test.questions?.length ?? 0,
            sub: `4 types · avg 3 min`,
            valueColor: '#0F2A6B',
          },
        ].map(({ icon, label, value, sub, valueColor }) => (
          <div
            key={label}
            style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {icon}
              <span style={{ fontSize: 12, color: '#6B7280' }}>{label}</span>
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: valueColor, lineHeight: 1.2 }}>{value}</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* Questions section */}
      <div style={{ flex: 1, margin: '0 32px 32px', background: '#fff', borderRadius: 10, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Questions header */}
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#0F2A6B' }}>Questions</span>
            <span style={{ background: '#EEF2FF', color: '#1B4FD8', borderRadius: 12, padding: '4px 10px', fontSize: 12, fontWeight: 500 }}>
              {test.questions?.length ?? 0} questions
            </span>
          </div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {FILTER_TABS.map(tab => {
              const isActive = activeTab === tab
              const count = tab === 'All' ? (test.questions?.length ?? 0) : (typeCounts[TAB_TO_TYPE[tab]] ?? 0)
              if (tab !== 'All' && count === 0) return null
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: isActive ? '#1B4FD8' : '#F3F4F6',
                    color: isActive ? '#fff' : '#6B7280',
                    fontSize: 12, fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredQuestions.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
              No questions in this category.
            </div>
          ) : (
            filteredQuestions.map((q, i) => (
              <div
                key={q.id ?? i}
                style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #F3F4F6', background: i % 2 === 2 ? '#FAFAFA' : '#fff' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ minWidth: 24, height: 24, borderRadius: 12, padding: '0 5px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1B4FD8' }}>{i + 1}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{q.text}</span>
                    <TypePill type={q.type} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete button (floating footer area) */}
      <div style={{ padding: '0 32px 20px', display: 'flex', gap: 10, flexShrink: 0, marginTop: -12 }}>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 8, border: '1px solid #FCA5A5', background: '#fff', color: '#EF4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          <Trash2 size={14} />
          Delete test
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          <Eye size={14} />
          View responses
        </button>
      </div>

      {/* Share modal */}
      {isDesktop ? (
        <Dialog open={shareOpen} onOpenChange={setShareOpen}>
          <DialogContent showCloseButton={false} className="p-0 gap-0 w-[480px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden ring-0">
            <ShareModalContent
              shareableLink={shareableLink}
              copied={copied}
              onCopy={handleCopyLink}
              onClose={() => setShareOpen(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={shareOpen} onOpenChange={setShareOpen}>
          <DrawerContent>
            <div className="pb-safe">
              <ShareModalContent
                shareableLink={shareableLink}
                copied={copied}
                onCopy={handleCopyLink}
                onClose={() => setShareOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onOpenChange={open => { if (!open) setDeleteOpen(false) }}>
        <DialogContent className="max-w-sm">
          <div style={{ padding: '8px 0' }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F2A6B', margin: '0 0 8px' }}>Delete this test?</p>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
              This action cannot be undone. All candidate responses will be permanently removed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                style={{ height: 40, padding: '0 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                style={{ height: 40, padding: '0 16px', borderRadius: 8, border: 'none', background: '#EF4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? 'Deleting…' : 'Delete test'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

// ─── Share modal ───────────────────────────────────────────────────────────

function ShareModalContent({
  shareableLink,
  copied,
  onCopy,
  onClose,
}: {
  shareableLink: string
  copied: boolean
  onCopy: () => void
  onClose: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ height: 60, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Share2 size={20} color="#1B4FD8" />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#0F2A6B' }}>Share test</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: 8, background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={16} color="#6B7280" />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>
          Share this assessment link with your candidates. Anyone with the link can access the test.
        </p>

        {/* Link section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Assessment link</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: '0 12px' }}>
            <Link size={16} color="#1B4FD8" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#1B4FD8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareableLink}
            </span>
            <button
              type="button"
              onClick={onCopy}
              style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 6, border: 'none', background: copied ? '#16A34A' : '#1B4FD8', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>or share via</span>
          <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        </div>

        {/* Share options */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: <Mail size={16} color="#374151" />, label: 'Email', onClick: () => window.open(`mailto:?subject=Test%20Invitation&body=${encodeURIComponent(`Complete your assessment at ${shareableLink}`)}`) },
            { icon: <MessageSquare size={16} color="#374151" />, label: 'Slack', onClick: () => { } },
            { icon: <QrCode size={16} color="#374151" />, label: 'QR Code', onClick: () => { } },
          ].map(({ icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Timer size={14} color="#9CA3AF" />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Link active · No expiration</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ height: 36, padding: '0 20px', borderRadius: 8, border: 'none', background: '#1B4FD8', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Save success modal ───────────────────────────────────────────────────

function SaveSuccessModal({
  open,
  onViewDetails,
  onBackToDashboard,
}: {
  open: boolean
  onViewDetails: () => void
  onBackToDashboard: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onViewDetails() }}>
      <DialogContent className="p-0 gap-0 max-w-[480px] rounded-2xl overflow-hidden">
        {/* Top section */}
        <div style={{ padding: '40px 40px 28px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'stretch' }}>
          {/* Icon + text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pencil size={32} color="#1B4FD8" />
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F2A6B' }}>Changes saved!</h2>
              <p style={{ margin: 0, fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>
                Your test has been updated successfully. All changes are now live and candidates will see the latest version.
              </p>
            </div>
          </div>

          {/* Info row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: 14 }}>
            <Info size={16} color="#1B4FD8" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
              Candidates currently taking the test will see changes on their next session refresh.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#E2E8F0' }} />

        {/* Actions */}
        <div style={{ padding: '20px 32px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            onClick={onViewDetails}
            style={{ height: 48, borderRadius: 10, border: 'none', background: '#1B4FD8', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Eye size={18} />
            View test details
          </button>
          <button
            type="button"
            onClick={onBackToDashboard}
            style={{ height: 44, borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            Back to dashboard
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Add Question Modal ────────────────────────────────────────────────────────

const AQ_TYPES: { type: Question['type']; Icon: React.ElementType; label: string; sub: string }[] = [
  { type: 'multiple_choice', Icon: List, label: 'Multiple choice', sub: 'Options to select from' },
  { type: 'short_answer', Icon: AlignLeft, label: 'Short answer', sub: 'Free text response' },
  { type: 'video', Icon: Video, label: 'Video response', sub: 'Record a video answer' },
  { type: 'ranking', Icon: List, label: 'Ranking', sub: 'Order items by priority' },
]

function AddQuestionModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (q: Question) => void
}) {
  const [qType, setQType] = useState<Question['type']>('multiple_choice')
  const [text, setText] = useState('')
  const [options, setOptions] = useState(['', '', ''])
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [rankItems, setRankItems] = useState(['', '', ''])

  function reset() {
    setQType('multiple_choice')
    setText('')
    setOptions(['', '', ''])
    setAllowMultiple(false)
    setRankItems(['', '', ''])
  }

  function handleClose() { reset(); onClose() }

  function handleAdd() {
    if (!text.trim()) return
    onAdd({ text: text.trim(), type: qType })
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose() }}>
      <DialogContent showCloseButton={false} className="p-0 gap-0 w-[640px] h-[660px] max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden ring-0 flex flex-col">

        {/* Header — 64px, padding [0,24] */}
        <div style={{ flexShrink: 0, height: 64, padding: '50px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0F2A6B' }}>Add question</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>Define the type, text and settings for your new question</span>
          </div>
          <button type="button" onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 6, background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* type-section — padding [16,24], gap 10 */}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Question type</span>
            <div style={{ display: 'flex', gap: 10 }}>
              {AQ_TYPES.map(({ type, Icon, label, sub }) => {
                const sel = qType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setQType(type)}
                    style={{ flex: 1, padding: 12, borderRadius: 8, border: sel ? '2px solid #1B4FD8' : '1px solid #E5E7EB', background: sel ? '#EEF2FF' : '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', textAlign: 'left' }}
                  >
                    <Icon size={20} color={sel ? '#1B4FD8' : '#6B7280'} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: sel ? '#1B4FD8' : '#374151' }}>{label}</span>
                    <span style={{ fontSize: 11, color: sel ? '#6366F1' : '#9CA3AF' }}>{sub}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* question-section — padding [0,24,16,24], gap 8 */}
          <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Question</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Required</span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. Which of the following best describes your management style?"
              style={{ width: '100%', height: 84, padding: 12, borderRadius: 8, border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: 14, color: '#111827', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.5' }}
            />
          </div>

          {/* mc-specific — padding [0,24,16,24], gap 10 */}
          {qType === 'multiple_choice' && (
            <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Answer Options</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Min. 2 options</span>
              </div>
              {options.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #D1D5DB', background: '#fff', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 36, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={e => setOptions(prev => prev.map((o, i) => i === idx ? e.target.value : o))}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#374151', width: '100%' }}
                    />
                  </div>
                  <X size={16} color="#D1D5DB" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => options.length > 2 && setOptions(prev => prev.filter((_, i) => i !== idx))} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setOptions(prev => [...prev, ''])}>
                <Plus size={14} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1B4FD8' }}>Add option</span>
              </div>
              {/* divider */}
              <div style={{ height: 1, background: '#E5E7EB' }} />
              {/* toggle row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Allow multiple selections</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Candidates can choose more than one answer</span>
                </div>
                <button type="button" onClick={() => setAllowMultiple(v => !v)} style={{ width: 40, height: 22, borderRadius: 11, background: allowMultiple ? '#1B4FD8' : '#D1D5DB', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', justifyContent: allowMultiple ? 'flex-end' : 'flex-start', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
                </button>
              </div>
            </div>
          )}

          {/* ranking-specific — padding [0,24,16,24], gap 10 */}
          {qType === 'ranking' && (
            <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Items to Rank</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Min. 2 items</span>
              </div>
              {rankItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: '#F3F4F6', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{idx + 1}</span>
                  </div>
                  <div style={{ flex: 1, height: 36, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={`Item ${idx + 1}`}
                      value={item}
                      onChange={e => setRankItems(prev => prev.map((v, i) => i === idx ? e.target.value : v))}
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#374151', width: '100%' }}
                    />
                  </div>
                  <X size={16} color="#D1D5DB" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => rankItems.length > 2 && setRankItems(prev => prev.filter((_, i) => i !== idx))} />
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setRankItems(prev => [...prev, ''])}>
                <Plus size={14} color="#1B4FD8" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1B4FD8' }}>Add item</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer — 64px, padding [0,24] */}
        <div style={{ flexShrink: 0, height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <button type="button" onClick={handleClose} style={{ padding: '7px 14px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
            Cancel
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid #1B4FD8', background: '#fff', color: '#1B4FD8', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <Eye size={14} color="#1B4FD8" />
              Preview
            </button>
            <button type="button" onClick={handleAdd} disabled={!text.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: text.trim() ? '#1B4FD8' : '#E2E8F0', color: text.trim() ? '#fff' : '#94A3B8', fontSize: 13, fontWeight: 600, cursor: text.trim() ? 'pointer' : 'default' }}>
              <Plus size={14} color={text.trim() ? '#fff' : '#94A3B8'} />
              Add question
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
