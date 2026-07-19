import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { analyzeFormulation, STABILITY_COLORS } from '../lib/mixingEngine'
import { exportFormulationPdf } from '../lib/exportPdf'
import { useTranslation } from '../i18n/useTranslation'
import { useCompoundStore } from '../store/useCompoundStore'
import type { Formulation } from '../types/formulation'

interface Props {
  projectTitle: string
  formulation: Formulation
  onChange: (formulation: Formulation) => void
  onSave: () => void
  saving: boolean
}

const ISSUE_COLORS: Record<'info' | 'warning' | 'danger', string> = {
  info: '#4a90d9',
  warning: '#f2b880',
  danger: '#e07a5f',
}

export default function FormulationPanel({ projectTitle, formulation, onChange, onSave, saving }: Props) {
  const [query, setQuery] = useState('')
  const { t } = useTranslation()
  const allCompounds = useCompoundStore((s) => s.allCompounds)

  const analysis = useMemo(
    () => analyzeFormulation(formulation.ingredients, allCompounds),
    [formulation, allCompounds],
  )

  const availableCompounds = useMemo(() => {
    const usedIds = new Set(formulation.ingredients.map((i) => i.compoundId))
    const q = query.trim().toLowerCase()
    return allCompounds.filter((c) => !usedIds.has(c.id) && (!q || c.name.toLowerCase().includes(q)))
  }, [formulation, query, allCompounds])

  const addCompound = (compoundId: string) => {
    onChange({
      ingredients: [...formulation.ingredients, { compoundId, percentage: 10 }],
    })
  }

  const removeCompound = (compoundId: string) => {
    onChange({
      ingredients: formulation.ingredients.filter((i) => i.compoundId !== compoundId),
    })
  }

  const updatePercentage = (compoundId: string, percentage: number) => {
    onChange({
      ingredients: formulation.ingredients.map((i) =>
        i.compoundId === compoundId ? { ...i, percentage } : i,
      ),
    })
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-panel p-4">
      <div>
        <h3 className="text-sm font-medium text-fg/70">{t('formulation.title')}</h3>

        {formulation.ingredients.length === 0 ? (
          <p className="mt-2 text-xs text-fg/40">{t('formulation.emptyHint')}</p>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {formulation.ingredients.map((ingredient) => {
                const compound = allCompounds.find((c) => c.id === ingredient.compoundId)
                if (!compound) return null
                return (
                  <motion.div
                    key={ingredient.compoundId}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1 truncate text-sm text-fg">{compound.name}</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={ingredient.percentage}
                      onChange={(e) => updatePercentage(ingredient.compoundId, Number(e.target.value))}
                      className="w-16 rounded border border-border bg-deep px-2 py-1 text-right text-sm text-fg focus:border-accent focus:outline-none"
                    />
                    <span className="text-xs text-fg/40">%</span>
                    <button
                      onClick={() => removeCompound(ingredient.compoundId)}
                      className="text-fg/40 hover:text-danger"
                      title={t('formulation.remove')}
                    >
                      ✕
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {formulation.ingredients.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded border border-border bg-deep p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg/50">{t('formulation.analysis')}</span>
              <motion.span
                key={analysis.stability}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="rounded-full px-2 py-0.5 text-[11px] font-medium text-black/80"
                style={{ backgroundColor: STABILITY_COLORS[analysis.stability] }}
              >
                {t(`stability.${analysis.stability}`)}
              </motion.span>
            </div>
            <p className="mt-2 text-sm text-fg/70">
              {t('formulation.estimatedPh', {
                value: analysis.estimatedPh !== null ? analysis.estimatedPh : t('formulation.phUnknown'),
              })}
            </p>
            {analysis.issues.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1">
                {analysis.issues.map((issue, i) => (
                  <li key={i} className="text-xs" style={{ color: ISSUE_COLORS[issue.severity] }}>
                    • {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSave}
          disabled={saving}
          className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? t('formulation.saving') : t('formulation.save')}
        </motion.button>
        {formulation.ingredients.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => exportFormulationPdf(projectTitle, formulation, allCompounds)}
            className="rounded border border-border px-3 py-1.5 text-sm text-fg/70 hover:border-accent hover:text-fg"
          >
            {t('formulation.exportPdf')}
          </motion.button>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('formulation.addSearchPlaceholder')}
          className="w-full rounded border border-border bg-deep px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
        />
        <div className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {availableCompounds.map((compound) => (
            <button
              key={compound.id}
              onClick={() => addCompound(compound.id)}
              className="flex items-center justify-between rounded px-2 py-1.5 text-left text-sm text-fg/70 hover:bg-panel-2"
            >
              {compound.name}
              <span className="text-xs text-accent">{t('formulation.addAction')}</span>
            </button>
          ))}
          {availableCompounds.length === 0 && (
            <p className="px-2 py-3 text-center text-xs text-fg/40">{t('formulation.noResults')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
