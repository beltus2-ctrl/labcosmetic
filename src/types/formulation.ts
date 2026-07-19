export type VesselType = 'beaker' | 'erlenmeyer' | 'test-tube' | 'flask' | 'buret'

export interface FormulationIngredient {
  compoundId: string
  percentage: number
}

export interface Formulation {
  ingredients: FormulationIngredient[]
  vessel?: VesselType
}

export const EMPTY_FORMULATION: Formulation = { ingredients: [], vessel: 'beaker' }
