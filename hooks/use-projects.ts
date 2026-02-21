"use client"

import useSWR from "swr"
import type { EventProject } from "@/lib/store"

const PROJECTS_KEY = "eventide-projects"

function getProjects(): EventProject[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.sessionStorage.getItem(PROJECTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveProjects(projects: EventProject[]) {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function useProjects() {
  const { data, mutate } = useSWR<EventProject[]>(PROJECTS_KEY, getProjects, {
    fallbackData: [],
    revalidateOnFocus: false,
  })

  const projects = data ?? []

  const addProject = (project: EventProject) => {
    const updated = [...projects, project]
    saveProjects(updated)
    mutate(updated)
  }

  const updateProject = (id: string, updates: Partial<EventProject>) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    )
    saveProjects(updated)
    mutate(updated)
  }

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id)
    saveProjects(updated)
    mutate(updated)
  }

  const duplicateProject = (id: string) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return
    const duplicate: EventProject = {
      ...JSON.parse(JSON.stringify(project)),
      id: crypto.randomUUID(),
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(),
    }
    const updated = [...projects, duplicate]
    saveProjects(updated)
    mutate(updated)
  }

  const getProject = (id: string) => projects.find((p) => p.id === id)

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    getProject,
  }
}
