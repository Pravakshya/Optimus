"use client"

import { useState } from "react"
import {
  FileText,
  Presentation,
  Sheet,
  Image,
  Film,
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  FolderOpen,
  Upload,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface MaterialItem {
  id: string
  name: string
  type: "document" | "presentation" | "spreadsheet" | "image" | "video" | "link"
  url: string
  notes: string
  addedAt: string
}

const TYPE_OPTIONS: { id: MaterialItem["type"]; label: string; icon: React.ElementType }[] = [
  { id: "document", label: "Document", icon: FileText },
  { id: "presentation", label: "Presentation", icon: Presentation },
  { id: "spreadsheet", label: "Spreadsheet", icon: Sheet },
  { id: "image", label: "Image", icon: Image },
  { id: "video", label: "Video", icon: Film },
  { id: "link", label: "Link", icon: Link2 },
]

const TYPE_COLORS: Record<string, string> = {
  document: "bg-[oklch(0.62_0.14_275)]/10 text-[oklch(0.62_0.14_275)]",
  presentation: "bg-[oklch(0.65_0.16_30)]/10 text-[oklch(0.65_0.16_30)]",
  spreadsheet: "bg-[oklch(0.65_0.15_155)]/10 text-[oklch(0.65_0.15_155)]",
  image: "bg-[oklch(0.70_0.15_340)]/10 text-[oklch(0.70_0.15_340)]",
  video: "bg-[oklch(0.60_0.14_275)]/10 text-[oklch(0.60_0.14_275)]",
  link: "bg-[oklch(0.58_0.12_250)]/10 text-[oklch(0.58_0.12_250)]",
}

export function MaterialsPanel({
  materials,
  onMaterialsChange,
}: {
  materials: MaterialItem[]
  onMaterialsChange: (materials: MaterialItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<MaterialItem["type"] | "all">("all")
  const [newItem, setNewItem] = useState<{
    name: string
    type: MaterialItem["type"]
    url: string
    notes: string
  }>({
    name: "",
    type: "document",
    url: "",
    notes: "",
  })

  const filtered = filterType === "all" ? materials : materials.filter((m) => m.type === filterType)

  const addMaterial = () => {
    if (!newItem.name.trim()) return
    const item: MaterialItem = {
      id: crypto.randomUUID(),
      ...newItem,
      addedAt: new Date().toISOString(),
    }
    onMaterialsChange([...materials, item])
    setNewItem({ name: "", type: "document", url: "", notes: "" })
    setShowForm(false)
  }

  const removeMaterial = (id: string) => {
    onMaterialsChange(materials.filter((m) => m.id !== id))
  }

  const getIcon = (type: MaterialItem["type"]) => {
    return TYPE_OPTIONS.find((t) => t.id === type)?.icon ?? FileText
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <FolderOpen className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Materials</h3>
            <p className="text-xs text-muted-foreground">{materials.length} file{materials.length !== 1 ? "s" : ""} attached</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
            showForm
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25"
          )}
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "Add Material"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Name</label>
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem((v) => ({ ...v, name: e.target.value }))}
              placeholder="Budget Spreadsheet Q4"
              className="h-10 rounded-xl border-border/50 bg-background/80 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setNewItem((v) => ({ ...v, type: opt.id }))}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                    newItem.type === opt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <opt.icon className="size-3" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">URL / Link</label>
            <Input
              value={newItem.url}
              onChange={(e) => setNewItem((v) => ({ ...v, url: e.target.value }))}
              placeholder="https://docs.google.com/..."
              className="h-10 rounded-xl border-border/50 bg-background/80 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
            <Input
              value={newItem.notes}
              onChange={(e) => setNewItem((v) => ({ ...v, notes: e.target.value }))}
              placeholder="Shared with catering team..."
              className="h-10 rounded-xl border-border/50 bg-background/80 text-sm"
            />
          </div>

          <button
            onClick={addMaterial}
            disabled={!newItem.name.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-40"
          >
            <Upload className="size-4" />
            Add Material
          </button>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterType("all")}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
            filterType === "all"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-background/50 text-muted-foreground hover:border-border"
          )}
        >
          All ({materials.length})
        </button>
        {TYPE_OPTIONS.map((opt) => {
          const count = materials.filter((m) => m.type === opt.id).length
          if (count === 0) return null
          return (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                filterType === opt.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 bg-background/50 text-muted-foreground hover:border-border"
              )}
            >
              <opt.icon className="size-3" />
              {opt.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Materials grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/50 bg-card/30 py-12">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <FolderOpen className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {materials.length === 0 ? "No materials added yet" : "No materials match this filter"}
          </p>
          {materials.length === 0 && (
            <p className="text-xs text-muted-foreground/60">
              Add presentations, documents, and links to keep everything organized.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = getIcon(item.type)
            const colorClass = TYPE_COLORS[item.type] ?? TYPE_COLORS.document
            return (
              <div
                key={item.id}
                className="group flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/70 p-4 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", colorClass)}>
                    <Icon className="size-5" />
                  </div>
                  <button
                    onClick={() => removeMaterial(item.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 flex size-7 items-center justify-center rounded-lg text-destructive transition-all hover:bg-destructive/10"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {TYPE_OPTIONS.find((t) => t.id === item.type)?.label}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.notes}</p>
                )}
                {item.url && (
                  <a
                    href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    Open
                  </a>
                )}
                <span className="text-[10px] text-muted-foreground/50">
                  Added {new Date(item.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
