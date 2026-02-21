"use client"

import { useState } from "react"
import { ProjectCard, CreateNewCard } from "./project-card"
import { QuestionnaireModal } from "./questionnaire-modal"
import { TopNav } from "./top-nav"
import { useProjects } from "@/hooks/use-projects"
import type { EventProject } from "@/lib/store"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Dashboard({
  onOpenProject,
}: {
  onOpenProject: (id: string) => void
}) {
  const { projects, addProject, duplicateProject, deleteProject } = useProjects()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")
  const [search, setSearch] = useState("")

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleComplete = (project: EventProject) => {
    addProject(project)
    onOpenProject(project.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
              <p className="text-sm text-muted-foreground">
                {projects.length} event{projects.length !== 1 ? "s" : ""} in your workspace
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="h-10 rounded-xl border-border/50 bg-card/70 pl-10 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <CreateNewCard onClick={() => setModalOpen(true)} />
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={onOpenProject}
                onDuplicate={duplicateProject}
                onDelete={deleteProject}
              />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10">
                <Search className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">No events yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first event to get started with planning.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <QuestionnaireModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={handleComplete}
      />
    </div>
  )
}
