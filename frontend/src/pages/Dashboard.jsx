import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { api } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const h = await api.get('/assessments/history?limit=10')
        setHistory(h.data?.history || [])
      } catch {
        setHistory([])
      }
      try {
        const r = await api.get('/assessments/latest')
        setLatest(r.data?.assessment || null)
      } catch {
        setLatest(null)
      }
    }
    load()
  }, [])

  const chart = useMemo(() => {
    const labels = [...history].reverse().map((x) => new Date(x.createdAt).toLocaleDateString())
    const data = [...history].reverse().map((x) => x.score)
    return {
      labels,
      datasets: [
        {
          label: 'Risk score',
          data,
          fill: true,
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(167,139,250,0.22)',
          tension: 0.35,
        },
      ],
    }
  }, [history])

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            User Dashboard
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            Your Health <span className="text-bloom-purple">Progress</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            Track your risk score over time and keep improving your habits.
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="bloom-card p-6 lg:col-span-2">
            <div className="text-sm font-extrabold text-bloom-ink">Risk Score Trend</div>
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/60 p-4">
              {history.length ? (
                <Line
                  data={chart}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { min: 0, max: 100 } },
                  }}
                />
              ) : (
                <div className="text-sm font-semibold text-bloom-ink/70">
                  No history yet. Complete an assessment to see charts.
                </div>
              )}
            </div>
          </div>

          <div className="bloom-card p-6">
            <div className="text-sm font-extrabold text-bloom-ink">Latest Snapshot</div>
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/60 p-4">
              <div className="text-xs font-extrabold text-bloom-ink/60">Risk Level</div>
              <div className="mt-1 text-2xl font-black text-bloom-purple">
                {latest?.risk?.riskLevel ? `${latest.risk.riskLevel} Risk` : '—'}
              </div>
              <div className="mt-3 text-xs font-extrabold text-bloom-ink/60">Risk Score</div>
              <div className="mt-1 text-xl font-black text-bloom-ink">
                {latest?.risk?.score != null ? `${latest.risk.score}%` : '—'}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link to="/assessment" className="bloom-btn-primary">
                Take Assessment
              </Link>
              <Link to="/recommendations" className="bloom-btn-ghost">
                View Recommendations
              </Link>
              <Link to="/feedback" className="bloom-btn-ghost">
                Leave Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

