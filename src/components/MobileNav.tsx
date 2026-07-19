import { useUiStore, type View } from '../store/useUiStore'
import { useTranslation } from '../i18n/useTranslation'

const TABS: { view: View; labelKey: string; icon: string }[] = [
  { view: 'projects', labelKey: 'nav.projects', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10' },
  { view: 'periodic-table', labelKey: 'nav.periodicTable', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' },
  { view: 'compounds', labelKey: 'nav.compounds', icon: 'M9 3h6m-5 0v6.5L4.8 19a1.5 1.5 0 001.3 2.3h11.8a1.5 1.5 0 001.3-2.3L14 9.5V3' },
]

export default function MobileNav() {
  const { view, setView, setPaletteOpen } = useUiStore()
  const { t } = useTranslation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-panel/95 backdrop-blur sm:hidden">
      {TABS.map((tab) => (
        <button
          key={tab.view}
          onClick={() => setView(tab.view)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
            view === tab.view ? 'text-accent' : 'text-fg/50'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={tab.icon} />
          </svg>
          <span className="max-w-[80px] truncate">{t(tab.labelKey)}</span>
        </button>
      ))}
      <button
        onClick={() => setPaletteOpen(true)}
        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-fg/50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <span>{t('palette.searchButton')}</span>
      </button>
    </nav>
  )
}
