import { motion } from 'motion/react'
import { CATEGORY_COLORS, type ChemicalElement } from '../data/elements'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  element: ChemicalElement
  onClose: () => void
}

export default function ElementDetail({ element, onClose }: Props) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm rounded-lg border border-border bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex h-16 w-16 flex-col items-center justify-center rounded text-black/80"
            style={{ backgroundColor: CATEGORY_COLORS[element.category] }}
          >
            <span className="text-[10px] leading-none opacity-70">{element.number}</span>
            <span className="text-xl font-bold leading-none">{element.symbol}</span>
          </div>
          <button onClick={onClose} className="text-fg/50 hover:text-fg">
            ✕
          </button>
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold text-fg">{element.name}</h3>
        <p className="text-sm text-fg/50">{t(`elementCategory.${element.category}`)}</p>

        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-fg/50">{t('element.atomicNumber')}</dt>
          <dd className="text-fg">{element.number}</dd>
          <dt className="text-fg/50">{t('element.atomicMass')}</dt>
          <dd className="text-fg">{element.mass} u</dd>
          <dt className="text-fg/50">{t('element.period')}</dt>
          <dd className="text-fg">{element.period}</dd>
          <dt className="text-fg/50">{t('element.state')}</dt>
          <dd className="text-fg">{t(`state.${element.state}`)}</dd>
          <dt className="text-fg/50">{t('element.radioactive')}</dt>
          <dd className="text-fg">{element.radioactive ? t('element.yes') : t('element.no')}</dd>
        </dl>
      </motion.div>
    </motion.div>
  )
}
