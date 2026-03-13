import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setSession(res.data?.token, res.data?.user)
      toast.success('Welcome back!')
      navigate('/assessment')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="bloom-card p-7 text-left">
          <div className="text-2xl font-black text-bloom-ink">Login</div>
          <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
            Sign in to continue your PCOS wellness journey.
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-bold text-bloom-ink/70">Email</label>
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
              <label className="text-xs font-bold text-bloom-ink/70">Password</label>
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
              {loading ? 'Signing in…' : t('common.submit')}
            </button>
          </form>

          <div className="mt-5 text-sm font-semibold text-bloom-ink/70">
            New here?{' '}
            <Link to="/register" className="font-extrabold text-bloom-purple">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

