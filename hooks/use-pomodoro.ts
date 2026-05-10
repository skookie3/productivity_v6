'use client'

import { createClient } from '@/lib/supabase/client'
import { PomodoroSession } from '@/lib/types'
import useSWR from 'swr'

const supabase = createClient()

export function usePomodoro() {
  const { data: sessions, error, mutate } = useSWR<PomodoroSession[]>(
    'pomodoro_sessions',
    async () => {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .order('completed_at', { ascending: false })
      if (error) throw error
      return data
    }
  )

  const addSession = async (durationMinutes: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert({ 
        user_id: user.id, 
        duration_minutes: durationMinutes,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()
    if (error) throw error
    mutate()
    return data
  }

  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0]
    return sessions?.filter((s) => s.completed_at.startsWith(today)) || []
  }

  const getTotalMinutesToday = () => {
    return getTodaySessions().reduce((sum, s) => sum + s.duration_minutes, 0)
  }

  return {
    sessions: sessions || [],
    isLoading: !sessions && !error,
    error,
    addSession,
    getTodaySessions,
    getTotalMinutesToday,
    mutate,
  }
}
