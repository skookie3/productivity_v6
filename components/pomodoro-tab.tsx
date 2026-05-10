'use client'

import { usePomodoro } from '@/hooks/use-pomodoro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const TIMER_MODES = {
  work: { label: 'Travail', minutes: 25, icon: Brain, color: 'text-red-500' },
  shortBreak: { label: 'Pause courte', minutes: 5, icon: Coffee, color: 'text-green-500' },
  longBreak: { label: 'Pause longue', minutes: 15, icon: Coffee, color: 'text-blue-500' },
}

export function PomodoroTab() {
  const { addSession, getTotalMinutesToday, isLoading } = usePomodoro()
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work.minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsToday, setSessionsToday] = useState(0)

  const currentMode = TIMER_MODES[mode]
  const totalMinutes = currentMode.minutes * 60
  const progress = ((totalMinutes - timeLeft) / totalMinutes) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleComplete = useCallback(async () => {
    if (mode === 'work') {
      await addSession(currentMode.minutes)
      setSessionsToday((prev) => prev + 1)
    }
    setIsRunning(false)
    
    // Auto switch to break
    if (mode === 'work') {
      const newMode = sessionsToday > 0 && (sessionsToday + 1) % 4 === 0 ? 'longBreak' : 'shortBreak'
      setMode(newMode)
      setTimeLeft(TIMER_MODES[newMode].minutes * 60)
    } else {
      setMode('work')
      setTimeLeft(TIMER_MODES.work.minutes * 60)
    }
  }, [mode, currentMode.minutes, addSession, sessionsToday])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, handleComplete])

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(TIMER_MODES[newMode].minutes * 60)
    setIsRunning(false)
  }

  const handleReset = () => {
    setTimeLeft(currentMode.minutes * 60)
    setIsRunning(false)
  }

  const totalMinutesToday = getTotalMinutesToday()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex gap-2 justify-center">
        {(Object.keys(TIMER_MODES) as TimerMode[]).map((m) => {
          const modeData = TIMER_MODES[m]
          return (
            <Button
              key={m}
              variant={mode === m ? 'default' : 'secondary'}
              onClick={() => handleModeChange(m)}
              className="flex-1 max-w-32"
            >
              {modeData.label}
            </Button>
          )
        })}
      </div>

      {/* Timer Display */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-secondary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={cn(
                    'transition-all duration-1000',
                    mode === 'work' ? 'text-red-500' : 'text-green-500'
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <currentMode.icon className={cn('h-8 w-8 mb-2', currentMode.color)} />
                <span className="text-5xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {currentMode.label}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  'w-32',
                  isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                )}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{sessionsToday}</p>
            <p className="text-sm text-muted-foreground">Sessions aujourd&apos;hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalMinutesToday}</p>
            <p className="text-sm text-muted-foreground">Minutes de focus</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
