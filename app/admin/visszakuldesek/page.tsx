"use client"

import { Construction } from "lucide-react"

export default function AdminReturnsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
        Visszaküldések kezelése
      </h1>
      <p className="text-muted-foreground text-center">
        Hamarosan! Ez az oldal fejlesztés alatt áll.
      </p>
    </div>
  )
}
