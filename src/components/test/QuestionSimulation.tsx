'use client'
import { useState } from 'react'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: string) => void
}

export default function QuestionSimulation({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const pick = (option: string) => {
    const next = selected === option ? null : option
    setSelected(next)
    onAnswer(next ?? '')
  }

  return (
    <div className="space-y-6">
      {/* Scenario card */}
      {question.scenario && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#EEF2FF] rounded-xl p-4 text-sm text-slate-700 leading-relaxed border-l-4 border-[#1B4FD8] md:col-span-1">
            <p className="text-xs font-semibold text-[#1B4FD8] mb-2 uppercase tracking-wide">
              Scenario
            </p>
            {question.scenario}
          </div>
          <div className="space-y-3">
            {(question.options ?? []).map((option) => {
              const active = selected === option
              return (
                <button
                  key={option}
                  onClick={() => pick(option)}
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
        </div>
      )}

      {/* No scenario — just options */}
      {!question.scenario && (
        <div className="space-y-3">
          {(question.options ?? []).map((option) => {
            const active = selected === option
            return (
              <button
                key={option}
                onClick={() => pick(option)}
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
      )}
    </div>
  )
}
