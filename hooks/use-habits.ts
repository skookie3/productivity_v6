'use client'

import { createClient } from '@/lib/supabase/client'
import { Habit, HabitCompletion } from '@/lib/types'
import useSWR from 'swr'

const supabase = createClient()

export function useHabits() {
  const { data: habits, error, mutate } = useSWR<Habit[]>('habits', async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  })

  const addHabit = async (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('habits')
      .insert({ ...habit, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    mutate()
    return data
  }

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const { error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    mutate()
  }

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  return {
    habits: habits || [],
    isLoading: !habits && !error,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    mutate,
  }
}

export function useHabitCompletions() {
  const { data: completions, error, mutate } = useSWR<HabitCompletion[]>(
    'habit_completions',
    async () => {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .order('completed_date', { ascending: false })
      if (error) throw error
      return data
    }
  )

  const toggleCompletion = async (habitId: string, date: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const existing = completions?.find(
      (c) => c.habit_id === habitId && c.completed_date === date
    )

    if (existing) {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('habit_completions')
        .insert({ habit_id: habitId, user_id: user.id, completed_date: date })
      if (error) throw error
    }
    mutate()
  }

  const isCompleted = (habitId: string, date: string) => {
    return completions?.some(
      (c) => c.habit_id === habitId && c.completed_date === date
    ) || false
  }

  return {
    completions: completions || [],
    isLoading: !completions && !error,
    error,
    toggleCompletion,
    isCompleted,
    mutate,
  }
}
