'use client'

import { useHabits, useHabitCompletions } from '@/hooks/use-habits'
import { useTasks } from '@/hooks/use-tasks'
import { usePomodoro } from '@/hooks/use-pomodoro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckSquare, Timer, TrendingUp, Calendar } from 'lucide-react'
import { useMemo } from 'react'

function getLast30Days() {
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}

export function HistoryTab() {
  const { habits } = useHabits()
  const { completions, isCompleted } = useHabitCompletions()
  const { tasks } = useTasks()
  const { sessions } = usePomodoro()

  const last30Days = useMemo(() => getLast30Days(), [])

  // Calculate stats
  const habitStats = useMemo(() => {
    const totalPossible = habits.length * 30
    const totalCompleted = last30Days.reduce((sum, day) => {
      return sum + habits.filter((h) => isCompleted(h.id, day)).length
    }, 0)
    const rate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
    return { totalCompleted, totalPossible, rate }
  }, [habits, last30Days, isCompleted])

  const taskStats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length
    const total = tasks.length
    return { completed, total }
  }, [tasks])

  const pomodoroStats = useMemo(() => {
    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10
    return { totalSessions, totalMinutes, totalHours }
  }, [sessions])

  // Activity heatmap data
  const heatmapData = useMemo(() => {
    return last30Days.map((day) => {
      const habitCount = habits.filter((h) => isCompleted(h.id, day)).length
      const maxHabits = habits.length || 1
      const intensity = habitCount / maxHabits
      return { day, habitCount, intensity }
    })
  }, [last30Days, habits, isCompleted])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{habitStats.rate}%</p>
                <p className="text-xs text-muted-foreground">Habitudes complétées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
                <p className="text-xs text-muted-foreground">Tâches terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Timer className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pomodoroStats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions Pomodoro</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pomodoroStats.totalHours}h</p>
                <p className="text-xs text-muted-foreground">Temps de focus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Activité des 30 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {heatmapData.map((data) => (
              <div
                key={data.day}
                className="w-4 h-4 rounded-sm"
                style={{
                  backgroundColor:
                    data.intensity === 0
                      ? 'var(--secondary)'
                      : `rgba(34, 197, 94, ${0.2 + data.intensity * 0.8})`,
                }}
                title={`${data.day}: ${data.habitCount} habitude${data.habitCount !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Moins</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                <div
                  key={intensity}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor:
                      intensity === 0
                        ? 'var(--secondary)'
                        : `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`,
                  }}
                />
              ))}
            </div>
            <span>Plus</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.length === 0 && tasks.length === 0 && sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            ) : (
              <>
                {habits.slice(0, 3).map((habit) => {
                  const today = new Date().toISOString().split('T')[0]
                  const completed = isCompleted(habit.id, today)
                  return (
                    <div key={habit.id} className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="flex-1 text-sm">{habit.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {completed ? 'Complété' : 'En attente'}
                      </span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
