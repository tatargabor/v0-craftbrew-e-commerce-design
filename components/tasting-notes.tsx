"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TastingNote {
  name: string
  intensity: number // 0-100
  color?: string
}

interface TastingNotesProps {
  notes: TastingNote[]
  className?: string
}

// Flavor colors - warm tones for coffee
const defaultColors: Record<string, string> = {
  // Fruits
  "Áfonya": "#6366f1",
  "Citrus": "#fbbf24",
  "Narancs": "#f97316",
  "Málna": "#ec4899",
  "Szilva": "#7c3aed",
  "Alma": "#84cc16",
  "Körte": "#a3e635",
  "Szőlő": "#8b5cf6",
  "Trópusi gyümölcs": "#fcd34d",
  "Eper": "#f43f5e",
  "Meggy": "#dc2626",
  
  // Sweet
  "Csokoládé": "#78350f",
  "Karamell": "#d97706",
  "Méz": "#fbbf24",
  "Vanília": "#fef3c7",
  "Kakaó": "#92400e",
  "Mogyoró": "#a16207",
  "Mandula": "#d4a574",
  "Barna cukor": "#b45309",
  
  // Earthy
  "Dohány": "#78716c",
  "Fűszeres": "#ea580c",
  "Fahéj": "#c2410c",
  "Szegfűszeg": "#9a3412",
  "Földes": "#57534e",
  
  // Floral
  "Virágos": "#f472b6",
  "Jázmin": "#fbcfe8",
  "Levendula": "#a78bfa",
  
  // Other
  "Vaj": "#fef9c3",
  "Dió": "#92400e",
  "Telt": "#44403c",
}

export function TastingNotes({ notes, className }: TastingNotesProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Visual wheel representation */}
      <div className="relative aspect-square max-w-xs mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {notes.map((note, index) => {
            const angle = (index / notes.length) * 360 - 90
            const radius = 60 + (note.intensity / 100) * 30
            const x = 100 + Math.cos((angle * Math.PI) / 180) * radius
            const y = 100 + Math.sin((angle * Math.PI) / 180) * radius
            const color = note.color || defaultColors[note.name] || "#78350f"
            
            return (
              <motion.g
                key={note.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* Line from center */}
                <line
                  x1="100"
                  y1="100"
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
                {/* Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={8 + (note.intensity / 100) * 8}
                  fill={color}
                  fillOpacity="0.8"
                />
              </motion.g>
            )
          })}
          {/* Center circle */}
          <circle cx="100" cy="100" r="20" fill="currentColor" className="text-primary" />
        </svg>
      </div>

      {/* List representation */}
      <div className="space-y-3">
        {notes.map((note, index) => {
          const color = note.color || defaultColors[note.name] || "#78350f"
          
          return (
            <motion.div
              key={note.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-foreground flex-1">
                {note.name}
              </span>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${note.intensity}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Simpler tag-based display for product cards
export function FlavorTags({
  flavors,
  className,
}: {
  flavors: string[]
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {flavors.map((flavor) => {
        const color = defaultColors[flavor] || "#78350f"
        
        return (
          <span
            key={flavor}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {flavor}
          </span>
        )
      })}
    </div>
  )
}
