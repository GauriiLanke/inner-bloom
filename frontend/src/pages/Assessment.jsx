import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { api } from '../services/api'

const stepsKey = 'assessment.steps'

function StepPill({ active, label }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
        active ? 'bg-white text-bloom-ink shadow-sm' : 'text-bloom-ink/60'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${active ? 'bg-bloom-purple' : 'bg-bloom-ink/20'}`}
      />
      {label}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-bloom-ink/70">{label}</span>
      {children}
    </label>
  )
}

export default function Assessment() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    personal: { name: '', age: 22, heightCm: 165, weightKg: 60 },
    menstrual: { cycleRegularity: 'Regular', cycleDurationDays: 28 },
    symptoms: { acne: false, hairLoss: false, weightGain: false, fatigue: false },
    lifestyle: { sleepHours: 7, stressLevel: 'Medium', exerciseFrequency: '1-2x/week' },
    familyHistory: { pcosHistory: 'No' },
  })

  const stepsRaw = t(stepsKey, { returnObjects: true })
  const stepLabels = Array.isArray(stepsRaw)
    ? stepsRaw
    : ['Personal Info', 'Health Details', 'Lifestyle']
  const totalSteps = stepLabels.length
  const progress = useMemo(() => Math.round(((step + 1) / totalSteps) * 100), [step, totalSteps])

  const submit = async () => {
    setLoading(true)
    try {
      const res = await api.post('/assessments', form)
      const { risk, recommendations } = res.data || {}
      localStorage.setItem('innerbloom_lastRisk', JSON.stringify({ risk, recommendations }))
      toast.success('Assessment complete!')
      navigate('/results')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Assessment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <div className="text-xs font-extrabold tracking-widest text-bloom-ink/50">
            {t('assessment.badge')}
          </div>
          <div className="mt-2 text-3xl font-black tracking-tight text-bloom-ink">
            {t('assessment.title').split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-bloom-purple">
              {t('assessment.title').split(' ').slice(-2).join(' ')}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            {t('assessment.subtitle')}
          </div>
        </div>

        <div className="mt-8 bloom-card p-7">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {Array.isArray(stepLabels)
                ? stepLabels.map((s, idx) => <StepPill key={s} active={idx === step} label={s} />)
                : null}
            </div>
            <div className="text-xs font-extrabold text-bloom-ink/60">{progress}% complete</div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-bloom-ink/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-bloom-purple to-bloom-lavender"
              style={{ width: `${progress}%` }}
            />
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7"
          >
            {step === 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t('assessment.fields.fullName')}>
                  <input
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                    placeholder="Your name"
                    value={form.personal.name}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        personal: { ...p.personal, name: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label={t('assessment.fields.age')}>
                  <input
                    type="number"
                    min={10}
                    max={80}
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                    value={form.personal.age}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        personal: { ...p.personal, age: Number(e.target.value) },
                      }))
                    }
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4 md:col-span-1 md:grid-cols-2">
                  <Field label={t('assessment.fields.height')}>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                      value={form.personal.heightCm}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          personal: { ...p.personal, heightCm: Number(e.target.value) },
                        }))
                      }
                    />
                  </Field>
                  <Field label={t('assessment.fields.weight')}>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                      value={form.personal.weightKg}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          personal: { ...p.personal, weightKg: Number(e.target.value) },
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t('assessment.fields.cycleRegularity')}>
                  <div className="flex flex-wrap gap-2">
                    {t('assessment.options.regularity', { returnObjects: true }).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            menstrual: { ...p.menstrual, cycleRegularity: opt },
                          }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-bold ${
                          form.menstrual.cycleRegularity === opt
                            ? 'border-bloom-lavender bg-white text-bloom-ink shadow-sm'
                            : 'border-white/70 bg-white/60 text-bloom-ink/70 hover:bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={t('assessment.fields.cycleDuration')}>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                    value={form.menstrual.cycleDurationDays}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        menstrual: { ...p.menstrual, cycleDurationDays: Number(e.target.value) },
                      }))
                    }
                  />
                </Field>

                <Field label={t('assessment.fields.symptoms')}>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(t('assessment.options.symptoms', { returnObjects: true })).map(
                      ([key, label]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-bold text-bloom-ink/80 hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(form.symptoms[key])}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              symptoms: { ...p.symptoms, [key]: e.target.checked },
                            }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label={t('assessment.fields.familyHistory')}>
                  <div className="flex gap-2">
                    {t('assessment.options.familyHistory', { returnObjects: true }).map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            familyHistory: { pcosHistory: opt },
                          }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-bold ${
                          form.familyHistory.pcosHistory === opt
                            ? 'border-bloom-lavender bg-white text-bloom-ink shadow-sm'
                            : 'border-white/70 bg-white/60 text-bloom-ink/70 hover:bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 md:grid-cols-3">
                <Field label={t('assessment.fields.sleep')}>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                    value={form.lifestyle.sleepHours}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        lifestyle: { ...p.lifestyle, sleepHours: Number(e.target.value) },
                      }))
                    }
                  />
                </Field>
                <Field label={t('assessment.fields.stress')}>
                  <select
                    value={form.lifestyle.stressLevel}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        lifestyle: { ...p.lifestyle, stressLevel: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  >
                    {t('assessment.options.stress', { returnObjects: true }).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t('assessment.fields.exercise')}>
                  <select
                    value={form.lifestyle.exerciseFrequency}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        lifestyle: { ...p.lifestyle, exerciseFrequency: e.target.value },
                      }))
                    }
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  >
                    {t('assessment.options.exercise', { returnObjects: true }).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || loading}
              className="bloom-btn-ghost disabled:opacity-40"
            >
              {t('assessment.back')}
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
                disabled={loading}
                className="bloom-btn-primary"
              >
                {t('assessment.next')}
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={loading} className="bloom-btn-primary">
                {loading ? t('assessment.loading') : t('assessment.submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

