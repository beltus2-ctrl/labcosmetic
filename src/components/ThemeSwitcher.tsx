import { useThemeStore, type Theme } from '../store/useThemeStore'
import { useTranslation } from '../i18n/useTranslation'

const THEMES: Theme[] = ['nuit', 'clair', 'emeraude']

const SWATCH: Record<Theme, string> = {
  nuit: '#4a90d9',
  clair: '#2f6fb0',
  emeraude: '#34c98c',
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-panel-2 p-1">
      {THEMES.map((themeOption) => (
        <button
          key={themeOption}
          onClick={() => setTheme(themeOption)}
          title={t(`theme.${themeOption}`)}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
            theme === themeOption ? 'ring-2 ring-accent' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: SWATCH[themeOption] }}
          />
        </button>
      ))}
    </div>
  )
}
