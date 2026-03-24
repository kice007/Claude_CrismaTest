'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import type { Variants } from 'motion-dom'
import { fadeUp, fadeIn } from '@/lib/animations'

const calcStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } },
}

export default function TestCalculatingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/test/${id}/result`)
    }, 6000)
    return () => clearTimeout(timer)
  }, [id, router])

  return (
    <div className="min-h-screen bg-[#0F2A6B] flex items-center justify-center relative overflow-hidden">
      {/* Background floating particles */}
      {[
        { top: '15%', left: '12%', size: 6, delay: 0 },
        { top: '25%', right: '10%', size: 4, delay: 1 },
        { top: '70%', left: '8%', size: 5, delay: 2 },
        { top: '60%', right: '15%', size: 7, delay: 0.5 },
        { top: '40%', left: '85%', size: 4, delay: 1.5 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-400/20"
          style={{ top: p.top, left: 'left' in p ? p.left : undefined, right: 'right' in p ? p.right : undefined, width: p.size, height: p.size }}
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* Centered card */}
      <div className="bg-[#0F2A6B] border border-blue-800 rounded-2xl p-14 max-w-md w-full text-center shadow-2xl relative z-10">
        {/* Pulsing ring + spinner */}
        <div className="w-48 h-48 mx-auto mb-10 relative">
          <div className="absolute inset-0 rounded-full border-[6px] border-blue-800" />
          <motion.div
            className="absolute inset-0 rounded-full border-[6px] border-[#1B4FD8]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-transparent border-t-[#1B4FD8] rounded-full"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-white mb-8">{t('test_calculating_title')}</h1>

        {/* Staggered steps */}
        <motion.ul
          variants={calcStaggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3 text-left"
        >
          {[
            t('test_calculating_step_1'),
            t('test_calculating_step_2'),
            t('test_calculating_step_3'),
            t('test_calculating_step_4'),
          ].map((step, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 text-blue-200 text-sm"
            >
              <motion.span
                variants={fadeIn}
                className="w-5 h-5 rounded-full bg-[#1B4FD8]/40 flex items-center justify-center text-[#1B4FD8] text-xs shrink-0"
              >
                {i + 1}
              </motion.span>
              {step}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
