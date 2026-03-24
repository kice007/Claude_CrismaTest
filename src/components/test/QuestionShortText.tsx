'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: string) => void
}

export default function QuestionShortText({ question, onAnswer }: Props) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const limit = question.wordLimit ?? 150
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length
  const overLimit = wordCount > limit

  const handleChange = (value: string) => {
    setText(value)
    onAnswer(value)
  }

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={6}
        className="w-full border-2 border-[#1B4FD8] rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30"
        placeholder="Write your answer here..."
      />
      <p className={`text-xs text-right ${overLimit ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
        {t('test_questions_word_count', { count: wordCount, limit })}
      </p>
    </div>
  )
}
