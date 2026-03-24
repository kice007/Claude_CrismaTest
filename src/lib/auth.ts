// src/lib/auth.ts
// Visual-only auth: localStorage flag for UI reactivity + cookie for proxy.ts edge guard.
// NEVER called from Server Components or proxy.ts — browser APIs only.

export function setAuthSession(): void {
  localStorage.setItem('crismatest_isLoggedIn', 'true')
  // Companion cookie read by src/proxy.ts at edge runtime
  document.cookie = 'crismatest_auth=1; path=/; SameSite=Lax'
}

export function clearAuthSession(): void {
  localStorage.removeItem('crismatest_isLoggedIn')
  document.cookie = 'crismatest_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function getIsLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('crismatest_isLoggedIn') === 'true'
}
