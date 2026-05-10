'use client'

import { useHabits, useHabitCompletions } from '@/hooks/use-habits'
import { useTasks } from '@/hooks/use-tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle2, Circle, Activity, CheckSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

function getWeekDays(startDate: Date) {
  const days = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay() + 1) // Start from Monday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dayNumber: date.getDate(),
      isToday: date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
    })
  }
  return days
}

export function PlanningTab() {
  const { habits } = useHabits()
  const { isCompleted } = useHabitCompletions()
  const { tasks } = useTasks()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedDate(newDate)
  }

  const pendingTasks = tasks.filter((t) => !t.completed)

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              &larr;
            </button>
            <h3 className="font-medium">
              {weekDays[0].date.split('-').reverse().slice(0, 2).join('/')} -{' '}
              {weekDays[6].date.split('-').reverse().slice(0, 2).join('/')}
            </h3>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              &rarr;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day.date}
                className={cn(
                  'text-center p-2 rounded-lg',
                  day.isToday ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                )}
              >
                <p className="text-xs capitalize">{day.dayName.slice(0, 3)}</p>
                <p className="text-lg font-bold">{day.dayNumber}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Habit Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5" />
            Habitudes de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-sm font-medium">{habit.name}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const completed = isCompleted(habit.id, day.date)
                      return (
                        <div
                          key={day.date}
                          className="flex items-center justify-center"
                        >
                          {completed ? (
                            <CheckCircle2
                              className="h-5 w-5"
                              style={{ color: habit.color }}
                            />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/30" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune habitude créée
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquare className="h-5 w-5" />
            Tâches à venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    )}
                  />
                  <span className="text-sm">{task.title}</span>
                </div>
              ))}
              {pendingTasks.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{pendingTasks.length - 5} autres tâches
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune tâche en attente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Week Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5" />
            Résumé de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-2xl font-bold">
                {habits.reduce((sum, habit) => {
                  return sum + weekDays.filter((day) => isCompleted(habit.id, day.date)).length
                }, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Habitudes complétées</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-2xl font-bold">
                {habits.length > 0
                  ? Math.round(
                      (habits.reduce((sum, habit) => {
                        return sum + weekDays.filter((day) => isCompleted(habit.id, day.date)).length
                      }, 0) /
                        (habits.length * 7)) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground">Taux de complétion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
