'use client'

import { createClient } from '@/lib/supabase/client'
import { UserSettings } from '@/lib/types'
import useSWR from 'swr'
import { useEffect } from 'react'

const supabase = createClient()

export function useSettings() {
  const { data: settings, error, mutate } = useSWR<UserSettings | null>(
    'user_settings',
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error && error.code === 'PGRST116') {
        // No settings found, create default
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id, theme: 'light', best_streak: 0 })
          .select()
          .single()
        if (insertError) throw insertError
        return newSettings
      }
      if (error) throw error
      return data
    }
  )

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark')
    }
  }, [settings?.theme])

  const updateTheme = async (theme: 'light' | 'dark') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !settings) return

    const { error } = await supabase
      .from('user_settings')
      .update({ theme, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
    if (error) throw error
    mutate()
  }

  const updateBestStreak = async (streak: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !settings) return

    if (streak > (settings.best_streak || 0)) {
      const { error } = await supabase
        .from('user_settings')
        .update({ best_streak: streak, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
      if (error) throw error
      mutate()
    }
  }

  return {
    settings,
    isLoading: settings === undefined && !error,
    error,
    updateTheme,
    updateBestStreak,
    mutate,
  }
}
