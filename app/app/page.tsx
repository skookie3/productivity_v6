"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { NavTabs } from "@/components/nav-tabs"
import { HabitsTab } from "@/components/habits-tab"
import { TasksTab } from "@/components/tasks-tab"
import { PomodoroTab } from "@/components/pomodoro-tab"
import { HistoryTab } from "@/components/history-tab"
import { PlanningTab } from "@/components/planning-tab"
import { useSettings } from "@/hooks/use-settings"
import { LogOut, Moon, Sun, Cloud, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

type Tab = "habits" | "tasks" | "pomodoro" | "history" | "planning"

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<Tab>("habits")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { settings, updateTheme, isLoading: settingsLoading } = useSettings()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    if (settings?.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings?.theme])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const toggleTheme = () => {
    const newTheme = settings?.theme === "dark" ? "light" : "dark"
    updateTheme(newTheme)
  }

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Focus</h1>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Synced
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {settings?.theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === "habits" && <HabitsTab />}
          {activeTab === "tasks" && <TasksTab />}
          {activeTab === "pomodoro" && <PomodoroTab />}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "planning" && <PlanningTab />}
        </div>
      </main>
    </div>
  )
}
