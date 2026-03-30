'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { CircleCheck, ExternalLink } from 'lucide-react'

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
  phone?: string
  company?: string
  job_title?: string
  logic_score: number
  comms_score: number
  job_skill_score: number
}

function fraudBadge(severity: 'none' | 'low' | 'medium' | 'high'): { label: string; bg: string; color: string } {
  if (severity === 'none' || severity === 'low') return { label: 'Low Risk', bg: '#D1FAE5', color: '#065F46' }
  if (severity === 'medium') return { label: 'Medium Risk', bg: '#FEF3C7', color: '#92400E' }
  return { label: 'High Risk', bg: '#FEE2E2', color: '#991B1B' }
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: 44 }}>
      <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <div style={{ height: 12, width: 80, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
      </div>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ flex: 1, backgroundColor: i === 0 ? '#EEF2FF' : 'white', borderBottom: '1px solid #E2E8F0', borderRight: i < 2 ? '1px solid #E2E8F0' : undefined, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: 12, width: 60, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        </div>
      ))}
    </div>
  )
}

function ComparePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? []

  const [candidates, setCandidates] = useState<CandidateDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ids.length === 0) return

    setLoading(true)
    setError(null)

    Promise.all(
      ids.map(id =>
        fetch('/api/candidates/' + id).then(r => {
          if (!r.ok) throw new Error('Failed to fetch candidate ' + id)
          return r.json() as Promise<CandidateDetail>
        })
      )
    )
      .then(data => {
        const sorted = [...data].sort((a, b) => b.crima_score - a.crima_score)
        setCandidates(sorted)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('ids')])

  // No ids state
  if (ids.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: 32, gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: 80, paddingBottom: 80, gap: 16 }}>
          <p style={{ color: '#475569', fontSize: 16 }}>{t('dashboard.comparePage.noSelected')}</p>
          <button
            type="button"
            onClick={() => router.push('/dashboard/candidates')}
            style={{ backgroundColor: '#1B4FD8', color: 'white', borderRadius: 8, height: 40, padding: '0 16px', fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            {t('dashboard.comparePage.backToCandidates')}
          </button>
        </div>
      </div>
    )
  }

  // Determine positional slots (C1, C2, C3) — already sorted by crima_score desc
  const c1 = candidates[0] ?? null
  const c2 = candidates[1] ?? null
  const c3 = candidates[2] ?? null

  const pipelineStageLabel = (idx: number) => {
    if (idx === 0) return { label: 'Technical', color: '#1B4FD8', fontWeight: 600 }
    if (idx === 1) return { label: 'Screened', color: '#475569', fontWeight: 400 }
    return { label: 'Applied', color: '#94A3B8', fontWeight: 400 }
  }

  const aiVerdictLabel = (idx: number) => {
    if (idx === 0) return { label: 'Advance to Interview', color: '#6366F1', fontWeight: 600 }
    if (idx === 1) return { label: 'Further screening', color: '#92400E', fontWeight: 400 }
    return { label: 'On Hold', color: '#94A3B8', fontWeight: 400 }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 32, gap: 24 }}>

      {/* Header */}
      <div style={{ height: 48, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#0F2A6B', fontSize: 24, fontWeight: 700 }}>{t('dashboard.comparePage.title')}</span>
        <button
          type="button"
          style={{ border: '1px solid #1B4FD8', color: '#1B4FD8', borderRadius: 8, height: 40, padding: '0 16px', fontSize: 14, fontWeight: 400, backgroundColor: 'transparent', cursor: 'pointer' }}
        >
          {t('dashboard.comparePage.exportReport')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: 16, borderRadius: 8, backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Comparison table */}
      <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {loading ? (
          <>
            {/* Loading header placeholder */}
            <div style={{ display: 'flex', flexDirection: 'row', height: 88, borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0' }} />
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex: 1, backgroundColor: i === 0 ? '#EEF2FF' : 'white', borderRight: i < 2 ? '1px solid #E2E8F0' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ height: 14, width: 100, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
                </div>
              ))}
            </div>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            {/* Header row */}
            <div style={{ height: 88, display: 'flex', flexDirection: 'row' }}>
              {/* Label cell */}
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500 }}>{t('dashboard.comparePage.candidatesCount', { count: candidates.length })}</span>
              </div>

              {/* C1 cell */}
              {c1 ? (
                <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderTop: '2px solid #C7D2FE', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ backgroundColor: '#6366F1', color: 'white', borderRadius: 10, height: 20, padding: '0 8px', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>{t('dashboard.comparePage.bestFit')}</span>
                  <span style={{ color: '#0F2A6B', fontSize: 14, fontWeight: 700 }}>{c1.full_name}</span>
                  <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 500 }}>{c1.role} · {c1.crima_score} / 100</span>
                </div>
              ) : (
                <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }} />
              )}

              {/* C2 cell */}
              {c2 ? (
                <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ color: '#0F2A6B', fontSize: 14, fontWeight: 700 }}>{c2.full_name}</span>
                  <span style={{ color: '#64748B', fontSize: 12 }}>{c2.role} · {c2.crima_score} / 100</span>
                </div>
              ) : (
                <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }} />
              )}

              {/* C3 cell */}
              {c3 ? (
                <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ color: '#0F2A6B', fontSize: 14, fontWeight: 700 }}>{c3.full_name}</span>
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>{c3.role} · {c3.crima_score} / 100</span>
                </div>
              ) : (
                <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0' }} />
              )}
            </div>

            {/* CrismaScore row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{t('dashboard.comparePage.table.crimaScore')}</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {c1 && <><span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 700 }}>{c1.crima_score}</span><CircleCheck size={16} color="#6366F1" /></>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: '#475569', fontSize: 14 }}>{c2.crima_score}</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: '#94A3B8', fontSize: 14 }}>{c3.crima_score}</span>}
              </div>
            </div>

            {/* Logic row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{t('dashboard.comparePage.table.logic')}</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {c1 && <><span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 700 }}>{c1.logic_score}%</span><CircleCheck size={16} color="#6366F1" /></>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: '#475569', fontSize: 14 }}>{c2.logic_score}%</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: '#94A3B8', fontSize: 14 }}>{c3.logic_score}%</span>}
              </div>
            </div>

            {/* Communication row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{t('dashboard.comparePage.table.communication')}</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {c1 && <><span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 700 }}>{c1.comms_score}%</span><CircleCheck size={16} color="#6366F1" /></>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: '#475569', fontSize: 14 }}>{c2.comms_score}%</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: '#94A3B8', fontSize: 14 }}>{c3.comms_score}%</span>}
              </div>
            </div>

            {/* Job skills row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>{t('dashboard.comparePage.table.jobSkills')}</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                {c1 && <><span style={{ color: '#1B4FD8', fontSize: 14, fontWeight: 700 }}>{c1.job_skill_score}%</span><CircleCheck size={16} color="#6366F1" /></>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: '#475569', fontSize: 14 }}>{c2.job_skill_score}%</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: '#94A3B8', fontSize: 14 }}>{c3.job_skill_score}%</span>}
              </div>
            </div>

            {/* Anti-Fraud risk row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>Anti-Fraud risk</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c1 && (() => {
                  const b = fraudBadge(c1.fraud_flag_severity)
                  return (
                    <span style={{ backgroundColor: b.bg, color: b.color, borderRadius: 10, height: 20, padding: '0 8px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>{b.label}</span>
                  )
                })()}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && (() => {
                  const b = fraudBadge(c2.fraud_flag_severity)
                  return (
                    <span style={{ backgroundColor: b.bg, color: b.color, borderRadius: 10, height: 20, padding: '0 8px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>{b.label}</span>
                  )
                })()}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && (() => {
                  const b = fraudBadge(c3.fraud_flag_severity)
                  return (
                    <span style={{ backgroundColor: b.bg, color: b.color, borderRadius: 10, height: 20, padding: '0 8px', fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>{b.label}</span>
                  )
                })()}
              </div>
            </div>

            {/* Pipeline stage row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>Pipeline stage</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c1 && <span style={{ color: pipelineStageLabel(0).color, fontSize: 13, fontWeight: pipelineStageLabel(0).fontWeight }}>{pipelineStageLabel(0).label}</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: pipelineStageLabel(1).color, fontSize: 13, fontWeight: pipelineStageLabel(1).fontWeight }}>{pipelineStageLabel(1).label}</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: pipelineStageLabel(2).color, fontSize: 13, fontWeight: pipelineStageLabel(2).fontWeight }}>{pipelineStageLabel(2).label}</span>}
              </div>
            </div>

            {/* AI Verdict row */}
            <div style={{ height: 44, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#475569', fontSize: 12, fontWeight: 500 }}>AI Verdict</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderBottom: '1px solid #C7D2FE', borderRight: '1px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c1 && <span style={{ color: aiVerdictLabel(0).color, fontSize: 12, fontWeight: aiVerdictLabel(0).fontWeight }}>{aiVerdictLabel(0).label}</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && <span style={{ color: aiVerdictLabel(1).color, fontSize: 12, fontWeight: aiVerdictLabel(1).fontWeight }}>{aiVerdictLabel(1).label}</span>}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && <span style={{ color: aiVerdictLabel(2).color, fontSize: 12, fontWeight: aiVerdictLabel(2).fontWeight }}>{aiVerdictLabel(2).label}</span>}
              </div>
            </div>

            {/* Quick Actions row */}
            <div style={{ height: 56, display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: 180, backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#94A3B8', fontSize: 11 }}>Quick Actions</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#EEF2FF', borderRight: '1px solid #C7D2FE', borderBottom: '2px solid #C7D2FE', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c1 && (
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/candidates/${c1.id}`)}
                    style={{ backgroundColor: '#1B4FD8', color: 'white', borderRadius: 6, padding: '6px 12px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <ExternalLink size={12} color="white" />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>View profile</span>
                  </button>
                )}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', borderRight: '1px solid #E2E8F0', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c2 && (
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/candidates/${c2.id}`)}
                    style={{ border: '1px solid #1B4FD8', color: '#1B4FD8', borderRadius: 6, padding: '6px 12px', backgroundColor: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <ExternalLink size={12} color="#1B4FD8" />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>View profile</span>
                  </button>
                )}
              </div>
              <div style={{ flex: 1, backgroundColor: 'white', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                {c3 && (
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/candidates/${c3.id}`)}
                    style={{ border: '1px solid #CBD5E1', color: '#94A3B8', borderRadius: 6, padding: '6px 12px', backgroundColor: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <ExternalLink size={12} color="#94A3B8" />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>View profile</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'column', padding: 32, gap: 24 }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
          <div style={{ height: 24, width: 200, backgroundColor: '#E2E8F0', borderRadius: 4 }} />
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ height: 88, backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }} />
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 44, borderBottom: '1px solid #E2E8F0', backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFC' }} />
          ))}
        </div>
      </div>
    }>
      <ComparePageInner />
    </Suspense>
  )
}
