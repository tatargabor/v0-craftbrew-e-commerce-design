"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Mennyiség",
  className,
}: QuantityStepperProps) {
  const canDecrement = value > min
  const canIncrement = value < max

  const handleDecrement = () => {
    if (canDecrement) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (canIncrement) {
      onChange(value + 1)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}
      <div className="inline-flex items-center rounded-lg border-2 border-border bg-surface">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-none rounded-l-md hover:bg-muted"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Csökkentés"
        >
          <Minus className="size-4" />
        </Button>
        
        <div className="w-14 flex items-center justify-center">
          <span className="font-mono text-base font-medium tabular-nums">
            {value}
          </span>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-none rounded-r-md hover:bg-muted"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Növelés"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}
