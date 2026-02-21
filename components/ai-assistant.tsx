"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { EventType } from "@/lib/store"
import { EVENT_TYPES } from "@/lib/store"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS: Record<EventType, string[]> = {
  corporate: [
    "What are popular icebreaker activities for corporate events?",
    "How should I arrange seating for a networking mixer?",
    "Recommend a keynote speaker format.",
  ],
  social: [
    "What kind of activities work well for a social gathering?",
    "How can I create a great photo booth area?",
    "Suggest themed decoration ideas.",
  ],
  academic: [
    "What are good breakout session formats?",
    "How should I plan poster presentation areas?",
    "Recommend A/V setup for lectures.",
  ],
  community: [
    "What activities bring communities together?",
    "How to organize volunteer stations?",
    "Ideas for family-friendly entertainment.",
  ],
  charity: [
    "How do I structure a charity auction?",
    "What are effective fundraising activities?",
    "Suggest impactful donor recognition ideas.",
  ],
  entertainment: [
    "What stage setup works for live performances?",
    "How to manage crowd flow for a concert?",
    "Recommend lighting setups for shows.",
  ],
  athletic: [
    "How to layout race check-in and finish areas?",
    "What are popular sports event sponsorship packages?",
    "Ideas for spectator engagement activities.",
  ],
  promotional: [
    "How to maximize brand visibility at a launch?",
    "Recommend interactive demo station layouts.",
    "Ideas for swag bag contents.",
  ],
  virtual: [
    "How to keep virtual attendees engaged?",
    "Best platforms for hybrid events?",
    "How to set up a streaming corner?",
  ],
}

const RESPONSES: Record<string, string> = {
  "activities": "For your event, consider interactive stations like DIY crafts, a cocktail-mixing bar, lawn games, or a trivia contest. Photo booths with themed props are always a hit! You could also set up a collaborative art wall where guests contribute to a mural throughout the evening.",
  "seating": "For a networking-focused layout, try cocktail rounds (highboy tables with 2-4 seats) spaced evenly, mixed with lounge clusters of sofas and low tables. Avoid traditional classroom rows -- people mingle more when they can move freely. Leave 30% of your floor space as open walkways.",
  "decoration": "Create zones with distinct vibes: an entrance with a statement balloon arch or floral installation, a main area with string lights and draped fabric, and a cozy lounge corner with candles and greenery. Stick to 2-3 main colors for cohesion.",
  "budget": "A good rule of thumb: allocate 40% to venue/catering, 15% to entertainment, 15% to decor, 10% to A/V, 10% to marketing/invitations, and 10% as a contingency buffer. Adjust based on your priorities.",
  "food": "For a 3-hour event, plan 8-10 pieces of finger food per person. Include a mix of hot and cold items, dietary options (vegetarian, gluten-free), and at least one signature drink. Stations work better than passed trays for events over 100 people.",
  "default": "That's a great question! Here are some tips based on your event type: focus on guest experience first, keep logistics simple, and always have a backup plan for weather or tech issues. Would you like more specific advice on any particular aspect?",
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes("activit") || lower.includes("icebreaker") || lower.includes("game") || lower.includes("entertainment")) {
    return RESPONSES.activities
  }
  if (lower.includes("seat") || lower.includes("layout") || lower.includes("arrang")) {
    return RESPONSES.seating
  }
  if (lower.includes("decor") || lower.includes("theme") || lower.includes("decoration")) {
    return RESPONSES.decoration
  }
  if (lower.includes("budget") || lower.includes("cost") || lower.includes("spend")) {
    return RESPONSES.budget
  }
  if (lower.includes("food") || lower.includes("cater") || lower.includes("drink") || lower.includes("menu")) {
    return RESPONSES.food
  }
  return RESPONSES.default
}

export function AiAssistant({
  eventType,
  eventName,
}: {
  eventType: EventType
  eventName: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const typeLabel = EVENT_TYPES.find((t) => t.id === eventType)?.label?.toLowerCase() ?? "event"
  const suggestions = SUGGESTIONS[eventType] ?? SUGGESTIONS.social

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(text)
      const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: response }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          <Sparkles className="size-4" />
          <span>AI Assistant</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-96 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Event AI</span>
                <span className="text-[10px] text-muted-foreground">
                  Planning your {typeLabel}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close AI assistant"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: 360, minHeight: 200 }}>
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  {`It looks like you're planning a ${typeLabel}${eventName ? ` "${eventName}"` : ""}! I can help with ideas, layouts, and planning tips.`}
                </p>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Suggestions
                  </span>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 rounded-bl-md">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border/50 p-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input) }}
              placeholder="Ask about your event..."
              className="h-9 flex-1 rounded-xl border-border/50 bg-background/50 text-sm"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-md disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
