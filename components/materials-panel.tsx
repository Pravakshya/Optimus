"use client"

import { useState, type ElementType } from "react"
import {
  FileText,
  FileSpreadsheet,
  FilePresentation,
  Image as ImageIcon,
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

const TYPE_OPTIONS: {
  id: MaterialItem["type"]
  label: string
  icon: ElementType
}[] = [
  { id: "document", label: "Document", icon: FileText },
  { id: "presentation", label: "Presentation", icon: FilePresentation },
  { id: "spreadsheet", label: "Spreadsheet", icon: FileSpreadsheet },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "video", label: "Video", icon: Film },
  { id: "link", label: "Link", icon: Link2 },
]

const TYPE_COLORS: Record<MaterialItem["type"], string> = {
  document: "bg-blue-500/10 text-blue-600",
  presentation: "bg-orange-500/10 text-orange-600",
  spreadsheet: "bg-green-500/10 text-green-600",
  image: "bg-pink-500/10 text-pink-600",
  video: "bg-purple-500/10 text-purple-600",
  link: "bg-sky-500/10 text-sky-600",
}

export function MaterialsPanel({
  materials,
  onMaterialsChange,
}: {
  materials: MaterialItem[]
  onMaterialsChange: (materials: MaterialItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] =
    useState<MaterialItem["type"] | "all">("all")

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

  const filtered =
    filterType === "all"
      ? materials
      : materials.filter((m) => m.type === filterType)

  const addMaterial = () => {
    if (!newItem.name.trim()) return

    const item: MaterialItem = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
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
            <h3 className="text-lg font-bold">Materials</h3>
            <p className="text-xs text-muted-foreground">
              {materials.length} file
              {materials.length !== 1 ? "s" : ""} attached
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
            showForm
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
          )}
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? "Cancel" : "Add Material"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="flex flex-col gap-4 rounded-2xl border p-5 bg-muted/20">
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={newItem.name}
              onChange={(e) =>
                setNewItem((v) => ({ ...v, name: e.target.value }))
              }
              placeholder="Budget Spreadsheet Q4"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setNewItem((v) => ({ ...v, type: opt.id }))
                  }
                  className={cn(
                    "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs",
                    newItem.type === opt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  <opt.icon className="size-3" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">URL</label>
            <Input
              value={newItem.url}
              onChange={(e) =>
                setNewItem((v) => ({ ...v, url: e.target.value }))
              }
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">
              Notes (optional)
            </label>
            <Input
              value={newItem.notes}
              onChange={(e) =>
                setNewItem((v) => ({ ...v, notes: e.target.value }))
              }
              placeholder="Shared with team..."
            />
          </div>

          <button
            onClick={addMaterial}
            disabled={!newItem.name.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-40"
          >
            <Upload className="size-4" />
            Add Material
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={cn(
            "rounded-lg border px-3 py-1 text-xs",
            filterType === "all"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground"
          )}
        >
          All ({materials.length})
        </button>

        {TYPE_OPTIONS.map((opt) => {
          const count = materials.filter((m) => m.type === opt.id).length
          if (!count) return null

          return (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-3 py-1 text-xs",
                filterType === opt.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              <opt.icon className="size-3" />
              {opt.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border border-dashed rounded-2xl py-12">
          <FolderOpen className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {materials.length === 0
              ? "No materials added yet"
              : "No materials match this filter"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const Icon = getIcon(item.type)
            const colorClass = TYPE_COLORS[item.type]

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border p-4 bg-card"
              >
                <div className="flex justify-between">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      colorClass
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <button
                    onClick={() => removeMaterial(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {item.type}
                  </p>
                </div>

                {item.notes && (
                  <p className="text-xs text-muted-foreground">
                    {item.notes}
                  </p>
                )}

                {item.url && (
                  <a
                    href={
                      item.url.startsWith("http")
                        ? item.url
                        : `https://${item.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary"
                  >
                    <ExternalLink className="size-3" />
                    Open
                  </a>
                )}

                <span className="text-[10px] text-muted-foreground/50">
                  Added{" "}
                  {new Date(item.addedAt).toLocaleDateString()}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}