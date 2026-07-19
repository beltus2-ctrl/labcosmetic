import { supabase } from '../lib/supabase'
import type { Formulation } from '../types/formulation'

export interface ProjectVersion {
  id: string
  formulation: Formulation
  createdAt: string
  ingredientCount: number
}

interface VersionRow {
  id: string
  data: { formulation?: Formulation }
  created_at: string
}

function toProjectVersion(row: VersionRow): ProjectVersion {
  const formulation = row.data?.formulation ?? { ingredients: [] }
  return {
    id: row.id,
    formulation,
    createdAt: new Date(row.created_at).toLocaleString('fr-FR'),
    ingredientCount: formulation.ingredients.length,
  }
}

export async function createVersion(
  projectId: string,
  userId: string,
  formulation: Formulation,
): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase
    .from('project_versions')
    .insert({ project_id: projectId, user_id: userId, data: { formulation } })
  if (error) throw error
}

export async function listVersions(projectId: string): Promise<ProjectVersion[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('project_versions')
    .select('id, data, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as VersionRow[]).map(toProjectVersion)
}
