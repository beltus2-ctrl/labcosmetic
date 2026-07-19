import { create } from 'zustand'
import { COMPOUNDS, type Compound } from '../data/compounds'
import { createCustomCompound, deleteCustomCompound, listCustomCompounds } from '../services/customCompounds'

interface CompoundStore {
  customCompounds: Compound[]
  allCompounds: Compound[]
  load: (userId: string) => Promise<void>
  add: (userId: string, compound: Omit<Compound, 'id' | 'custom'>) => Promise<Compound>
  remove: (id: string) => Promise<void>
}

function merge(custom: Compound[]): Compound[] {
  return [...custom, ...COMPOUNDS]
}

export const useCompoundStore = create<CompoundStore>((set, get) => ({
  customCompounds: [],
  allCompounds: COMPOUNDS,
  load: async (userId) => {
    const customCompounds = await listCustomCompounds(userId)
    set({ customCompounds, allCompounds: merge(customCompounds) })
  },
  add: async (userId, compound) => {
    const created = await createCustomCompound(userId, compound)
    const customCompounds = [created, ...get().customCompounds]
    set({ customCompounds, allCompounds: merge(customCompounds) })
    return created
  },
  remove: async (id) => {
    await deleteCustomCompound(id)
    const customCompounds = get().customCompounds.filter((c) => c.id !== id)
    set({ customCompounds, allCompounds: merge(customCompounds) })
  },
}))
