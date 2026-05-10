'use client'

import { useTasks } from '@/hooks/use-tasks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, CheckSquare, AlertTriangle, Circle, ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const PRIORITIES = [
  { id: 'low', label: 'Basse', color: 'text-green-500', icon: Circle },
  { id: 'medium', label: 'Moyenne', color: 'text-yellow-500', icon: AlertTriangle },
  { id: 'high', label: 'Haute', color: 'text-red-500', icon: ArrowUp },
] as const

export function TasksTab() {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted, isLoading } = useTasks()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return
    await addTask({ title: newTaskTitle, priority: newTaskPriority })
    setNewTaskTitle('')
    setNewTaskPriority('medium')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const pendingTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  const getPriorityData = (priority: string) => {
    return PRIORITIES.find((p) => p.id === priority) || PRIORITIES[1]
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
      {/* Add Task Form */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nouvelle tâche..."
              className="flex-1"
            />
            <Select
              value={newTaskPriority}
              onValueChange={(v) => setNewTaskPriority(v as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <p.icon className={cn('h-3 w-3', p.color)} />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground">
          À faire ({pendingTasks.length})
        </h3>
        {pendingTasks.length > 0 ? (
          <div className="space-y-2">
            {pendingTasks.map((task) => {
              const priorityData = getPriorityData(task.priority)
              const PriorityIcon = priorityData.icon
              return (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) =>
                          toggleTask(task.id, checked as boolean)
                        }
                      />
                      <PriorityIcon
                        className={cn('h-4 w-4', priorityData.color)}
                      />
                      <span className="flex-1">{task.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune tâche à faire</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">
              Terminées ({completedTasks.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </div>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) =>
                        toggleTask(task.id, checked as boolean)
                      }
                    />
                    <span className="flex-1 line-through text-muted-foreground">
                      {task.title}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
