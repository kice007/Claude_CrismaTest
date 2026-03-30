'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  PencilRuler,
  FileCheck,
  TrendingUp,
  Users,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Candidate {
  id: string
  full_name: string
  role: string
  avatar_color: string
  crima_score: number
  trust_score: number
  status: 'passed' | 'failed' | 'pending'
  test_date: string
}

const PAGE_SIZE = 4

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function statusBadgeStyle(status: 'passed' | 'failed' | 'pending') {
  if (status === 'passed') return { bg: '#D1FAE5', color: '#065F46' }
  if (status === 'failed') return { bg: '#FEE2E2', color: '#991B1B' }
  return { bg: '#FEF3C7', color: '#92400E' }
}

function initials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const SCORE_BARS = [
  { label: '<40', color: '#EF4444', height: 33 },
  { label: '40–59', color: '#F59E0B', height: 89 },
  { label: '60–74', color: '#3B82F6', height: 180 },
  { label: '75–84', color: '#1B4FD8', height: 171 },
  { label: '85+', color: '#22C55E', height: 96 },
]

const TOP_AVATAR_STYLES = [
  { avatarBg: '#EEF2FF', initColor: '#1B4FD8', scoreBg: '#DCFCE7', scoreColor: '#16A34A' },
  { avatarBg: '#DBEAFE', initColor: '#1B4FD8', scoreBg: '#DBEAFE', scoreColor: '#1D4ED8' },
  { avatarBg: '#FEF3C7', initColor: '#D97706', scoreBg: '#EEF2FF', scoreColor: '#1B4FD8' },
]

