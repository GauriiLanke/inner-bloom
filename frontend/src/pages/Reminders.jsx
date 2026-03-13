import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CalendarPlus, BellRing, Sparkles } from 'lucide-react'

import { api } from '../services/api'

const defaultReminders = [
  { type: 'Lunch Time', time: '13:00', enabled: true },
  { type: 'Exercise', time: '18:00', enabled: true },
  { type: 'Water Intake', time: '11:00', enabled: true },
  { type: 'Sleep', time: '22:30', enabled: true },
]

function googleCalendarLink({ title, details, start, end }) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const params = new URLSearchParams({
    text: title,
    details,
    dates: `${start.replace(/[-:]/g, '')}/${end.replace(/[-:]/g, '')}`,
  })
  return `${base}&${params.toString()}`
}

function toUtcCompact(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    '00Z'
  )
}

export default function Reminders() {
  const [items, setItems] = useState(defaultReminders)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/reminders')
        const existing = res.data?.reminders || []
        if (existing.length) {
          setItems(
            defaultReminders.map((d) => {
              const hit = existing.find((x) => x.type === d.type)
              return hit ? { type: hit.type, time: hit.time, enabled: hit.enabled !== false } : d
            }),
          )
        }
      } catch {
        // ignore
      }
    }
    load()
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      await api.post('/reminders', { reminders: items })
      toast.success('Reminders saved!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save reminders')
    } finally {
      setLoading(false)
    }
  }

  const calendarLinks = useMemo(() => {
    const now = new Date()
    return items.map((r) => {
      const [hh, mm] = r.time.split(':').map((x) => Number(x))
      const start = new Date(now)
      start.setHours(hh, mm, 0, 0)
      if (start < now) start.setDate(start.getDate() + 1)
      const end = new Date(start)
      end.setMinutes(end.getMinutes() + 30)
      return {
        type: r.type,
        url: googleCalendarLink({
          title: `Inner Bloom: ${r.type}`,
          details: 'A gentle habit reminder from Inner Bloom.',
          start: toUtcCompact(start),
          end: toUtcCompact(end),
        }),
      }
    })
  }, [items])

  return (
    <div className="bloom-bg min-h-[calc(100vh-88px)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold text-bloom-ink/70">
            <Sparkles className="h-4 w-4 text-bloom-purple" />
            Reminder System
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-bloom-ink">
            Set Your <span className="text-bloom-purple">Daily Reminders</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
            Reminders are stored in your account. If SMTP is configured, emails will be sent.
          </div>
        </div>

        <div className="mt-8 bloom-card p-7">
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((r, idx) => (
              <div key={r.type} className="rounded-2xl border border-white/70 bg-white/60 p-5 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-bloom-ink">
                    <BellRing className="h-4 w-4 text-bloom-purple" />
                    {r.type}
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-bloom-ink/70">
                    <input
                      type="checkbox"
                      checked={r.enabled}
                      onChange={(e) =>
                        setItems((p) =>
                          p.map((x, i) => (i === idx ? { ...x, enabled: e.target.checked } : x)),
                        )
                      }
                    />
                    Enabled
                  </label>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="time"
                    value={r.time}
                    onChange={(e) =>
                      setItems((p) => p.map((x, i) => (i === idx ? { ...x, time: e.target.value } : x)))
                    }
                    className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  />
                  <a
                    href={calendarLinks.find((x) => x.type === r.type)?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bloom-btn-ghost px-4 py-3 text-sm"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <button disabled={loading} onClick={save} className="bloom-btn-primary">
              {loading ? 'Saving…' : 'Save Reminder Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

