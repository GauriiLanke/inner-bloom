import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Moon, Sparkles, Stethoscope, Flower2 } from 'lucide-react'

import { api } from '../services/api'

function SectionCard({ icon: Icon, title, items }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="bloom-card p-6 text-left">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card-gradient">
          <Icon className="h-5 w-5 text-bloom-purple" />
        </div>
        <div className="text-sm font-extrabold text-bloom-ink">{title}</div>
      </div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-semibold text-bloom-ink/70">
        {(items || []).slice(0, 6).map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Recommendations() {
  const [rec, setRec] = useState(null)
  const [risk, setRisk] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('innerbloom_lastRisk')
    if (raw) {
      const parsed = JSON.parse(raw)
      setRec(parsed?.recommendations || null)
      setRisk(parsed?.risk || null)
    }

    async function hydrateFromApi() {
      try {
        const r = await api.get('/assessments/latest')
        setRec(r.data?.recommendations || null)
        setRisk(r.data?.assessment?.risk || null)
      } catch {
        // ignore
      }
    }
    hydrateFromApi()
  }, [])

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            Personalized Recommendations
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            Your Wellness Plan <span className="text-bloom-purple">for This Week</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            Based on your latest risk score{risk ? ` (${risk.riskLevel} Risk)` : ''}.
          </div>
        </div>

        <div className="mt-8 bloom-card p-7 text-left">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card-gradient">
              <Flower2 className="h-5 w-5 text-bloom-purple" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-bloom-ink">Summary</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">{rec?.headline || '—'}</div>
              {rec?.nextSteps?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm font-semibold text-bloom-ink/70">
                  {rec.nextSteps.slice(0, 5).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SectionCard icon={Flower2} title="Lifestyle Suggestions" items={rec?.lifestyle} />
          <SectionCard icon={Dumbbell} title="Exercise Plan" items={rec?.exercise} />
          <SectionCard icon={Moon} title="Sleep Advice" items={rec?.sleep} />
          <SectionCard icon={Stethoscope} title="Doctor Consultation" items={rec?.doctor} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/diet" className="bloom-btn-primary">
            Get Diet Plan
          </Link>
          <Link to="/reminders" className="bloom-btn-ghost">
            Set Reminders + Calendar
          </Link>
          <Link to="/doctors" className="bloom-btn-ghost">
            Nearby Doctors
          </Link>
        </div>
      </div>
    </div>
  )
}

