import { create } from 'zustand'

export interface LabProject {
  id: string
  title: string
  updatedAt: string
}

interface ProjectStore {
  projects: LabProject[]
  activeProjectId: string | null
  setProjects: (projects: LabProject[]) => void
  openProject: (id: string) => void
  closeProject: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  activeProjectId: null,
  setProjects: (projects) => set({ projects }),
  openProject: (id) => set({ activeProjectId: id }),
  closeProject: () => set({ activeProjectId: null }),
}))
