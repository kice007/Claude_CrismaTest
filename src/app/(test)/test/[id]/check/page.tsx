'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function TestCheckPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)

  const [micLevel, setMicLevel] = useState(0)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [checks, setChecks] = useState({
    camera: false,
    mic: false,
    alone: false,
    noScreens: false,
  })
  const [disclaimerChecked, setDisclaimerChecked] = useState(false)

  const isReady =
    checks.camera && checks.mic && checks.alone && checks.noScreens && disclaimerChecked

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Web Audio API for mic level — created inside success callback
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setMicLevel(avg / 255)
        animFrameRef.current = requestAnimationFrame(tick)
      }
      animFrameRef.current = requestAnimationFrame(tick)

      setPermissionGranted(true)
      setChecks((prev) => ({ ...prev, camera: true, mic: true }))
    } catch {
      setPermissionDenied(true)
      toast.error(t('test_check_permission_denied'))
    }
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-100 px-6 py-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-[#0F2A6B]">CrismaTest</span>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-500">{t('test_check_title')}</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT — webcam + mic */}
          <div className="space-y-4">
            {/* Webcam preview */}
            <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video">
              {permissionGranted ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  {permissionDenied
                    ? t('test_check_permission_denied')
                    : t('test_check_webcam_label')}
                </div>
              )}
            </div>

            {/* Mic level bars */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">{t('test_check_mic_label')}</p>
              <div className="flex items-end gap-1 h-8">
                {Array.from({ length: 7 }).map((_, i) => {
                  const threshold = (i + 1) / 7
                  const active = micLevel > threshold * 0.3
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-75"
                      style={{
                        height: `${((i + 1) / 7) * 100}%`,
                        backgroundColor: active ? '#1B4FD8' : '#E2E8F0',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Permission button / retry */}
            {!permissionGranted && (
              <button
                onClick={requestPermissions}
                className="w-full border border-[#1B4FD8] text-[#1B4FD8] rounded-lg py-2.5 text-sm font-medium hover:bg-[#EEF2FF] transition-colors"
              >
                {permissionDenied ? t('test_check_retry') : t('test_check_permission_cta')}
              </button>
            )}
          </div>

          {/* RIGHT — checklist */}
          <div className="space-y-3">
            {[
              { key: 'camera' as const, label: t('test_check_item_camera') },
              { key: 'mic' as const, label: t('test_check_item_mic') },
              { key: 'alone' as const, label: t('test_check_item_alone') },
              { key: 'noScreens' as const, label: t('test_check_item_no_screens') },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={(e) => setChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                  disabled={key === 'camera' || key === 'mic'}
                  className="w-4 h-4 rounded accent-[#1B4FD8]"
                />
                <span className="text-sm text-slate-700">{label}</span>
                {checks[key] && <span className="ml-auto text-[#1B4FD8]">✓</span>}
              </label>
            ))}

            {/* Disclaimer */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded accent-[#1B4FD8]"
              />
              <span className="text-xs text-slate-500">{t('test_check_disclaimer')}</span>
            </label>

            {/* I'm Ready CTA */}
            <button
              disabled={!isReady}
              onClick={() => router.push(`/test/${id}/questions`)}
              className="w-full bg-[#1B4FD8] text-white rounded-xl py-3.5 font-semibold mt-4 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3B6FE8]"
            >
              {t('test_check_cta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
