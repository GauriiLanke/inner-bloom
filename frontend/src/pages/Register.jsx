import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [age, setAge] = useState(22)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', { name, age, email, password })
      // Do not auto-login: ask user to login explicitly after registration.
      setSession('', null)
      toast.success(t('auth.register.success'))
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="bloom-card p-7 text-left">
          <div className="text-2xl font-black text-bloom-ink">{t('auth.register.title')}</div>
          <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
            {t('auth.register.subtitle')}
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-bold text-bloom-ink/70">{t('auth.common.name')}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-bloom-ink/70">{t('auth.common.age')}</label>
              <input
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                type="number"
                min={10}
                max={80}
                required
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-bloom-ink/70">{t('auth.common.email')}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-bloom-ink/70">{t('auth.common.password')}</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                placeholder="••••••••"
              />
            </div>

            <button disabled={loading} className="bloom-btn-primary w-full">
              {loading ? t('auth.register.loading') : t('auth.register.cta')}
            </button>
          </form>

          <div className="mt-5 text-sm font-semibold text-bloom-ink/70">
            {t('auth.register.haveAccount')}{' '}
            <Link to="/login" className="font-extrabold text-bloom-purple">
              {t('auth.common.login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

