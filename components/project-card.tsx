"use client"

import { Copy, Pencil, Trash2, Calendar } from "lucide-react"
import type { EventProject } from "@/lib/store"
import { EVENT_TYPES } from "@/lib/store"
import { EventIcon } from "./event-icon"
import { cn } from "@/lib/utils"

import { Button3D } from 'react-3d-button';
import 'react-3d-button/styles';

export function ProjectCard({
  project,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  project: EventProject
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}) {
  const typeInfo = EVENT_TYPES.find((t) => t.id === project.eventType)

  return (
    

    
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer"
      onClick={() => onEdit(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onEdit(project.id)
        }
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <EventIcon type={project.eventType} size="md" />
          <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {typeInfo?.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-base font-semibold text-foreground leading-tight text-balance">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{new Date(project.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(project.id)
            }}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Duplicate ${project.name}`}
          >
            <Copy className="size-3.5" />
            Duplicate
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project.id)
            }}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CreateNewCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl",
        "border-2 border-dashed border-primary/30 bg-primary/5",
        "transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10",
        "cursor-pointer"
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Pencil className="size-6" />
      </div>
      <span className="text-sm font-semibold text-primary">
        Create New Event
      </span>
    </button>
  )
}
