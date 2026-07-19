import { useMemo, useState } from 'react'
import SkinAvatar3D from './SkinAvatar3D'
import { simulateSkinEffects, TIME_POINTS, type TimePoint } from '../lib/skinEffectEngine'
import { useTranslation } from '../i18n/useTranslation'
import { useCompoundStore } from '../store/useCompoundStore'
import type { Formulation } from '../types/formulation'

interface Props {
  formulation: Formulation
  mode: 'topique' | 'ingestion'
}

const METRICS = ['hydration', 'irritation', 'radiance', 'pigmentation'] as const

const METRIC_COLORS: Record<(typeof METRICS)[number], string> = {
  hydration: '#4a90d9',
  irritation: '#e07a5f',
  radiance: '#7fd1ae',
  pigmentation: '#f2b880',
}

export default function AvatarPanel({ formulation }: Props) {
  const [timePoint, setTimePoint] = useState<TimePoint>('immediate')
  const { t } = useTranslation()
  const allCompounds = useCompoundStore((s) => s.allCompounds)

  const timeline = useMemo(
    () => simulateSkinEffects(formulation.ingredients, allCompounds),
    [formulation, allCompounds],
  )
  const state = timeline[timePoint]

  if (formulation.ingredients.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-fg/40">
        {t('avatar.emptyHint')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:h-full lg:grid-cols-[1.4fr_1fr]">
      <div className="h-64 lg:h-auto">
        <SkinAvatar3D state={state} />
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-panel p-4">
        <div>
          <h3 className="text-sm font-medium text-fg/70">{t('avatar.timeline')}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIME_POINTS.map(({ key }) => (
              <button
                key={key}
                onClick={() => setTimePoint(key)}
                className={`rounded px-3 py-1.5 text-sm ${
                  timePoint === key ? 'bg-accent text-white' : 'bg-deep text-fg/60 hover:text-fg'
                }`}
              >
                {t(`timePoint.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {METRICS.map((metric) => (
            <div key={metric}>
              <div className="flex items-center justify-between text-xs text-fg/60">
                <span>{t(`avatar.${metric}`)}</span>
                <span>{Math.round(state[metric])}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-fg/10">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${state[metric]}%`, backgroundColor: METRIC_COLORS[metric] }}
                />
              </div>
            </div>
          ))}
        </div>

        {timeline.warnings.length > 0 && (
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wide text-fg/40">{t('avatar.warnings')}</h4>
            <ul className="mt-1 flex flex-col gap-1 text-xs text-fg/60">
              {timeline.warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="border-t border-border pt-3 text-[11px] leading-snug text-fg/40">{t('avatar.disclaimer')}</p>
      </div>
    </div>
  )
}
