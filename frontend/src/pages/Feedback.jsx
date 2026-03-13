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

import { api } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Feedback() {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

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
      toast.success('Thanks for your feedback!')
      setComment('')
      await loadAnalytics()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit feedback')
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
            Feedback System
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            Help Us Improve <span className="text-bloom-purple">Inner Bloom</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            Rate recommendations, diet usefulness, and app experience.
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="bloom-card p-7 lg:col-span-1 text-left">
            <div className="text-sm font-extrabold text-bloom-ink">Submit feedback</div>
            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-bold text-bloom-ink/70">Rating (1–5)</span>
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
                <span className="text-xs font-bold text-bloom-ink/70">Comment</span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  placeholder="What did you like? What should we improve?"
                />
              </label>

              <button disabled={loading} className="bloom-btn-primary w-full">
                {loading ? 'Sending…' : 'Submit'}
              </button>
            </form>
          </div>

          <div className="bloom-card p-7 lg:col-span-2">
            <div className="text-left">
              <div className="text-sm font-extrabold text-bloom-ink">Analytics</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
                Simple dashboard for hackathon demos.
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">Total</div>
                <div className="mt-1 text-2xl font-black text-bloom-ink">{analytics?.summary?.count ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">Average</div>
                <div className="mt-1 text-2xl font-black text-bloom-ink">
                  {analytics?.summary?.avgRating ? analytics.summary.avgRating.toFixed(2) : '0.00'}
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/60 p-4 text-left">
                <div className="text-xs font-extrabold text-bloom-ink/60">Top Tags</div>
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
                    <span className="text-xs font-semibold text-bloom-ink/60">—</span>
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
                <div className="text-sm font-semibold text-bloom-ink/70">No analytics yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

