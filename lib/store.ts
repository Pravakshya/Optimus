export type EventType =
  | "corporate"
  | "social"
  | "academic"
  | "community"
  | "charity"
  | "entertainment"
  | "athletic"
  | "promotional"
  | "virtual"

export interface CostCategory {
  enabled: boolean
  budget: number
  vendor: string
  notes: string
}

export interface Vendor {
  id: string
  name: string
  website: string
  cost: number
  category: string
}

export interface TodoItem {
  id: string
  text: string
  dueDate: string
  completed: boolean
}

export interface MaterialItem {
  id: string
  name: string
  type: "document" | "presentation" | "spreadsheet" | "image" | "video" | "link"
  url: string
  notes: string
  addedAt: string
}

export interface RoomItem {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export interface EventProject {
  id: string
  name: string
  eventType: EventType
  capacity: number
  guestRange: [number, number]
  totalBudget: number
  venueAddress: string
  venueType: string
  venueDimensions: { length: number; width: number; height: number }
  costCategories: Record<string, CostCategory>
  vendors: Vendor[]
  todos: TodoItem[]
  roomItems: RoomItem[]
  date: string
  createdAt: string
}

export const EVENT_TYPES: {
  id: EventType
  label: string
  icon: string
}[] = [
  { id: "corporate", label: "Corporate", icon: "briefcase" },
  { id: "social", label: "Social", icon: "cake" },
  { id: "academic", label: "Academic", icon: "graduation-cap" },
  { id: "community", label: "Community", icon: "globe" },
  { id: "charity", label: "Charity", icon: "heart-handshake" },
  { id: "entertainment", label: "Entertainment", icon: "drama" },
  { id: "athletic", label: "Athletic", icon: "trophy" },
  { id: "promotional", label: "Promotional", icon: "gem" },
  { id: "virtual", label: "Virtual", icon: "monitor" },
]

export const COST_CATEGORY_LABELS: Record<string, string> = {
  food: "Food & Catering",
  decor: "Decor",
  rentals: "Rentals",
  services: "Services",
  entertainment: "Entertainment",
  marketing: "Marketing",
  miscellaneous: "Miscellaneous",
}

export const DEFAULT_COST_CATEGORIES: Record<string, CostCategory> = {
  food: { enabled: false, budget: 0, vendor: "", notes: "" },
  decor: { enabled: false, budget: 0, vendor: "", notes: "" },
  rentals: { enabled: false, budget: 0, vendor: "", notes: "" },
  services: { enabled: false, budget: 0, vendor: "", notes: "" },
  entertainment: { enabled: false, budget: 0, vendor: "", notes: "" },
  marketing: { enabled: false, budget: 0, vendor: "", notes: "" },
  miscellaneous: { enabled: false, budget: 0, vendor: "", notes: "" },
}

export const ROOM_ITEM_TYPES = [
  { type: "chair", label: "Chair", width: 30, height: 30, icon: "armchair" },
  { type: "table", label: "Table", width: 60, height: 60, icon: "square" },
  { type: "stage", label: "Stage", width: 120, height: 60, icon: "presentation" },
  { type: "decoration", label: "Decor", width: 30, height: 30, icon: "flower-2" },
  { type: "lighting", label: "Lighting", width: 20, height: 20, icon: "lamp" },
  { type: "booth", label: "Booth", width: 60, height: 40, icon: "store" },
  { type: "screen", label: "Screen", width: 80, height: 10, icon: "monitor" },
  { type: "plant", label: "Plant", width: 25, height: 25, icon: "trees" },
]

export function createDefaultProject(overrides?: Partial<EventProject>): EventProject {
  return {
    id: crypto.randomUUID(),
    name: "Untitled Event",
    eventType: "corporate",
    capacity: 100,
    guestRange: [50, 150],
    totalBudget: 10000,
    venueAddress: "",
    venueType: "indoor",
    venueDimensions: { length: 100, width: 65, height: 16 },
    costCategories: JSON.parse(JSON.stringify(DEFAULT_COST_CATEGORIES)),
    vendors: [],
    todos: [],
    roomItems: [],
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}
