"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface VariantOption {
  value: string
  label: string
  disabled?: boolean
  priceModifier?: number // Additional price for this variant
  stockCount?: number
}

interface VariantSelectorProps {
  label: string
  options: VariantOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function VariantSelector({
  label,
  options,
  value,
  onChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value
          const isDisabled = option.disabled

          const button = (
            <button
              key={option.value}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(option.value)}
              className={cn(
                "relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected && !isDisabled && [
                  "border-primary bg-primary text-primary-foreground",
                  "shadow-sm",
                ],
                !isSelected && !isDisabled && [
                  "border-border bg-surface text-foreground",
                  "hover:border-primary/50 hover:bg-muted",
                ],
                isDisabled && [
                  "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed",
                  "opacity-60",
                ]
              )}
            >
              <span className={cn(isDisabled && "line-through decoration-muted-foreground/50")}>
                {option.label}
              </span>
              
              {/* Sold out badge */}
              {isDisabled && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0 bg-muted-foreground text-white"
                >
                  Elfogyott
                </Badge>
              )}
              
              {/* Low stock indicator */}
              {!isDisabled && option.stockCount !== undefined && option.stockCount <= 5 && option.stockCount > 0 && (
                <span className="absolute -top-1 -right-1 size-2 bg-warning rounded-full animate-pulse" />
              )}
            </button>
          )

          // Wrap disabled buttons in tooltip
          if (isDisabled) {
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p>Ez a változat jelenleg nem elérhető</p>
                </TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </div>
    </div>
  )
}

interface SizeSelectorProps {
  sizes: {
    value: string
    label: string
    price: number
    disabled?: boolean
    stockCount?: number
  }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

export function SizeSelector({
  sizes,
  value,
  onChange,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">Méret</Label>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => {
          const isSelected = value === size.value
          const isDisabled = size.disabled

          const button = (
            <button
              key={size.value}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(size.value)}
              className={cn(
                "relative flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200",
                "border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected && !isDisabled && [
                  "border-primary bg-primary text-primary-foreground",
                  "shadow-sm",
                ],
                !isSelected && !isDisabled && [
                  "border-border bg-surface text-foreground",
                  "hover:border-primary/50 hover:bg-muted",
                ],
                isDisabled && [
                  "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed",
                  "opacity-60",
                ]
              )}
            >
              <span className={cn(
                "text-sm font-semibold",
                isDisabled && "line-through decoration-muted-foreground/50"
              )}>
                {size.label}
              </span>
              <span className={cn(
                "text-xs mt-0.5 font-mono",
                isSelected && !isDisabled ? "text-primary-foreground/80" : "text-muted-foreground",
                isDisabled && "line-through"
              )}>
                {formatPrice(size.price)}
              </span>
              
              {isDisabled && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0 bg-muted-foreground text-white whitespace-nowrap"
                >
                  Elfogyott
                </Badge>
              )}
            </button>
          )

          if (isDisabled) {
            return (
              <Tooltip key={size.value}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>
                  <p>Ez a méret jelenleg nem elérhető</p>
                </TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </div>
    </div>
  )
}
