'use client'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { z } from 'zod'
import { fadeUp, staggerContainer } from '@/lib/animations'

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export default function TestUserInfoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    sessionStorage.setItem('crismatest_candidate_info', JSON.stringify(data))
    router.push(`/test/${id}/check`)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL */}
      <div className="bg-[#0F2A6B] lg:w-1/2 flex flex-col items-center justify-center p-10 lg:p-16 text-white min-h-[40vh] lg:min-h-screen">
        <div className="mb-6">
          <span className="text-2xl font-bold tracking-tight">CrismaTest</span>
        </div>
        {/* Step badge */}
        <span className="text-xs font-semibold text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full mb-4">
          {t('test_userinfo_step_badge')}
        </span>
        <p className="text-lg text-blue-100 text-center max-w-xs mt-2">
          {t('test_userinfo_left_tagline')}
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-slate-900 mb-6"
          >
            {t('test_userinfo_title')}
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('test_userinfo_full_name')}
              </label>
              <input
                {...register('fullName')}
                placeholder={t('test_userinfo_full_name_placeholder')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{t('auth_field_required')}</p>
              )}
            </motion.div>

            {/* Email Address */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('test_userinfo_email')}
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder={t('test_userinfo_email_placeholder')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{t('auth_invalid_email')}</p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('test_userinfo_phone')}
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder={t('test_userinfo_phone_placeholder')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{t('auth_field_required')}</p>
              )}
            </motion.div>

            {/* Job Title */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('test_userinfo_job_title')}
              </label>
              <input
                {...register('jobTitle')}
                placeholder={t('test_userinfo_job_title_placeholder')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
              {errors.jobTitle && (
                <p className="text-xs text-red-500 mt-1">{t('auth_field_required')}</p>
              )}
            </motion.div>

            {/* Company */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('test_userinfo_company')}
              </label>
              <input
                {...register('company')}
                placeholder={t('test_userinfo_company_placeholder')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
              />
              {errors.company && (
                <p className="text-xs text-red-500 mt-1">{t('auth_field_required')}</p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp} transition={{ duration: 0.3 }} className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#1B4FD8] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#3B6FE8] transition-colors text-base"
              >
                {t('test_userinfo_cta')}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
