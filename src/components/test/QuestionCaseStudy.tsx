'use client'
import { useState } from 'react'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: string[]) => void
}

export default function QuestionCaseStudy({ question, onAnswer }: Props) {
  const [answers, setAnswers] = useState<string[]>((question.subQuestions ?? []).map(() => ''))

  const update = (index: number, value: string) => {
    const next = [...answers]
    next[index] = value
    setAnswers(next)
    onAnswer(next)
  }

  return (
    <div className="space-y-6">
      {/* Scenario card */}
      {question.scenario && (
        <div className="bg-[#EEF2FF] rounded-xl p-4 text-sm text-slate-700 leading-relaxed border-l-4 border-[#1B4FD8]">
          {question.scenario}
        </div>
      )}

      {/* Sub-question textareas */}
      {(question.subQuestions ?? []).map((subQ, i) => (
        <div key={i} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {i + 1}. {subQ}
          </label>
          <textarea
            value={answers[i]}
            onChange={(e) => update(i, e.target.value)}
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]"
          />
        </div>
      ))}
    </div>
  )
}
