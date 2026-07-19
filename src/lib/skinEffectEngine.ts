import { COMPOUNDS, type Compound } from '../data/compounds'
import type { FormulationIngredient } from '../types/formulation'
import { analyzeFormulation } from './mixingEngine'

export type TimePoint = 'immediate' | 'day3' | 'week1' | 'month1'

export const TIME_POINTS: { key: TimePoint; label: string }[] = [
  { key: 'immediate', label: 'Immédiat' },
  { key: 'day3', label: '3 jours' },
  { key: 'week1', label: '1 semaine' },
  { key: 'month1', label: '1 mois' },
]

export interface SkinState {
  hydration: number
  irritation: number
  radiance: number
  pigmentation: number
}

export type SkinTimeline = Record<TimePoint, SkinState> & { warnings: string[] }

const BASELINE: SkinState = { hydration: 45, irritation: 5, radiance: 45, pigmentation: 0 }

// Poids d'évolution par métrique et par échéance (fraction du potentiel appliquée à ce moment)
const CURVES: Record<keyof SkinState, Record<TimePoint, number>> = {
  hydration: { immediate: 0.9, day3: 0.5, week1: 0.15, month1: 0.02 },
  irritation: { immediate: 0.6, day3: 1, week1: 0.3, month1: 0.05 },
  radiance: { immediate: 0.1, day3: 0.4, week1: 1, month1: 0.6 },
  pigmentation: { immediate: 1, day3: 0.6, week1: 0.2, month1: 0.02 },
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v))
}

export function simulateSkinEffects(
  ingredients: FormulationIngredient[],
  compounds: Compound[] = COMPOUNDS,
): SkinTimeline {
  let hydrationPotential = 0
  let irritationPotential = 0
  let radiancePotential = 0
  let pigmentationPotential = 0

  for (const ingredient of ingredients) {
    const compound = compounds.find((c) => c.id === ingredient.compoundId)
    if (!compound) continue
    const weight = ingredient.percentage / 100

    if (compound.function.some((f) => ['hydratant', 'humectant', 'émollient'].includes(f))) {
      hydrationPotential += weight * 40
    }
    if (compound.function.includes('antioxydant')) {
      radiancePotential += weight * 30
    }
    if (compound.function.includes('colorant')) {
      pigmentationPotential += weight * 50
    }
    if (compound.safety.level === 'caution') {
      irritationPotential += weight * 60
    } else if (compound.safety.level === 'moderate') {
      irritationPotential += weight * 25
    }
  }

  const analysis = analyzeFormulation(ingredients, compounds)
  if (analysis.estimatedPh !== null) {
    if (analysis.estimatedPh < 3 || analysis.estimatedPh > 9) irritationPotential += 20
    else if (analysis.estimatedPh < 4.5 || analysis.estimatedPh > 6.5) irritationPotential += 8
  }

  hydrationPotential = clamp(hydrationPotential)
  irritationPotential = clamp(irritationPotential)
  radiancePotential = clamp(radiancePotential)
  pigmentationPotential = clamp(pigmentationPotential)

  const timeline = {} as SkinTimeline
  for (const { key } of TIME_POINTS) {
    timeline[key] = {
      hydration: clamp(BASELINE.hydration + hydrationPotential * CURVES.hydration[key]),
      irritation: clamp(BASELINE.irritation + irritationPotential * CURVES.irritation[key]),
      radiance: clamp(BASELINE.radiance + radiancePotential * CURVES.radiance[key]),
      pigmentation: clamp(BASELINE.pigmentation + pigmentationPotential * CURVES.pigmentation[key]),
    }
  }

  const warnings = analysis.issues.map((i) => i.message)
  if (pigmentationPotential > 15) {
    warnings.push('Coloration temporaire de la peau probable (composé colorant) — se dissipe généralement en quelques jours')
  }

  timeline.warnings = warnings
  return timeline
}
