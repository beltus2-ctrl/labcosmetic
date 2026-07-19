import { supabase } from '../lib/supabase'
import type { Compound } from '../data/compounds'

interface CompoundRow {
  id: string
  data: Omit<Compound, 'id' | 'custom'>
}

function toCompound(row: CompoundRow): Compound {
  return { ...row.data, id: row.id, custom: true }
}

export async function listCustomCompounds(userId: string): Promise<Compound[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_compounds')
    .select('id, data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CompoundRow[]).map(toCompound)
}

export async function createCustomCompound(
  userId: string,
  compound: Omit<Compound, 'id' | 'custom'>,
): Promise<Compound> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data, error } = await supabase
    .from('user_compounds')
    .insert({ user_id: userId, data: compound })
    .select('id, data')
    .single()

  if (error) throw error
  return toCompound(data as CompoundRow)
}

export async function deleteCustomCompound(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.from('user_compounds').delete().eq('id', id)
  if (error) throw error
}
