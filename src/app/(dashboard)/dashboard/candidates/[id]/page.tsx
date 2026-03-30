'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, ChevronRight, Plus, Send } from 'lucide-react'
import { toast } from 'sonner'
import { CalendarModal } from '@/components/modals/CalendarModal'

const REQUIRED_SCORE = 78

interface CandidateDetail {
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
  email: string
  phone: string
  company: string
  job_title: string
  logic_score: number
  comms_score: number
  job_skill_score: number
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function StatusBadge({ status }: { status: 'passed' | 'failed' | 'pending' }) {
  if (status === 'passed') {
    return (
      <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', height: 22, borderRadius: 11, padding: '0 10px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
        Reviewed
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', height: 22, borderRadius: 11, padding: '0 10px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
        Failed
      </span>
    )
  }
  return (
    <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', height: 22, borderRadius: 11, padding: '0 10px', fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
      Pending
    </span>
  )
}

const PIPELINE_STAGES = ['Applied', 'Screened', 'Technical', 'Interview', 'Offer']

interface RecruiterNote {
  author: string
  date: string
  text: string
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [stageIndex, setStageIndex] = useState(2)
  const [stageEnteredDate, setStageEnteredDate] = useState<string | null>(null)

  // Recruiter notes
  const [notes, setNotes] = useState<RecruiterNote[]>([
    { author: 'Anna Corp', date: 'Mar 14', text: 'Strong technical profile. Recommend advancing to interview stage.' },
  ])
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleAddNote() {
    const trimmed = noteText.trim()
    if (!trimmed) return
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setNotes(prev => [...prev, { author: 'You', date: today, text: trimmed }])
    setNoteText('')
    setAddingNote(false)
  }

