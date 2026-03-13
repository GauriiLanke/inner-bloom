import { createContext, useContext, useMemo, useState } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(i18n.language || 'en')

  const setLanguage = (lng) => {
    const next = ['en', 'hi', 'mr'].includes(lng) ? lng : 'en'
    setLanguageState(next)
    i18n.changeLanguage(next)
    localStorage.setItem('innerbloom_lang', next)
  }

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

