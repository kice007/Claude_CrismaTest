'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Eye, EyeOff, ArrowRight, Check, Mail, X, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { setAuthSession } from '@/lib/auth'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'
import { SizeSelect } from '@/components/auth/SizeSelect'
import { CountrySelect } from '@/components/auth/CountrySelect'

// ─── Types ────────────────────────────────────────────────────────────────────

type SignUpStep = 'form' | 'otp' | 'onboarding-1' | 'onboarding-2' | 'complete'

// ─── Schema ───────────────────────────────────────────────────────────────────

const signUpSchema = z.object({
  companyName: z.string().min(1),
  firstName:   z.string().min(1),
  lastName:    z.string().min(1),
  email:       z.string().email(),
  password:    z.string().min(8),
  companySize: z.string().min(1),
  country:     z.string().min(1),
})
type SignUpFormValues = z.infer<typeof signUpSchema>

// ─── Chip option definitions (IDs are language-agnostic) ─────────────────────

const INDUSTRY_OPTIONS = [
  { id: 'tech',       tk: 'auth_onboarding_ind_tech' },
  { id: 'finance',    tk: 'auth_onboarding_ind_finance' },
  { id: 'marketing',  tk: 'auth_onboarding_ind_marketing' },
  { id: 'support',    tk: 'auth_onboarding_ind_support' },
  { id: 'sales',      tk: 'auth_onboarding_ind_sales' },
  { id: 'operations', tk: 'auth_onboarding_ind_operations' },
]

const VOLUME_OPTIONS = [
  { id: '1-5',   label: '1–5' },
  { id: '6-20',  label: '6–20' },
  { id: '21-50', label: '21–50' },
  { id: '50+',   label: '50+' },
]

const ROLE_OPTIONS = [
  { id: 'sw_eng',  tk: 'auth_onboarding_role_sw_eng' },
  { id: 'pm',      tk: 'auth_onboarding_role_pm' },
  { id: 'data',    tk: 'auth_onboarding_role_data' },
  { id: 'ux',      tk: 'auth_onboarding_role_ux' },
  { id: 'mktg',    tk: 'auth_onboarding_role_mktg' },
  { id: 'sales',   tk: 'auth_onboarding_role_sales' },
  { id: 'support', tk: 'auth_onboarding_role_support' },
]

const ATS_LIST = [
  { id: 'workday',    tk: 'auth_onboarding_ats_workday' },
  { id: 'greenhouse', tk: 'auth_onboarding_ats_greenhouse' },
  { id: 'lever',      tk: 'auth_onboarding_ats_lever' },
  { id: 'notion',     tk: 'auth_onboarding_ats_notion' },
  { id: 'none',       tk: 'auth_onboarding_ats_none' },
]

const WHY_LIST = [
  { id: 'screening',   tk: 'auth_onboarding_why_1' },
  { id: 'fraud',       tk: 'auth_onboarding_why_2' },
  { id: 'compare',     tk: 'auth_onboarding_why_3' },
  { id: 'pool',        tk: 'auth_onboarding_why_4' },
  { id: 'standardize', tk: 'auth_onboarding_why_5' },
]

