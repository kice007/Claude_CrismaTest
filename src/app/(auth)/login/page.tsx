'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { motion } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { setAuthSession } from '@/lib/auth'
import { fadeUp } from '@/lib/animations'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof schema>

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  'border border-slate-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] bg-white text-slate-900 placeholder:text-slate-400'
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(schema),
  })

  const onSubmit = () => {
    setAuthSession()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center px-4 py-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-10"
      >
        <LogoMark />

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          {t('auth_login_title')}
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          {t('auth_login_subtitle')}
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
          {t('auth_login_google')}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label className={labelCls}>{t('auth_login_email')}</label>
            <input
              {...register('email')}
              type="email"
              placeholder={t('auth_login_email_placeholder')}
              className={
                errors.email
                  ? 'border border-red-500 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-slate-900 placeholder:text-slate-400'
                  : inputCls
              }
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{t('auth_invalid_email')}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                {t('auth_login_password')}
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--color-brand-primary)] hover:underline"
              >
                {t('auth_login_forgot')}
              </Link>
            </div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth_login_password_placeholder')}
                className={
                  (errors.password
                    ? 'border border-red-500 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-slate-900 placeholder:text-slate-400'
                    : inputCls) + ' pr-10'
                }
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
              <p className="text-sm text-red-500 mt-1">{t('auth_field_required')}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              {...register('rememberMe')}
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 rounded border-slate-200 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600">
              {t('auth_login_remember')}
            </label>
          </div>

          <button type="submit" className={btnPrimaryCls}>
            {t('auth_login_cta')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          {t('auth_login_no_account')}{' '}
          <Link
            href="/sign-up"
            className="text-[var(--color-brand-primary)] font-medium hover:underline"
          >
            {t('auth_login_signup_link')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
