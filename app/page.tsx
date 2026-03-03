"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { EventDashboard } from "@/components/event-dashboard"
import AuthGate from "@/components/auth-gate"

export default function Home() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  if (activeProjectId) {
    return (
      <EventDashboard
        projectId={activeProjectId}
        onBack={() => setActiveProjectId(null)}
      />
    )
  }

  return <AuthGate><Dashboard onOpenProject={setActiveProjectId} /></AuthGate>
}
