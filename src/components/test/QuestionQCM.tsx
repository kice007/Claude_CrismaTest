'use client'
import { useState } from 'react'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: string[]) => void
}

export default function QuestionQCM({ question, onAnswer }: Props) {
  const isMulti = question.question.toLowerCase().includes('select all')
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (option: string) => {
    let next: string[]
    if (isMulti) {
      next = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    } else {
      next = selected.includes(option) ? [] : [option]
    }
    setSelected(next)
    onAnswer(next)
  }

  return (
    <div className="space-y-3">
      {(question.options ?? []).map((option) => {
        const active = selected.includes(option)
        return (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors min-h-[48px] ${
              active
                ? 'bg-[#EEF2FF] border-[#1B4FD8] text-[#1B4FD8] font-medium'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
