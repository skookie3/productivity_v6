'use client'

import { createClient } from '@/lib/supabase/client'
import { Task } from '@/lib/types'
import useSWR from 'swr'

const supabase = createClient()

export function useTasks() {
  const { data: tasks, error, mutate } = useSWR<Task[]>('tasks', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  })

  const addTask = async (task: { title: string; priority: 'low' | 'medium' | 'high' }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    mutate()
    return data
  }

  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (error) throw error
    mutate()
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
    mutate()
  }

  const clearCompleted = async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('completed', true)
    if (error) throw error
    mutate()
  }

  return {
    tasks: tasks || [],
    isLoading: !tasks && !error,
    error,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    mutate,
  }
}
