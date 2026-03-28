'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { MOCK_TEST, MockQuestion } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'

// ─── QCM ─────────────────────────────────────────────────────────────────────
function QuestionQCM({
  question,
  value,
  onChange,
}: {
  question: MockQuestion
  value: string | undefined
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-3">
      {question.options?.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-colors ${value === opt
            ? 'border-[#1B4FD8] bg-[#EEF2FF] text-[#1B4FD8] font-medium'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
          <span className="flex items-center gap-3">
            <span
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${value === opt ? 'border-[#1B4FD8] bg-[#1B4FD8]' : 'border-slate-300'
                }`}
            >
              {value === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            {opt}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── DRAG DROP ────────────────────────────────────────────────────────────────
function QuestionDragDrop({
  question,
  value,
  onChange,
}: {
  question: MockQuestion
  value: string[] | undefined
  onChange: (v: string[]) => void
}) {
  const [items, setItems] = useState<string[]>(value ?? question.items ?? [])
  const dragIndex = useRef<number | null>(null)

  const onDragStart = (i: number) => {
    dragIndex.current = i
  }
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === i) return
    const next = [...items]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(i, 0, moved)
    dragIndex.current = i
    setItems(next)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-slate-200 bg-white cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors"
        >
          <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-xs font-medium text-slate-500 flex-shrink-0">
            {i + 1}
          </span>
          <span className="text-sm text-slate-700 flex-1">{item}</span>
          <span className="text-slate-300 select-none">⋮⋮</span>
        </div>
      ))}
    </div>
  )
}

// ─── CASE STUDY / SIMULATION — scenario + MCQ ────────────────────────────────
function QuestionScenario({
  question,
  value,
  onChange,
}: {
  question: MockQuestion
  value: string | undefined
  onChange: (v: string) => void
}) {
  const opts = question.options ?? []
  const isHorizontal = opts.length <= 3 && opts.every((o) => o.length < 60)

  return (
    <div className="space-y-5">
      {/* Scenario box */}
      {question.scenario && (
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {question.scenario}
        </div>
      )}

      {/* Options */}
      {isHorizontal ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {opts.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-left px-4 py-4 rounded-xl border text-sm transition-colors ${value === opt
                ? 'border-[#1B4FD8] bg-[#EEF2FF] text-[#1B4FD8] font-medium'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {opts.map((opt) => {
            const [head, ...rest] = opt.split('\n')
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors ${value === opt
                  ? 'border-[#1B4FD8] bg-[#EEF2FF]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <p className={`text-sm font-medium ${value === opt ? 'text-[#1B4FD8]' : 'text-slate-800'}`}>
                  {head}
                </p>
                {rest.length > 0 && (
                  <p className="text-xs text-slate-500 mt-0.5">{rest.join('\n')}</p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── AUDIO / VIDEO ────────────────────────────────────────────────────────────
function QuestionAudioVideo({
  onChange,
}: {
  question: MockQuestion
  onChange: (v: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [camReady, setCamReady] = useState(false)
  const [recording, setRecording] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setCamReady(true)
      })
      .catch(() => { })
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    if (!recording) return
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [recording])

  const startRecording = () => {
    if (!streamRef.current) return
    chunksRef.current = []
    const rec = new MediaRecorder(streamRef.current)
    rec.ondataavailable = (e) => chunksRef.current.push(e.data)
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setPreview(url)
      onChange(url)
      if (videoRef.current) videoRef.current.srcObject = null
    }
    rec.start()
    recorderRef.current = rec
    setRecording(true)
    setElapsed(0)
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="space-y-4">
      {/* Video block */}
      <div className="relative bg-[#1a1f2e] rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
        {preview ? (
          <video src={preview} controls className="w-full h-full object-cover" />
        ) : (
          <>
            {camReady && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover absolute inset-0"
              />
            )}
            {!camReady && (
              <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span>Video recording area — [camera off/on]</span>
              </div>
            )}
            {recording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-medium rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {formatTime(elapsed)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!preview && !recording && (
          <button
            onClick={startRecording}
            disabled={!camReady}
            className="flex items-center gap-2 bg-red-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            Start recording
          </button>
        )}
        {recording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-600 transition-colors"
          >
            ■ Stop recording
          </button>
        )}
        {preview && (
          <button
            onClick={() => {
              setPreview(null)
              if (videoRef.current && streamRef.current) {
                videoRef.current.srcObject = streamRef.current
              }
              onChange('')
            }}
            className="text-sm text-[#1B4FD8] border border-[#1B4FD8] rounded-lg px-4 py-2.5 hover:bg-[#EEF2FF] transition-colors"
          >
            Re-record
          </button>
        )}
        {!recording && !preview && (
          <button className="text-sm text-slate-500 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors">
            Preview before submit
          </button>
        )}
      </div>
    </div>
  )
}

// ─── SHORT TEXT ───────────────────────────────────────────────────────────────
function QuestionShortText({
  question,
  value,
  onChange,
}: {
  question: MockQuestion
  value: string | undefined
  onChange: (v: string) => void
}) {
  const limit = question.wordLimit ?? 150
  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0
  const over = wordCount > limit

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          placeholder="Start typing your answer..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30 focus:border-[#1B4FD8] resize-none"
        />
        <p className={`absolute bottom-3 right-4 text-xs ${over ? 'text-red-500' : 'text-slate-400'}`}>
          {wordCount} / {limit} words
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange('')}
          className="text-sm text-slate-600 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
        <button
          disabled={wordCount === 0}
          className="text-sm font-medium bg-[#1B4FD8] text-white rounded-lg px-4 py-2 hover:bg-[#3B6FE8] transition-colors disabled:opacity-40"
        >
          Validate answer
        </button>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
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
  const isLast = currentIndex === questions.length - 1
  const progress = ((currentIndex + 1) / questions.length) * 100

  const timerColor =
    timeRemaining <= 30 ? '#EF4444' : timeRemaining <= 60 ? '#F59E0B' : '#64748B'

  useEffect(() => {
    if (timeRemaining <= 0) {
      sessionStorage.setItem('crismatest_answers', JSON.stringify(answers))
      router.push(`/test/${id}/calculating`)
      return
    }
    const t = setInterval(() => setTimeRemaining((v) => v - 1), 1000)
    return () => clearInterval(t)
  }, [timeRemaining, id, router, answers])

  const handleAnswer = (v: unknown) => {
    setAnswers((prev) => ({ ...prev, [current.id]: v }))
  }

  const handleNext = () => {
    if (isLast) {
      sessionStorage.setItem('crismatest_answers', JSON.stringify(answers))
      router.push(`/test/${id}/calculating`)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(current.id)) {
        next.delete(current.id)
      } else {
        next.add(current.id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-slate-100 w-full">
        <div
          className="h-full bg-[#1B4FD8] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header row */}
      <header className="flex items-center justify-end gap-4 px-6 py-3 border-b border-slate-50">
        <span className="text-xs font-semibold bg-[#EEF2FF] text-[#1B4FD8] px-3 py-1 rounded-full">
          {current.module}
        </span>
        <span
          className="text-sm font-medium tabular-nums"
          style={{ color: timerColor }}
        >
          {formatTime(timeRemaining)}
        </span>
        <AuthLangToggle />
      </header>

      {/* Body */}
      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h2 className="text-lg font-semibold text-slate-900 leading-relaxed mb-8">
          {current.question}
        </h2>

        {current.type === 'qcm' && (
          <QuestionQCM
            question={current}
            value={answers[current.id] as string}
            onChange={handleAnswer}
          />
        )}
        {current.type === 'dragdrop' && (
          <QuestionDragDrop
            question={current}
            value={answers[current.id] as string[]}
            onChange={handleAnswer}
          />
        )}
        {(current.type === 'casestudy' || current.type === 'simulation') && (
          <QuestionScenario
            question={current}
            value={answers[current.id] as string}
            onChange={handleAnswer}
          />
        )}
        {current.type === 'audiovideo' && (
          <QuestionAudioVideo
            question={current}
            onChange={handleAnswer}
          />
        )}
        {current.type === 'shorttext' && (
          <QuestionShortText
            question={current}
            value={answers[current.id] as string}
            onChange={handleAnswer}
          />
        )}
      </main>

      {/* Footer nav */}
      <footer className="border-t border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {t('test_questions_prev')}
          </button>

          <button
            onClick={toggleFlag}
            className={`text-sm transition-colors ${flagged.has(current.id)
              ? 'text-amber-500 font-medium'
              : 'text-slate-400 hover:text-amber-500'
              }`}
          >
            {t('test_questions_flag')}
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#1B4FD8] text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-[#3B6FE8] transition-colors"
          >
            {isLast ? t('test_questions_submit') : `${t('test_questions_next')} `}
          </button>
        </div>
      </footer>
    </div>
  )
}
