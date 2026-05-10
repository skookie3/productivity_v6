'use client'

import { TabType } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Activity,
  CheckSquare,
  Timer,
  History,
  Calendar,
} from 'lucide-react'

interface NavTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'habits', label: 'Habitudes', icon: Activity },
  { id: 'tasks', label: 'Tâches', icon: CheckSquare },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'history', label: 'Historique', icon: History },
  { id: 'planning', label: 'Planning', icon: Calendar },
]

export function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
