'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { setAuthSession } from '@/lib/auth'
import { fadeIn, fadeUp } from '@/lib/animations'

// ─── Types ────────────────────────────────────────────────────────────────────

type SignUpStep = 'form' | 'otp' | 'onboarding-1' | 'onboarding-2' | 'complete'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const signUpSchema = z.object({
  companyName: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  companySize: z.string().min(1),
  country: z.string().min(1),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

// ─── Role chips ───────────────────────────────────────────────────────────────

const ROLES = [
  'Customer Support',
  'Sales',
  'Marketing',
  'Engineering',
  'Finance',
  'HR',
  'Operations',
  'Other',
]

// ─── Shared input class ───────────────────────────────────────────────────────

const inputCls =
  'border border-slate-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] bg-white text-slate-900 placeholder:text-slate-400'
const inputErrorCls =
  'border border-red-500 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-slate-900 placeholder:text-slate-400'
const labelCls = 'block text-sm font-medium text-slate-700 mb-1'
const btnPrimaryCls =
  'bg-[var(--color-brand-primary)] text-white rounded-lg px-4 py-2.5 w-full font-medium hover:bg-[var(--color-brand-secondary)] transition-colors'

// ─── Logo ─────────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="flex items-center gap-2 mb-6 justify-center">
      <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary)] flex items-center justify-center">
        <span className="text-white font-bold text-sm">C</span>
      </div>
      <span className="font-semibold text-slate-900 text-lg">CrismaTest</span>
    </div>
  )
}

// ─── Step 1: Sign-up form ─────────────────────────────────────────────────────

function SignUpForm({ onNext }: { onNext: (email: string) => void }) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(signUpSchema),
  })

  const onSubmit = (data: SignUpFormValues) => {
    onNext(data.email)
  }

  return (
    <motion.div
      key="form"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <LogoMark />
      <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
        {t('auth_signup_title')}
      </h1>
      <p className="text-slate-500 text-center text-sm mb-6">
        {t('auth_signup_subtitle')}
      </p>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => toast.info(t('auth_google_coming_soon'))}
        className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 font-medium hover:bg-slate-50 transition-colors mb-5"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
        {t('auth_signup_google')}
      </button>

      <div className="flex items-center gap-3 mb-5">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Company Name */}
        <div>
          <label className={labelCls}>{t('auth_signup_company')}</label>
          <input
            {...register('companyName')}
            type="text"
            placeholder={t('auth_signup_company_placeholder')}
            className={errors.companyName ? inputErrorCls : inputCls}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
          )}
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t('auth_signup_first_name')}</label>
            <input
              {...register('firstName')}
              type="text"
              placeholder={t('auth_signup_first_name_placeholder')}
              className={errors.firstName ? inputErrorCls : inputCls}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>{t('auth_signup_last_name')}</label>
            <input
              {...register('lastName')}
              type="text"
              placeholder={t('auth_signup_last_name_placeholder')}
              className={errors.lastName ? inputErrorCls : inputCls}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>{t('auth_signup_email')}</label>
          <input
            {...register('email')}
            type="email"
            placeholder={t('auth_signup_email_placeholder')}
            className={errors.email ? inputErrorCls : inputCls}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{t('auth_invalid_email')}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className={labelCls}>{t('auth_signup_password')}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth_signup_password_placeholder')}
              className={errors.password ? inputErrorCls + ' pr-10' : inputCls + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{t('auth_password_min')}</p>
          )}
        </div>

        {/* Company Size */}
        <div>
          <label className={labelCls}>{t('auth_signup_company_size')}</label>
          <select
            {...register('companySize')}
            className={errors.companySize ? inputErrorCls : inputCls}
          >
            <option value="">{t('auth_signup_company_size')}</option>
            <option value="1-10">{t('auth_signup_company_size_1')}</option>
            <option value="11-50">{t('auth_signup_company_size_2')}</option>
            <option value="51-200">{t('auth_signup_company_size_3')}</option>
            <option value="201+">{t('auth_signup_company_size_4')}</option>
          </select>
          {errors.companySize && (
            <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className={labelCls}>{t('auth_signup_country')}</label>
          <input
            {...register('country')}
            type="text"
            placeholder={t('auth_signup_country_placeholder')}
            className={errors.country ? inputErrorCls : inputCls}
          />
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
          )}
        </div>

        <button type="submit" className={btnPrimaryCls}>
          {t('auth_signup_cta')}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        {t('auth_signup_login')}{' '}
        <Link href="/login" className="text-[var(--color-brand-primary)] font-medium hover:underline">
          {t('auth_signup_login_link')}
        </Link>
      </p>
    </motion.div>
  )
}

