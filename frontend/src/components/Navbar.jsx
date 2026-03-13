import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut, Sparkles } from 'lucide-react'

import Logo from './Logo'
import LanguageSelect from './LanguageSelect'
import { useAuth } from '../context/AuthContext'

const navLinkBase =
  'text-sm font-semibold text-bloom-ink/70 hover:text-bloom-ink transition px-3 py-2 rounded-full'

export default function Navbar() {
  const { t } = useTranslation()
  const { isAuthed, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="bloom-card flex items-center justify-between px-4 py-3">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/#about" className={navLinkBase}>
              {t('nav.about')}
            </NavLink>
            <NavLink to="/assessment" className={navLinkBase}>
              {t('nav.assessment')}
            </NavLink>
            <NavLink to="/#features" className={navLinkBase}>
              {t('nav.features')}
            </NavLink>
            <NavLink to="/#contact" className={navLinkBase}>
              {t('nav.contact')}
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelect className="hidden sm:inline-flex" />

            {isAuthed ? (
              <div className="flex items-center gap-2">
                <div className="hidden text-xs font-semibold text-bloom-ink/70 sm:block">
                  {user?.name}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    navigate('/')
                  }}
                  className="bloom-btn-ghost px-4 py-2 text-sm"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bloom-btn-primary px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4" />
                {t('nav.start')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

