"use client"

import { Coffee, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = "Nincs találat",
  description = "Próbálj kevesebb szűrőt, vagy böngéssz az összes termék között.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="size-24 rounded-full bg-muted flex items-center justify-center">
          <Coffee className="size-10 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 size-10 rounded-full bg-secondary/20 flex items-center justify-center">
          <Search className="size-5 text-secondary" />
        </div>
      </div>

      {/* Text */}
      <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm text-balance">
        {description}
      </p>

      {/* Action */}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
