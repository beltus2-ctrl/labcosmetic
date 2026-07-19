import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useProjectStore } from './store/useProjectStore'
import { useAuth } from './hooks/useAuth'
import { useThemeStore } from './store/useThemeStore'
import { useUiStore } from './store/useUiStore'
import { useCompoundStore } from './store/useCompoundStore'
import { useTranslation } from './i18n/useTranslation'
import ProjectGallery from './components/ProjectGallery'
import ProjectWorkspace from './components/ProjectWorkspace'
import PeriodicTable from './components/PeriodicTable'
import CompoundLibrary from './components/CompoundLibrary'
import AuthScreen from './components/AuthScreen'
import ThemeSwitcher from './components/ThemeSwitcher'
import LanguageSwitcher from './components/LanguageSwitcher'
import ToastContainer from './components/ToastContainer'
import SplashScreen from './components/SplashScreen'
import CommandPalette from './components/CommandPalette'
import MobileNav from './components/MobileNav'
import Logo from './components/Logo'

const SPLASH_MIN_MS = 1600

function App() {
  const { view, setView, setPaletteOpen } = useUiStore()
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const closeProject = useProjectStore((s) => s.closeProject)
  const { user, loading, signOut } = useAuth()
  const theme = useThemeStore((s) => s.theme)
  const loadCompounds = useCompoundStore((s) => s.load)
  const { t } = useTranslation()
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_MIN_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadCompounds(user.id).catch((e) => console.error('loadCompounds', e))
    }
  }, [user?.id, loadCompounds])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(!useUiStore.getState().paletteOpen)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setPaletteOpen])

  const showSplash = loading || !splashDone

  if (showSplash) {
    return (
      <AnimatePresence>
        <SplashScreen key="splash" />
      </AnimatePresence>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  const contentKey = view === 'projects' ? `projects-${activeProjectId ?? 'gallery'}` : view

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-4 p-4 pb-20 sm:gap-6 sm:p-6 sm:pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <h1 className="font-display text-xl font-semibold text-fg">LabCosmetic</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-sm text-fg/50 transition hover:border-accent hover:text-fg sm:flex"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            {t('palette.searchButton')}
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
          </button>
          <button
            onClick={() => setView('projects')}
            className={`hidden rounded px-3 py-1.5 text-sm transition sm:block ${
              view === 'projects' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'
            }`}
          >
            {t('nav.projects')}
          </button>
          <button
            onClick={() => setView('periodic-table')}
            className={`hidden rounded px-3 py-1.5 text-sm transition sm:block ${
              view === 'periodic-table' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'
            }`}
          >
            {t('nav.periodicTable')}
          </button>
          <button
            onClick={() => setView('compounds')}
            className={`hidden rounded px-3 py-1.5 text-sm transition sm:block ${
              view === 'compounds' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'
            }`}
          >
            {t('nav.compounds')}
          </button>
          {view === 'projects' && activeProjectId && (
            <button
              onClick={closeProject}
              className="rounded border border-border px-3 py-1.5 text-sm text-fg/70 hover:border-accent hover:text-fg"
            >
              {t('nav.backToProjects')}
            </button>
          )}
          <ThemeSwitcher />
          <LanguageSwitcher />
          <span className="ml-1 hidden text-xs text-fg/40 lg:inline">{user.email}</span>
          <button
            onClick={signOut}
            className="rounded border border-border px-3 py-1.5 text-sm text-fg/70 hover:border-accent hover:text-fg"
          >
            {t('nav.logout')}
          </button>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {view === 'periodic-table' ? (
            <PeriodicTable />
          ) : view === 'compounds' ? (
            <CompoundLibrary userId={user.id} />
          ) : activeProjectId ? (
            <ProjectWorkspace projectId={activeProjectId} userId={user.id} />
          ) : (
            <ProjectGallery userId={user.id} />
          )}
        </motion.div>
      </AnimatePresence>

      <MobileNav />
      <CommandPalette />
      <ToastContainer />
    </div>
  )
}

export default App
