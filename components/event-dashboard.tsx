"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { EventIcon } from "./event-icon"
import { BottomNav, type DashboardTab } from "./bottom-nav"
import { HomeOverview } from "./home-overview"
import { BudgetTab } from "./budget-tab"
import { InvitesPanel } from "./invites-panel"
import {MaterialsPanel} from "./materials-panel"
import { RoomBuilder } from "./room-builder"
import { TodoPanel } from "./todo-panel"
import { AiAssistant } from "./ai-assistant"
import { EVENT_TYPES, type RoomItem, type Vendor, type TodoItem } from "@/lib/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function EventDashboard({
  projectId,
  onBack,
}: {
  projectId: string
  onBack: () => void
}) {
  const { getProject, updateProject } = useProjects()
  const project = getProject(projectId)
  const [activeTab, setActiveTab] = useState<DashboardTab>("home")
  const [todoOpen, setTodoOpen] = useState(true)

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  const typeInfo = EVENT_TYPES.find((t) => t.id === project.eventType)

  const handleCapacityChange = (capacity: number) => {
    updateProject(projectId, { capacity })
  }

  const handleGuestRangeChange = (guestRange: [number, number]) => {
    updateProject(projectId, { guestRange })
  }

  const handleRoomItemsChange = (roomItems: RoomItem[]) => {
    updateProject(projectId, { roomItems })
  }

  const handleVendorsChange = (vendors: Vendor[]) => {
    updateProject(projectId, { vendors })
  }

  const handleTodosChange = (todos: TodoItem[]) => {
    updateProject(projectId, { todos })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-6">
          <button
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            aria-label="Go back to projects"
          >
            <ArrowLeft className="size-4" />
          </button>
          <EventIcon type={project.eventType} size="sm" />
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-bold text-foreground leading-tight truncate">
              {project.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{typeInfo?.label}</span>
              <span className="text-xs text-muted-foreground/50">|</span>
              <span className="text-xs text-muted-foreground">
                {new Date(project.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setTodoOpen(!todoOpen)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                todoOpen
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-label={todoOpen ? "Close to-do panel" : "Open to-do panel"}
            >
              {todoOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
              <span className="hidden sm:inline">To-Do</span>
              {project.todos.length > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {project.todos.filter((t) => !t.completed).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content with optional todo sidebar */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 pb-20">
        {/* Tab content */}
        <main className={cn(
          "flex-1 min-w-0 transition-all duration-300",
          todoOpen ? "lg:pr-0" : ""
        )}>
          <ScrollArea className="h-[calc(100vh-3.5rem-5rem)]">
            <div className="p-6">
              {activeTab === "home" && (
                <HomeOverview project={project} onNavigate={setActiveTab} />
              )}
              {activeTab === "budget" && (
                <BudgetTab
                  costCategories={project.costCategories}
                  totalBudget={project.totalBudget}
                  vendors={project.vendors}
                  onVendorsChange={handleVendorsChange}
                />
              )}
              {activeTab === "invites" && (
                <InvitesPanel
                  capacity={project.capacity}
                  guestRange={project.guestRange}
                  onCapacityChange={handleCapacityChange}
                  onGuestRangeChange={handleGuestRangeChange}
                />
              )}
              {activeTab === "materials" && (
                <MaterialsPanel />
              )}
              {activeTab === "room" && (
                <RoomBuilder
                  items={project.roomItems}
                  onItemsChange={handleRoomItemsChange}
                  roomWidth={project.venueDimensions.width}
                  roomLength={project.venueDimensions.length}
                />
              )}
            </div>
          </ScrollArea>
        </main>

        {/* To-Do Sidebar */}
        <aside
          className={cn(
            "shrink-0 border-l border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 overflow-hidden hidden lg:block",
            todoOpen ? "w-[25%] min-w-[300px] max-w-[400px]" : "w-0 border-l-0"
          )}
        >
          {todoOpen && (
            <ScrollArea className="h-[calc(100vh-3.5rem-5rem)]">
              <div className="p-5">
                <TodoPanel
                  todos={project.todos}
                  onTodosChange={handleTodosChange}
                />
              </div>
            </ScrollArea>
          )}
        </aside>
      </div>

      {/* Floating bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* AI Assistant */}
      <AiAssistant eventType={project.eventType} eventName={project.name} />
    </div>
  )
}
