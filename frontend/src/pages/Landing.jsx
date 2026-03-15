import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  CalendarDays,
  MessageSquareText,
  Activity,
  Bell,
  ArrowRight,
  Lock,
  Heart,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import LanguageSelect from '../components/LanguageSelect'

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bloom-card p-6 text-left transition"
    >
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-card-gradient">
        <Icon className="h-6 w-6 text-bloom-purple" />
      </div>
      <div className="text-base font-extrabold text-bloom-ink">{title}</div>
      <div className="mt-2 text-base leading-snug text-bloom-ink/70">{desc}</div>
    </motion.div>
  )
}

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div className="bloom-bg">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2.5 text-sm font-bold text-bloom-ink/70 shadow-sm">
              <Sparkles className="h-4 w-4 text-bloom-purple" />
              {t('landing.badge')}
            </div>

            <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-bloom-ink">{t('appName').split(' ')[0]}</span>{' '}
              <span className="bg-gradient-to-r from-bloom-purple to-bloom-lavender bg-clip-text text-transparent">
                {t('appName').split(' ').slice(1).join(' ') || t('appName')}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-xl font-semibold text-bloom-ink/80">
              {t('subtitle')}
            </p>
            <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-bloom-ink/60">
              {t('landing.heroDescription')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="bloom-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-4 text-lg font-bold"
              >
                {t('landing.ctaPrimary')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#about"
                className="bloom-btn-ghost rounded-full border border-bloom-ink/20 px-7 py-4 text-lg font-bold"
              >
                {t('landing.ctaSecondary')}
              </a>
              <div className="ml-0 sm:ml-2">
                <LanguageSelect />
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-4 text-left">
              {[
                { icon: Lock, title: t('landing.pill1Title'), desc: t('landing.pill1Desc') },
                { icon: Sparkles, title: t('landing.pill2Title'), desc: t('landing.pill2Desc') },
                { icon: Heart, title: t('landing.pill3Title'), desc: t('landing.pill3Desc') },
              ].map((x) => (
                <div
                  key={x.title}
                  className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/40 px-5 py-3"
                >
                  <x.icon className="h-5 w-5 shrink-0 text-bloom-purple" />
                  <div>
                    <div className="text-sm font-extrabold text-bloom-ink">{x.title}</div>
                    <div className="text-xs font-medium text-bloom-ink/60">{x.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: open hero image – no box, image floats on background */}
          <div className="relative flex min-h-[420px] items-end justify-center md:min-h-[540px] lg:min-h-[620px]">
            {/* Soft blurred orbs – no card, just atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-bloom-pink/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-bloom-lavender/20 blur-3xl" />
              <div className="absolute right-1/3 top-10 h-72 w-72 rounded-full bg-bloom-pink/15 blur-2xl" />
            </div>

            {/* Hero illustration – no box, larger and flowing */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px]"
            >
              <img
                src="/hero-illustration.png"
                alt=""
                className="w-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(124,58,237,0.12)] animate-floaty"
              />
            </motion.div>

            {/* Four feature bubbles – over the open image area */}
            <div className="absolute left-0 top-4 rounded-xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:left-2">
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 shrink-0 text-bloom-purple" />
                <span className="text-sm font-bold text-bloom-ink">{t('landing.heroRight1')}</span>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur sm:right-2">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="h-5 w-5 shrink-0 text-bloom-purple" />
                <span className="text-sm font-bold text-bloom-ink">{t('landing.heroRight2')}</span>
              </div>
            </div>
            <div className="absolute bottom-14 left-4 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur md:bottom-24">
              <div className="flex items-center gap-2.5">
                <Bell className="h-5 w-5 shrink-0 text-bloom-purple" />
                <span className="text-sm font-bold text-bloom-ink">{t('landing.heroRight3')}</span>
              </div>
            </div>
            <div className="absolute right-4 top-16 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm backdrop-blur md:right-8 md:top-24">
              <div className="flex items-center gap-2.5">
                <UserRound className="h-5 w-5 shrink-0 text-bloom-purple" />
                <span className="text-sm font-bold text-bloom-ink">{t('landing.heroRight4')}</span>
              </div>
            </div>
          </div>
        </div>

        <div id="about" className="mt-16">
          <div className="text-sm font-extrabold tracking-widest text-bloom-ink/50">
            {t('landing.aboutKicker')}
          </div>
          <div className="mt-3 text-4xl font-black tracking-tight text-bloom-ink md:text-5xl">
            {t('landing.aboutHeadline').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-bloom-purple">
              {t('landing.aboutHeadline').split(' ').slice(-1)[0]}
            </span>
          </div>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-bloom-ink/70">
            {t('landing.aboutBody')}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple md:text-4xl">{t('landing.stat1Title')}</div>
              <div className="mt-2 text-base font-semibold text-bloom-ink/70">
                {t('landing.stat1Desc')}
              </div>
            </div>
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple md:text-4xl">{t('landing.stat2Title')}</div>
              <div className="mt-2 text-base font-semibold text-bloom-ink/70">
                {t('landing.stat2Desc')}
              </div>
            </div>
            <div className="bloom-card p-6">
              <div className="text-3xl font-black text-bloom-purple md:text-4xl">{t('landing.stat3Title')}</div>
              <div className="mt-2 text-base font-semibold text-bloom-ink/70">
                {t('landing.stat3Desc')}
              </div>
            </div>
          </div>
        </div>

        <div id="features" className="mt-16">
          <div className="text-sm font-extrabold tracking-widest text-bloom-ink/50">
            {t('landing.featuresKicker')}
          </div>
          <div className="mt-3 text-4xl font-black tracking-tight text-bloom-ink md:text-5xl">
            {t('landing.featuresHeadline').split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-bloom-purple">
              {t('landing.featuresHeadline').split(' ').slice(-1)[0]}
            </span>
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

        <div id="contact" className="mt-16">
          <div className="bloom-card p-8">
            <div className="text-xl font-black text-bloom-ink md:text-2xl">{t('landing.contactTitle')}</div>
            <p className="mt-2 text-base font-semibold text-bloom-ink/70">
              {t('landing.contactBody')}
            </p>
            <div className="mt-6">
              <Link to="/login" className="bloom-btn-primary inline-flex items-center gap-2 px-7 py-4 text-lg font-bold">
                {t('landing.ctaPrimary')} <HeartPulse className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

