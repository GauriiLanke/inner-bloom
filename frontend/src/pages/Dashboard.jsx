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
import { Sparkles, ArrowRight, Activity, CalendarDays, HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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
          backgroundColor: 'rgba(124,58,237,0.15)',
          tension: 0.4,
          pointBackgroundColor: '#A78BFA',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [history])

  const riskScore = latest?.risk?.score ?? 0;
  const riskColor = riskScore > 65 ? 'bg-red-400' : riskScore > 35 ? 'bg-orange-400' : 'bg-emerald-400';
  const meterWidth = `${Math.max(5, Math.min(100, riskScore))}%`;

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)] overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-extrabold text-bloom-ink/70 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            AI Health Dashboard
          </div>
          <div className="mt-4 text-4xl lg:text-5xl font-black tracking-tight text-bloom-ink drop-shadow-sm">
            Your Health <span className="bg-gradient-to-r from-bloom-purple to-pink-500 bg-clip-text text-transparent">Snapshot</span>
          </div>
          <div className="mt-3 text-base font-medium text-bloom-ink/70">
            Monitor your PCOS risk profile, track historical trends, and discover personalized plans.
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-3">
          
          {/* Main Chart Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bloom-card p-6 lg:p-8 lg:col-span-2 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-bloom-pink/20 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-bloom-purple">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-lg font-extrabold text-bloom-ink">Risk Score Trend</div>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur p-4 lg:p-6 shadow-sm">
              {history.length ? (
                <div className="h-[250px] w-full">
                  <Line
                    data={chart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { 
                        legend: { display: false },
                        tooltip: { backgroundColor: 'rgba(43, 27, 58, 0.9)', padding: 12, cornerRadius: 8 }
                      },
                      scales: { 
                        y: { min: 0, max: 100, border: { display: false }, grid: { color: 'rgba(0,0,0,0.04)' } },
                        x: { border: { display: false }, grid: { display: false } }
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center h-[250px]">
                  <Activity className="w-10 h-10 text-bloom-purple/30 mb-3" />
                  <div className="text-sm font-semibold text-bloom-ink/70">
                    No history yet. Complete an assessment to generate your chart.
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Snapshot Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bloom-card p-6 lg:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-bloom-purple">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="text-lg font-extrabold text-bloom-ink">Latest Assessment</div>
              </div>
              
              <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur p-5 shadow-sm text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-bloom-ink/50 mb-1">Current Risk Level</div>
                <div className="text-3xl font-black text-bloom-ink bg-gradient-to-br from-bloom-ink to-bloom-purple bg-clip-text text-transparent">
                  {latest?.risk?.riskLevel ? `${latest.risk.riskLevel}` : '—'}
                </div>
                
                <div className="mt-6 mb-2 flex justify-between items-center text-xs font-bold">
                  <span className="text-bloom-ink/60">Confidence Score</span>
                  <span className="text-bloom-purple">{riskScore}%</span>
                </div>
                
                {/* Animated Risk Meter */}
                <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner border border-black/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: meterWidth }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${riskColor}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link to="/assessment" className="bloom-btn-primary group">
                Take Assessment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/recommendations" className="bloom-btn-ghost text-xs py-2.5">
                  View Plan
                </Link>
                <Link to="/diet" className="bloom-btn-ghost text-xs py-2.5">
                  Diet Generator
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

