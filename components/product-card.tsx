"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Product {
  id: string
  name: string
  origin: string
  price: number
  image: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isSoldOut?: boolean
  slug: string
}

interface ProductCardProps {
  product: Product
  className?: string
}

function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  return (
    <motion.article
      className={cn("group relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/kavek/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted mb-4">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-secondary text-secondary-foreground font-mono text-xs tracking-wider">
                ÚJ
              </Badge>
            )}
            {product.isSoldOut && (
              <Badge variant="secondary" className="bg-muted-foreground text-white font-mono text-xs tracking-wider">
                ELFOGYOTT
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 size-9 rounded-full bg-white/80 backdrop-blur-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "hover:bg-white hover:scale-110",
              isWishlisted && "opacity-100"
            )}
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-foreground"
              )}
            />
            <span className="sr-only">
              {isWishlisted ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
            </span>
          </Button>

          {/* Quick Add - appears on hover */}
          {!product.isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="w-full bg-primary/95 backdrop-blur-sm hover:bg-primary"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to cart logic
                }}
              >
                Kosárba
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Origin */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.origin}
          </p>

          {/* Name */}
          <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-tight text-balance">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < Math.floor(product.rating)
                      ? "fill-secondary text-secondary"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <p className={cn(
            "font-mono text-base font-medium",
            product.isSoldOut ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-[4/5] rounded-lg bg-muted mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
    </div>
  )
}