const SOURCE_LIST = [
  { id: 'linkedin', tk: 'auth_onboarding_heard_linkedin' },
  { id: 'google',   tk: 'auth_onboarding_heard_google' },
  { id: 'referral', tk: 'auth_onboarding_heard_referral' },
  { id: 'social',   tk: 'auth_onboarding_heard_social' },
  { id: 'other',    tk: 'auth_onboarding_heard_other' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  'h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-shadow'
const inputErrorCls =
  'h-11 w-full rounded-lg border border-red-400 bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow'
const labelCls = 'block text-[13px] font-medium text-[#374151] mb-1.5'

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-[7px] text-[13px] transition-all border leading-none ${
        selected
          ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border-[#2563EB] border-[1.5px]'
          : 'bg-[#F8FAFC] text-[#64748B] font-normal border-[#E2E8F0]'
      }`}
    >
      {label}
    </button>
  )
}

// ─── OtherInput — animated inline text field ──────────────────────────────────

function OtherInput({ value, onChange, placeholder }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden"
    >
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-9 w-full max-w-xs rounded-lg border border-[#2563EB] bg-[#EFF6FF] px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-shadow"
      />
    </motion.div>
  )
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const { t } = useTranslation()
  return (
    <div className="relative hidden lg:flex w-1/2 min-h-screen bg-[#0f172a] flex-col overflow-hidden flex-shrink-0">
      {/* Decorative circles */}
      <div
        className="absolute rounded-full bg-[#1E293B]"
        style={{ width: '86%', aspectRatio: '1', left: '39%', top: '42%' }}
      />
      <div
        className="absolute rounded-full bg-[#162032]"
        style={{ width: '58%', aspectRatio: '1', left: '50%', top: '56%' }}
      />
      <div
        className="absolute rounded-full bg-[#1A2D47]"
        style={{ width: '44%', aspectRatio: '1', left: '67%', top: '-9%' }}
      />

      {/* Logo row */}
      <Link href="/" className="relative z-10 flex items-center gap-2.5 px-14 pt-11">
        <Image src="/images/logo.png" alt="CrismaTest logo" width={42} height={36} />
        <span className="text-white font-bold text-lg tracking-tight">CrismaTest</span>
      </Link>

      {/* Tagline — vertically centered in remaining space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-14">
        <h2 className="text-white font-extrabold text-[38px] leading-[1.25] mb-5 max-w-[560px]">
          {t('auth_left_headline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h2>
        <p className="text-[#94A3B8] text-[15px] leading-[1.6] max-w-[520px]">
          {t('auth_left_sub')}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-14 pb-11 text-[#64748B] text-[12px]">
        <span>{t('auth_left_legal')}</span>
      </div>
    </div>
  )
}

// ─── Step 1: Sign-up form ─────────────────────────────────────────────────────

function SignUpForm({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, control, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(signUpSchema),
  })
  const onSubmit = () => onNext()

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-[420px]"
    >
      <h1 className="text-[28px] font-bold text-[#0F172A] mb-1">{t('auth_signup_title')}</h1>
      <p className="text-[14px] text-[#64748B] mb-6">{t('auth_signup_subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Company Name */}
        <div>
          <label className={labelCls}>{t('auth_signup_company_name')}</label>
          <input
            {...register('companyName')}
            type="text"
            placeholder={t('auth_signup_company_name_placeholder')}
            className={errors.companyName ? inputErrorCls : inputCls}
          />
        </div>

        {/* First + Last */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t('auth_signup_first_name')}</label>
            <input
              {...register('firstName')}
              type="text"
              placeholder={t('auth_signup_first_name_placeholder')}
              className={errors.firstName ? inputErrorCls : inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t('auth_signup_last_name')}</label>
            <input
              {...register('lastName')}
              type="text"
              placeholder={t('auth_signup_last_name_placeholder')}
              className={errors.lastName ? inputErrorCls : inputCls}
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label className={labelCls}>{t('auth_signup_email')}</label>
          <input
            {...register('email')}
            type="email"
            placeholder={t('auth_signup_email_placeholder')}
            className={errors.email ? inputErrorCls : inputCls}
          />
        </div>

        {/* Password */}
        <div>
          <label className={labelCls}>{t('auth_signup_password')}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`${errors.password ? inputErrorCls : inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Company Size — custom select */}
        <div>
          <label className={labelCls}>{t('auth_signup_company_size')}</label>
          <Controller
            name="companySize"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SizeSelect value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Country */}
        <div>
          <label className={labelCls}>{t('auth_signup_country')}</label>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CountrySelect
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.country}
              />
            )}
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-lg bg-[#1b4fd8] text-white text-[15px] font-semibold hover:bg-[#1a45c0] transition-colors"
        >
          {t('auth_signup_cta')}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[13px] text-[#6B7280]">{t('auth_or_continue')}</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={() => toast.info(t('auth_google_coming_soon'))}
        className="h-11 w-full flex items-center justify-center gap-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[14px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
      >
        <Globe size={18} className="text-[#6B7280]" />
        {t('auth_google_cta')}
      </button>

      {/* Footer link */}
      <p className="flex items-center justify-center gap-1 text-[13px] text-[#6B7280] mt-5">
        {t('auth_signup_have_account')}
        <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
          {t('auth_signup_login_link')}
        </Link>
      </p>
    </motion.div>
  )
}

