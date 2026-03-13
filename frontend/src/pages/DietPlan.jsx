import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import { Download, Sparkles } from 'lucide-react'

import { api } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

function DayRow({ d }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
      <div className="text-sm font-extrabold text-bloom-ink">{d.dayLabel || d.day}</div>
      <div className="mt-2 grid gap-2 text-sm font-semibold text-bloom-ink/75">
        <div>
          <span className="font-extrabold text-bloom-ink">Breakfast:</span> {d.breakfast}
        </div>
        <div>
          <span className="font-extrabold text-bloom-ink">Lunch:</span> {d.lunch}
        </div>
        <div>
          <span className="font-extrabold text-bloom-ink">Dinner:</span> {d.dinner}
        </div>
        {d.snacks ? (
          <div>
            <span className="font-extrabold text-bloom-ink">Snacks:</span> {d.snacks}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function buildPdf(plan) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 42
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Inner Bloom – Weekly PCOS Diet Plan', margin, y)
  y += 22

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Language: ${plan.language}   |   Risk: ${plan.riskLevel}`, margin, y)
  y += 18

  doc.setDrawColor(124, 58, 237)
  doc.line(margin, y, 595 - margin, y)
  y += 16

  doc.setFontSize(11)
  for (const d of plan.days || []) {
    const title = d.dayLabel || d.day
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    y += 14
    doc.setFont('helvetica', 'normal')

    const lines = [
      `Breakfast: ${d.breakfast}`,
      `Lunch: ${d.lunch}`,
      `Dinner: ${d.dinner}`,
      d.snacks ? `Snacks: ${d.snacks}` : null,
    ].filter(Boolean)

    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, 595 - margin * 2)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 13
      if (y > 770) {
        doc.addPage()
        y = margin
      }
    }
    y += 10
  }

  return doc
}

export default function DietPlan() {
  const { language } = useLanguage()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfLang, setPdfLang] = useState(language)

  const canDownload = useMemo(() => Boolean(plan?.days?.length), [plan])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await api.post('/diet-plans/generate', { language: pdfLang })
      setPlan(res.data?.plan)
      toast.success('Diet plan generated!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate diet plan')
    } finally {
      setLoading(false)
    }
  }

  const download = () => {
    if (!plan) return
    const doc = buildPdf(plan)
    doc.save(`InnerBloom_DietPlan_${plan.language}.pdf`)
  }

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            Diet Plan Generator
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            Get Your <span className="text-bloom-purple">7‑Day</span> Diet Plan
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            Generate and download a personalized weekly plan as a PDF.
          </div>
        </div>

        <div className="mt-8 bloom-card p-7">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-left">
              <div className="text-sm font-extrabold text-bloom-ink">Select PDF Language</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">
                Choose the language before generating.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={pdfLang}
                onChange={(e) => setPdfLang(e.target.value)}
                className="rounded-full border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
              <button disabled={loading} onClick={generate} className="bloom-btn-primary">
                {loading ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </div>

          {plan ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {plan.days.map((d) => (
                <DayRow key={d.day} d={d} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-white/70 bg-white/60 p-5 text-sm font-semibold text-bloom-ink/70">
              Generate to see a preview of your weekly plan here.
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button disabled={!canDownload} onClick={download} className="bloom-btn-primary disabled:opacity-40">
              <Download className="h-4 w-4" />
              Download Diet Plan PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

