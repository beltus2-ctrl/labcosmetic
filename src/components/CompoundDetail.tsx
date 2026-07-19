import { SAFETY_COLORS, type Compound } from '../data/compounds'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  compound: Compound
  resolve: (id: string) => Compound | undefined
  onSelect: (id: string) => void
}

export default function CompoundDetail({ compound, resolve, onSelect }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-fg">{compound.name}</h3>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-black/80"
            style={{ backgroundColor: SAFETY_COLORS[compound.safety.level] }}
          >
            {t(`safetyLevel.${compound.safety.level}`)}
          </span>
        </div>
        <p className="text-sm text-fg/50">{t(`compoundCategory.${compound.category}`)}</p>
      </div>

      <dl className="grid grid-cols-2 gap-y-2 text-sm">
        {compound.formula && (
          <>
            <dt className="text-fg/50">{t('compoundDetail.formula')}</dt>
            <dd className="text-fg">{compound.formula}</dd>
          </>
        )}
        {compound.inciName && (
          <>
            <dt className="text-fg/50">{t('compoundDetail.inciName')}</dt>
            <dd className="text-fg">{compound.inciName}</dd>
          </>
        )}
        {compound.phRange && (
          <>
            <dt className="text-fg/50">{t('compoundDetail.typicalPh')}</dt>
            <dd className="text-fg">
              {compound.phRange[0]} – {compound.phRange[1]}
            </dd>
          </>
        )}
      </dl>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-wide text-fg/40">{t('compoundDetail.functions')}</h4>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {compound.function.map((f) => (
            <span key={f} className="rounded-full border border-border px-2 py-0.5 text-xs text-fg/70">
              {f}
            </span>
          ))}
        </div>
      </div>

      {compound.safety.notes.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-fg/40">{t('compoundDetail.warnings')}</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-fg/70">
            {compound.safety.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {compound.decomposesInto && compound.decomposesInto.length > 0 && (
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-fg/40">
            {t('compoundDetail.decomposesInto')}
          </h4>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {compound.decomposesInto.map((id) => {
              const c = resolve(id)
              if (!c) return null
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  className="rounded-full bg-deep px-2.5 py-1 text-xs text-accent hover:bg-accent hover:text-white"
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-3">
        <h4 className="text-xs font-medium uppercase tracking-wide text-fg/40">{t('compoundDetail.source')}</h4>
        <p className="mt-1 text-xs text-fg/50">{compound.source}</p>
      </div>
    </div>
  )
}