// ─── Step 2: OTP modal ────────────────────────────────────────────────────────

function OtpModal({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const r0 = useRef<HTMLInputElement>(null)
  const r1 = useRef<HTMLInputElement>(null)
  const r2 = useRef<HTMLInputElement>(null)
  const r3 = useRef<HTMLInputElement>(null)
  const r4 = useRef<HTMLInputElement>(null)
  const r5 = useRef<HTMLInputElement>(null)
  const refs = [r0, r1, r2, r3, r4, r5]

  const handleInput = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 5) refs[i + 1].current?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const isFull = digits.every((d) => d !== '')

  return (
    <motion.div
      key="otp-modal"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[20px] p-10 w-[480px] flex flex-col gap-5"
    >
      {/* Close */}
      <div className="flex justify-end">
        <button type="button" className="text-[#94A3B8] hover:text-[#475569] transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Mail icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-[32px] bg-[#EFF6FF] border-[1.5px] border-[#BFDBFE] flex items-center justify-center">
          <Mail size={28} className="text-[#2563EB]" />
        </div>
      </div>

      <h2 className="text-[24px] font-bold text-[#0F172A] text-center">{t('auth_otp_title')}</h2>
      <p className="text-[14px] text-[#64748B] text-center leading-[1.6]">
        {t('auth_otp_modal_subtitle')}
      </p>

      {/* OTP boxes */}
      <div className="flex justify-center gap-2.5">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-14 h-16 rounded-[10px] text-center text-[28px] font-bold text-[#0F172A] focus:outline-none transition-all ${
              d
                ? 'border-2 border-[#2563EB] bg-white'
                : 'border-[1.5px] border-[#E2E8F0] bg-[#F8FAFC]'
            }`}
          />
        ))}
      </div>

      {/* Verify */}
      <button
        type="button"
        onClick={onNext}
        disabled={!isFull}
        className="h-12 w-full rounded-[10px] bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {t('auth_otp_cta')}
      </button>

      {/* Resend */}
      <div className="flex items-center justify-center gap-1 text-[13px]">
        <span className="text-[#64748B]">{t('auth_otp_verify_no_receive')}</span>
        <button
          type="button"
          onClick={() => toast.success(t('auth_otp_resend'))}
          className="text-[#2563EB] font-semibold hover:underline"
        >
          {t('auth_otp_resend')}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Step 3: Onboarding 1 ─────────────────────────────────────────────────────

function Onboarding1({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()
  const [industry, setIndustry] = useState<string[]>([])
  const [industryOther, setIndustryOther] = useState('')
  const [volume, setVolume] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [rolesOther, setRolesOther] = useState('')
  const [ats, setAts] = useState('')
  const [atsOther, setAtsOther] = useState('')

  const toggleMulti = (set: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    set((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]))

  const industryHasOther = industry.includes('other')
  const rolesHasOther = roles.includes('other')
  const atsIsOther = ats === 'other'

  return (
    <motion.div
      key="onboarding-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <div className="w-8 h-0.5 bg-[#2563EB]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
        </div>
        <span className="text-[13px] font-medium text-[#64748B]">
          {t('auth_onboarding_step', { current: 1, total: 2 })}
        </span>
      </div>

      <h1 className="text-[26px] font-extrabold text-[#0F172A] tracking-tight mb-1">
        {t('auth_onboarding_step1_title')}
      </h1>
      <p className="text-[14px] text-[#64748B] leading-[1.5] mb-5">{t('auth_onboarding_step1_sub')}</p>

      {/* Industry */}
      <div className="mb-5">
        <p className={labelCls}>{t('auth_onboarding_1_industry')}</p>
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              label={t(opt.tk)}
              selected={industry.includes(opt.id)}
              onClick={() => toggleMulti(setIndustry, opt.id)}
            />
          ))}
          <Chip
            label={t('auth_onboarding_ind_other')}
            selected={industryHasOther}
            onClick={() => {
              toggleMulti(setIndustry, 'other')
              if (industryHasOther) setIndustryOther('')
            }}
          />
        </div>
        <AnimatePresence>
          {industryHasOther && (
            <OtherInput
              value={industryOther}
              onChange={setIndustryOther}
              placeholder={t('auth_onboarding_other_industry')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Volume */}
      <div className="mb-5">
        <p className={labelCls}>{t('auth_onboarding_1_hiring_volume')}</p>
        <div className="flex flex-wrap gap-2">
          {VOLUME_OPTIONS.map((opt) => (
            <Chip key={opt.id} label={opt.label} selected={volume === opt.id} onClick={() => setVolume(opt.id)} />
          ))}
        </div>
      </div>

      {/* Roles */}
      <div className="mb-5">
        <p className={labelCls}>{t('auth_onboarding_1_roles')}</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              label={t(opt.tk)}
              selected={roles.includes(opt.id)}
              onClick={() => toggleMulti(setRoles, opt.id)}
            />
          ))}
          <Chip
            label={t('auth_onboarding_role_other')}
            selected={rolesHasOther}
            onClick={() => {
              toggleMulti(setRoles, 'other')
              if (rolesHasOther) setRolesOther('')
            }}
          />
        </div>
        <AnimatePresence>
          {rolesHasOther && (
            <OtherInput
              value={rolesOther}
              onChange={setRolesOther}
              placeholder={t('auth_onboarding_other_role')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ATS */}
      <div className="mb-6">
        <p className={labelCls}>{t('auth_onboarding_1_ats')}</p>
        <div className="flex flex-wrap gap-2">
          {ATS_LIST.map((opt) => (
            <Chip
              key={opt.id}
              label={t(opt.tk)}
              selected={ats === opt.id}
              onClick={() => {
                setAts(opt.id)
                setAtsOther('')
              }}
            />
          ))}
          <Chip
            label={t('auth_onboarding_ats_other')}
            selected={atsIsOther}
            onClick={() => {
              setAts(atsIsOther ? '' : 'other')
              if (atsIsOther) setAtsOther('')
            }}
          />
        </div>
        <AnimatePresence>
          {atsIsOther && (
            <OtherInput
              value={atsOther}
              onChange={setAtsOther}
              placeholder={t('auth_onboarding_other_ats')}
            />
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="h-12 w-full flex items-center justify-center gap-2 rounded-[10px] bg-[#2563eb] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] transition-colors"
      >
        {t('auth_onboarding_1_cta')} <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

// ─── Step 4: Onboarding 2 ─────────────────────────────────────────────────────

function Onboarding2({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()
  const [why, setWhy] = useState<string[]>([])
  const [source, setSource] = useState('')
  const [sourceOther, setSourceOther] = useState('')

  const toggleWhy = (val: string) =>
    setWhy((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]))

  return (
    <motion.div
      key="onboarding-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <div className="w-8 h-0.5 bg-[#2563EB]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
        </div>
        <span className="text-[13px] font-medium text-[#64748B]">
          {t('auth_onboarding_step', { current: 2, total: 2 })}
        </span>
      </div>

      <h1 className="text-[26px] font-extrabold text-[#0F172A] tracking-tight mb-1">
        {t('auth_onboarding_step2_title')}
      </h1>
      <p className="text-[14px] text-[#64748B] leading-[1.5] mb-5">{t('auth_onboarding_step2_sub')}</p>

      {/* Why checkboxes */}
      <div className="mb-6">
        <p className={labelCls}>{t('auth_onboarding_2_why_title')}</p>
        <div className="flex flex-col gap-3 mt-1">
          {WHY_LIST.map((opt) => {
            const checked = why.includes(opt.id)
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleWhy(opt.id)}
                className="flex items-center gap-3 text-left"
              >
                <div
                  className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center flex-shrink-0 border transition-colors ${
                    checked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#D1D5DB]'
                  }`}
                >
                  {checked && <Check size={11} className="text-white" />}
                </div>
                <span className={`text-[14px] ${checked ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                  {t(opt.tk)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* How did you hear */}
      <div className="mb-8">
        <p className={labelCls}>{t('auth_onboarding_2_how_heard')}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {SOURCE_LIST.map((opt) => (
            <Chip
              key={opt.id}
              label={t(opt.tk)}
              selected={source === opt.id}
              onClick={() => {
                setSource(opt.id)
                if (opt.id !== 'other') setSourceOther('')
              }}
            />
          ))}
        </div>
        <AnimatePresence>
          {source === 'other' && (
            <OtherInput
              value={sourceOther}
              onChange={setSourceOther}
              placeholder={t('auth_onboarding_other_source')}
            />
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="h-12 w-full flex items-center justify-center gap-2 rounded-[10px] bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] transition-colors"
      >
        {t('auth_onboarding_2_cta')} <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

// ─── Step 5: All set modal ────────────────────────────────────────────────────

function AllSetModal({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  return (
    <motion.div
      key="allset-modal"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-[20px] px-12 py-12 w-[480px] flex flex-col items-center gap-6"
    >
      {/* Green check */}
      <div className="w-[72px] h-[72px] rounded-[36px] bg-[#10B981] flex items-center justify-center">
        <Check size={32} className="text-white" strokeWidth={2.5} />
      </div>

      <h2 className="text-[28px] font-extrabold text-[#0F172A] text-center">{t('auth_allset_title')}</h2>
      <p className="text-[14px] text-[#64748B] text-center leading-[1.6]">
        {t('auth_allset_body')}
      </p>

      <button
        type="button"
        onClick={onDone}
        className="h-[52px] w-full flex items-center justify-center gap-2 rounded-[10px] bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] transition-colors"
      >
        {t('auth_allset_cta')} <ArrowRight size={16} />
      </button>

      <span className="text-[13px] text-[#94A3B8]">{t('auth_allset_note')}</span>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [step, setStep] = useState<SignUpStep>('form')
  const router = useRouter()

  const handleDone = () => {
    setAuthSession()
    router.push('/dashboard')
  }

  const isModal = step === 'otp' || step === 'complete'

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 bg-white min-h-screen flex flex-col">
        {/* Language toggle */}
        <div className="flex justify-end px-6 pt-6 pb-2">
          <AuthLangToggle />
        </div>

        {/* Content area — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-10 lg:px-20 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'form' && <SignUpForm key="form" onNext={() => setStep('otp')} />}
            {step === 'onboarding-1' && (
              <Onboarding1 key="onboarding-1" onNext={() => setStep('onboarding-2')} />
            )}
            {step === 'onboarding-2' && (
              <Onboarding2 key="onboarding-2" onNext={() => setStep('complete')} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal overlay for OTP and AllSet */}
      <AnimatePresence>
        {isModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0F172A]/55 flex items-center justify-center z-20"
          >
            <AnimatePresence mode="wait">
              {step === 'otp' && (
                <OtpModal key="otp" onNext={() => setStep('onboarding-1')} />
              )}
              {step === 'complete' && <AllSetModal key="complete" onDone={handleDone} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
