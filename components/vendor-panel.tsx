"use client"

import { useState } from "react"
import { ExternalLink, Plus, Trash2, DollarSign, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Vendor } from "@/lib/store"

export function VendorPanel({
  vendors,
  onVendorsChange,
  totalBudget,
}: {
  vendors: Vendor[]
  onVendorsChange: (vendors: Vendor[]) => void
  totalBudget: number
}) {
  const [showForm, setShowForm] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: "",
    website: "",
    cost: 0,
    category: "",
  })

  const totalCost = vendors.reduce((sum, v) => sum + v.cost, 0)
  const remaining = totalBudget - totalCost

  const addVendor = () => {
    if (!newVendor.name) return
    const vendor: Vendor = {
      id: crypto.randomUUID(),
      ...newVendor,
    }
    onVendorsChange([...vendors, vendor])
    setNewVendor({ name: "", website: "", cost: 0, category: "" })
    setShowForm(false)
  }

  const removeVendor = (id: string) => {
    onVendorsChange(vendors.filter((v) => v.id !== id))
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="size-4 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">Vendors</h4>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:shadow-md"
          aria-label="Add vendor"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* Budget summary */}
      <div className="flex items-center justify-between rounded-xl bg-background/50 p-3 border border-border/30">
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-primary" />
          <span className="text-xs text-muted-foreground">Remaining</span>
        </div>
        <span className={`text-sm font-bold font-mono ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>
          ${remaining.toLocaleString()}
        </span>
      </div>

      {showForm && (
        <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <Input
            value={newVendor.name}
            onChange={(e) => setNewVendor((v) => ({ ...v, name: e.target.value }))}
            placeholder="Vendor name"
            className="h-8 rounded-lg text-sm border-border/50 bg-background/50"
          />
          <Input
            value={newVendor.website}
            onChange={(e) => setNewVendor((v) => ({ ...v, website: e.target.value }))}
            placeholder="Website URL"
            className="h-8 rounded-lg text-sm border-border/50 bg-background/50"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              value={newVendor.cost || ""}
              onChange={(e) => setNewVendor((v) => ({ ...v, cost: Number(e.target.value) }))}
              placeholder="Cost"
              className="h-8 rounded-lg text-sm border-border/50 bg-background/50"
            />
            <Input
              value={newVendor.category}
              onChange={(e) => setNewVendor((v) => ({ ...v, category: e.target.value }))}
              placeholder="Category"
              className="h-8 rounded-lg text-sm border-border/50 bg-background/50"
            />
          </div>
          <button
            onClick={addVendor}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:shadow-md"
          >
            Add Vendor
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {vendors.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No vendors added yet
          </p>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group flex items-start justify-between rounded-xl border border-border/30 bg-background/30 p-3 transition-colors hover:border-primary/20"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">{vendor.name}</span>
                {vendor.website && (
                  <a
                    href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline truncate"
                  >
                    <ExternalLink className="size-3 shrink-0" />
                    {vendor.website}
                  </a>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-foreground">
                    ${vendor.cost.toLocaleString()}
                  </span>
                  {vendor.category && (
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                      {vendor.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeVendor(vendor.id)}
                className="opacity-0 group-hover:opacity-100 flex size-6 items-center justify-center rounded-md text-destructive transition-all hover:bg-destructive/10"
                aria-label={`Remove ${vendor.name}`}
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
