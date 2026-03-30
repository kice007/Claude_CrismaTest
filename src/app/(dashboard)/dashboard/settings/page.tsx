'use client'
import { useTranslation } from 'react-i18next'

export default function SettingsPage() {
  const { t } = useTranslation()
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>{t('dashboard.settings.title')}</span>
      <span style={{ fontSize: 14, color: '#94A3B8' }}>{t('dashboard.settings.comingSoon')}</span>
    </div>
  )
}
