import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ELEMENTS, CATEGORY_COLORS, STATE_COLORS, type ChemicalElement, type ElementCategory } from '../data/elements'
import { useTranslation } from '../i18n/useTranslation'
import { useUiStore } from '../store/useUiStore'
import ElementDetail from './ElementDetail'

const CATEGORIES = Object.keys(CATEGORY_COLORS) as ElementCategory[]

export default function PeriodicTable() {
  const [selected, setSelected] = useState<ChemicalElement | null>(null)
  const [query, setQuery] = useState('')
  const { t } = useTranslation()
  const { paletteTarget, setPaletteTarget } = useUiStore()

  useEffect(() => {
    if (paletteTarget?.type === 'element') {
      const element = ELEMENTS.find((e) => e.number === paletteTarget.number)
      if (element) setSelected(element)
      setPaletteTarget(null)
    }
  }, [paletteTarget, setPaletteTarget])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return new Set(
      ELEMENTS.filter((e) => e.name.toLowerCase().includes(q) || e.symbol.toLowerCase() === q).map(
        (e) => e.number,
      ),
    )
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('element.searchPlaceholder')}
        className="w-full max-w-sm rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
      />

      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(46px, 1fr))',
            gridTemplateRows: 'repeat(10, auto)',
            minWidth: '900px',
          }}
        >
          {ELEMENTS.map((element, i) => {
            const dimmed = matches !== null && !matches.has(element.number)
            return (
              <motion.button
                key={element.number}
                onClick={() => setSelected(element)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: dimmed ? 0.25 : 1, scale: 1 }}
                transition={{ duration: 0.15, delay: i * 0.002 }}
                whileHover={{ scale: 1.12, zIndex: 10 }}
                whileTap={{ scale: 1.02 }}
                style={{
                  gridRow: element.gridRow,
                  gridColumn: element.gridColumn,
                  backgroundColor: CATEGORY_COLORS[element.category],
                }}
                className="relative flex aspect-square flex-col items-center justify-center rounded text-black/80 hover:ring-2 hover:ring-white"
                title={element.name}
              >
                <span
                  className="absolute left-0.5 top-0.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: STATE_COLORS[element.state] }}
                  title={t(`state.${element.state}`)}
                />
                <span className="text-[9px] leading-none opacity-70">{element.number}</span>
                <span className="text-sm font-bold leading-none">{element.symbol}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg/60">
        {CATEGORIES.map((category) => (
          <div key={category} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
            {t(`elementCategory.${category}`)}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg/40">
        {(['solid', 'liquid', 'gas', 'unknown'] as const).map((state) => (
          <div key={state} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATE_COLORS[state] }} />
            {t(`state.${state}`)}
          </div>
        ))}
      </div>

      {selected && <ElementDetail element={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
