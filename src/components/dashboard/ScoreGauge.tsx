'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface ScoreGaugeProps {
  score: number
  size?: number
}

function gradeLabel(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 70) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

function gradeColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-blue-100 text-blue-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-red-100 text-red-800'
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10
  const circumference = 2 * Math.PI * r

  const [dashOffset, setDashOffset] = useState(circumference)

  useEffect(() => {
    // Trigger animation after mount
    const target = circumference * (1 - score / 100)
    const timer = setTimeout(() => setDashOffset(target), 50)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={10}
          />
          {/* Progress */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#1B4FD8"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Score number centered */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
        >
          <span
            className="font-bold text-slate-900 leading-none"
            style={{ fontSize: size * 0.22 }}
          >
            {score}
          </span>
          <span className="text-slate-400 text-xs mt-1">/ 100</span>
        </div>
      </div>

      {/* Grade badge */}
      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${gradeColor(score)}`}>
        Grade {gradeLabel(score)}
      </span>
    </div>
  )
}
