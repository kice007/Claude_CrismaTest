'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Mic, TriangleAlert, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuthLangToggle } from '@/components/auth/AuthLangToggle'

export default function TestCheckPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useTranslation()

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)

  const [micLevel, setMicLevel] = useState(0)
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const [checks, setChecks] = useState({
    alone: false,
    noScreens: false,
    consent: false,
  })

  const isReady = cameraOn && micOn && checks.alone && checks.noScreens && checks.consent

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

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

      setCameraOn(true)
      setMicOn(true)
    } catch {
      setPermissionDenied(true)
    }
  }

  useEffect(() => {
    // startCamera is async — all setState calls execute after the await, never synchronously
    void startCamera() // eslint-disable-line react-hooks/set-state-in-effect
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const ripple = 1 + micLevel * 0.35

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] px-12 h-16 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="CrismaTest" width={42} height={36} className="object-contain" />
          <span className="text-[18px] font-bold text-[#0F2A6B] tracking-tight">CrismaTest</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[16px] font-semibold text-[#0F2A6B]">{t('test_check_title')}</span>
          <AuthLangToggle />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-row p-12 gap-10">
        {/* LEFT — Webcam */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative h-[700px] bg-[#1F2937] rounded-xl overflow-hidden">
            {/* Always mounted so videoRef is available when startCamera runs */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${cameraOn ? 'block' : 'hidden'}`}
            />

            {/* Overlay: loading or denied */}
            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#9CA3AF]">
                {permissionDenied ? (
                  <>
                    <TriangleAlert size={28} className="text-[#EF4444]" />
                    <p className="text-sm text-center px-8 text-[#DC2626]">{t('test_check_permission_denied')}</p>
                    <button
                      onClick={startCamera}
                      className="text-xs border border-[#EF4444] text-[#DC2626] rounded-lg px-4 py-2 hover:bg-[#FEF2F2] transition-colors mt-1"
                    >
                      {t('test_check_retry')}
                    </button>
                  </>
                ) : (
                  <p className="text-sm">{t('test_check_webcam_label')}</p>
                )}
              </div>
            )}

            {/* Mic indicator — concentric ripple circles */}
            <div className="absolute bottom-4 left-4 w-[100px] h-[100px]">
              <div
                className="absolute inset-0 rounded-full bg-[#2563EB] transition-transform duration-75"
                style={{ opacity: 0.08, transform: `scale(${ripple})` }}
              />
              <div
                className="absolute inset-[12px] rounded-full bg-[#2563EB] transition-transform duration-75"
                style={{ opacity: 0.14, transform: `scale(${ripple})` }}
              />
              <div
                className="absolute inset-[22px] rounded-full bg-[#2563EB] transition-transform duration-75"
                style={{ opacity: 0.22, transform: `scale(${ripple})` }}
              />
              <div className="absolute inset-[30px] rounded-full bg-[#2563EB] flex items-center justify-center">
                <Mic size={18} className="text-white" />
              </div>
            </div>
          </div>

          {/* Denied banner below webcam */}
          {permissionDenied && (
            <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#EF4444] rounded-lg px-4 py-2.5">
              <TriangleAlert size={16} className="text-[#EF4444] flex-shrink-0" />
              <span className="text-[13px] text-[#DC2626]">{t('test_check_permission_denied')}</span>
            </div>
          )}
        </div>

        {/* RIGHT — Checklist */}
        <div className="w-[400px] flex flex-col gap-6">
          <h2 className="text-[18px] font-bold text-[#0F2A6B]">{t('test_check_before_begin')}</h2>

          <div className="flex flex-col gap-3.5">
            {/* Camera — auto-checked */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-[#1B4FD8] flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[14px] text-[#374151]">{t('test_check_item_camera')}</span>
            </div>

            {/* Mic — auto-checked */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-[#1B4FD8] flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[14px] text-[#374151]">{t('test_check_item_mic')}</span>
            </div>

            {/* Manual checkboxes */}
            {([
              { key: 'alone', label: t('test_check_item_alone') },
              { key: 'noScreens', label: t('test_check_item_no_screens') },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors cursor-pointer ${checks[key] ? 'bg-[#1B4FD8] border-[#1B4FD8]' : 'bg-white border-[#D1D5DB]'
                    }`}
                  onClick={() => setChecks((c) => ({ ...c, [key]: !c[key] }))}
                >
                  {checks[key] && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-[14px] text-[#374151]">{label}</span>
              </label>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-[#EEF2FF] rounded-lg flex items-start gap-3 py-3.5">
            <div
              className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors cursor-pointer mt-0.5 ${checks.consent ? 'bg-[#1B4FD8] border-[#1B4FD8]' : 'bg-white border-[#1B4FD8]'
                }`}
              onClick={() => setChecks((c) => ({ ...c, consent: !c.consent }))}
            >
              {checks.consent && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-[13px] text-[#374151] leading-relaxed">{t('test_check_disclaimer')}</span>
          </div>

          <button
            disabled={!isReady}
            onClick={() => router.push(`/test/${id}/questions`)}
            className="w-full bg-[#1B4FD8] text-white rounded-lg h-[52px] font-semibold text-[15px] mt-auto hover:bg-[#3B6FE8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('test_check_cta')}
          </button>
        </div>
      </div>
    </div>
  )
}
