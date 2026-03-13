import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquareText, Mic, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function ruleAnswer(q) {
  const text = q.toLowerCase()
  if (text.includes('pcos') && (text.includes('what') || text.includes('define') || text.includes('meaning'))) {
    return 'PCOS (Polycystic Ovary Syndrome) is a common hormonal condition that can affect periods, skin/hair, and metabolism. Early assessment helps guide lifestyle changes and clinical follow-up.'
  }
  if (text.includes('symptom')) {
    return 'Common PCOS symptoms can include irregular periods, acne, hair thinning, weight changes, and fatigue. If symptoms are significant, consider consulting a gynecologist/endocrinologist.'
  }
  if (text.includes('diet') || text.includes('food')) {
    return 'A PCOS-friendly approach often focuses on protein + fiber, low-GI carbs, and healthy fats. Avoid frequent sugary drinks/snacks, and aim for consistent meals.'
  }
  if (text.includes('exercise')) {
    return 'A great starting plan is 20–30 minutes of walking most days plus 2 strength sessions/week. Consistency matters more than intensity.'
  }
  if (text.includes('sleep') || text.includes('stress')) {
    return 'Sleep (7–9 hours) and stress management can support hormone balance. Try a consistent bedtime and short breathing/relaxation routines.'
  }
  if (text.includes('doctor') || text.includes('gynecologist')) {
    return 'If you have irregular cycles or multiple symptoms, a clinician may recommend hormone tests, ultrasound, and metabolic screening. Use the Nearby Doctors page to find clinics near you.'
  }
  return 'I can help explain PCOS, lifestyle tips, diet/exercise guidance, and when to consult a doctor. What would you like to know?'
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I’m Inner Bloom assistant. Ask me about PCOS, diet, exercise, sleep, or doctors.' },
  ])

  const scrollRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [open, messages])

  const canSpeech = useMemo(
    () => typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  )

  const startVoice = () => {
    if (!canSpeech) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recog = new SpeechRecognition()
    recog.lang = 'en-IN'
    recog.interimResults = false
    recog.maxAlternatives = 1
    recognitionRef.current = recog
    setListening(true)
    recog.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript || ''
      setInput(transcript)
      setListening(false)
    }
    recog.onerror = () => setListening(false)
    recog.onend = () => setListening(false)
    recog.start()
  }

  const send = () => {
    const q = input.trim()
    if (!q) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    const a = ruleAnswer(q)
    setTimeout(() => setMessages((m) => [...m, { role: 'assistant', text: a }]), 250)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-bloom-purple to-bloom-lavender px-5 py-3 text-sm font-extrabold text-white shadow-bloom"
      >
        <MessageSquareText className="h-4 w-4" />
        AI Chat
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[92vw] overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-bloom backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-white/60 px-4 py-3">
              <div className="text-sm font-black text-bloom-ink">Inner Bloom Assistant</div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/60">
                <X className="h-4 w-4 text-bloom-ink/70" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-[360px] space-y-3 overflow-auto px-4 py-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`w-fit max-w-[85%] rounded-2xl px-4 py-3 text-sm font-semibold ${
                    m.role === 'user'
                      ? 'ml-auto bg-gradient-to-r from-bloom-purple to-bloom-lavender text-white'
                      : 'bg-white/80 text-bloom-ink'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="border-t border-white/60 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') send()
                  }}
                  className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-bloom-lavender/40"
                  placeholder="Ask about PCOS, diet, exercise…"
                />
                <button type="button" onClick={send} className="rounded-2xl bg-bloom-purple p-3 text-white">
                  <Send className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={!canSpeech}
                  onClick={startVoice}
                  className="rounded-2xl bg-white/80 p-3 text-bloom-purple disabled:opacity-40"
                  title={canSpeech ? 'Voice input' : 'Voice input not supported'}
                >
                  <Mic className={`h-4 w-4 ${listening ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              <div className="mt-2 text-[11px] font-semibold text-bloom-ink/60">
                Prototype assistant (rule-based) • Voice input uses browser speech recognition.
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

