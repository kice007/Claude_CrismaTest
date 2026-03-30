'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { User, Lock, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'

export default function TestUserInfoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  })

  const canContinue =
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.company.trim() &&
    form.jobTitle.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canContinue) {
      sessionStorage.setItem('crismatest_candidate_info', JSON.stringify(form))
      router.push(`/test/${id}/check`)
    }
  }

  const inputClass =
    'w-full bg-white text-sm text-slate-900 placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30 focus:border-[#1B4FD8] transition-colors'

  const fields = [
    { key: 'fullName', label: t('test_userinfo_full_name'), type: 'text', placeholder: t('test_userinfo_full_name_placeholder') },
    { key: 'email', label: t('test_userinfo_email'), type: 'email', placeholder: t('test_userinfo_email_placeholder') },
    { key: 'phone', label: t('test_userinfo_phone'), type: 'tel', placeholder: t('test_userinfo_phone_placeholder') },
    { key: 'company', label: t('test_userinfo_company'), type: 'text', placeholder: t('test_userinfo_company_placeholder') },
    { key: 'jobTitle', label: t('test_userinfo_job_title'), type: 'text', placeholder: t('test_userinfo_job_title_placeholder') },
  ] as const

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="lg:w-1/2 min-h-[220px] lg:min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0f172a', gap: 32, padding: 64 }}
      >
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="CrismaTest"
            width={110}
            height={110}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <p
          className="text-white font-bold"
          style={{ fontSize: 30, letterSpacing: -0.5, fontFamily: 'Inter, sans-serif' }}
        >
          CrismaTest
        </p>

        <p
          className="text-center"
          style={{ color: '#A5B4FC', fontSize: 15, lineHeight: 1.6, fontFamily: 'Inter, sans-serif', maxWidth: 380 }}
        >
          {t('test_intro_tagline')}
        </p>

        <div style={{ width: 40, height: 2, background: '#3B6FE8', borderRadius: 2 }} />

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
        {/* Lang toggle */}
        <div className="absolute top-5 right-6">
          <AuthLangToggle />
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white border"
          style={{
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: 16,
            padding: 40,
            gap: 20,
          }}
        >
          {/* Step badge */}
          <div
            className="inline-flex items-center self-start"
            style={{ background: '#EEF2FF', borderRadius: 20, padding: '6px 14px', gap: 8 }}
          >
            <User size={14} color="#1B4FD8" />
            <span style={{ color: '#1B4FD8', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              user informations
            </span>
          </div>

          {/* Title */}
          <p style={{ color: '#111827', fontSize: 24, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
            Tell us about yourself
          </p>

          {/* Subtitle */}
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.5, fontFamily: 'Inter, sans-serif', maxWidth: 340 }}>
            This helps us personalize your assessment
          </p>

          {/* Fields */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key} className="flex flex-col" style={{ gap: 6 }}>
                <label
                  style={{ color: '#374151', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className={inputClass}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    border: '1.5px solid #E5E7EB',
                    paddingLeft: 14,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <Lock size={14} color="#6B7280" className="shrink-0" />
            <span style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
              Your data is private and never shared
            </span>
          </div>

          {/* Continue button */}
          <button
            type="submit"
            disabled={!canContinue}
            className="flex items-center justify-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#1B4FD8',
              borderRadius: 10,
              height: 50,
              gap: 10,
              border: 'none',
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {t('test_userinfo_cta')}
            </span>
            <ArrowRight size={16} color="#FFFFFF" />
          </button>
        </form>
      </div>

    </div>
  )
}
