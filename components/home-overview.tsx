"use client"

import { Calendar, Users, DollarSign, MapPin, LayoutPanelLeft } from "lucide-react"
import type { EventProject } from "@/lib/store"
import { EVENT_TYPES, COST_CATEGORY_LABELS } from "@/lib/store"
import { EventIcon } from "./event-icon"
import type { DashboardTab } from "./bottom-nav"

export function HomeOverview({
  project,
  onNavigate,
}: {
  project: EventProject
  onNavigate: (tab: DashboardTab) => void
}) {
  const typeInfo = EVENT_TYPES.find((t) => t.id === project.eventType)
  const enabledCats = Object.entries(project.costCategories).filter(([, v]) => v.enabled)
  const allocated = enabledCats.reduce((sum, [, v]) => sum + v.budget, 0)
  const todosDone = project.todos.filter((t) => t.completed).length

  return (
    <div className="flex flex-col gap-6">
      {/* Hero card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/70 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <EventIcon type={project.eventType} size="lg" />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-foreground text-balance">{project.name}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(project.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>{typeInfo?.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <button
          className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-scale-[-1.02]"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Capacity</span>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground">{project.capacity}</div>
          <span className="text-xs text-muted-foreground">
            Range: {project.guestRange[0]}-{project.guestRange[1]} guests
          </span>
        </button>

        <button
          className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-scale-[-1.02]"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="size-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Budget</span>
          </div>
          <div className="text-3xl font-bold font-msono text-foreground">
            ${project.totalBudget.toLocaleString()}
          </div>
          <span className="text-xs text-muted-foreground">
            ${allocated.toLocaleString()} allocated
          </span>
        </button>

        <button
          className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-scale-[-1.02]"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <LayoutPanelLeft className="size-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Room</span>
          </div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {project.roomItems.length}
          </div>
          <span className="text-xs text-muted-foreground">
            {project.venueDimensions.width}ft x {project.venueDimensions.length}ft
          </span>
        </button>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-scale-[-1.02]">
          <div className="flex items-center gap-2 ">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="size-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Venue</span>
          </div>
          <div className="text-3xl font-semibold text-foreground leading-snug">
            {project.venueAddress || "Not set"}
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {project.venueType}
          </span>
        </div>
      </div>

      {/* Budget categories at a glance */}
      {enabledCats.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">Budget Allocation</h3>
          <div className="flex flex-col gap-2">
            {enabledCats.map(([key, cat]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 truncate text-xs text-muted-foreground">
                  {COST_CATEGORY_LABELS[key]}
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${project.totalBudget > 0 ? (cat.budget / project.totalBudget) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-16 text-right">
                  ${cat.budget.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress overview */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Task Progress</h3>
          <span className="text-xs font-mono text-muted-foreground">{todosDone}/{project.todos.length}</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${project.todos.length > 0 ? (todosDone / project.todos.length) * 100 : 0}%` }}
          />
        </div>
        {project.todos.length === 0 && (
          <p className="text-xs text-muted-foreground">No tasks yet. Add some in the to-do list.</p>
        )}
      </div>
    </div>
  )
}
