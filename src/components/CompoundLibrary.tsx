import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { SAFETY_COLORS, type Compound } from '../data/compounds'
import { useTranslation } from '../i18n/useTranslation'
import { useUiStore } from '../store/useUiStore'
import { useCompoundStore } from '../store/useCompoundStore'
import { useToastStore } from '../store/useToastStore'
import CompoundDetail from './CompoundDetail'
import CompoundForm from './CompoundForm'

interface Props {
  userId: string
}

export default function CompoundLibrary({ userId }: Props) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { t } = useTranslation()
  const { paletteTarget, setPaletteTarget } = useUiStore()
  const { allCompounds, add, remove } = useCompoundStore()
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    if (paletteTarget?.type === 'compound') {
      setSelectedId(paletteTarget.id)
      setPaletteTarget(null)
    }
  }, [paletteTarget, setPaletteTarget])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allCompounds
    return allCompounds.filter(
      (c) => c.name.toLowerCase().includes(q) || c.inciName?.toLowerCase().includes(q),
    )
  }, [query, allCompounds])

  const selected = allCompounds.find((c) => c.id === selectedId) ?? null

  const findById = (id: string): Compound | undefined => allCompounds.find((c) => c.id === id)

  const handleCreate = async (compound: Omit<Compound, 'id' | 'custom'>) => {
    const created = await add(userId, compound)
    setSelectedId(created.id)
    addToast(t('compoundLibrary.created'), 'success')
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('compoundLibrary.confirmDeleteCustom'))) return
    try {
      await remove(id)
      if (selectedId === id) setSelectedId(null)
      addToast(t('compoundLibrary.deleted'), 'success')
    } catch (e) {
      addToast((e as Error).message, 'error')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('compoundLibrary.searchPlaceholder')}
            className="flex-1 rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 rounded bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            {t('compoundLibrary.newCompound')}
          </button>
        </div>
        <div className="flex max-h-[65svh] flex-col gap-1 overflow-y-auto pr-1">
          {filtered.map((compound) => (
            <button
              key={compound.id}
              onClick={() => setSelectedId(compound.id)}
              className={`flex items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm transition ${
                selectedId === compound.id
                  ? 'bg-accent text-white'
                  : 'bg-panel text-fg/80 hover:bg-panel-2'
              }`}
            >
              <span className="min-w-0 flex-1 truncate">
                {compound.name}
                <span className="ml-2 text-xs opacity-60">
                  {compound.custom ? t('compoundLibrary.customBadge') : t(`compoundCategory.${compound.category}`)}
                </span>
              </span>
              {compound.custom && (
                <span
                  className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] uppercase ${
                    selectedId === compound.id ? 'border-white/40 text-white/90' : 'border-accent/50 text-accent'
                  }`}
                >
                  ★
                </span>
              )}
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: SAFETY_COLORS[compound.safety.level] }}
              />
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-fg/40">{t('compoundLibrary.noResults')}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel p-5">
        {selected ? (
          <div className="flex flex-col gap-3">
            <CompoundDetail compound={selected} resolve={findById} onSelect={(id) => setSelectedId(id)} />
            {selected.custom && (
              <button
                onClick={() => handleDelete(selected.id)}
                className="self-start rounded border border-danger/40 px-3 py-1.5 text-sm text-danger transition hover:bg-danger/10"
              >
                {t('compoundLibrary.deleteCustom')}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-fg/40">{t('compoundLibrary.selectHint')}</p>
        )}
      </div>

      <AnimatePresence>
        {showForm && <CompoundForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
