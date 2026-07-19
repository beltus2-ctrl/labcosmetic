import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ELEMENTS, CATEGORY_COLORS } from '../data/elements'
import { SAFETY_COLORS } from '../data/compounds'
import { useUiStore } from '../store/useUiStore'
import { useCompoundStore } from '../store/useCompoundStore'
import { useProjectStore } from '../store/useProjectStore'
import { useThemeStore, type Theme } from '../store/useThemeStore'
import { useLocaleStore } from '../store/useLocaleStore'
import { useTranslation } from '../i18n/useTranslation'
import Logo from './Logo'

interface PaletteItem {
  id: string
  category: 'element' | 'compound' | 'project' | 'action'
  label: string
  hint?: string
  swatch?: string
  keywords: string
  run: () => void
}

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setView, setPaletteTarget } = useUiStore()
  const allCompounds = useCompoundStore((s) => s.allCompounds)
  const projects = useProjectStore((s) => s.projects)
  const openProject = useProjectStore((s) => s.openProject)
  const setTheme = useThemeStore((s) => s.setTheme)
  const setLocale = useLocaleStore((s) => s.setLocale)
  const { t } = useTranslation()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setPaletteOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  const allItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = []

    for (const project of projects) {
      items.push({
        id: `project-${project.id}`,
        category: 'project',
        label: project.title,
        hint: project.updatedAt,
        keywords: project.title.toLowerCase(),
        run: () => {
          setView('projects')
          openProject(project.id)
        },
      })
    }

    for (const compound of allCompounds) {
      items.push({
        id: `compound-${compound.id}`,
        category: 'compound',
        label: compound.name,
        hint: compound.inciName ?? compound.formula,
        swatch: SAFETY_COLORS[compound.safety.level],
        keywords: `${compound.name} ${compound.inciName ?? ''} ${compound.formula ?? ''}`.toLowerCase(),
        run: () => {
          setPaletteTarget({ type: 'compound', id: compound.id })
          setView('compounds')
        },
      })
    }

    for (const element of ELEMENTS) {
      items.push({
        id: `element-${element.number}`,
        category: 'element',
        label: `${element.name} (${element.symbol})`,
        hint: `#${element.number} · ${element.mass} u`,
        swatch: CATEGORY_COLORS[element.category],
        keywords: `${element.name} ${element.symbol}`.toLowerCase(),
        run: () => {
          setPaletteTarget({ type: 'element', number: element.number })
          setView('periodic-table')
        },
      })
    }

    const themes: Theme[] = ['nuit', 'clair', 'emeraude']
    for (const theme of themes) {
      items.push({
        id: `action-theme-${theme}`,
        category: 'action',
        label: t('palette.switchTheme', { theme: t(`theme.${theme}`) }),
        keywords: `theme thème ${t(`theme.${theme}`).toLowerCase()} ${theme}`,
        run: () => setTheme(theme),
      })
    }
    items.push({
      id: 'action-locale-fr',
      category: 'action',
      label: t('palette.switchToFrench'),
      keywords: 'langue language français french fr',
      run: () => setLocale('fr'),
    })
    items.push({
      id: 'action-locale-en',
      category: 'action',
      label: t('palette.switchToEnglish'),
      keywords: 'langue language anglais english en',
      run: () => setLocale('en'),
    })
    items.push({
      id: 'action-nav-projects',
      category: 'action',
      label: t('palette.goProjects'),
      keywords: `${t('nav.projects').toLowerCase()} projets projects`,
      run: () => setView('projects'),
    })
    items.push({
      id: 'action-nav-periodic',
      category: 'action',
      label: t('palette.goPeriodicTable'),
      keywords: `${t('nav.periodicTable').toLowerCase()} tableau periodic mendeleiev`,
      run: () => setView('periodic-table'),
    })
    items.push({
      id: 'action-nav-compounds',
      category: 'action',
      label: t('palette.goCompounds'),
      keywords: `${t('nav.compounds').toLowerCase()} composés compounds bibliothèque library`,
      run: () => setView('compounds'),
    })

    return items
  }, [projects, allCompounds, openProject, setLocale, setPaletteTarget, setTheme, setView, t])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Sans requête : projets récents + actions (pattern "suggestions" des top apps de recherche)
      return allItems.filter((i) => i.category === 'project' || i.category === 'action').slice(0, 9)
    }
    const matched = allItems.filter((i) => i.keywords.includes(q))
    // Priorité : correspondance en début de label, puis projets > composés > éléments > actions
    const order = { project: 0, compound: 1, element: 2, action: 3 }
    return matched
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1
        const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1
        if (aStarts !== bStarts) return aStarts - bStarts
        return order[a.category] - order[b.category]
      })
      .slice(0, 12)
  }, [allItems, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (paletteOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [paletteOpen])

  useEffect(() => {
    const active = listRef.current?.children[activeIndex] as HTMLElement | undefined
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const execute = (item: PaletteItem) => {
    item.run()
    close()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      execute(results[activeIndex])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const CATEGORY_LABEL: Record<PaletteItem['category'], string> = {
    element: t('palette.categoryElement'),
    compound: t('palette.categoryCompound'),
    project: t('palette.categoryProject'),
    action: t('palette.categoryAction'),
  }

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-40 flex items-start justify-center bg-black/60 p-4 pt-[14svh] backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Logo size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('palette.placeholder')}
                className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg/40 focus:outline-none"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-fg/40">Esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[46svh] overflow-y-auto p-1.5">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-fg/40">{t('palette.noResults')}</p>
              ) : (
                results.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => execute(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      index === activeIndex ? 'bg-accent text-white' : 'text-fg/80'
                    }`}
                  >
                    {item.swatch && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.swatch }} />
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.hint && (
                      <span className={`truncate text-xs ${index === activeIndex ? 'text-white/70' : 'text-fg/40'}`}>
                        {item.hint}
                      </span>
                    )}
                    <span
                      className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
                        index === activeIndex ? 'border-white/30 text-white/80' : 'border-border text-fg/40'
                      }`}
                    >
                      {CATEGORY_LABEL[item.category]}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[10px] text-fg/40">
              <span>↑↓ {t('palette.hintNavigate')}</span>
              <span>↵ {t('palette.hintOpen')}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
