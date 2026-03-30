'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Mail, Phone, ShieldCheck, ShieldAlert } from 'lucide-react'
import { ContactModal } from '@/components/modals/ContactModal'

interface CandidateDetail {
  id: string
  full_name: string
  role: string
  avatar_initials: string
  avatar_color: string
  crima_score: number
  trust_score: number
  fraud_flag_count: number
  status: string
  test_date: string
  email: string
  phone: string
  company: string
  logic_score: number
}

interface TestCard {
  title: string
  meta: string
  crimaScore: number
  logicScore: number
  trustScore: number
  fraudStatus: 'clean' | 'flagged'
  fraudText: string
  fraudCount: number
}

function clamp(val: number): number {
  return Math.min(100, Math.max(0, val))
}

function formatAdded(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function buildTestCards(c: CandidateDetail): TestCard[] {
  const added = formatAdded(c.test_date)
  return [
    {
      title: 'Cognitive Assessment',
      meta: `${c.role}  ·  ${added}  ·  42 min  ·  3 interviews`,
      crimaScore: c.crima_score,
      logicScore: c.logic_score,
      trustScore: c.trust_score,
      fraudStatus: 'clean',
      fraudText: 'No Issues Detected',
      fraudCount: 0,
    },
    {
      title: 'Technical Skills',
      meta: `${c.role}  ·  ${added}  ·  38 min  ·  2 interviews`,
      crimaScore: clamp(c.crima_score - 13),
      logicScore: clamp(c.logic_score - 11),
      trustScore: clamp(c.trust_score - 16),
      fraudStatus: c.fraud_flag_count > 0 ? 'flagged' : 'clean',
      fraudText: c.fraud_flag_count > 0 ? `${c.fraud_flag_count} Flags Raised` : 'No Issues Detected',
      fraudCount: c.fraud_flag_count,
    },
    {
      title: 'Leadership Potential',
      meta: `${c.role}  ·  ${added}  ·  55 min  ·  4 interviews`,
      crimaScore: clamp(c.crima_score + 5),
      logicScore: clamp(c.logic_score - 6),
      trustScore: clamp(c.trust_score + 15),
      fraudStatus: 'clean',
      fraudText: 'No Issues Detected',
      fraudCount: 0,
    },
  ]
}

function TestResultCard({ card }: { card: TestCard }) {
  const isFlagged = card.fraudStatus === 'flagged'
  return (
    <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <span style={{ color: '#0F2A6B', fontSize: 14, fontWeight: 700 }}>{card.title}</span>
        <span style={{ backgroundColor: '#ECFDF5', color: '#16A34A', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>
          Completed
        </span>
      </div>

      {/* Meta */}
      <div style={{ padding: '0 20px 14px 20px' }}>
        <span style={{ color: '#6B7280', fontSize: 12 }}>{card.meta}</span>
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: '#F3F4F6', height: 1 }} />

      {/* Score row */}
      <div style={{ display: 'flex' }}>
        {[
          { label: 'CrismaScore', value: card.crimaScore, color: '#1B4FD8', borderRight: true },
          { label: 'Logic Score', value: card.logicScore, color: '#6366F1', borderRight: true },
          { label: 'Trust Score', value: card.trustScore, color: '#1B4FD8', borderRight: false },
        ].map(col => (
          <div
            key={col.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '14px 0',
              borderRight: col.borderRight ? '1px solid #E5E7EB' : 'none',
            }}
          >
            <span style={{ color: col.color, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{col.value}</span>
            <span style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 500 }}>{col.label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: '#F3F4F6', height: 1 }} />

      {/* Anti-fraud row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          backgroundColor: isFlagged ? '#FFFBEB' : '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isFlagged
            ? <ShieldAlert size={14} color="#F59E0B" />
            : <ShieldCheck size={14} color="#9CA3AF" />
          }
          <span style={{ color: '#6B7280', fontSize: 12, fontWeight: 500 }}>Anti-Fraud Analysis</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            backgroundColor: isFlagged ? '#FEF3C7' : '#ECFDF5',
            borderRadius: 20,
            padding: '4px 12px',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isFlagged ? '#F59E0B' : '#22C55E' }} />
          <span style={{ color: isFlagged ? '#92400E' : '#16A34A', fontSize: 11, fontWeight: 600 }}>
            {card.fraudText}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function TalentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    async function fetchCandidate() {
      setLoading(true)
      try {
        const res = await fetch(`/api/candidates/${id}`)
        if (res.status === 404) { setNotFound(true); return }
        if (res.ok) setCandidate(await res.json())
        else setNotFound(true)
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
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ height: 20, width: 160, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        <div style={{ height: 173, backgroundColor: '#E2E8F0', borderRadius: 12 }} />
        <div style={{ display: 'flex', gap: 16 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 220, backgroundColor: '#E2E8F0', borderRadius: 12 }} />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !candidate) {
    return (
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/talent-pool')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 'fit-content' }}
        >
          <ArrowLeft size={16} color="#1B4FD8" />
          <span style={{ color: '#1B4FD8', fontSize: 14 }}>Back to candidates</span>
        </button>
        <p style={{ color: '#0F172A', fontSize: 16, fontWeight: 600 }}>Candidate not found</p>
      </div>
    )
  }

  const testCards = buildTestCards(candidate)
  const addedDate = formatAdded(candidate.test_date)

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/talent-pool')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={16} color="#1B4FD8" />
          <span style={{ color: '#1B4FD8', fontSize: 14 }}>Back to candidates</span>
        </button>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#1B4FD8',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Send size={15} color="#FFFFFF" />
          Contact
        </button>
      </div>

      {/* Profile card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        {/* Avatar column */}
        <div style={{ width: 110, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{
            width: 75,
            height: 73,
            borderRadius: 40,
            backgroundColor: candidate.avatar_color || '#3B6FE8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>{candidate.avatar_initials}</span>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            backgroundColor: '#F0FDF4',
            borderRadius: 20,
            padding: '5px 12px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }} />
            <span style={{ color: '#16A34A', fontSize: 12, fontWeight: 500 }}>Active</span>
          </div>
          <span style={{ color: '#9CA3AF', fontSize: 11 }}>Added {addedDate}</span>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 130, backgroundColor: '#F3F4F6', flexShrink: 0 }} />

        {/* Info column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#0F2A6B', fontSize: 20, fontWeight: 700 }}>{candidate.full_name}</span>

          {/* Role + company badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ backgroundColor: '#EEF2FF', borderRadius: 6, padding: '4px 10px' }}>
              <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600 }}>{candidate.role}</span>
            </div>
            {candidate.company && (
              <div style={{ backgroundColor: '#F3F4F6', borderRadius: 6, padding: '4px 10px' }}>
                <span style={{ color: '#374151', fontSize: 12 }}>{candidate.company}</span>
              </div>
            )}
          </div>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {candidate.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} color="#9CA3AF" />
                <span style={{ color: '#4B5563', fontSize: 13 }}>{candidate.email}</span>
              </div>
            )}
            {candidate.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} color="#9CA3AF" />
                <span style={{ color: '#4B5563', fontSize: 13 }}>{candidate.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Results section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#0F2A6B', fontSize: 16, fontWeight: 700 }}>Test Results</span>
          <div style={{ backgroundColor: '#EEF2FF', borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600 }}>3 tests taken</span>
          </div>
        </div>

        {/* Cards row */}
        <div style={{ display: 'flex', gap: 16 }}>
          {testCards.map(card => (
            <TestResultCard key={card.title} card={card} />
          ))}
        </div>
      </div>

      {/* Contact modal */}
      <ContactModal
        open={contactOpen}
        onOpenChange={open => setContactOpen(open)}
        candidateName={candidate.full_name}
        candidateEmail={candidate.email}
      />
    </div>
  )
}
