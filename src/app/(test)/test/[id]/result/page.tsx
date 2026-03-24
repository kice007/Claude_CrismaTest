'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

export default function TestResultPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const [finalScore, setFinalScore] = useState(0)
  const [subScores, setSubScores] = useState({
    logic: 0,
    communication: 0,
    jobSkill: 0,
    trust: 0,
    video: 0,
  })
  const [grade, setGrade] = useState<'excellent' | 'good' | 'average' | 'below'>('good')
  const [showConfetti, setShowConfetti] = useState(false)

  // Gauge animation
  const r = 80
  const circumference = 2 * Math.PI * r
  const progress = useMotionValue(0)
  const strokeDashoffset = useTransform(progress, [0, 100], [circumference, 0])

  // Derive score from sessionStorage (browser-only)
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem('crismatest_answers')
    const answerCount = storedAnswers
      ? Object.keys(JSON.parse(storedAnswers) as Record<string, unknown>).length
      : 0
    const score = Math.min(95, Math.max(40, 60 + answerCount * 3))
    setFinalScore(score)
    setSubScores({
      logic: Math.min(100, Math.round(score * 0.9)),
      communication: Math.min(100, Math.round(score * 1.05)),
      jobSkill: Math.min(100, Math.round(score * 0.95)),
      trust: Math.min(100, Math.round(score * 0.85)),
      video: Math.min(100, Math.round(score * 1.0)),
    })
    const g =
      score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 55 ? 'average' : 'below'
    setGrade(g as typeof grade)
    if (score > 70) setShowConfetti(true)
  }, [])

  // Animate gauge when finalScore is set
  useEffect(() => {
    if (finalScore > 0) {
      const controls = animate(progress, finalScore, { duration: 1.5, ease: 'easeOut' })
      return controls.stop
    }
  }, [finalScore, progress])

  // Fire confetti
  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B4FD8', '#3B6FE8', '#6366F1', '#FFFFFF'],
      })
    }
  }, [showConfetti])

  const gradeColors = {
    excellent: 'bg-emerald-100 text-emerald-700',
    good: 'bg-blue-100 text-blue-700',
    average: 'bg-amber-100 text-amber-700',
    below: 'bg-red-100 text-red-600',
  }

  const gradeLabel = {
    excellent: t('test_result_grade_excellent'),
    good: t('test_result_grade_good'),
    average: t('test_result_grade_average'),
    below: t('test_result_grade_below'),
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/score/sample`)
    toast.success(`${t('test_result_share_copy')}!`)
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-lg font-bold text-[#0F2A6B]">CrismaTest</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Congrats banner */}
        {showConfetti && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4 }}
            className="bg-[#1B4FD8] text-white rounded-2xl p-4 mb-8 text-center"
          >
            <p className="font-bold text-lg">{t('test_result_congrats')}</p>
            <p className="text-blue-200 text-sm">{t('test_result_congrats_sub')}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT — Gauge + sub-scores */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* SVG Gauge */}
            <div className="flex justify-center mb-6">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background ring */}
                <circle cx="100" cy="100" r={r} fill="none" stroke="#E2E8F0" strokeWidth="12" />
                {/* Animated arc */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="#1B4FD8"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset }}
                  transform="rotate(-90 100 100)"
                />
                {/* Score text */}
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  fill="#0F2A6B"
                  fontSize="36"
                  fontWeight="700"
                >
                  {Math.round(finalScore)}
                </text>
                <text x="100" y="115" textAnchor="middle" fill="#64748B" fontSize="12">
                  CrismaScore
                </text>
              </svg>
            </div>

            {/* Grade badge */}
            <div className="flex justify-center mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${gradeColors[grade]}`}>
                {gradeLabel[grade]}
              </span>
            </div>

            {/* Sub-scores */}
            <h3 className="text-sm font-semibold text-slate-700 mb-4">
              {t('test_result_subscores_title')}
            </h3>
            <div className="space-y-3">
              {[
                { key: 'logic', label: t('test_result_subscore_logic'), value: subScores.logic },
                { key: 'communication', label: t('test_result_subscore_comm'), value: subScores.communication },
                { key: 'jobSkill', label: t('test_result_subscore_job'), value: subScores.jobSkill },
                { key: 'trust', label: t('test_result_subscore_trust'), value: subScores.trust },
                { key: 'video', label: t('test_result_subscore_video'), value: subScores.video },
              ].map(({ key, label, value }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#1B4FD8] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Share + CTAs */}
          <div className="space-y-4">
            {/* Share card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                {t('test_result_share_title')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Copy size={14} />
                  {t('test_result_share_copy')}
                </button>
                <button
                  onClick={() =>
                    window.open(
                      'https://www.linkedin.com/sharing/share-offsite/?url=https://crismatest.com/score/sample',
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-[#0857a4] transition-colors"
                >
                  {t('test_result_share_linkedin')}
                </button>
              </div>
            </div>

            {/* Secondary CTAs */}
            <Link
              href="/pricing"
              className="block w-full text-center border border-[#1B4FD8] text-[#1B4FD8] rounded-xl px-4 py-3 text-sm font-medium hover:bg-[#EEF2FF] transition-colors"
            >
              {t('test_result_improve')}
            </Link>
            <Link
              href={`/test/${id}/intro`}
              className="block w-full text-center text-slate-500 text-sm hover:text-slate-700 transition-colors py-3"
            >
              {t('test_result_retake')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
