"use client"

import { useState, useRef } from "react"
import { Plus, CheckCircle2, Circle, Trash2, ListTodo, Calendar, GripVertical } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { TodoItem } from "@/lib/store"
import { cn } from "@/lib/utils"

export function TodoPanel({
  todos,
  onTodosChange,
}: {
  todos: TodoItem[]
  onTodosChange: (todos: TodoItem[]) => void
}) {
  const [newText, setNewText] = useState("")
  const [newDate, setNewDate] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dateRef = useRef<HTMLInputElement>(null)

  const completed = todos.filter((t) => t.completed).length
  const progress = todos.length > 0 ? (completed / todos.length) * 100 : 0

  const addTodo = () => {
    if (!newText.trim()) return
    const todo: TodoItem = {
      id: crypto.randomUUID(),
      text: newText,
      dueDate: newDate,
      completed: false,
    }
    onTodosChange([...todos, todo])
    setNewText("")
    setNewDate("")
    setShowDatePicker(false)
  }

  const toggleTodo = (id: string) => {
    onTodosChange(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const deleteTodo = (id: string) => {
    onTodosChange(todos.filter((t) => t.id !== id))
  }

  const openDatePicker = () => {
    setShowDatePicker(true)
    setTimeout(() => dateRef.current?.showPicker?.(), 50)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <ListTodo className="size-4 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">Tasks</h4>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {completed}/{todos.length}
        </span>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* Add task form - compact with inline calendar icon */}
      <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/40 p-3">
        <div className="flex items-start gap-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                addTodo()
              }
            }}
            placeholder="Describe your task..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-border/50 bg-background/50 px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Calendar icon button */}
            <button
              type="button"
              onClick={openDatePicker}
              className={cn(
                "relative flex size-8 items-center justify-center rounded-lg border transition-colors",
                newDate
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
              aria-label="Set due date"
              title={newDate ? `Due: ${new Date(newDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Set due date"}
            >
              <Calendar className="size-3.5" />
              <input
                ref={dateRef}
                type="date"
                value={newDate}
                onChange={(e) => { setNewDate(e.target.value); setShowDatePicker(false) }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                tabIndex={-1}
              />
            </button>
            {newDate && (
              <span className="text-[10px] font-medium text-primary">
                {new Date(newDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <button
            onClick={addTodo}
            disabled={!newText.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-40"
            aria-label="Add task"
          >
            <Plus className="size-3" />
            Add
          </button>
        </div>
      </div>

      {/* Tasks list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 360px)" }}>
        {todos.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No tasks yet. Add one above to start tracking your progress.
          </p>
        ) : (
          <>
            {/* Incomplete tasks first */}
            {todos.filter((t) => !t.completed).map((todo) => (
              <div
                key={todo.id}
                className="group flex items-start gap-2.5 rounded-xl border border-border/30 bg-background/30 p-3 transition-all duration-200 hover:border-primary/20"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-0.5 shrink-0 transition-transform duration-200 hover:scale-110"
                  aria-label="Mark as complete"
                >
                  <Circle className="size-[18px] text-muted-foreground" />
                </button>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <span className="text-sm leading-relaxed text-foreground">
                    {todo.text}
                  </span>
                  {todo.dueDate && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="size-2.5" />
                      {new Date(todo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 flex size-6 items-center justify-center rounded-md text-destructive transition-all hover:bg-destructive/10"
                  aria-label={`Delete ${todo.text}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            {/* Completed tasks */}
            {todos.filter((t) => t.completed).length > 0 && (
              <div className="mt-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-1">
                  Completed
                </span>
                <div className="flex flex-col gap-1.5 mt-1.5">
                  {todos.filter((t) => t.completed).map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-start gap-2.5 rounded-xl border border-primary/10 bg-primary/[0.03] p-3 transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 shrink-0 transition-transform duration-200 hover:scale-110"
                        aria-label="Mark as incomplete"
                      >
                        <CheckCircle2 className="size-[18px] text-primary" />
                      </button>
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <span className="text-sm leading-relaxed text-muted-foreground line-through">
                          {todo.text}
                        </span>
                        {todo.dueDate && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                            <Calendar className="size-2.5" />
                            {new Date(todo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 flex size-6 items-center justify-center rounded-md text-destructive transition-all hover:bg-destructive/10"
                        aria-label={`Delete ${todo.text}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
