import { useState } from 'react'
import { motion } from 'motion/react'
import type { Compound, SafetyLevel } from '../data/compounds'
import { SAFETY_COLORS } from '../data/compounds'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  onSubmit: (compound: Omit<Compound, 'id' | 'custom'>) => Promise<void>
  onClose: () => void
}

const COLOR_PRESETS = [
  '#eaf4fa', '#bcd9ec', '#4a90d9', '#7fd1ae', '#8dbf7c', '#f2b705',
  '#e8a33d', '#d9a441', '#e07a5f', '#d97ab0', '#b9a7d9', '#8a9a6b',
]

const SAFETY_LEVELS: SafetyLevel[] = ['low', 'moderate', 'caution']

export default function CompoundForm({ onSubmit, onClose }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [inciName, setInciName] = useState('')
  const [formula, setFormula] = useState('')
  const [functions, setFunctions] = useState('')
  const [phMin, setPhMin] = useState('')
  const [phMax, setPhMax] = useState('')
  const [color, setColor] = useState(COLOR_PRESETS[1])
  const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>('low')
  const [safetyNotes, setSafetyNotes] = useState('')
  const [source, setSource] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const functionList = functions
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    if (!name.trim() || functionList.length === 0 || !source.trim()) {
      setError(t('compoundForm.errorRequired'))
      return
    }

    let phRange: [number, number] | undefined
    if (phMin !== '' || phMax !== '') {
      const min = Number(phMin)
      const max = Number(phMax)
      if (Number.isNaN(min) || Number.isNaN(max) || min > max || min < 0 || max > 14) {
        setError(t('compoundForm.errorPh'))
        return
      }
      phRange = [min, max]
    }

    const compound: Omit<Compound, 'id' | 'custom'> = {
      name: name.trim(),
      category: 'pure-compound',
      function: functionList,
      color,
      safety: {
        level: safetyLevel,
        notes: safetyNotes
          .split('\n')
          .map((n) => n.trim())
          .filter(Boolean),
      },
      source: source.trim(),
      ...(inciName.trim() ? { inciName: inciName.trim() } : {}),
      ...(formula.trim() ? { formula: formula.trim() } : {}),
      ...(phRange ? { phRange } : {}),
    }

    setSubmitting(true)
    try {
      await onSubmit(compound)
      onClose()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded border border-border bg-deep px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85svh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-panel p-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-fg">{t('compoundForm.title')}</h3>
          <button type="button" onClick={onClose} className="text-fg/50 hover:text-fg">
            ✕
          </button>
        </div>

        <label className="flex flex-col gap-1 text-xs text-fg/60">
          {t('compoundForm.name')}
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-fg/60">
            {t('compoundForm.inciName')}
            <input value={inciName} onChange={(e) => setInciName(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-fg/60">
            {t('compoundForm.formula')}
            <input value={formula} onChange={(e) => setFormula(e.target.value)} className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs text-fg/60">
          {t('compoundForm.functions')}
          <input
            value={functions}
            onChange={(e) => setFunctions(e.target.value)}
            placeholder={t('compoundForm.functionsPlaceholder')}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs text-fg/60">
            {t('compoundForm.phMin')}
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={phMin}
              onChange={(e) => setPhMin(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-fg/60">
            {t('compoundForm.phMax')}
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={phMax}
              onChange={(e) => setPhMax(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-fg/60">
          {t('compoundForm.color')}
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  color === preset ? 'border-accent scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-fg/60">
          {t('compoundForm.safetyLevel')}
          <div className="flex gap-2">
            {SAFETY_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSafetyLevel(level)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                  safetyLevel === level ? 'border-accent text-fg' : 'border-border text-fg/50'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SAFETY_COLORS[level] }} />
                {t(`safetyLevel.${level}`)}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 text-xs text-fg/60">
          {t('compoundForm.safetyNotes')}
          <textarea
            value={safetyNotes}
            onChange={(e) => setSafetyNotes(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-fg/60">
          {t('compoundForm.source')}
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={t('compoundForm.sourcePlaceholder')}
            rows={2}
            className={inputClass}
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? t('compoundForm.creating') : t('compoundForm.create')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border px-3 py-2 text-sm text-fg/70"
          >
            {t('compoundForm.cancel')}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
