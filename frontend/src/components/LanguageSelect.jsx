import { useTranslation } from 'react-i18next'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSelect({ className = '' }) {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-bloom-ink/70">{t('common.language')}</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none backdrop-blur focus:ring-2 focus:ring-bloom-lavender/40"
      >
        <option value="en">{t('common.english')}</option>
        <option value="hi">{t('common.hindi')}</option>
        <option value="mr">{t('common.marathi')}</option>
      </select>
    </label>
  )
}

