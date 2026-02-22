"use client"

import { BudgetBreakdown } from "./budget-breakdown"
import { VendorPanel } from "./vendor-panel"
import type { CostCategory, Vendor } from "@/lib/store"

export function BudgetTab({
  costCategories,
  totalBudget,
  vendors,
  onVendorsChange,
  onCostCategoriesChange,
  onBudgetChange,
}: {
  costCategories: Record<string, CostCategory>
  totalBudget: number
  vendors: Vendor[]
  onVendorsChange: (vendors: Vendor[]) => void
  onCostCategoriesChange: (categories: Record<string, CostCategory>) => void
  onBudgetChange: (budget: number) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <BudgetBreakdown costCategories={costCategories} totalBudget={totalBudget} />
      <VendorPanel 
        vendors={vendors} 
        onVendorsChange={onVendorsChange} 
        totalBudget={totalBudget}
        costCategories={costCategories}
        onCostCategoriesChange={onCostCategoriesChange}
      />
    </div>
  )
}
