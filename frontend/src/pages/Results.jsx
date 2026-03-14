import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gauge, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const colors = {
  Low: 'from-emerald-500 to-emerald-300',
  Moderate: 'from-amber-500 to-amber-300',
  High: 'from-rose-500 to-rose-300',
}

function RiskMeter({ score = 0, riskLevel = 'Low' }) {
  const angle = useMemo(() => (score / 100) * 180 - 90, [score])
  const grad = colors[riskLevel] || colors.Low

  return (
    <div className="relative mx-auto h-44 w-80 max-w-full">
      <div className="absolute inset-x-0 top-3 mx-auto h-36 w-72 rounded-[999px] bg-white/60 p-4 shadow-bloom">
        <div className={`h-full w-full rounded-[999px] bg-gradient-to-r ${grad} opacity-25`} />
      </div>
      <div className="absolute inset-x-0 top-3 mx-auto h-36 w-72 overflow-hidden rounded-[999px]">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/70" />
      </div>
      <motion.div
        initial={{ rotate: -90 }}
        animate={{ rotate: angle }}
        className="absolute left-1/2 top-[22px] h-32 w-1 origin-bottom -translate-x-1/2 rounded-full bg-bloom-purple shadow"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-fit rounded-2xl border border-white/70 bg-white/70 px-5 py-3 text-center">
        <div className="text-xs font-extrabold text-bloom-ink/60">Risk Score</div>
        <div className="text-2xl font-black text-bloom-ink">{score}%</div>
      </div>
    </div>
  )
}

export default function Results() {
  const [data, setData] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    const raw = localStorage.getItem('innerbloom_lastRisk')
    if (raw) setData(JSON.parse(raw))
  }, [])

  const risk = data?.risk
  const rec = data?.recommendations

  if (!risk) {
    return (
      <div className="bloom-bg min-h-[calc(100vh-88px)]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="bloom-card p-7 text-center">
            <div className="text-xl font-black text-bloom-ink">
              {t('resultsPage.noResultsTitle')}
            </div>
            <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
              {t('resultsPage.noResultsSubtitle')}
            </div>
            <div className="mt-5">
              <Link to="/assessment" className="bloom-btn-primary">
                {t('resultsPage.startAssessment')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            {t('resultsPage.badge')}
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            {t('resultsPage.title')}:{' '}
            <span className="text-bloom-purple">
              {risk.riskLevel} {t('resultsPage.riskSuffix')}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            {t('resultsPage.subtitle')}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="bloom-card p-7">
            <div className="flex items-center gap-2 text-sm font-extrabold text-bloom-ink">
              <Gauge className="h-5 w-5 text-bloom-purple" /> {t('resultsPage.riskScoreLabel')}
            </div>
            <div className="mt-6">
              <RiskMeter score={risk.score} riskLevel={risk.riskLevel} />
            </div>
            <div className="mt-6 rounded-2xl border border-white/70 bg-white/60 p-4">
              <div className="text-xs font-extrabold text-bloom-ink/60">
                {t('resultsPage.explanation')}
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-bloom-ink/70">
                {risk.explanation?.slice(0, 6).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bloom-card p-7">
            <div className="text-sm font-extrabold text-bloom-ink">
              {t('resultsPage.healthInsights')}
            </div>
            <div className="mt-2 text-sm font-semibold text-bloom-ink/70">{rec?.headline}</div>

            <div className="mt-6 grid gap-3">
              {[
                {
                  title: t('resultsPage.cards.indicatorsTitle'),
                  text: t('resultsPage.cards.indicatorsText'),
                },
                {
                  title: t('resultsPage.cards.adjustmentsTitle'),
                  text: t('resultsPage.cards.adjustmentsText'),
                },
                {
                  title: t('resultsPage.cards.monitorTitle'),
                  text: t('resultsPage.cards.monitorText'),
                },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-white/70 bg-white/60 p-4">
                  <div className="text-xs font-extrabold text-bloom-ink">{c.title}</div>
                  <div className="mt-1 text-sm font-semibold text-bloom-ink/70">{c.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/recommendations" className="bloom-btn-primary">
                {t('resultsPage.viewRecommendations')}
              </Link>
              <Link to="/diet" className="bloom-btn-ghost">
                {t('resultsPage.getDietPlan')}
              </Link>
              <Link to="/reminders" className="bloom-btn-ghost">
                {t('resultsPage.setReminders')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

