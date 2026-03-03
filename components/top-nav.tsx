"use client"

import { Sparkles, LayoutGrid, FolderOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";



export function TopNav() {
  const [open, setOpen] = useState(false);

  const logoutUser = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

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
          
            <button className=""> <b>
              My Events</b>
            </button>
        </nav>

       <div className="relative">
      {/* Account Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <User className="size-4" />
        <span className="sr-only">Profile</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-border bg-card shadow-md">
          <button
            onClick={() => {
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-secondary"
          >
            View Account
          </button>

          <button
            onClick={() => {
              logoutUser();
              console.log("logout here");
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
      </div>
    </header>
  )
}
