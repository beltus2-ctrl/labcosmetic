import { supabase } from '../lib/supabase'
import type { LabProject } from '../store/useProjectStore'
import { EMPTY_FORMULATION, type Formulation } from '../types/formulation'

interface ProjectRow {
  id: string
  title: string
  data: Record<string, unknown>
  updated_at: string
}

export interface ProjectDetail {
  id: string
  title: string
  formulation: Formulation
  updatedAt: string
}

function toLabProject(row: ProjectRow): LabProject {
  return {
    id: row.id,
    title: row.title,
    updatedAt: new Date(row.updated_at).toLocaleDateString('fr-FR'),
  }
}

function toProjectDetail(row: ProjectRow): ProjectDetail {
  return {
    id: row.id,
    title: row.title,
    formulation: (row.data?.formulation as Formulation | undefined) ?? EMPTY_FORMULATION,
    updatedAt: new Date(row.updated_at).toLocaleDateString('fr-FR'),
  }
}

export async function listProjects(userId: string): Promise<LabProject[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, data, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data as ProjectRow[]).map(toLabProject)
}

export async function createProject(userId: string, title: string): Promise<LabProject> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: userId, title, data: {} })
    .select('id, title, data, updated_at')
    .single()

  if (error) throw error
  return toLabProject(data as ProjectRow)
}

export async function renameProject(id: string, title: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('projects').update({ title }).eq('id', id)
  if (error) throw error
}

export async function touchProject(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function deleteProject(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function getProject(id: string): Promise<ProjectDetail> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, data, updated_at')
    .eq('id', id)
    .single()

  if (error) throw error
  return toProjectDetail(data as ProjectRow)
}

export async function saveFormulation(id: string, formulation: Formulation): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('projects').update({ data: { formulation } }).eq('id', id)
  if (error) throw error
}
