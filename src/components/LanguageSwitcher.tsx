import { useLocaleStore } from '../store/useLocaleStore'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore()

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-panel-2 p-1 text-xs">
      <button
        onClick={() => setLocale('fr')}
        className={`rounded-full px-2 py-0.5 ${locale === 'fr' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'}`}
      >
        FR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`rounded-full px-2 py-0.5 ${locale === 'en' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'}`}
      >
        EN
      </button>
    </div>
  )
}
