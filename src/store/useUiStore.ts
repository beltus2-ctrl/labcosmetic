import { create } from 'zustand'

export type View = 'projects' | 'periodic-table' | 'compounds'

// Cible posée par la palette de commande, consommée (puis effacée) par la vue de destination
export type PaletteTarget =
  | { type: 'element'; number: number }
  | { type: 'compound'; id: string }
  | null

interface UiStore {
  view: View
  setView: (view: View) => void
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  paletteTarget: PaletteTarget
  setPaletteTarget: (target: PaletteTarget) => void
}

export const useUiStore = create<UiStore>((set) => ({
  view: 'projects',
  setView: (view) => set({ view }),
  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  paletteTarget: null,
  setPaletteTarget: (paletteTarget) => set({ paletteTarget }),
}))
