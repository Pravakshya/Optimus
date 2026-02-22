"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EventIcon } from "./event-icon"
import {
  EVENT_TYPES,
  COST_CATEGORY_LABELS,
  DEFAULT_COST_CATEGORIES,
  createDefaultProject,
  type EventProject,
  type EventType,
  type CostCategory,
} from "@/lib/store"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

const STEPS = [
  "Basic Info",
  "Event Type",
  "Budget",
  "Venue",
]

export function QuestionnaireModal({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (project: EventProject) => void
}) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState(100)
  const [guestRange, setGuestRange] = useState<[number, number]>([50, 150])
  const [eventType, setEventType] = useState<EventType>("corporate")
  const [totalBudget, setTotalBudget] = useState(10000)
  const [venueAddress, setVenueAddress] = useState("")
  const [venueType, setVenueType] = useState("indoor")
  const [dimensions, setDimensions] = useState({ length: 100, width: 65, height: 16 })
  const [costCategories, setCostCategories] = useState<Record<string, CostCategory>>(
    JSON.parse(JSON.stringify(DEFAULT_COST_CATEGORIES))
  )
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const resetForm = useCallback(() => {
    setStep(0)
    setName("")
    setCapacity(100)
    setGuestRange([50, 100])
    setEventType("corporate")
    setTotalBudget(10000)
    setVenueAddress("")
    setVenueType("indoor")
    setDimensions({ length: 100, width: 65, height: 16 })
    setCostCategories(JSON.parse(JSON.stringify(DEFAULT_COST_CATEGORIES)))
    setDate(new Date().toISOString().split("T")[0])
  }, [])

  const handleComplete = () => {
    const project = createDefaultProject({
      name: name || "Untitled Event",
      eventType,
      capacity,
      guestRange,
      totalBudget,
      venueAddress,
      venueType,
      venueDimensions: dimensions,
      costCategories,
      date,
    })
    onComplete(project)
    resetForm()
    onOpenChange(false)
  }

  const toggleCategory = (key: string) => {
    setCostCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }))
  }

  const updateCategoryBudget = (key: string, budget: number) => {
    setCostCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], budget },
    }))
  }

  const updateCategoryVendor = (key: string, vendor: string) => {
    setCostCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], vendor },
    }))
  }

  const updateCategoryNotes = (key: string, notes: string) => {
    setCostCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], notes },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent
        className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-card/95 backdrop-blur-xl border-border/50"
        showCloseButton
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground">
            Create New Event
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </DialogDescription>
          {/* Single step indicator - dots only, no separate Progress bar */}
          <div className="flex gap-1.5 pt-3">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all duration-300",
                  i < step
                    ? "bg-primary"
                    : i === step
                      ? "bg-primary shadow-sm shadow-primary/30"
                      : "bg-muted"
                )}
                aria-label={`Go to step ${i + 1}: ${s}`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          <div className="py-4">
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="event-name" className="text-sm font-medium">Event Name</Label>
                  <Input
                    id="event-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Amazing Event"
                    className="h-11 rounded-xl border-border/50 bg-background/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="event-date" className="text-sm font-medium">Event Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 rounded-xl border-border/50 bg-background/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Capacity: <span className="font-mono text-primary">{capacity}</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCapacity(Math.max(10, capacity - 1))}
                      className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                      aria-label="Decrease capacity"
                    >
                      -
                    </button>
                    <Slider
                      value={[capacity]}
                      onValueChange={([v]) => setCapacity(v)}
                      min={10}
                      max={5000}
                      step={10}
                      className="flex-1"
                    />
                    <button
                      onClick={() => setCapacity(Math.min(5000, capacity + 1))}
                      className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                      aria-label="Increase capacity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Guest Range: <span className="font-mono text-primary">{guestRange[0]} - {guestRange[1]}</span>
                  </Label>
                  <Slider
                    value={guestRange}
                    onValueChange={(v) => setGuestRange(v as [number, number])}
                    min={10}
                    max={5000}
                    step={10}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-3 gap-3">
                {EVENT_TYPES.map((et) => (
                  <button
                    key={et.id}
                    onClick={() => setEventType(et.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200",
                      eventType === et.id
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20"
                        : "border-border/50 bg-background/50 hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    <EventIcon type={et.id} size="md" />
                    <span className="text-xs font-medium text-foreground">{et.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="total-budget" className="text-sm font-medium">Total Budget</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      id="total-budget"
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="h-11 rounded-xl border-border/50 bg-background/50 pl-7"
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/30 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Budget Preview</h4>
                  <div className="text-3xl font-bold text-primary font-mono">
                    ${totalBudget.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can allocate this across categories in the next steps.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="venue-address" className="text-sm font-medium">Venue Address</Label>
                  <Input
                    id="venue-address"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="123 Event Street, City"
                    className="h-11 rounded-xl border-border/50 bg-background/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Venue Type</Label>
                  <Select value={venueType} onValueChange={setVenueType}>
                    <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(["length", "width", "height"] as const).map((dim) => (
                    <div key={dim} className="flex flex-col gap-2">
                      <Label className="text-xs font-medium capitalize">{dim} (ft)</Label>
                      <Input
                        type="number"
                        value={dimensions[dim]}
                        onChange={(e) =>
                          setDimensions((d) => ({ ...d, [dim]: Number(e.target.value) }))
                        }
                        className="h-10 rounded-xl border-border/50 bg-background/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-4 flex-shrink-0">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              <Sparkles className="size-4" />
              Generate Event Dashboard
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