export default function DashboardOverviewPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    fetch('/api/candidates')
      .then(r => r.ok ? r.json() : [])
      .then((data: Candidate[]) => setAllCandidates(Array.isArray(data) ? data : []))
      .catch(() => setAllCandidates([]))
      .finally(() => setLoading(false))
  }, [])

  const topCandidates = useMemo(
    () =>
      [...allCandidates]
        .filter(c => c.crima_score >= 75)
        .sort((a, b) => b.crima_score - a.crima_score)
        .slice(0, 3),
    [allCandidates]
  )

  const totalPages = Math.ceil(allCandidates.length / PAGE_SIZE)
  const pageRows = allCandidates.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="flex flex-col p-8 gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between" style={{ height: 46 }}>
        <h1 className="font-bold text-[#0F2A6B]" style={{ fontSize: 24 }}>{t('dashboard.overview.title')}</h1>
        <button
          type="button"
          onClick={() => router.push('/dashboard/build-test')}
          className="flex items-center rounded-lg bg-[#1B4FD8] text-white font-semibold text-sm shrink-0"
          style={{ gap: 8, height: 40, padding: '0 20px' }}
        >
          <PencilRuler size={20} />
          {t('dashboard.nav.buildTest')}
        </button>
      </div>

      {/* KPI row */}
      <div className="flex gap-4 w-full">
        <div className="flex-1 bg-white rounded-xl flex flex-col" style={{ padding: 20, gap: 10 }}>
          <div className="flex items-center justify-between w-full">
            <span className="text-[#64748B]" style={{ fontSize: 13 }}>{t('dashboard.overview.kpi.testsSent')}</span>
            <FileCheck size={16} className="text-[#94A3B8]" />
          </div>
          <span className="font-bold text-[#0F172A]" style={{ fontSize: 30 }}>142</span>
          <span className="text-[#22C55E]" style={{ fontSize: 12 }}>{t('dashboard.overview.kpi.testsSentDelta')}</span>
        </div>

        <div className="flex-1 bg-white rounded-xl flex flex-col" style={{ padding: 20, gap: 10 }}>
          <div className="flex items-center justify-between w-full">
            <span className="text-[#64748B]" style={{ fontSize: 13 }}>{t('dashboard.overview.kpi.avgScore')}</span>
            <TrendingUp size={16} className="text-[#94A3B8]" />
          </div>
          <span className="font-bold text-[#0F172A]" style={{ fontSize: 30 }}>76 / 100</span>
          <span className="text-[#22C55E]" style={{ fontSize: 12 }}>{t('dashboard.overview.kpi.avgScoreDelta')}</span>
        </div>

        <div className="flex-1 bg-white rounded-xl flex flex-col" style={{ padding: 20, gap: 10 }}>
          <div className="flex items-center justify-between w-full">
            <span className="text-[#64748B]" style={{ fontSize: 13 }}>{t('dashboard.overview.kpi.candidatesReviewed')}</span>
            <Users size={16} className="text-[#94A3B8]" />
          </div>
          <span className="font-bold text-[#0F172A]" style={{ fontSize: 30 }}>38</span>
          <span className="text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.kpi.candidatesReviewedSub')}</span>
        </div>

        <div className="flex-1 bg-white rounded-xl flex flex-col" style={{ padding: 20, gap: 10 }}>
          <div className="flex items-center justify-between w-full">
            <span className="text-[#64748B]" style={{ fontSize: 13 }}>{t('dashboard.overview.kpi.fraudFlags')}</span>
            <ShieldAlert size={16} className="text-[#94A3B8]" />
          </div>
          <span className="font-bold text-[#0F172A]" style={{ fontSize: 30 }}>9</span>
          <span className="text-[#22C55E]" style={{ fontSize: 12 }}>{t('dashboard.overview.kpi.fraudFlagsDelta')}</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="flex gap-4 w-full">
        {/* Score distribution — chart anchored to bottom of card */}
        <div className="flex-1 bg-white rounded-xl flex flex-col justify-between" style={{ padding: 24, gap: 16 }}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col" style={{ gap: 2 }}>
              <span className="font-semibold text-[#0F172A]" style={{ fontSize: 15 }}>{t('dashboard.overview.scoreDistribution')}</span>
              <span className="text-[#94A3B8]" style={{ fontSize: 12 }}>{t('dashboard.overview.scoreDistributionSub')}</span>
            </div>
          </div>
          {/* Vertical bar chart — bars aligned to bottom */}
          <div className="flex w-full" style={{ gap: 8, height: 200 }}>
            {/* Y-axis labels */}
            <div
              className="flex flex-col justify-between items-end shrink-0"
              style={{ width: 24, height: 200, paddingBottom: 20 }}
            >
              {[50, 40, 30, 20, 10, 0].map(v => (
                <span key={v} style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1 }}>{v}</span>
              ))}
            </div>
            {/* Bars + gridlines */}
            <div className="flex-1 relative" style={{ height: 200 }}>
              {/* Bars */}
              <div className="flex items-end relative w-full" style={{ gap: 12, height: '100%' }}>
                {SCORE_BARS.map((bar) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center" style={{ gap: 4 }}>
                    <div
                      className="w-full"
                      style={{
                        height: bar.height,
                        backgroundColor: bar.color,
                        borderRadius: '4px 4px 0 0',
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-[#94A3B8] shrink-0" style={{ fontSize: 11 }}>{bar.label}</span>
                  </div>
                ))}
              </div>
              {/* Horizontal gridlines — rendered after bars so they cross through */}
              <div
                className="absolute inset-0 flex flex-col justify-between pointer-events-none"
                style={{ paddingBottom: 20 }}
              >
                {[50, 40, 30, 20, 10, 0].map(v => (
                  <div key={v} style={{ width: '100%', height: 1, background: 'rgba(148,163,184,0.25)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top candidates */}
        <div className="bg-white rounded-xl flex flex-col" style={{ width: 320, padding: 24, gap: 16 }}>
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-[#0F172A]" style={{ fontSize: 15 }}>{t('dashboard.overview.topCandidates')}</span>
            <span className="text-[#94A3B8]" style={{ fontSize: 12 }}>
              {t('dashboard.overview.topCandidatesQualified', { count: topCandidates.length })}
            </span>
          </div>

          {(loading ? [] : topCandidates).map((c, i) => {
            const style = TOP_AVATAR_STYLES[i % TOP_AVATAR_STYLES.length]
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => router.push(`/dashboard/candidates/${c.id}`)}
                className="flex items-center w-full text-left hover:bg-slate-50 transition-colors rounded-lg"
                style={{
                  gap: 10,
                  padding: '12px 10px',
                  borderBottom: i < topCandidates.length - 1 ? '1px solid #F1F5F9' : undefined,
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, backgroundColor: style.avatarBg }}
                >
                  <span className="font-bold" style={{ fontSize: 11, color: style.initColor }}>
                    {initials(c.full_name)}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 2 }}>
                  <span className="font-semibold text-[#0F172A] truncate" style={{ fontSize: 13 }}>{c.full_name}</span>
                  <span className="text-[#94A3B8] truncate" style={{ fontSize: 11 }}>{c.role}</span>
                </div>
                <div
                  className="shrink-0 flex items-center justify-center rounded-md"
                  style={{ backgroundColor: style.scoreBg, padding: '3px 8px' }}
                >
                  <span className="font-bold" style={{ fontSize: 12, color: style.scoreColor }}>{c.crima_score}</span>
                </div>
              </button>
            )
          })}

          {loading && (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          )}

          <div
            className="flex items-center justify-center w-full"
            style={{ padding: '12px 0', borderTop: '1px solid #EEF2FF' }}
          >
            <Link href="/dashboard/candidates" className="text-[#1B4FD8] font-medium" style={{ fontSize: 13 }}>
              {t('dashboard.overview.viewAllQualified')}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent candidates section header */}
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold text-[#0F172A]" style={{ fontSize: 15 }}>{t('dashboard.overview.recentCandidates')}</span>
        <Link href="/dashboard/candidates" className="text-[#1B4FD8] font-medium" style={{ fontSize: 13 }}>
          {t('dashboard.overview.viewAll')}
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl w-full overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>

        {/* Header row */}
        <div
          className="flex items-center w-full shrink-0"
          style={{ backgroundColor: '#F8FAFC', height: 44, padding: '0 16px', borderBottom: '1px solid #E2E8F0' }}
        >
          <div style={{ width: 44 }} />
          <div style={{ width: 200 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.name')}</span>
          </div>
          <div style={{ width: 160 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.role')}</span>
          </div>
          <div style={{ width: 120 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.score')}</span>
          </div>
          <div style={{ width: 100 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.trust')}</span>
          </div>
          <div style={{ width: 110 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.status')}</span>
          </div>
          <div style={{ width: 120 }}>
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.date')}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <span className="font-semibold text-[#64748B]" style={{ fontSize: 12 }}>{t('dashboard.overview.table.action')}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : allCandidates.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8] text-sm">{t('dashboard.overview.empty')}</div>
        ) : (
          pageRows.map((c, i) => {
            const badgeStyle = statusBadgeStyle(c.status)
            const badgeLabel = c.status === 'passed' ? t('dashboard.status.reviewed') : c.status === 'failed' ? t('dashboard.status.failed') : t('dashboard.status.pending')
            const isLast = i === pageRows.length - 1
            return (
              <div
                key={c.id}
                className="flex items-center w-full cursor-pointer hover:bg-slate-50 transition-colors"
                style={{
                  height: 56,
                  padding: '0 16px',
                  borderBottom: isLast ? undefined : '1px solid #F1F5F9',
                }}
                onClick={() => router.push(`/dashboard/candidates/${c.id}`)}
              >
                <div className="flex items-center justify-center shrink-0" style={{ width: 44 }}>
                  <div
                    className="rounded-full"
                    style={{ width: 32, height: 32, backgroundColor: c.avatar_color }}
                  />
                </div>
                <div className="flex items-center" style={{ width: 200 }}>
                  <span className="font-medium text-[#0F172A] truncate" style={{ fontSize: 14 }}>{c.full_name}</span>
                </div>
                <div className="flex items-center" style={{ width: 160 }}>
                  <span className="text-[#475569] truncate" style={{ fontSize: 14 }}>{c.role}</span>
                </div>
                <div className="flex items-center" style={{ width: 120 }}>
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: 52, height: 24, backgroundColor: '#6366F1' }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: 13 }}>{c.crima_score}</span>
                  </div>
                </div>
                <div className="flex items-center" style={{ width: 100 }}>
                  <span className="text-[#475569]" style={{ fontSize: 14 }}>{c.trust_score}%</span>
                </div>
                <div className="flex items-center" style={{ width: 110 }}>
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ height: 24, padding: '0 10px', backgroundColor: badgeStyle.bg }}
                  >
                    <span className="font-medium" style={{ fontSize: 12, color: badgeStyle.color }}>{badgeLabel}</span>
                  </div>
                </div>
                <div className="flex items-center" style={{ width: 120 }}>
                  <span className="text-[#475569]" style={{ fontSize: 13 }}>{formatDate(c.test_date)}</span>
                </div>
                <div className="flex-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/candidates/${c.id}`) }}
                    className="flex items-center justify-center rounded-md"
                    style={{ height: 32, padding: '0 12px', border: '1px solid #1B4FD8' }}
                  >
                    <span className="font-medium text-[#1B4FD8]" style={{ fontSize: 13 }}>{t('dashboard.overview.viewBtn')}</span>
                  </button>
                </div>
              </div>
            )
          })
        )}

        {/* Pagination footer */}
        <div
          className="flex items-center justify-between w-full"
          style={{ backgroundColor: '#F8FAFC', height: 52, padding: '0 16px', borderTop: '1px solid #E2E8F0' }}
        >
          <span className="text-[#64748B]" style={{ fontSize: 13 }}>
            {allCandidates.length === 0
              ? t('dashboard.overview.paginationZero')
              : t('dashboard.overview.paginationRange', { start: page * PAGE_SIZE + 1, end: Math.min((page + 1) * PAGE_SIZE, allCandidates.length), total: allCandidates.length })}
          </span>
          <div className="flex items-center" style={{ gap: 4 }}>
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center justify-center rounded-md bg-white disabled:opacity-40"
              style={{ width: 32, height: 32, border: '1px solid #E2E8F0' }}
            >
              <ChevronLeft size={16} className="text-[#64748B]" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center justify-center rounded-md bg-white disabled:opacity-40"
              style={{ width: 32, height: 32, border: '1px solid #E2E8F0' }}
            >
              <ChevronRight size={16} className="text-[#64748B]" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
