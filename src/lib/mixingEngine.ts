import { COMPOUNDS, type Compound } from '../data/compounds'
import type { FormulationIngredient } from '../types/formulation'

// Liste par défaut : composés curés uniquement. Les appelants passent la liste
// fusionnée (curés + personnalisés) quand elle est disponible.

export type IssueSeverity = 'info' | 'warning' | 'danger'

export interface CompatibilityIssue {
  severity: IssueSeverity
  message: string
}

export type Stability = 'stable' | 'a-surveiller' | 'instable'

export interface FormulationAnalysis {
  totalPercentage: number
  estimatedPh: number | null
  stability: Stability
  issues: CompatibilityIssue[]
}

const SKIN_COMFORT_PH: [number, number] = [4.5, 6.5]

export function analyzeFormulation(
  ingredients: FormulationIngredient[],
  compounds: Compound[] = COMPOUNDS,
): FormulationAnalysis {
  const issues: CompatibilityIssue[] = []
  const totalPercentage = ingredients.reduce((sum, i) => sum + i.percentage, 0)

  let phWeightedSum = 0
  let phWeightTotal = 0

  for (const ingredient of ingredients) {
    const compound = compounds.find((c) => c.id === ingredient.compoundId)
    if (!compound) continue

    if (compound.phRange) {
      const midpoint = (compound.phRange[0] + compound.phRange[1]) / 2
      phWeightedSum += midpoint * ingredient.percentage
      phWeightTotal += ingredient.percentage
    }

    if (compound.safety.level === 'caution') {
      issues.push({
        severity: 'danger',
        message: `${compound.name} : ${compound.safety.notes[0] ?? 'prudence requise'}`,
      })
    } else if (compound.safety.level === 'moderate') {
      issues.push({
        severity: 'warning',
        message: `${compound.name} : ${compound.safety.notes[0] ?? 'à doser avec attention'}`,
      })
    }
  }

  const estimatedPh = phWeightTotal > 0 ? Math.round((phWeightedSum / phWeightTotal) * 10) / 10 : null

  if (estimatedPh !== null) {
    if (estimatedPh < 3 || estimatedPh > 9) {
      issues.push({
        severity: 'danger',
        message: `pH estimé ${estimatedPh} : zone extrême, risque d'irritation cutanée élevé`,
      })
    } else if (estimatedPh < SKIN_COMFORT_PH[0] || estimatedPh > SKIN_COMFORT_PH[1]) {
      issues.push({
        severity: 'warning',
        message: `pH estimé ${estimatedPh} : hors de la zone de confort cutané habituelle (${SKIN_COMFORT_PH[0]}–${SKIN_COMFORT_PH[1]})`,
      })
    }
  }

  if (ingredients.length > 0 && Math.round(totalPercentage) !== 100) {
    issues.push({
      severity: 'info',
      message: `La formulation totalise ${Math.round(totalPercentage)}% (ajuste les proportions pour atteindre 100%)`,
    })
  }

  const stability: Stability = issues.some((i) => i.severity === 'danger')
    ? 'instable'
    : issues.some((i) => i.severity === 'warning')
      ? 'a-surveiller'
      : 'stable'

  return { totalPercentage, estimatedPh, stability, issues }
}

export const STABILITY_LABELS: Record<Stability, string> = {
  stable: 'Stable',
  'a-surveiller': 'À surveiller',
  instable: 'Instable',
}

export const STABILITY_COLORS: Record<Stability, string> = {
  stable: '#7fd1ae',
  'a-surveiller': '#f2b880',
  instable: '#e07a5f',
}
