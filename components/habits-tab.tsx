'use client'

import { useHabits, useHabitCompletions } from '@/hooks/use-habits'
import { useSettings } from '@/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Check, Flame, Activity, Heart, Brain, Dumbbell, Book, Coffee, Moon, Sun, Droplets } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'

const ICONS = [
  { id: 'activity', icon: Activity, label: 'Activité' },
  { id: 'heart', icon: Heart, label: 'Santé' },
  { id: 'brain', icon: Brain, label: 'Mental' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Sport' },
  { id: 'book', icon: Book, label: 'Lecture' },
  { id: 'coffee', icon: Coffee, label: 'Café' },
  { id: 'moon', icon: Moon, label: 'Sommeil' },
  { id: 'sun', icon: Sun, label: 'Matin' },
  { id: 'droplets', icon: Droplets, label: 'Eau' },
]

const COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#ef4444', // red
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
]

function getIconComponent(iconId: string) {
  const iconData = ICONS.find((i) => i.id === iconId)
  return iconData?.icon || Activity
}

function getWeekDays() {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    days.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 2),
      isToday: i === 0,
    })
  }
  return days
}

export function HabitsTab() {
  const { habits, addHabit, deleteHabit, isLoading } = useHabits()
  const { completions, toggleCompletion, isCompleted } = useHabitCompletions()
  const { updateBestStreak } = useSettings()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: 'activity',
    color: '#3b82f6',
    weekly_goal: 7,
  })

  const weekDays = useMemo(() => getWeekDays(), [])
  const today = weekDays[weekDays.length - 1].date

  // Calculate streak
  const currentStreak = useMemo(() => {
    if (habits.length === 0) return 0
    let streak = 0
    const checkDate = new Date()
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const allCompleted = habits.every((h) => isCompleted(h.id, dateStr))
      if (!allCompleted) break
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }
    return streak
  }, [habits, completions, isCompleted])

  useEffect(() => {
    if (currentStreak > 0) {
      updateBestStreak(currentStreak)
    }
  }, [currentStreak, updateBestStreak])

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return
    await addHabit(newHabit)
    setNewHabit({ name: '', icon: 'activity', color: '#3b82f6', weekly_goal: 7 })
    setIsDialogOpen(false)
  }

  const getCompletionCount = (habitId: string) => {
    return weekDays.filter((day) => isCompleted(habitId, day.date)).length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Flame className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Série actuelle</p>
              <p className="text-3xl font-bold">{currentStreak} jour{currentStreak !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const IconComponent = getIconComponent(habit.icon)
          const completionCount = getCompletionCount(habit.id)
          
          return (
            <Card key={habit.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: habit.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{habit.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {completionCount}/{habit.weekly_goal}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {weekDays.map((day) => {
                        const completed = isCompleted(habit.id, day.date)
                        return (
                          <button
                            key={day.date}
                            onClick={() => toggleCompletion(habit.id, day.date)}
                            className={cn(
                              'flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all',
                              completed
                                ? 'text-white'
                                : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                              day.isToday && !completed && 'ring-2 ring-primary ring-offset-2'
                            )}
                            style={completed ? { backgroundColor: habit.color } : {}}
                          >
                            {completed ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              day.label
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {habits.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune habitude</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez votre première habitude pour commencer
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une habitude
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle habitude</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={newHabit.name}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, name: e.target.value })
                }
                placeholder="Ex: Méditation"
              />
            </div>
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((icon) => {
                  const Icon = icon.icon
                  return (
                    <button
                      key={icon.id}
                      onClick={() =>
                        setNewHabit({ ...newHabit, icon: icon.id })
                      }
                      className={cn(
                        'p-2 rounded-lg border transition-colors',
                        newHabit.icon === icon.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-transform',
                      newHabit.color === color && 'ring-2 ring-offset-2 ring-primary scale-110'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Objectif hebdomadaire</Label>
              <Select
                value={String(newHabit.weekly_goal)}
                onValueChange={(v) =>
                  setNewHabit({ ...newHabit, weekly_goal: parseInt(v) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} jour{n > 1 ? 's' : ''} par semaine
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddHabit} className="w-full">
              Créer l&apos;habitude
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
