'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, PenLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'
import { useAuth } from '@/lib/auth-context'

// ─── Left panel ───────────────────────────────────────────────────────────────
function AuthLeftPanel() {
  const { t } = useTranslation()
  return (
    <div
      className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden min-h-screen"
      style={{ background: '#0f172a' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 320, height: 320, background: '#1A2D47', left: '66.7%', top: '-8.9%' }} />
        <div className="absolute rounded-full" style={{ width: 620, height: 620, background: '#1E293B', left: '38.9%', top: '42.2%' }} />
        <div className="absolute rounded-full" style={{ width: 420, height: 420, background: '#162032', left: '50%', top: '55.6%' }} />
      </div>
      <div className="relative z-10 p-10 flex items-center gap-2.5">
        <Image src="/images/logo.png" alt="CrismaTest logo" width={42} height={36} />
        <span className="text-white text-[18px] font-bold">CrismaTest</span>
      </div>
      <div className="relative z-10 px-14 pb-12">
        <h1 className="text-white font-extrabold leading-tight mb-5" style={{ fontSize: 38, maxWidth: 560 }}>
          {t('auth_left_headline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h1>
        <p className="text-[#94A3B8] text-[15px] leading-relaxed" style={{ maxWidth: 520 }}>
          {t('auth_left_sub')}
        </p>
      </div>
      <div className="relative z-10 px-14 pb-6">
        <p className="text-slate-500 text-xs">{t('auth_left_legal')}</p>
      </div>
    </div>
  )
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 transition-all"
      style={{
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: selected ? 600 : 400,
        color: selected ? '#2563EB' : '#64748B',
        background: selected ? '#EFF6FF' : '#F8FAFC',
        border: selected ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
        lineHeight: 1,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Other inline input ───────────────────────────────────────────────────────
function OtherInput({
  value,
  onChange,
  onCommit,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onCommit: () => void
  placeholder?: string
}) {
  return (
    <input
      autoFocus
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onCommit()}
      onBlur={onCommit}
      placeholder={placeholder}
      className="outline-none"
      style={{
        padding: '6px 12px',
        borderRadius: 20,
        fontSize: 13,
        color: '#0F172A',
        background: '#F8FAFC',
        border: '1.5px solid #2563EB',
        minWidth: 160,
        lineHeight: 1,
      }}
    />
  )
}

// ─── All-set modal ────────────────────────────────────────────────────────────
function AllSetModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-[2px]">
      <div
        className="bg-white w-full max-w-[480px] mx-4 flex flex-col items-center gap-6 text-center"
        style={{ borderRadius: 20, padding: 48 }}
      >
        <div
          className="w-[72px] h-[72px] flex items-center justify-center"
          style={{ background: '#10B981', borderRadius: 36 }}
        >
          <Check size={32} color="#FFFFFF" strokeWidth={2.5} />
        </div>

        <h2
          className="text-[#0F172A] text-center"
          style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}
        >
          {t('auth_allset_title')}
        </h2>

        <p className="text-[14px] text-[#64748B] text-center" style={{ lineHeight: 1.6 }}>
          {t('auth_allset_body')}
        </p>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
          style={{ height: 52, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
        >
          {t('auth_allset_cta')}
          <ArrowRight size={16} />
        </button>

        <span className="text-[13px] text-[#94A3B8]">{t('auth_allset_note')}</span>
      </div>
    </div>
  )
}

// ─── Option definitions (IDs are language-agnostic) ──────────────────────────
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

const ATS_OPTIONS = [
  { id: 'workday',    tk: 'auth_onboarding_ats_workday' },
  { id: 'greenhouse', tk: 'auth_onboarding_ats_greenhouse' },
  { id: 'lever',      tk: 'auth_onboarding_ats_lever' },
  { id: 'notion',     tk: 'auth_onboarding_ats_notion' },
  { id: 'none',       tk: 'auth_onboarding_ats_none' },
]

const WHY_OPTIONS = [
  { id: 'screening',    tk: 'auth_onboarding_why_1' },
  { id: 'fraud',        tk: 'auth_onboarding_why_2' },
  { id: 'compare',      tk: 'auth_onboarding_why_3' },
  { id: 'talent_pool',  tk: 'auth_onboarding_why_4' },
  { id: 'standardize',  tk: 'auth_onboarding_why_5' },
]

const HOW_HEARD_OPTIONS = [
  { id: 'linkedin', tk: 'auth_onboarding_heard_linkedin' },
  { id: 'google',   tk: 'auth_onboarding_heard_google' },
  { id: 'referral', tk: 'auth_onboarding_heard_referral' },
  { id: 'social',   tk: 'auth_onboarding_heard_social' },
  { id: 'other',    tk: 'auth_onboarding_heard_other' },
]

// ─── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation()

  // IDs stored in state, not display labels — safe across language switches
  const [industries, setIndustries] = useState<string[]>(['tech'])
  const [otherIndustry, setOtherIndustry] = useState('')
  const [volume, setVolume] = useState('1-5')
  const [roles, setRoles] = useState<string[]>(['sw_eng', 'pm'])
  const [showOtherRole, setShowOtherRole] = useState(false)
  const [otherRole, setOtherRole] = useState('')
  const [ats, setAts] = useState('none')
  const [otherAts, setOtherAts] = useState('')

  const toggleMulti = (arr: string[], id: string, set: (v: string[]) => void) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id])

  function handleIndustryOtherClick() {
    if (industries.includes('other')) {
      setIndustries((prev) => prev.filter((x) => x !== 'other'))
      setOtherIndustry('')
    } else {
      setIndustries((prev) => [...prev, 'other'])
    }
  }

  function commitOtherIndustry() {
    if (!otherIndustry.trim()) setIndustries((prev) => prev.filter((x) => x !== 'other'))
  }

  function handleOtherRoleClick() {
    if (showOtherRole) { setShowOtherRole(false); setOtherRole('') }
    else setShowOtherRole(true)
  }

  function commitOtherRole() {
    if (!otherRole.trim()) setShowOtherRole(false)
  }

  function handleAtsOtherClick() {
    setAts('other')
    setOtherAts('')
  }

  function commitOtherAts() {
    if (!otherAts.trim()) setAts('none')
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <div className="w-8 bg-[#2563EB]" style={{ height: 2 }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
        </div>
        <span className="text-[13px] font-medium text-[#64748B]">
          {t('auth_onboarding_step', { current: 1, total: 2 })}
        </span>
      </div>

      <h1 className="text-[#0F172A] mt-1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
        {t('auth_onboarding_step1_title')}
      </h1>
      <p className="text-[14px] text-[#64748B]" style={{ lineHeight: 1.5 }}>
        {t('auth_onboarding_step1_sub')}
      </p>

      <div style={{ height: 8 }} />

      {/* Industry */}
      <span className="text-[13px] font-semibold text-[#374151]">{t('auth_onboarding_1_industry')}</span>
      <div style={{ height: 8 }} />
      <div className="flex flex-wrap gap-2">
        {INDUSTRY_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            label={t(opt.tk)}
            selected={industries.includes(opt.id)}
            onClick={() => toggleMulti(industries, opt.id, setIndustries)}
          />
        ))}
        {industries.includes('other') && otherIndustry ? (
          <Chip label={otherIndustry} selected onClick={handleIndustryOtherClick} />
        ) : industries.includes('other') ? (
          <OtherInput
            value={otherIndustry}
            onChange={setOtherIndustry}
            onCommit={commitOtherIndustry}
            placeholder={t('auth_onboarding_other_industry')}
          />
        ) : (
          <Chip label={t('auth_onboarding_ind_other')} selected={false} onClick={handleIndustryOtherClick} />
        )}
      </div>

      <div style={{ height: 8 }} />

      {/* Volume */}
      <span className="text-[13px] font-semibold text-[#374151]">{t('auth_onboarding_1_hiring_volume')}</span>
      <div style={{ height: 8 }} />
      <div className="flex flex-wrap gap-2">
        {VOLUME_OPTIONS.map((opt) => (
          <Chip key={opt.id} label={opt.label} selected={volume === opt.id} onClick={() => setVolume(opt.id)} />
        ))}
      </div>

      <div style={{ height: 8 }} />

      {/* Roles */}
      <span className="text-[13px] font-semibold text-[#374151]">{t('auth_onboarding_1_roles')}</span>
      <div style={{ height: 8 }} />
      <div className="flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            label={t(opt.tk)}
            selected={roles.includes(opt.id)}
            onClick={() => toggleMulti(roles, opt.id, setRoles)}
          />
        ))}
        {showOtherRole && otherRole ? (
          <Chip label={otherRole} selected onClick={handleOtherRoleClick} icon={<PenLine size={12} />} />
        ) : showOtherRole ? (
          <OtherInput
            value={otherRole}
            onChange={setOtherRole}
            onCommit={commitOtherRole}
            placeholder={t('auth_onboarding_other_role')}
          />
        ) : (
          <Chip
            label={t('auth_onboarding_role_other')}
            selected={false}
            onClick={handleOtherRoleClick}
            icon={<PenLine size={12} className="text-[#94A3B8]" />}
          />
        )}
      </div>

      <div style={{ height: 8 }} />

      {/* ATS */}
      <span className="text-[13px] font-semibold text-[#374151]">{t('auth_onboarding_1_ats')}</span>
      <div style={{ height: 8 }} />
      <div className="flex flex-wrap gap-2">
        {ATS_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            label={t(opt.tk)}
            selected={ats === opt.id}
            onClick={() => setAts(opt.id)}
          />
        ))}
        {ats === 'other' && otherAts ? (
          <Chip label={otherAts} selected onClick={handleAtsOtherClick} />
        ) : ats === 'other' ? (
          <OtherInput
            value={otherAts}
            onChange={setOtherAts}
            onCommit={commitOtherAts}
            placeholder={t('auth_onboarding_other_ats')}
          />
        ) : (
          <Chip label={t('auth_onboarding_ats_other')} selected={false} onClick={handleAtsOtherClick} />
        )}
      </div>

      <div style={{ height: 8 }} />

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
        style={{ height: 48, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
      >
        {t('auth_onboarding_1_cta')}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ─── Step 2 ────────────────────────────────────────────────────────────────────
function Step2({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const [reasons, setReasons] = useState<string[]>(['screening', 'fraud'])
  const [source, setSource] = useState('linkedin')

  const toggleReason = (id: string) =>
    setReasons((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <div className="w-8 bg-[#2563EB]" style={{ height: 2 }} />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
        </div>
        <span className="text-[13px] font-medium text-[#64748B]">
          {t('auth_onboarding_step', { current: 2, total: 2 })}
        </span>
      </div>

      <h1 className="text-[#0F172A] mt-1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
        {t('auth_onboarding_step2_title')}
      </h1>
      <p className="text-[14px] text-[#64748B]" style={{ lineHeight: 1.5 }}>
        {t('auth_onboarding_step2_sub')}
      </p>

      <div style={{ height: 8 }} />

      {/* Why */}
      <span className="text-[13px] font-semibold text-[#374151]">{t('auth_onboarding_2_why_title')}</span>
      <div className="flex flex-col gap-3 mt-3">
        {WHY_OPTIONS.map((opt) => {
          const checked = reasons.includes(opt.id)
          return (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => toggleReason(opt.id)}
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: checked ? '#2563EB' : '#FFFFFF',
                  border: checked ? 'none' : '1.5px solid #D1D5DB',
                }}
              >
                {checked && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <span className="text-[14px]" style={{ color: checked ? '#0F172A' : '#64748B' }}>
                {t(opt.tk)}
              </span>
            </label>
          )
        })}
      </div>

      <div style={{ height: 4 }} />

      {/* How heard */}
      <span className="text-[13px] font-semibold text-[#374151] mt-2">{t('auth_onboarding_2_how_heard')}</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {HOW_HEARD_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            label={t(opt.tk)}
            selected={source === opt.id}
            onClick={() => setSource(opt.id)}
          />
        ))}
      </div>

      <div style={{ height: 8 }} />

      <button
        onClick={onDone}
        className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
        style={{ height: 48, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
      >
        {t('auth_onboarding_2_cta')}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ─── Onboarding page ──────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [showAllSet, setShowAllSet] = useState(false)

  return (
    <>
      <div className="min-h-screen flex">
        <AuthLeftPanel />

        {/* Right panel */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex justify-end px-8 py-6">
            <AuthLangToggle />
          </div>
          <div className="flex-1 flex items-center justify-center px-[72px] pb-8">
            <div className="w-full max-w-[615px]">
              {step === 1
                ? <Step1 onNext={() => setStep(2)} />
                : <Step2 onDone={() => setShowAllSet(true)} />
              }
            </div>
          </div>
        </div>
      </div>

      {showAllSet && (
        <AllSetModal onClose={() => { login(); router.push('/dashboard') }} />
      )}
    </>
  )
}
