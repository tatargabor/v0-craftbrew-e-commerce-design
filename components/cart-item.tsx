"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface CartItemProps {
  id: string
  name: string
  variant: string
  slug: string
  image: string
  price: number
  quantity: number
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  maxQuantity?: number
}

export function CartItem({
  id,
  name,
  variant,
  slug,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  maxQuantity = 99,
}: CartItemProps) {
  const lineTotal = price * quantity

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      className="flex gap-4 py-6 border-b border-border last:border-0"
    >
      {/* Thumbnail */}
      <Link 
        href={`/kavek/${slug}`}
        className="relative shrink-0 size-24 sm:size-28 rounded-lg overflow-hidden bg-muted"
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link 
              href={`/kavek/${slug}`}
              className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {name}
            </Link>
            <p className="text-sm text-muted-foreground mt-0.5">{variant}</p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(id)}
            aria-label={`${name} eltávolítása`}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between gap-4">
          {/* Inline quantity stepper */}
          <div className="inline-flex items-center rounded-md border border-border bg-surface">
            <button
              type="button"
              className={cn(
                "size-8 flex items-center justify-center text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={() => onQuantityChange(id, quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Csökkentés"
            >
              <span className="text-lg leading-none">−</span>
            </button>
            
            <span className="w-10 text-center font-mono text-sm tabular-nums">
              {quantity}
            </span>
            
            <button
              type="button"
              className={cn(
                "size-8 flex items-center justify-center text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={() => onQuantityChange(id, quantity + 1)}
              disabled={quantity >= maxQuantity}
              aria-label="Növelés"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>

          {/* Line total */}
          <p className="font-mono text-base font-medium text-foreground tabular-nums">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <Skeleton className="size-24 sm:size-28 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-1.5" />
        <div className="mt-auto pt-3 flex items-end justify-between">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  )
}
