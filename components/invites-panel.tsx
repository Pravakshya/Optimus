"use client"

import { Users, Minus, Plus, UserPlus, Mail, UserCheck } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function InvitesPanel({
  capacity,
  guestRange,
  onCapacityChange,
  onGuestRangeChange,
}: {
  capacity: number
  guestRange: [number, number]
  onCapacityChange: (val: number) => void
  onGuestRangeChange: (val: [number, number]) => void
}) {
  const [invites, setInvites] = useState<{ name: string; email: string; status: "pending" | "confirmed" | "declined" }[]>([])
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  const confirmed = invites.filter((i) => i.status === "confirmed").length
  const pending = invites.filter((i) => i.status === "pending").length
  const fillPct = capacity > 0 ? Math.min(100, ((confirmed + pending) / capacity) * 100) : 0

  const addInvite = () => {
    if (!newName.trim()) return
    setInvites((prev) => [
      ...prev,
      { name: newName.trim(), email: newEmail.trim(), status: "pending" },
    ])
    setNewName("")
    setNewEmail("")
  }

  const toggleStatus = (idx: number) => {
    setInvites((prev) =>
      prev.map((inv, i) => {
        if (i !== idx) return inv
        const next = inv.status === "pending" ? "confirmed" : inv.status === "confirmed" ? "declined" : "pending"
        return { ...inv, status: next }
      })
    )
  }

  const removeInvite = (idx: number) => {
    setInvites((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Capacity Section */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Venue Capacity</h4>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{capacity}</div>
        </div>

        {/* Fill bar */}
        <div className="flex flex-col gap-2">
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/80 transition-all duration-500"
              style={{ width: `${fillPct}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium text-foreground">
              {confirmed + pending} / {capacity}
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{confirmed} confirmed</span>
            <span>{pending} pending</span>
            <span>{capacity - confirmed - pending} remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCapacityChange(Math.max(10, capacity - 10))}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
            aria-label="Decrease capacity"
          >
            <Minus className="size-3.5" />
          </button>
          <Slider
            value={[capacity]}
            onValueChange={([v]) => onCapacityChange(v)}
            min={10}
            max={1000}
            step={10}
            className="flex-1"
          />
          <button
            onClick={() => onCapacityChange(Math.min(1000, capacity + 10))}
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
            aria-label="Increase capacity"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Guest Range: <span className="font-mono text-primary">{guestRange[0]} - {guestRange[1]}</span>
          </span>
          <Slider
            value={guestRange}
            onValueChange={(v) => onGuestRangeChange(v as [number, number])}
            min={10}
            max={1000}
            step={10}
          />
        </div>
      </div>

      {/* Guest List */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="size-4 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Guest List</h4>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {invites.length} invited
          </span>
        </div>

        {/* Add invite form */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addInvite() }}
              placeholder="Guest name"
              className="h-9 flex-1 rounded-lg border-border/50 bg-background/50 text-sm"
            />
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addInvite() }}
              placeholder="Email"
              className="h-9 flex-1 rounded-lg border-border/50 bg-background/50 text-sm"
            />
          </div>
          <button
            onClick={addInvite}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
          >
            <UserPlus className="size-3.5" />
            Add Guest
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
          {invites.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No guests added yet. Start building your guest list above.
            </p>
          ) : (
            invites.map((inv, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3 rounded-xl border border-border/30 bg-background/30 p-3 transition-colors hover:border-primary/20"
              >
                <button
                  onClick={() => toggleStatus(idx)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors"
                  aria-label={`Toggle ${inv.name} status`}
                  title={`Status: ${inv.status}. Click to change.`}
                >
                  {inv.status === "confirmed" ? (
                    <UserCheck className="size-4 text-primary" />
                  ) : inv.status === "declined" ? (
                    <Users className="size-4 text-destructive" />
                  ) : (
                    <Mail className="size-4 text-muted-foreground" />
                  )}
                </button>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground truncate">{inv.name}</span>
                  {inv.email && (
                    <span className="text-[10px] text-muted-foreground truncate">{inv.email}</span>
                  )}
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                  inv.status === "confirmed"
                    ? "bg-primary/10 text-primary"
                    : inv.status === "declined"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary text-muted-foreground"
                }`}>
                  {inv.status}
                </span>
                {inv.status === "pending" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setInvites((prev) =>
                          prev.map((inv2, i) => 
                            i === idx ? { ...inv2, status: "confirmed" } : inv2
                          )
                        )
                      }}
                      className="text-[10px] px-2 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-all"
                      aria-label={`Accept ${inv.name}`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setInvites((prev) =>
                          prev.map((inv2, i) => 
                            i === idx ? { ...inv2, status: "declined" } : inv2
                          )
                        )
                      }}
                      className="text-[10px] px-2 py-1 rounded-md bg-destructive text-primary-foreground hover:opacity-90 transition-all"
                      aria-label={`Decline ${inv.name}`}
                    >
                      Decline
                    </button>
                  </div>
                )}
                <button
                  onClick={() => removeInvite(idx)}
                  className="opacity-0 group-hover:opacity-100 text-destructive transition-all"
                  aria-label={`Remove ${inv.name}`}
                >
                  <Users className="size-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
