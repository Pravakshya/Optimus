"use client"

import { useState } from "react"
import { Plus, Trash2, ExternalLink, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MaterialItem {
  id: string
  name: string
  url: string
  addedAt: string
}

export function MaterialsPanel() {
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [showForm, setShowForm] = useState(false)

  const addMaterial = () => {
    if (!name.trim()) return

    const newItem: MaterialItem = {
      id: crypto.randomUUID(),
      name,
      url,
      addedAt: new Date().toISOString(),
    }

    setMaterials((prev) => [...prev, newItem])
    setName("")
    setUrl("")
    setShowForm(false)
  }

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="size-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Materials</h2>
            <p className="text-sm text-muted-foreground">
              {materials.length} item{materials.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="size-4" />
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="flex flex-col gap-3 rounded-xl border p-4">
          <Input
            placeholder="Material name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addMaterial}
            disabled={!name.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-40"
          >
            Save
          </button>
        </div>
      )}

      {/* Empty State */}
      {materials.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
          No materials added yet
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border p-4"
            >
              <div className="flex justify-between">
                <p className="font-semibold truncate">{item.name}</p>
                <button onClick={() => removeMaterial(item.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </button>
              </div>

              {item.url && (
                <a
                  href={
                    item.url.startsWith("http")
                      ? item.url
                      : `https://${item.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary"
                >
                  <ExternalLink className="size-3" />
                  Open
                </a>
              )}

              <span className="text-xs text-muted-foreground">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}