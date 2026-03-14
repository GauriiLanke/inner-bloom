import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { api } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Feedback() {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const loadAnalytics = async () => {
    try {
      const res = await api.get('/feedback/analytics')
      setAnalytics(res.data)
    } catch {
      setAnalytics(null)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/feedback', { rating, comment })
      toast.success(t('feedbackPage.thanks'))
      setComment('')
      await loadAnalytics()
    } catch (err) {
      toast.error(err?.response?.data?.message || t('feedbackPage.error'))
    } finally {
      setLoading(false)
    }
  }

  const chart = useMemo(() => {
    const s = analytics?.summary
    if (!s) return null
    return {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Ratings',
          data: [s.r1, s.r2, s.r3, s.r4, s.r5],
          backgroundColor: ['#F43F5E', '#FB7185', '#FBBF24', '#A78BFA', '#7C3AED'],
          borderRadius: 10,
        },
      ],
    }
  }, [analytics])

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            {t('feedbackPage.badge')}
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            {t('feedbackPage.title').split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-bloom-purple">
              {t('feedbackPage.title').split(' ').slice(-2).join(' ')}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            {t('feedbackPage.subtitle')}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="bloom-card p-7 lg:col-span-1 text-left">
            <div className="text-sm font-extrabold text-bloom-ink">
              {t('feedbackPage.submitTitle')}
            </div>
            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-bold text-bloom-ink/70">
                  {t('feedbackPage.ratingLabel')}
                </span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
                <div className="text-sm font-extrabold text-bloom-purple">{rating} / 5</div>
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold text-bloom-ink/70">
                  {t('feedbackPage.commentLabel')}
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  placeholder={t('feedbackPage.commentPlaceholder')}
                />
              </label>

              <button disabled={loading} className="bloom-btn-primary w-full">
                {loading ? t('feedbackPage.submitting') : t('feedbackPage.submit')}
              </button>
            </form>
          </div>

          <div className="bloom-card p-7 lg:col-span-2">
            <div className="text-left">
              <div className="text-sm font-extrabold text-bloom-ink">
                {t('feedbackPage.analyticsTitle')}
              </div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
                {t('feedbackPage.analyticsSubtitle')}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">
                  {t('feedbackPage.total')}
                </div>
                <div className="mt-1 text-2xl font-black text-bloom-ink">{analytics?.summary?.count ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">
                  {t('feedbackPage.average')}
                </div>
                <div className="mt-1 text-2xl font-black text-bloom-ink">
                  {analytics?.summary?.avgRating ? analytics.summary.avgRating.toFixed(2) : '0.00'}
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">
                  {t('feedbackPage.topTags')}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(analytics?.topTags || []).slice(0, 6).map((t) => (
                    <span
                      key={t.tag}
                      className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-bloom-ink/70"
                    >
                      {t.tag} ({t.count})
                    </span>
                  ))}
                  {!analytics?.topTags?.length ? (
                    <span className="text-xs font-semibold text-bloom-ink/60">
                      {t('feedbackPage.noTags')}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/70 bg-white/60 p-4">
              {chart ? (
                <Bar
                  data={chart}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              ) : (
                <div className="text-sm font-semibold text-bloom-ink/70">
                  {t('feedbackPage.noAnalytics')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

