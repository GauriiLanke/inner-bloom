import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { HeartPulse, ShieldCheck, Sparkles, Stethoscope, CalendarDays, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'

import LanguageSelect from '../components/LanguageSelect'

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bloom-card p-5 text-left transition"
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card-gradient">
        <Icon className="h-5 w-5 text-bloom-purple" />
      </div>
      <div className="text-sm font-extrabold text-bloom-ink">{title}</div>
      <div className="mt-1 text-sm text-bloom-ink/70">{desc}</div>
    </motion.div>
  )
}

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div className="bloom-bg">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-bold text-bloom-ink/70 shadow-sm">
              <Sparkles className="h-4 w-4 text-bloom-purple" />
              AI-Powered Women’s Health
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-bloom-ink md:text-5xl">
              <span className="bg-gradient-to-r from-bloom-purple to-bloom-lavender bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base font-semibold text-bloom-ink/70">
              {t('subtitle')}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/assessment" className="bloom-btn-primary">
                Start Health Assessment
                <HeartPulse className="h-4 w-4" />
              </Link>
              <a href="#about" className="bloom-btn-ghost">
                Learn More
              </a>
              <div className="ml-0 sm:ml-2">
                <LanguageSelect />
              </div>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 text-left">
              {[
                { title: 'Private & Secure', desc: 'JWT protected account' },
                { title: 'AI Powered', desc: 'Risk scoring + insights' },
                { title: 'Women First', desc: 'Soft wellness UI' },
              ].map((x) => (
                <div key={x.title} className="rounded-2xl border border-white/70 bg-white/50 px-4 py-3">
                  <div className="text-xs font-extrabold text-bloom-ink">{x.title}</div>
                  <div className="mt-1 text-xs font-semibold text-bloom-ink/60">{x.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bloom-card relative overflow-hidden p-7"
            >
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-bloom-pink/40 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-bloom-lavender/35 blur-2xl" />

              <div className="relative">
                <div className="text-sm font-extrabold text-bloom-ink">
                  Hackathon Demo Flow
                </div>
                <div className="mt-2 text-sm font-semibold text-bloom-ink/70">
                  Assessment → AI Risk → Recommendations → Diet Plan → Reminders → Doctors → Feedback
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    { icon: ShieldCheck, label: 'Secure account & dashboard' },
                    { icon: CalendarDays, label: 'Reminders + calendar actions' },
                    { icon: MessageSquareText, label: 'AI assistant (voice + text)' },
                    { icon: Stethoscope, label: 'Nearby doctors locator' },
                  ].map((i) => (
                    <div
                      key={i.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3"
                    >
                      <i.icon className="h-5 w-5 text-bloom-purple" />
                      <div className="text-sm font-bold text-bloom-ink">{i.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div id="about" className="mt-14">
          <div className="text-xs font-extrabold tracking-widest text-bloom-ink/50">UNDERSTANDING PCOS</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-bloom-ink">
            Why Early Detection <span className="text-bloom-purple">Matters</span>
          </div>
          <p className="mt-4 max-w-3xl text-sm font-semibold text-bloom-ink/70">
            PCOS (Polycystic Ovary Syndrome) is a common hormonal condition that can affect cycles, skin, hair, and
            metabolic health. Inner Bloom helps you recognize early signals and build sustainable habits with personalized guidance.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple">1 in 5</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">Women affected worldwide</div>
            </div>
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple">70%</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">Cases remain undiagnosed</div>
            </div>
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple">Early</div>
              <div className="mt-1 text-sm font-semibold text-bloom-ink/70">Detection can prevent complications</div>
            </div>
          </div>
        </div>

        <div id="features" className="mt-14">
          <div className="text-xs font-extrabold tracking-widest text-bloom-ink/50">FEATURES</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-bloom-ink">
            Everything You <span className="text-bloom-purple">Need</span>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="AI Prediction Engine"
              desc="Rule-based scoring prototype for early PCOS risk."
            />
            <FeatureCard
              icon={HeartPulse}
              title="Smart Diet Planner"
              desc="7-day plan tailored to your risk profile, downloadable."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Lifestyle Coaching"
              desc="Sleep, stress, and exercise guidance with friendly reminders."
            />
            <FeatureCard
              icon={MessageSquareText}
              title="AI Health Assistant"
              desc="Answers PCOS questions with text + voice input."
            />
            <FeatureCard
              icon={CalendarDays}
              title="Calendar Actions"
              desc="Add habits to your calendar in one click."
            />
            <FeatureCard
              icon={Stethoscope}
              title="Nearby Doctors"
              desc="Use location to find nearby gynecologists on a map."
            />
          </div>
        </div>

        <div id="contact" className="mt-14">
          <div className="bloom-card p-7">
            <div className="text-lg font-black text-bloom-ink">Ready to start?</div>
            <p className="mt-1 text-sm font-semibold text-bloom-ink/70">
              Take a quick assessment — get your AI risk score and a wellness plan in minutes.
            </p>
            <div className="mt-5">
              <Link to="/assessment" className="bloom-btn-primary">
                Start Assessment <HeartPulse className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

