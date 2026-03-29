'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { Mail, ArrowLeft } from 'lucide-react'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email(),
})

type ForgotFormValues = z.infer<typeof schema>

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  'border border-slate-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] bg-white text-slate-900 placeholder:text-slate-400 text-sm'
const inputErrorCls =
  'border border-red-400 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-slate-900 placeholder:text-slate-400 text-sm'
const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-1.5'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: standardSchemaResolver(schema),
  })

  const onSubmit = ({ email }: ForgotFormValues) => {
    sessionStorage.setItem('fp_email', email)
    router.push('/forgot-password/verify')
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt="CrismaTest logo" width={42} height={36} />
          <span className="font-bold text-[17px] text-[#0F172A]">CrismaTest</span>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
            <Mail size={28} className="text-[#2563EB]" />
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-[#0F172A]">{t('auth_forgot_title')}</h1>
          <p className="text-[14px] text-[#64748B] max-w-[340px]">{t('auth_forgot_subtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <div>
            <label className={labelCls}>{t('auth_forgot_email_label')}</label>
            <input
              {...register('email')}
              type="email"
              placeholder={t('auth_forgot_email_placeholder')}
              className={errors.email ? inputErrorCls : inputCls}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{t('auth_invalid_email')}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[15px] font-semibold rounded-lg transition-colors"
          >
            <Mail size={15} />
            {t('auth_forgot_cta')}
          </button>
        </form>

        {/* Back link */}
        <div className="flex items-center justify-center gap-1.5">
          <ArrowLeft size={13} className="text-[#64748B]" />
          <Link
            href="/login"
            className="text-[13px] font-semibold text-[#2563EB] hover:underline"
          >
            {t('auth_forgot_back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
