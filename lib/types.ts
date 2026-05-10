export interface Habit {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  weekly_goal: number
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  duration_minutes: number
  completed_at: string
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: 'light' | 'dark'
  best_streak: number
  created_at: string
  updated_at: string
}

export type TabType = 'habits' | 'tasks' | 'pomodoro' | 'history' | 'planning'
