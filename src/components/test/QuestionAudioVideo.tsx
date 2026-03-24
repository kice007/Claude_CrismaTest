'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MockQuestion } from '@/lib/mock-data'

interface Props {
  question: MockQuestion
  onAnswer: (a: Blob | null) => void
}

type RecState = 'idle' | 'recording' | 'preview'

export default function QuestionAudioVideo({ question: _question, onAnswer }: Props) {
  const { t } = useTranslation()
  const [recState, setRecState] = useState<RecState>('idle')
  const [timeLeft, setTimeLeft] = useState(90)
  const [blob, setBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/mp4'
      chunksRef.current = []
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: mimeType })
        setBlob(recorded)
        onAnswer(recorded)
        stream.getTracks().forEach((t) => t.stop())
        setRecState('preview')
      }

      recorder.start()
      setRecState('recording')
      setTimeLeft(90)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            recorder.stop()
            clearInterval(timerRef.current!)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      // Graceful fallback — no webcam available
      setRecState('idle')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const reRecord = () => {
    setBlob(null)
    setTimeLeft(90)
    setRecState('idle')
  }

  useEffect(() => {
    if (recState === 'preview' && blob && videoPreviewRef.current) {
      videoPreviewRef.current.src = URL.createObjectURL(blob)
    }
  }, [recState, blob])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const progressPct = recState === 'recording' ? ((90 - timeLeft) / 90) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Video area */}
      <div className="w-full aspect-video bg-[#1F2937] rounded-xl flex items-center justify-center overflow-hidden">
        {recState === 'preview' && blob ? (
          <video ref={videoPreviewRef} controls className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 text-sm">
            {recState === 'recording' ? '● REC' : 'Camera preview'}
          </span>
        )}
      </div>

      {/* Progress bar (recording only) */}
      {recState === 'recording' && (
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B4FD8] rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Timer (recording) */}
      {recState === 'recording' && (
        <p className="text-center text-sm font-mono text-slate-500">
          {timeLeft}s remaining
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {recState === 'idle' && (
          <button
            onClick={startRecording}
            className="flex-1 bg-[#1B4FD8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#3B6FE8] transition-colors"
          >
            {t('test_questions_record_cta')}
          </button>
        )}
        {recState === 'recording' && (
          <button
            onClick={stopRecording}
            className="flex-1 bg-red-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-red-600 transition-colors"
          >
            {t('test_questions_stop_cta')}
          </button>
        )}
        {recState === 'preview' && (
          <>
            <button
              onClick={reRecord}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {t('test_questions_rerecord_cta')}
            </button>
            <button
              onClick={() => onAnswer(blob)}
              className="flex-1 bg-[#1B4FD8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#3B6FE8] transition-colors"
            >
              {t('test_questions_submit_recording')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
