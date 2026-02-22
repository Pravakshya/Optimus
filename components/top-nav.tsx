"use client"

import { Sparkles, LayoutGrid, FolderOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"



export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-centerbg-primary text-primary-foreground ">
           <Image
              src="/optimuslogo.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Optimus
          </span>
        </div>

        <nav className="flex items-center gap-1">
          
            <button className="">
              My Events
            </button>
        </nav>

        <button className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground">
          <User className="size-4" />
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </header>
  )
}
