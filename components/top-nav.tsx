"use client"

import { Sparkles, LayoutGrid, FolderOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Optimus
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {[
            { id: "templates", label: "Templates", icon: LayoutGrid },
            { id: "projects", label: "My Projects", icon: FolderOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
          <User className="size-4" />
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </header>
  )
}