  function handleInterviewConfirmed(date: string, time: string) {
    setStageIndex(prev => Math.min(prev + 1, PIPELINE_STAGES.length - 1))
    const d = new Date(`${date}T${time}`)
    const formatted =
      d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setStageEnteredDate(
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    )
    toast.success('Interview invitation sent', {
      description: `${candidate?.full_name} will receive an email confirming the interview on ${formatted}.`,
      duration: 6000,
    })
  }

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true)
      try {
        const res = await fetch(`/api/candidates/${id}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (res.ok) {
          const data = await res.json()
          setCandidate(data)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCandidate()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col p-8 gap-6">
        <div style={{ height: 20, width: 160, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        <div style={{ height: 96, backgroundColor: '#E2E8F0', borderRadius: 12 }} />
        <div style={{ display: 'flex', gap: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ height: 160, backgroundColor: '#E2E8F0', borderRadius: 12 }} />
              <div style={{ height: 120, backgroundColor: '#E2E8F0', borderRadius: 12 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !candidate) {
    return (
      <div className="flex flex-col p-8 gap-6">
        <button
          type="button"
          onClick={() => router.push('/dashboard/candidates')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={16} color="#1B4FD8" />
          <span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 400 }}>Back to candidates</span>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 64, paddingBottom: 64, gap: 8 }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Candidate not found</p>
          <p style={{ fontSize: 14, color: '#64748B' }}>This candidate may have been removed or the link is incorrect.</p>
        </div>
      </div>
    )
  }

  const logicPct = Math.min(100, Math.max(0, candidate.logic_score))
  const commsPct = Math.min(100, Math.max(0, candidate.comms_score))
  const jobPct = Math.min(100, Math.max(0, candidate.job_skill_score))
  const isPassing = candidate.crima_score >= REQUIRED_SCORE

  return (
    <div className="flex flex-col p-8 gap-6">

      {/* 1. Back link */}
      <button
        type="button"
        onClick={() => router.push('/dashboard/candidates')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 'fit-content' }}
      >
        <ArrowLeft size={16} color="#1B4FD8" />
        <span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 400 }}>Back to candidates</span>
      </button>

      {/* 2. Header card */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Avatar */}
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: candidate.avatar_color || '#3B6FE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{candidate.avatar_initials}</span>
        </div>
        {/* Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#0F172A', fontSize: 20, fontWeight: 700 }}>{candidate.full_name}</span>
          <span style={{ color: '#475569', fontSize: 14 }}>{candidate.role}</span>
          <a href={`mailto:${candidate.email}`} style={{ color: '#1B4FD8', fontSize: 14, textDecoration: 'none' }}>{candidate.email}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#64748B', fontSize: 12 }}>Tested: {formatDate(candidate.test_date)}</span>
            <StatusBadge status={candidate.status} />
          </div>
        </div>
      </div>

      {/* 3. Three-column layout */}
      <div style={{ display: 'flex', gap: 24 }}>

        {/* Left column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* A. CrismaScore card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {/* Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#EEF2FF', border: '8px solid #1B4FD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#0F2A6B', fontSize: 28, fontWeight: 700 }}>{candidate.crima_score}</span>
                </div>
                <span style={{ color: '#64748B', fontSize: 13 }}>CrismaScore</span>
              </div>
              {/* Sub-scores */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Logic', value: logicPct },
                  { label: 'Communication', value: commsPct },
                  { label: 'Job Skills', value: jobPct },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569', fontSize: 12 }}>{label}</span>
                      <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600 }}>{value}%</span>
                    </div>
                    <div style={{ backgroundColor: '#E2E8F0', borderRadius: 3, height: 6, flex: 1 }}>
                      <div style={{ backgroundColor: '#1B4FD8', borderRadius: 3, height: 6, width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. Role fit card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Role fit</span>
            <span style={{ color: '#64748B', fontSize: 12 }}>Senior Backend Engineer</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Required</span>
                <span style={{ color: '#475569', fontSize: 14, fontWeight: 600 }}>≥ {REQUIRED_SCORE}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Candidate</span>
                <span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 700 }}>{candidate.crima_score}</span>
              </div>
              {isPassing ? (
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: 10, height: 24, padding: '0 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>PASS</span>
              ) : (
                <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 10, height: 24, padding: '0 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>FAIL</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <TrendingUp size={14} color="#6366F1" />
              <span style={{ color: '#6366F1', fontSize: 12 }}>Top 12% of all applicants this month</span>
            </div>
          </div>

        </div>

        {/* Center column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* A. Test timeline card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Test timeline</span>
            {[
              'Logic module — 09:02',
              'Communication module — 09:18',
              'Job skills module — 09:34',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B4FD8', flexShrink: 0 }} />
                <span style={{ color: '#475569', fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* B. Video preview card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Video preview</span>
            <div style={{ backgroundColor: '#0F172A', borderRadius: 8, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center' }}>[Video player — mocked preview]</span>
            </div>
          </div>

          {/* C. Pipeline card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Hiring pipeline</span>
            <span style={{ color: '#6366F1', fontSize: 12, fontWeight: 500 }}>Current stage: {PIPELINE_STAGES[stageIndex]}</span>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {PIPELINE_STAGES.map((stage, i) => {
                const isCompleted = i < stageIndex
                const isCurrent = i === stageIndex
                const isFuture = i > stageIndex
                return (
                  <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: isCompleted ? '#1B4FD8' : isCurrent ? '#EEF2FF' : '#F1F5F9',
                        border: isCurrent ? '2px solid #1B4FD8' : isFuture ? '1px solid #CBD5E1' : 'none',
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 10,
                        fontWeight: isCompleted ? 600 : isCurrent ? 700 : 400,
                        color: isCompleted ? '#1B4FD8' : isCurrent ? '#1B4FD8' : '#94A3B8',
                        whiteSpace: 'nowrap',
                      }}>
                        {stage}
                      </span>
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <ChevronRight size={12} color={i < stageIndex ? '#1B4FD8' : '#94A3B8'} style={{ marginBottom: 14, flexShrink: 0 }} />
                    )}
                  </div>
                )
              })}
            </div>
            {stageEnteredDate && (
              <span style={{ color: '#94A3B8', fontSize: 11 }}>Interview scheduled: {stageEnteredDate}</span>
            )}
          </div>

        </div>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* A. Anti-Fraud flags card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Anti-Fraud flags</span>
            {[
              { level: 'Low', bg: '#D1FAE5', color: '#065F46', text: 'Tab switch detected once' },
              { level: 'Medium', bg: '#FEF3C7', color: '#92400E', text: 'Copy-paste attempted' },
              { level: 'High', bg: '#FEE2E2', color: '#991B1B', text: 'Face not detected (2s)' },
            ].map(flag => (
              <div key={flag.level} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ backgroundColor: flag.bg, color: flag.color, borderRadius: 10, height: 20, padding: '0 8px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                  {flag.level}
                </span>
                <span style={{ color: '#475569', fontSize: 12 }}>{flag.text}</span>
              </div>
            ))}
          </div>

          {/* B. AI Insights card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>AI Insights</span>
            {[
              'Strong logical reasoning — consider for analytical roles',
              'Interview recommended: probe communication clarity',
              'Pace below average — not disqualifying for this role',
            ].map(insight => (
              <div key={insight} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6366F1', flexShrink: 0, marginTop: 3 }} />
                <span style={{ color: '#475569', fontSize: 12 }}>{insight}</span>
              </div>
            ))}
          </div>

          {/* C. Recruiter notes card */}
          <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: '#0F172A', fontSize: 15, fontWeight: 600 }}>Recruiter notes</span>

            {/* Existing notes */}
            {notes.map((note, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600 }}>{note.author}</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ color: '#94A3B8', fontSize: 11 }}>{note.date}</span>
                </div>
                <span style={{ color: '#475569', fontSize: 12 }}>{note.text}</span>
              </div>
            ))}

            {/* Add note input */}
            {addingNote ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  ref={textareaRef}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write your note here..."
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #C7D2FE',
                    padding: '10px 12px',
                    fontSize: 13,
                    color: '#0F172A',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setAddingNote(false); setNoteText('') }
                  }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setAddingNote(false); setNoteText('') }}
                    style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    style={{
                      background: noteText.trim() ? '#1B4FD8' : '#94A3B8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: noteText.trim() ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Send size={12} color="#fff" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingNote(true)}
                style={{ backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <Plus size={14} color="#94A3B8" />
                <span style={{ color: '#94A3B8', fontSize: 13 }}>Add a note...</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. Actions row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          style={{ backgroundColor: '#1B4FD8', color: 'white', borderRadius: 8, height: 40, padding: '0 20px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Invite to interview
        </button>
      </div>

      <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} onConfirm={handleInterviewConfirmed} />
    </div>
  )
}
