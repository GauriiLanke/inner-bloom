import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('innerbloom_token') || '')
  const [user, setUser] = useState(null)
  const isAuthed = Boolean(token)

  const setSession = (nextToken, nextUser) => {
    const t = nextToken || ''
    setToken(t)
    if (t) localStorage.setItem('innerbloom_token', t)
    else localStorage.removeItem('innerbloom_token')
    setUser(nextUser || null)
  }

  const logout = () => setSession('', null)

  useEffect(() => {
    let ignore = false
    async function loadMe() {
      if (!token) return
      try {
        const res = await api.get('/auth/me')
        if (!ignore) setUser(res.data?.user || null)
      } catch {
        if (!ignore) logout()
      }
    }
    loadMe()
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      setSession,
      logout,
    }),
    [token, user, isAuthed],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

