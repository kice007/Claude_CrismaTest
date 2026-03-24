'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { MOCK_TEST } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import QuestionQCM from '@/components/test/QuestionQCM'
import QuestionDragDrop from '@/components/test/QuestionDragDrop'
import QuestionCaseStudy from '@/components/test/QuestionCaseStudy'
import QuestionSimulation from '@/components/test/QuestionSimulation'
import QuestionAudioVideo from '@/components/test/QuestionAudioVideo'
import QuestionShortText from '@/components/test/QuestionShortText'

export default function TestQuestionsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const questions = MOCK_TEST.questions
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(MOCK_TEST.duration * 60)

  const current = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const timerColor =
    timeRemaining <= 30 ? '#EF4444' : timeRemaining <= 60 ? '#F59E0B' : '#64748B'

  useEffect(() => {
    if (timeRemaining <= 0) {
      sessionStorage.setItem('crismatest_answers', JSON.stringify(answers))
      router.push(`/test/${id}/calculating`)
      return
    }
    const timer = setInterval(() => setTimeRemaining((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeRemaining, id, router, answers])

  const handleAnswer = (answer: unknown) => {
    setAnswers((prev) => ({ ...prev, [current.id]: answer }))
  }

  const handleSubmit = () => {
    sessionStorage.setItem('crismatest_answers', JSON.stringify(answers))
    router.push(`/test/${id}/calculating`)
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      next.has(current.id) ? next.delete(current.id) : next.add(current.id)
      return next
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-10 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Progress */}
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1">
              {t('test_questions_progress', {
                current: currentIndex + 1,
                total: questions.length,
              })}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1B4FD8] rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          {/* Module badge */}
          <span className="text-xs font-semibold bg-[#EEF2FF] text-[#6366F1] px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
            {current.module}
          </span>
          {/* Timer */}
          <div
            className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-medium tabular-nums px-3 py-1.5 rounded-lg border"
            style={{ color: timerColor, borderColor: timerColor + '33' }}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
            {current.question}
          </h2>

          {current.type === 'qcm' && (
            <QuestionQCM question={current} onAnswer={handleAnswer} />
          )}
          {current.type === 'dragdrop' && (
            <QuestionDragDrop question={current} onAnswer={handleAnswer} />
          )}
          {current.type === 'casestudy' && (
            <QuestionCaseStudy question={current} onAnswer={handleAnswer} />
          )}
          {current.type === 'simulation' && (
            <QuestionSimulation question={current} onAnswer={handleAnswer} />
          )}
          {current.type === 'audiovideo' && (
            <QuestionAudioVideo question={current} onAnswer={handleAnswer} />
          )}
          {current.type === 'shorttext' && (
            <QuestionShortText question={current} onAnswer={handleAnswer} />
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t('test_questions_prev')}
          </button>
          <button
            onClick={toggleFlag}
            className={`text-sm font-medium transition-colors ${
              flagged.has(current.id)
                ? 'text-[#6366F1]'
                : 'text-slate-400 hover:text-[#6366F1]'
            }`}
          >
            {t('test_questions_flag')}
          </button>
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="bg-[#1B4FD8] text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#3B6FE8] transition-colors"
            >
              {t('test_questions_submit')}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="bg-[#1B4FD8] text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#3B6FE8] transition-colors"
            >
              {t('test_questions_next')}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
