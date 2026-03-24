'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { setAuthSession, clearAuthSession, getIsLoggedIn } from '@/lib/auth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isLoggedIn: boolean
  login: () => void   // calls setAuthSession() + sets state
  logout: () => void  // calls clearAuthSession() + sets state + router.push('/')
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Hydrate from localStorage after mount (SSR-safe)
    setIsLoggedIn(getIsLoggedIn())
  }, [])

  // NOTE: useCallback is intentionally used here — this is a provider, not a
  // React Compiler-managed component. The compiler only manages components,
  // not context providers.
  const login = useCallback(() => {
    setAuthSession()
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setIsLoggedIn(false)
    router.push('/')
  }, [router])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
