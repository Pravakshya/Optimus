"use client"

import {
  Briefcase,
  Cake,
  GraduationCap,
  Globe,
  HeartHandshake,
  Drama,
  Trophy,
  Gem,
  Monitor,
} from "lucide-react"
import type { EventType } from "@/lib/store"
import { cn } from "@/lib/utils"

const iconMap: Record<EventType, React.ElementType> = {
  corporate: Briefcase,
  social: Cake,
  academic: GraduationCap,
  community: Globe,
  charity: HeartHandshake,
  entertainment: Drama,
  athletic: Trophy,
  promotional: Gem,
  virtual: Monitor,
}

const colorMap: Record<EventType, string> = {
  corporate: "from-[oklch(0.62_0.14_275)] to-[oklch(0.50_0.12_275)]",
  social: "from-[oklch(0.70_0.15_340)] to-[oklch(0.55_0.13_340)]",
  academic: "from-[oklch(0.60_0.12_220)] to-[oklch(0.48_0.10_220)]",
  community: "from-[oklch(0.65_0.13_160)] to-[oklch(0.50_0.11_160)]",
  charity: "from-[oklch(0.68_0.14_15)] to-[oklch(0.55_0.12_15)]",
  entertainment: "from-[oklch(0.65_0.15_300)] to-[oklch(0.50_0.13_300)]",
  athletic: "from-[oklch(0.70_0.14_80)] to-[oklch(0.55_0.12_80)]",
  promotional: "from-[oklch(0.60_0.15_275)] to-[oklch(0.48_0.13_275)]",
  virtual: "from-[oklch(0.58_0.12_250)] to-[oklch(0.45_0.10_250)]",
}

export function EventIcon({
  type,
  size = "md",
  className,
}: {
  type: EventType
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const Icon = iconMap[type]
  const sizeClasses = {
    sm: "size-10 [&_svg]:size-5",
    md: "size-14 [&_svg]:size-7",
    lg: "size-20 [&_svg]:size-10",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-gradient-to-br text-primary-foreground shadow-lg",
        colorMap[type],
        sizeClasses[size],
        className
      )}
    >
      <Icon />
    </div>
  )
}
