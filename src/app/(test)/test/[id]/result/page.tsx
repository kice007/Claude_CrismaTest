'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { RotateCcw, Share2, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'

const SUB_SCORES = [
  { key: 'logic', labelKey: 'test_result_subscore_logic', pct: 80 },
  { key: 'comm',  labelKey: 'test_result_subscore_comm',  pct: 70 },
  { key: 'job',   labelKey: 'test_result_subscore_job',   pct: 72 },
  { key: 'trust', labelKey: 'test_result_subscore_trust', pct: 65 },
  { key: 'video', labelKey: 'test_result_subscore_video', pct: 78 },
]

const STRENGTHS = [
  'Strong logical reasoning under time pressure',
  'Clear and structured written communication',
]

function scoreGrade(s: number) {
  if (s >= 85) return { labelKey: 'test_result_grade_excellent', bg: '#DCFCE7', color: '#166534' }
  if (s >= 70) return { labelKey: 'test_result_grade_good',      bg: '#D1FAE5', color: '#065F46' }
  if (s >= 55) return { labelKey: 'test_result_grade_average',   bg: '#FEF3C7', color: '#92400E' }
  return               { labelKey: 'test_result_grade_below',    bg: '#FEE2E2', color: '#991B1B' }
}

export default function TestResultPage() {
  const { t } = useTranslation()

  const [score, setScore]       = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [barsVisible, setBarsVisible] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('crismatest_answers')
    const n = stored ? Object.keys(JSON.parse(stored) as Record<string, unknown>).length : 0
    setScore(Math.min(95, Math.max(40, 60 + n * 3)))
  }, [])

  // 1.5s ease-out count-up
  useEffect(() => {
    if (score === 0) return
    let frame = 0
    const total = 60
    const id = setInterval(() => {
      frame++
      const ease = 1 - Math.pow(1 - frame / total, 3)
      setDisplayed(Math.round(score * ease))
      if (frame >= total) {
        clearInterval(id)
        setDisplayed(score)
        setBarsVisible(true)
      }
    }, 25)
    return () => clearInterval(id)
  }, [score])

  const grade = scoreGrade(score)

  // SVG gauge: 280×280 container, r=134, stroke=12
  const R    = 134
  const circ = 2 * Math.PI * R
  const dash = circ - (displayed / 100) * circ

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex flex-col">

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E5E7EB] px-12 h-16 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="CrismaTest" width={42} height={36} className="object-contain" />
          <span className="text-[18px] font-bold text-[#0F2A6B] tracking-tight">CrismaTest</span>
        </div>
        <AuthLangToggle />
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      {/* padding: 48px top/bottom, 80px left/right; gap: 64px  */}
      <div className="flex-1 flex flex-row py-12 px-20 gap-16">

        {/* LEFT — Gauge + actions  (w=380) */}
        <div className="w-[380px] flex flex-col items-center gap-6 flex-shrink-0">

          {/* Gauge circle — 280×280 */}
          <div className="relative w-[280px] h-[280px]">
            <svg width="280" height="280" viewBox="0 0 280 280" className="absolute inset-0">
              {/* track */}
              <circle
                cx="140" cy="140" r={R}
                fill="white"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              {/* animated fill */}
              <circle
                cx="140" cy="140" r={R}
                fill="none"
                stroke="#1B4FD8"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dash}
                transform="rotate(-90 140 140)"
                style={{ transition: 'stroke-dashoffset 0.025s linear' }}
              />
            </svg>
            {/* score + label inside */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className="text-[64px] font-bold text-[#1B4FD8] leading-none tabular-nums">
                {displayed}
              </span>
              <span className="text-[13px] text-[#6B7280]">CrismaScore</span>
            </div>
          </div>

          {/* Grade badge */}
          <div
            className="h-9 flex items-center px-5 rounded-[18px] text-[14px] font-bold"
            style={{ backgroundColor: grade.bg, color: grade.color }}
          >
            {t(grade.labelKey)}
          </div>

          {/* Share CTA */}
          <button className="w-full h-12 flex items-center justify-center gap-2 bg-[#1B4FD8] text-white rounded-lg text-[14px] font-semibold hover:bg-[#3B6FE8] transition-colors">
            <Share2 size={16} />
            {t('test_result_share_title')}
          </button>

          {/* Improve link */}
          <span className="text-[14px] font-medium text-[#1B4FD8] cursor-pointer hover:underline">
            {t('test_result_improve')} →
          </span>

          {/* Retake */}
          <div className="flex items-center gap-1.5">
            <RotateCcw size={14} className="text-[#6B7280]" />
            <span className="text-[13px] text-[#6B7280]">{t('test_result_retake')}</span>
          </div>
        </div>

        {/* RIGHT — Score breakdown  (flex-1) */}
        <div className="flex-1 flex flex-col gap-8">

          <h2 className="text-[18px] font-bold text-[#0F2A6B]">
            {t('test_result_subscores_title')}
          </h2>

          {/* Sub-score bars — gap 16 between rows */}
          <div className="flex flex-col gap-4">
            {SUB_SCORES.map(({ key, labelKey, pct }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#374151]">{t(labelKey)}</span>
                  <span className="text-[14px] font-semibold text-[#1B4FD8]">{pct}%</span>
                </div>
                <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1B4FD8] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: barsVisible ? `${pct}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths card — cornerRadius 12, padding 24, gap 12 */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold text-[#0F2A6B]">
              {t('test_result_strengths_title')}
            </h3>
            {STRENGTHS.map((s) => (
              <div key={s} className="flex items-center gap-2.5">
                <CircleCheck size={16} className="text-[#10B981] flex-shrink-0" />
                <span className="text-[14px] text-[#374151]">{s}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}