// ─── Step 2: OTP ─────────────────────────────────────────────────────────────

function OtpStep({ email, onNext }: { email: string; onNext: () => void }) {
  const { t } = useTranslation()
  const [code, setCode] = useState('')

  const handleVerify = () => {
    if (code.length === 6) {
      onNext()
    }
  }

  return (
    <motion.div
      key="otp"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <LogoMark />
      <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
        {t('auth_otp_title')}
      </h1>
      <p className="text-slate-500 text-center text-sm mb-6">
        {t('auth_otp_subtitle', { email })}
      </p>

      <div className="mb-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder={t('auth_otp_placeholder')}
          className={`${inputCls} text-center text-xl tracking-[0.5em] font-mono`}
        />
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={code.length !== 6}
        className={`${btnPrimaryCls} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {t('auth_otp_cta')}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        <button
          type="button"
          onClick={() => toast.success('Code resent!')}
          className="text-[var(--color-brand-primary)] font-medium hover:underline"
        >
          {t('auth_otp_resend')}
        </button>
      </p>
    </motion.div>
  )
}

// ─── Step 3: Onboarding 1 ─────────────────────────────────────────────────────

function Onboarding1({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()

  return (
    <motion.div
      key="onboarding-1"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <LogoMark />
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-primary)] text-xs font-medium mb-4">
        {t('auth_onboarding_step', { current: 1, total: 2 })}
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {t('auth_onboarding_1_title')}
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        {t('auth_onboarding_1_subtitle')}
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className={labelCls}>{t('auth_onboarding_1_industry')}</label>
          <select className={inputCls}>
            <option value="technology">{t('auth_onboarding_1_industry_tech')}</option>
            <option value="finance">{t('auth_onboarding_1_industry_finance')}</option>
            <option value="healthcare">{t('auth_onboarding_1_industry_healthcare')}</option>
            <option value="retail">{t('auth_onboarding_1_industry_retail')}</option>
            <option value="other">{t('auth_onboarding_1_industry_other')}</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>{t('auth_onboarding_1_volume')}</label>
          <select className={inputCls}>
            <option value="1-5">{t('auth_onboarding_1_volume_1')}</option>
            <option value="6-20">{t('auth_onboarding_1_volume_2')}</option>
            <option value="21-50">{t('auth_onboarding_1_volume_3')}</option>
            <option value="51+">{t('auth_onboarding_1_volume_4')}</option>
          </select>
        </div>
      </div>

      <button type="button" onClick={onNext} className={btnPrimaryCls}>
        {t('auth_onboarding_1_cta')}
      </button>
    </motion.div>
  )
}

// ─── Step 4: Onboarding 2 ─────────────────────────────────────────────────────

function Onboarding2({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (role: string) => {
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  return (
    <motion.div
      key="onboarding-2"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <LogoMark />
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-primary)] text-xs font-medium mb-4">
        {t('auth_onboarding_step', { current: 2, total: 2 })}
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {t('auth_onboarding_2_title')}
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        {t('auth_onboarding_2_subtitle')}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {ROLES.map((role) => {
          const isSelected = selected.includes(role)
          return (
            <button
              key={role}
              type="button"
              onClick={() => toggle(role)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                isSelected
                  ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[var(--color-brand-primary)]'
              }`}
            >
              {role}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={selected.length === 0}
        className={`${btnPrimaryCls} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {t('auth_onboarding_2_cta')}
      </button>
    </motion.div>
  )
}

// ─── Step 5: All set ──────────────────────────────────────────────────────────

function AllSet() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleCta = () => {
    setAuthSession()
    router.push('/dashboard')
  }

  return (
    <motion.div
      key="complete"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <CheckCircle
          size={64}
          className="text-[var(--color-brand-primary)]"
          strokeWidth={1.5}
        />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {t('auth_allset_title')}
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        {t('auth_allset_subtitle')}
      </p>
      <button type="button" onClick={handleCta} className={btnPrimaryCls}>
        {t('auth_allset_cta')}
      </button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [step, setStep] = useState<SignUpStep>('form')
  const [email, setEmail] = useState('')

  const handleFormNext = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep('otp')
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-10">
        <AnimatePresence mode="wait">
          {step === 'form' && <SignUpForm key="form" onNext={handleFormNext} />}
          {step === 'otp' && (
            <OtpStep key="otp" email={email} onNext={() => setStep('onboarding-1')} />
          )}
          {step === 'onboarding-1' && (
            <Onboarding1 key="onboarding-1" onNext={() => setStep('onboarding-2')} />
          )}
          {step === 'onboarding-2' && (
            <Onboarding2 key="onboarding-2" onNext={() => setStep('complete')} />
          )}
          {step === 'complete' && <AllSet key="complete" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
