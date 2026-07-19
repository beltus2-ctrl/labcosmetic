import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'nuit' | 'clair' | 'emeraude'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'nuit',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'labcosmetique-theme' },
  ),
)
