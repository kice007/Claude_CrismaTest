'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Briefcase, Timer, Brain, MessageCircle, Star, Camera, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MOCK_TEST } from '@/lib/mock-data'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'

// Design-specified icons and durations per module name
const MODULE_META: Record<string, { Icon: React.ElementType; duration: string }> = {
  'Logic & reasoning': { Icon: Brain, duration: '7 min' },
  'Communication': { Icon: MessageCircle, duration: '3 min' },
  'Job skills': { Icon: Star, duration: '5 min' },
}

export default function TestInfoPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const test = MOCK_TEST

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="lg:w-1/2 min-h-[220px] lg:min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0F2A6B', gap: 32, padding: 64 }}
      >
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="CrismaTest"
          width={110}
          height={110}
          style={{ objectFit: 'contain' }}
        />

        {/* Brand name */}
        <p
          className="text-white font-bold"
          style={{ fontSize: 30, letterSpacing: -0.5, fontFamily: 'Inter, sans-serif' }}
        >
          CrismaTest
        </p>

        {/* Tagline */}
        <p
          className="text-center"
          style={{ color: '#A5B4FC', fontSize: 15, lineHeight: 1.6, fontFamily: 'Inter, sans-serif', maxWidth: 380 }}
        >
          {t('test_intro_tagline')}
        </p>

        {/* Divider */}
        <div style={{ width: 40, height: 2, background: '#3B6FE8', borderRadius: 2 }} />

        {/* Trust note */}
        <p
          className="text-center"
          style={{ color: '#6366F1', fontSize: 12, fontFamily: 'Inter, sans-serif', maxWidth: 300 }}
        >
          {t('test_intro_trusted')}
        </p>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div
        className="lg:w-1/2 min-h-screen flex flex-col items-center justify-center relative"
        style={{ background: '#ffffffff' }}
      >
        {/* Lang toggle — top-right */}
        <div className="absolute top-5 right-6">
          <AuthLangToggle />
        </div>

        {/* Card */}
        <div
          className="flex flex-col bg-white border"
          style={{
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 16,
            padding: 40,
            gap: 24,

          }}
        >
          {/* Badge — role */}
          <div
            className="inline-flex items-center self-start"
            style={{ background: '#EEF2FF', borderRadius: 20, padding: '6px 14px', gap: 8 }}
          >
            <Briefcase size={14} color="#1B4FD8" />
            <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {test.role} assessment
            </span>
          </div>

          {/* Duration row */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <Timer size={16} color="#6B7280" />
            <span style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
              {t('test_intro_duration_value', { minutes: test.duration })}
            </span>
          </div>

          {/* Section header */}
          <p style={{ color: '#111827', fontSize: 16, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
            {t('test_intro_modules')}
          </p>

          {/* Module rows */}
          <div className="flex flex-col" style={{ gap: 14 }}>
            {test.modules.map((mod) => {
              const meta = MODULE_META[mod]
              const Icon = meta?.Icon ?? Brain
              const duration = meta?.duration ?? '–'
              return (
                <div key={mod} className="flex items-center" style={{ gap: 12 }}>
                  <Icon size={18} color="#6366F1" />
                  <span
                    className="flex-1"
                    style={{ color: '#374151', fontSize: 14, fontFamily: 'Inter, sans-serif' }}
                  >
                    {mod}
                  </span>
                  <span style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                    {duration}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-start"
            style={{ background: '#FFF8F0', borderRadius: 8, padding: '12px 16px', gap: 10 }}
          >
            <Camera size={14} color="#F59E0B" className="shrink-0 mt-0.5" />
            <span
              style={{ color: '#92400E', fontSize: 12, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}
            >
              {t('test_intro_privacy_note')}
            </span>
          </div>

          {/* Start button */}
          <Link
            href={`/test/${id}/user-info`}
            className="flex items-center justify-center"
            style={{
              background: '#1B4FD8',
              borderRadius: 10,
              padding: '14px 0',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {t('test_intro_cta')}
            </span>
            <ArrowRight size={16} color="#FFFFFF" />
          </Link>
        </div>
      </div>

    </div>
  )
}
