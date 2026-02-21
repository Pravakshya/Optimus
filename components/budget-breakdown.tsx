"use client"

import { DollarSign } from "lucide-react"
import { COST_CATEGORY_LABELS, type CostCategory } from "@/lib/store"

export function BudgetBreakdown({
  costCategories,
  totalBudget,
}: {
  costCategories: Record<string, CostCategory>
  totalBudget: number
}) {
  const enabled = Object.entries(costCategories).filter(([, v]) => v.enabled)
  const allocated = enabled.reduce((sum, [, v]) => sum + v.budget, 0)
  const remaining = totalBudget - allocated

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <DollarSign className="size-4 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">Budget</h4>
        </div>
        <span className="text-lg font-bold font-mono text-primary">
          ${totalBudget.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.min(100, (allocated / totalBudget) * 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Allocated: <span className="font-mono font-medium text-foreground">${allocated.toLocaleString()}</span>
        </span>
        <span className={`font-mono font-medium ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>
          ${remaining.toLocaleString()} left
        </span>
      </div>

      {/* Category bars */}
      <div className="flex flex-col gap-2">
        {enabled.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">
            No categories enabled yet
          </p>
        ) : (
          enabled.map(([key, cat]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 truncate text-xs text-muted-foreground">
                {COST_CATEGORY_LABELS[key]?.split(" ")[0]}
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${totalBudget > 0 ? (cat.budget / totalBudget) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-14 text-right">
                ${cat.budget.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
