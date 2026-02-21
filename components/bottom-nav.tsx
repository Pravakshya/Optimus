"use client"

import { Home, Wallet, UserRoundSearch, LayoutPanelLeft, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export type DashboardTab = "home" | "budget" | "invites" | "room" | "materials"

const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Overview", icon: Home },
  { id: "budget", label: "Expenses", icon: Wallet },
  { id: "invites", label: "Guest List", icon: UserRoundSearch },
  { id: "materials", label: "Materials", icon: FolderOpen },
  { id: "room", label: "Floor Plan", icon: LayoutPanelLeft },
]

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}) {
  return (
    <nav
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-2xl border border-border/40 bg-card/80 px-1.5 py-1.5 shadow-xl shadow-foreground/5 backdrop-blur-xl"
      aria-label="Dashboard navigation"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <tab.icon className="size-4" />
            <span className={cn("hidden sm:inline", active && "sm:inline")}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
