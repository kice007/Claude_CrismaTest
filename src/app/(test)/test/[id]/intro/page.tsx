'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Clock, BookOpen, Shield } from 'lucide-react'
import { MOCK_TEST } from '@/lib/mock-data'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function TestIntroPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const test = MOCK_TEST // Phase 4: always use MOCK_TEST regardless of id param

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL — dark navy */}
      <div className="bg-[#0F2A6B] lg:w-1/2 flex flex-col items-center justify-center p-10 lg:p-16 text-white min-h-[40vh] lg:min-h-screen">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-2xl font-bold tracking-tight">CrismaTest</span>
        </div>
        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4 }}
          className="text-xl lg:text-2xl font-medium text-center text-blue-100 max-w-xs"
        >
          {t('test_intro_tagline')}
        </motion.p>
        {/* Trust badge */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-4 text-sm text-blue-300"
        >
          {t('test_intro_trusted')}
        </motion.p>
      </div>

      {/* RIGHT PANEL — white card */}
      <div className="bg-white lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Role badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
            <span className="inline-block bg-[#EEF2FF] text-[#1B4FD8] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {t('test_intro_role_badge')}: {test.role}
            </span>
          </motion.div>

          {/* Duration row */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-slate-500 text-sm mb-6"
          >
            <Clock size={14} />
            <span>
              {t('test_intro_duration')}:{' '}
              {t('test_intro_duration_value', { minutes: test.duration })}
            </span>
          </motion.div>

          {/* Modules list */}
          <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen size={14} />
              {t('test_intro_modules')}
            </h3>
            <ul className="space-y-2 mb-6">
              {test.modules.map((module, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#1B4FD8] flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  {module}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Webcam disclaimer chip */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-8 text-xs text-amber-700"
          >
            <Shield size={14} className="mt-0.5 shrink-0" />
            <span>{t('test_intro_privacy_note')}</span>
          </motion.div>

          {/* Start Test CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
            <Link
              href={`/test/${id}/user-info`}
              className="block w-full bg-[#1B4FD8] text-white text-center rounded-xl px-6 py-3.5 font-semibold hover:bg-[#3B6FE8] transition-colors text-base"
            >
              {t('test_intro_cta')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
