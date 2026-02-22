"use client"

import { useState } from "react"
import { BudgetBreakdown } from "./budget-breakdown"
import { VendorPanel } from "./vendor-panel"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { COST_CATEGORY_LABELS } from "@/lib/store"
import { cn } from "@/lib/utils"

import type { CostCategory, Vendor } from "@/lib/store"

export function BudgetTab({
  costCategories,
  totalBudget,
  vendors,
  onVendorsChange,
  onCostCategoriesChange,
}: {
  costCategories: Record<string, CostCategory>
  totalBudget: number
  vendors: Vendor[]
  onVendorsChange: (vendors: Vendor[]) => void
  onCostCategoriesChange: (categories: Record<string, CostCategory>) => void
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [draftCategories, setDraftCategories] =
    useState<Record<string, CostCategory>>(costCategories)

  // ===== SAME FUNCTIONS FROM QUESTIONNAIRE =====

  const toggleCategory = (key: string) => {
    setDraftCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }))
  }

  const updateCategoryBudget = (key: string, budget: number) => {
    setDraftCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], budget },
    }))
  }

  const updateCategoryVendor = (key: string, vendor: string) => {
    setDraftCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], vendor },
    }))
  }

  const updateCategoryNotes = (key: string, notes: string) => {
    setDraftCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], notes },
    }))
  }

  const handleSave = () => {
    onCostCategoriesChange(draftCategories)
    setEditOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Edit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setDraftCategories(costCategories)
            setEditOpen(true)
          }}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md hover:shadow-lg"
        >
          Edit Cost Categories
        </button>
      </div>

      <BudgetBreakdown
        costCategories={costCategories}
        totalBudget={totalBudget}
      />

      <VendorPanel
        vendors={vendors}
        onVendorsChange={onVendorsChange}
        totalBudget={totalBudget}
      />

      {/* ===== EDIT MODAL (Same as Questionnaire Step 4) ===== */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cost Categories</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            {Object.entries(COST_CATEGORY_LABELS).map(([key, label]) => (
              <div
                key={key}
                className={cn(
                  "rounded-2xl border transition-all duration-200",
                  draftCategories[key].enabled
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-background/30"
                )}
              >
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>
                  <Switch
                    checked={draftCategories[key].enabled}
                    onCheckedChange={() => toggleCategory(key)}
                  />
                </div>

                {draftCategories[key].enabled && (
                  <div className="flex flex-col gap-3 border-t border-border/30 p-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Budget:{" "}
                        <span className="font-mono text-primary">
                          $
                          {draftCategories[
                            key
                          ].budget.toLocaleString()}
                        </span>
                      </Label>
                      <Slider
                        value={[draftCategories[key].budget]}
                        onValueChange={([v]) =>
                          updateCategoryBudget(key, v)
                        }
                        min={0}
                        max={totalBudget}
                        step={100}
                      />
                    </div>

                    <Input
                      value={draftCategories[key].vendor}
                      onChange={(e) =>
                        updateCategoryVendor(key, e.target.value)
                      }
                      placeholder="Vendor name"
                      className="h-9 rounded-lg"
                    />

                    <Input
                      value={draftCategories[key].notes}
                      onChange={(e) =>
                        updateCategoryNotes(key, e.target.value)
                      }
                      placeholder="Notes..."
                      className="h-9 rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}