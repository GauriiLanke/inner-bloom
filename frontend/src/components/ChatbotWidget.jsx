import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageSquareText, Mic, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { api } from '../services/api'

function ruleAnswer(q, lng) {
  const lang = ['en', 'hi', 'mr'].includes(lng) ? lng : 'en'
  const text = q.toLowerCase()

  const replies = {
    en: {
      intro:
        'I can help explain PCOS, lifestyle tips, diet/exercise guidance, and when to consult a doctor. What would you like to know?',
      pcos:
        'PCOS (Polycystic Ovary Syndrome) is a common hormonal condition that can affect periods, skin/hair, and metabolism. Early assessment helps guide lifestyle changes and clinical follow-up.',
      symptoms:
        'Common PCOS symptoms can include irregular periods, acne, hair thinning, weight changes, and fatigue. If symptoms are significant, consider consulting a gynecologist/endocrinologist.',
      diet:
        'A PCOS-friendly approach often focuses on protein + fiber, low-GI carbs, and healthy fats. Avoid frequent sugary drinks/snacks, and aim for consistent meals.',
      exercise:
        'A gentle starting plan is 20–30 minutes of walking most days plus 2 strength sessions/week. Consistency matters more than intensity.',
      sleep:
        'Sleep (7–9 hours) and stress management can support hormone balance. Try a consistent bedtime and a short breathing/relaxation routine.',
      doctor:
        'If you have irregular cycles or multiple symptoms, a clinician may recommend hormone tests, ultrasound, and metabolic screening. Use the Nearby Doctors page to find clinics near you.',
    },
    hi: {
      intro:
        'मैं पीसीओएस, लाइफ़स्टाइल टिप्स, डाइट/व्यायाम और डॉक्टर से कब मिलना चाहिए – इन सब पर मदद कर सकती हूँ। आप क्या जानना चाहती हैं?',
      pcos:
        'पीसीओएस (पॉलीसिस्टिक ओवरी सिंड्रोम) एक सामान्य हार्मोनल स्थिति है जो पीरियड, त्वचा/बाल और मेटाबॉलिज़्म को प्रभावित कर सकती है। जल्दी आकलन से लाइफ़स्टाइल बदलाव और क्लिनिकल फॉलो-अप की योजना बनती है।',
      symptoms:
        'आम पीसीओएस लक्षणों में अनियमित पीरियड, मुहाँसे, बाल पतले होना, वज़न में बदलाव और थकान शामिल हो सकते हैं। ज़्यादा लक्षण हों तो स्त्री रोग विशेषज्ञ/एंडोक्राइनोलॉजिस्ट से मिलें।',
      diet:
        'पीसीओएस के लिए डाइट में प्रोटीन + फाइबर, लो-जीआई कार्ब्स और हेल्दी फ़ैट्स पर ध्यान देना उपयोगी होता है। बार‑बार मीठे ड्रिंक्स/स्नैक्स से बचें और खाने का समय नियमित रखें।',
      exercise:
        'शुरुआती प्लान के लिए ज़्यादातर दिनों में 20–30 मिनट वॉक और हफ्ते में 2 बार हल्का स्ट्रेंथ ट्रेनिंग अच्छा विकल्प है। रेगुलैरिटी सबसे ज़्यादा मायने रखती है।',
      sleep:
        '7–9 घंटे की नींद और तनाव कम करना हार्मोन बैलेंस में मदद कर सकता है। एक तय सोने का समय और छोटी साँस/रिलैक्सेशन एक्सरसाइज़ फ़ायदेमंद हैं।',
      doctor:
        'अगर पीरियड बहुत अनियमित हैं या कई लक्षण साथ में हैं तो डॉक्टर हार्मोन टेस्ट, अल्ट्रासाउंड और मेटाबॉलिक स्क्रीनिंग सुझा सकते हैं। नज़दीकी क्लिनिक देखने के लिए "Nearby Doctors" पेज इस्तेमाल करें।',
    },
    mr: {
      intro:
        'मी पीसीओएस, लाइफस्टाइल टिप्स, डाएट/व्यायाम आणि डॉक्टरकडे कधी जावे याबद्दल मदत करू शकते. तुम्हाला काय जाणून घ्यायचे आहे?',
      pcos:
        'पीसीओएस (पॉलीसिस्टिक ओवरी सिंड्रोम) ही एक सामान्य हार्मोनल स्थिती आहे जी पाळी, त्वचा/केस आणि मेटाबॉलिझमवर परिणाम करू शकते. लवकर मूल्यांकन केल्याने लाइफस्टाइल बदल व क्लिनिकल फॉलो‑अप नियोजित करता येतो.',
      symptoms:
        'सामान्य पीसीओएस लक्षणांमध्ये अनियमित पाळी, पुरळ, केस पातळ होणे, वजन बदल आणि थकवा यांचा समावेश होऊ शकतो. लक्षणे जास्त असल्यास स्त्रीरोगतज्ज्ञ/एंडोक्राइनोलॉजिस्ट यांना भेटा.',
      diet:
        'पीसीओएससाठी डाएटमध्ये प्रोटीन + फायबर, लो‑जीआय कार्ब्स आणि हेल्दी फॅट्सवर भर देणे उपयुक्त असते. वारंवार गोड पेये/स्नॅक्स टाळा आणि जेवणाचे वेळापत्रक नियमित ठेवा.',
      exercise:
        'सुरुवातीला बहुतेक दिवस 20–30 मिनिटे चालणे आणि आठवड्यात 2 वेळा हलका स्ट्रेंथ ट्रेनिंग हा चांगला पर्याय आहे. नियमितपणा सर्वात महत्त्वाचा आहे.',
      sleep:
        '7–9 तासांची झोप आणि ताण कमी करणे हार्मोन संतुलनाला मदत करू शकते. ठरलेला झोपेचा वेळ आणि थोडी श्वसन/रिलॅक्सेशन व्यायाम उपयोगी ठरतो.',
      doctor:
        'जर पाळी अत्यंत अनियमित असेल किंवा अनेक लक्षणे एकत्र असतील तर डॉक्टर हार्मोन तपासणी, अल्ट्रासाऊंड आणि मेटाबॉलिक स्क्रिनिंग सुचवू शकतात. जवळच्या क्लिनिकसाठी "Nearby Doctors" पेज वापरा.',
    },
  }

  const r = replies[lang]

  if (text.includes('pcos') && (text.includes('what') || text.includes('define') || text.includes('meaning'))) {
    return r.pcos
  }
  if (text.includes('symptom')) {
    return r.symptoms
  }
  if (text.includes('diet') || text.includes('food') || text.includes('eat')) {
    return r.diet
  }
  if (text.includes('exercise') || text.includes('workout') || text.includes('walk')) {
    return r.exercise
  }
  if (text.includes('sleep') || text.includes('stress')) {
    return r.sleep
  }
  if (text.includes('doctor') || text.includes('gynecologist')) {
    return r.doctor
  }

  return r.intro
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '' },
  ])

  const scrollRef = useRef(null)
  const recognitionRef = useRef(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [open, messages])

  // Update greeting when language changes
  useEffect(() => {
    setMessages((prev) => {
      const rest = prev.filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
      return [{ role: 'assistant', text: t('chatbot.welcome') }, ...rest]
    })
  }, [t])

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

  const send = async () => {
    const q = input.trim()
    if (!q) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    // Optimistically show a "thinking" bubble
    setMessages((m) => [...m, { role: 'assistant', text: '…' }])

    try {
      const res = await api.post('/chat', { message: q, language: i18n.language })
      const answer = res.data?.answer || ruleAnswer(q, i18n.language)
      setMessages((m) => [...m.slice(0, -1), { role: 'assistant', text: answer }])
    } catch {
      const fallback = ruleAnswer(q, i18n.language)
      setMessages((m) => [...m.slice(0, -1), { role: 'assistant', text: fallback }])
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-bloom-purple to-bloom-lavender px-5 py-3 text-sm font-extrabold text-white shadow-bloom"
      >
        <MessageSquareText className="h-4 w-4" />
        {t('chatbot.openButton')}
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
              <div className="text-sm font-black text-bloom-ink">{t('chatbot.header')}</div>
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
                  placeholder={t('chatbot.placeholder')}
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
                {t('chatbot.footerNote')}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

