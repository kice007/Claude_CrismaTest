'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { KeyRound, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth_password_mismatch',
    path: ['confirmPassword'],
  })

type ResetFormValues = z.infer<typeof schema>

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-1.5'

// ─── Password requirements check ─────────────────────────────────────────────

function RequirementRow({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Check
        size={13}
        className={met ? 'text-[#16A34A]' : 'text-[#CBD5E1]'}
        strokeWidth={2.5}
      />
      <span className={`text-[12px] ${met ? 'text-[#374151]' : 'text-[#94A3B8]'}`}>
        {label}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordResetPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: standardSchemaResolver(schema),
  })

  const passwordValue = watch('password', '')
  const hasMinChars = passwordValue.length >= 8
  const hasNumber = /\d/.test(passwordValue)
  const hasSpecial = /[^a-zA-Z0-9]/.test(passwordValue)

  const onSubmit = () => {
    sessionStorage.removeItem('fp_email') // cleanup
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col gap-[22px]">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt="CrismaTest logo" width={42} height={36} />
          <span className="font-bold text-[17px] text-[#0F172A]">CrismaTest</span>
        </Link>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
            <KeyRound size={28} className="text-[#2563EB]" />
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[#0F172A]">{t('auth_new_password_title')}</h1>
          <p className="text-[14px] text-[#64748B] max-w-[340px]">
            {t('auth_new_password_subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {/* New password */}
          <div>
            <label className={labelCls}>{t('auth_new_password_label')}</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth_new_password_placeholder')}
                className={`border rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 bg-white text-slate-900 placeholder:text-slate-400 text-[15px] ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-[var(--color-brand-primary)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{t('auth_password_min')}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className={labelCls}>{t('auth_confirm_password_label')}</label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder={t('auth_confirm_password_placeholder')}
                className={`border rounded-lg px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 bg-white text-slate-900 placeholder:text-slate-400 text-sm ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-slate-200 focus:ring-[var(--color-brand-primary)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-slate-600"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {t('auth_password_mismatch')}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-[#F0FDF4] rounded-lg px-3.5 py-3 flex flex-col gap-1.5">
            <RequirementRow met={hasMinChars} label={t('auth_req_min_chars')} />
            <RequirementRow met={hasNumber} label={t('auth_req_number')} />
            <RequirementRow met={hasSpecial} label={t('auth_req_special')} />
          </div>

          <button
            type="submit"
            className="w-full h-11 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[15px] font-semibold rounded-lg transition-colors"
          >
            <KeyRound size={16} />
            {t('auth_new_password_cta')}
          </button>
        </form>

        {/* Back link */}
        <div className="flex items-center justify-center gap-1.5">
          <ArrowLeft size={13} className="text-[#64748B]" />
          <Link
            href="/login"
            className="text-[13px] font-semibold text-[#2563EB] hover:underline"
          >
            {t('auth_new_password_back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
