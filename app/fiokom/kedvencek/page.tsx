"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  ShoppingCart,
  Bell,
  BellOff,
  LayoutGrid,
  List,
  Star,
  Coffee,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// Types
interface WishlistItem {
  id: string
  name: string
  origin: string
  price: number
  image: string
  rating: number
  reviewCount: number
  inStock: boolean
  lowStock?: boolean
  slug: string
  addedAt: Date
  notifyOnRestock: boolean
}

// Demo data
const initialWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Ethiopia Yirgacheffe",
    origin: "Etiópia",
    price: 3490,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    slug: "ethiopia-yirgacheffe",
    addedAt: new Date("2024-03-15"),
    notifyOnRestock: false,
  },
  {
    id: "2",
    name: "Colombia Huila",
    origin: "Kolumbia",
    price: 3290,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    slug: "colombia-huila",
    addedAt: new Date("2024-03-10"),
    notifyOnRestock: false,
  },
  {
    id: "3",
    name: "Kenya AA",
    origin: "Kenya",
    price: 4190,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=500&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    inStock: false,
    slug: "kenya-aa",
    addedAt: new Date("2024-03-08"),
    notifyOnRestock: true,
  },
  {
    id: "4",
    name: "Brazil Santos",
    origin: "Brazília",
    price: 2990,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=500&fit=crop",
    rating: 4.4,
    reviewCount: 203,
    inStock: true,
    lowStock: true,
    slug: "brazil-santos",
    addedAt: new Date("2024-03-20"),
    notifyOnRestock: false,
  },
  {
    id: "5",
    name: "Guatemala Antigua",
    origin: "Guatemala",
    price: 3690,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 78,
    inStock: false,
    slug: "guatemala-antigua",
    addedAt: new Date("2024-02-28"),
    notifyOnRestock: false,
  },
]

function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

type SortOption = "addedAt" | "price" | "name"
type ViewMode = "gallery" | "list"

export default function KedvencekPage() {
  const [items, setItems] = React.useState<WishlistItem[]>(initialWishlistItems)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = React.useState<SortOption>("addedAt")
  const [viewMode, setViewMode] = React.useState<ViewMode>("gallery")
  const [showEmpty, setShowEmpty] = React.useState(false) // Demo toggle

  // Sort items
  const sortedItems = React.useMemo(() => {
    const sorted = [...items]
    switch (sortBy) {
      case "addedAt":
        return sorted.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      case "price":
        return sorted.sort((a, b) => a.price - b.price)
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name, "hu"))
      default:
        return sorted
    }
  }, [items, sortBy])

  const displayItems = showEmpty ? [] : sortedItems

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === displayItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(displayItems.map((item) => item.id)))
    }
  }

  // Remove item with undo
  const removeItem = (item: WishlistItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(item.id)
      return next
    })

    toast(`${item.name} eltávolítva`, {
      action: {
        label: "Visszavonás",
        onClick: () => {
          setItems((prev) => {
            const exists = prev.find((i) => i.id === item.id)
            if (exists) return prev
            return [...prev, item].sort(
              (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
            )
          })
        },
      },
    })
  }

  // Bulk remove
  const removeSelected = () => {
    const removedItems = items.filter((item) => selectedIds.has(item.id))
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)))
    setSelectedIds(new Set())

    toast(`${removedItems.length} termék eltávolítva`, {
      action: {
        label: "Visszavonás",
        onClick: () => {
          setItems((prev) => [...prev, ...removedItems])
        },
      },
    })
  }

  // Add all selected to cart
  const addAllToCart = () => {
    const inStockSelected = items.filter(
      (item) => selectedIds.has(item.id) && item.inStock
    )
    toast.success(`${inStockSelected.length} termék hozzáadva a kosárhoz`)
    setSelectedIds(new Set())
  }

  // Toggle restock notification
  const toggleNotify = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, notifyOnRestock: !item.notifyOnRestock }
          : item
      )
    )
    const item = items.find((i) => i.id === id)
    if (item) {
      toast(
        item.notifyOnRestock
          ? "Értesítés kikapcsolva"
          : "Értesítünk, amint újra elérhető"
      )
    }
  }

  // Add single item to cart
  const addToCart = (item: WishlistItem) => {
    toast.success(`${item.name} hozzáadva a kosárhoz`)
  }

  const hasSelection = selectedIds.size > 0
  const inStockSelectedCount = items.filter(
    (item) => selectedIds.has(item.id) && item.inStock
  ).length

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Kedvenceim
          </h1>
          {displayItems.length > 0 && (
            <p className="text-muted-foreground">
              {displayItems.length} termék a kedvenceid között
            </p>
          )}
        </div>

        {/* Demo Toggle */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
          <span className="text-muted-foreground">Demo:</span>
          <Button
            variant={showEmpty ? "default" : "outline"}
            size="sm"
            onClick={() => setShowEmpty(!showEmpty)}
          >
            {showEmpty ? "Üres állapot" : "Termékekkel"}
          </Button>
        </div>

        {/* Empty State */}
        {displayItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center">
                <Coffee className="w-16 h-16 text-secondary/60" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-primary/60" />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-3 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-secondary/60" />
              </motion.div>
            </div>

            <h2 className="font-serif text-2xl font-medium text-foreground mb-3 text-center text-balance">
              Nincs még semmi a kedvenceid között
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8 text-balance">
              Fedezd fel kávéinkat és mentsd el a szívedhez közel állókat. 
              Kattints a szív ikonra bármelyik terméknél, hogy idekerüljön.
            </p>

            <Button asChild size="lg">
              <Link href={ROUTES.coffees}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Vásárlás folytatása
              </Link>
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Selection & Bulk Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectedIds.size === displayItems.length &&
                      displayItems.length > 0
                    }
                    onCheckedChange={selectAll}
                    aria-label="Mind kijelölése"
                  />
                  <span className="text-sm text-muted-foreground">
                    {hasSelection
                      ? `${selectedIds.size} kijelölve`
                      : "Mind kijelölése"}
                  </span>
                </div>

                <AnimatePresence>
                  {hasSelection && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Button
                        size="sm"
                        onClick={addAllToCart}
                        disabled={inStockSelectedCount === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Mind kosárba ({inStockSelectedCount})
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={removeSelected}
                      >
                        Eltávolítás
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Sort & View Toggle */}
              <div className="flex items-center gap-3">
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rendezés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addedAt">Hozzáadás dátuma</SelectItem>
                    <SelectItem value="price">Ár</SelectItem>
                    <SelectItem value="name">Név</SelectItem>
                  </SelectContent>
                </Select>

                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(v) => v && setViewMode(v as ViewMode)}
                  className="hidden sm:flex"
                >
                  <ToggleGroupItem value="gallery" aria-label="Galéria nézet">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="Lista nézet">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Product Grid/List */}
            <motion.div
              layout
              className={cn(
                viewMode === "gallery"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              )}
            >
              <AnimatePresence mode="popLayout">
                {displayItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === "gallery" ? (
                      <GalleryCard
                        item={item}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelect={() => toggleSelect(item.id)}
                        onRemove={() => removeItem(item)}
                        onToggleNotify={() => toggleNotify(item.id)}
                        onAddToCart={() => addToCart(item)}
                      />
                    ) : (
                      <ListCard
                        item={item}
                        isSelected={selectedIds.has(item.id)}
                        onToggleSelect={() => toggleSelect(item.id)}
                        onRemove={() => removeItem(item)}
                        onToggleNotify={() => toggleNotify(item.id)}
                        onAddToCart={() => addToCart(item)}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

// Gallery Card Component
interface CardProps {
  item: WishlistItem
  isSelected: boolean
  onToggleSelect: () => void
  onRemove: () => void
  onToggleNotify: () => void
  onAddToCart: () => void
}

function GalleryCard({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onToggleNotify,
  onAddToCart,
}: CardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Link href={`/kavek/${item.slug}`}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                !item.inStock && "opacity-60"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* Top Row: Checkbox + Badges + Heart */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded bg-white/90 backdrop-blur-sm transition-opacity",
                  !isSelected && "opacity-0 group-hover:opacity-100"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={onToggleSelect}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              {!item.inStock && (
                <Badge
                  variant="secondary"
                  className="bg-muted-foreground text-white font-mono text-xs tracking-wider"
                >
                  ELFOGYOTT
                </Badge>
              )}
              {item.lowStock && item.inStock && (
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground font-mono text-xs"
                >
                  UTOLSÓ DARABOK
                </Badge>
              )}
            </div>

            {/* Heart (remove) button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                  onClick={onRemove}
                >
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eltávolítás a kedvencekből</TooltipContent>
            </Tooltip>
          </div>

          {/* Bottom Action */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            {item.inStock ? (
              <Button
                className="w-full bg-white text-foreground hover:bg-white/90"
                onClick={onAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Kosárba
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={item.notifyOnRestock ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      !item.notifyOnRestock &&
                        "bg-white text-foreground hover:bg-white/90 border-0"
                    )}
                    onClick={onToggleNotify}
                  >
                    {item.notifyOnRestock ? (
                      <>
                        <BellOff className="mr-2 h-4 w-4" />
                        Értesítés bekapcsolva
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Értesíts
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {item.notifyOnRestock
                    ? "Értesítés kikapcsolása"
                    : "Értesítünk, amint újra elérhető"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {item.origin}
          </p>
          <Link
            href={`/kavek/${item.slug}`}
            className="block font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-tight"
          >
            {item.name}
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(item.rating)
                      ? "fill-secondary text-secondary"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({item.reviewCount})
            </span>
          </div>
          <p
            className={cn(
              "font-mono text-base font-medium",
              !item.inStock && "text-muted-foreground line-through"
            )}
          >
            {formatPrice(item.price)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// List Card Component
function ListCard({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onToggleNotify,
  onAddToCart,
}: CardProps) {
  return (
    <Card
      className={cn(
        "group transition-all duration-200",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Checkbox */}
          <div className="flex items-start pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Image */}
          <Link
            href={`/kavek/${item.slug}`}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={cn(
                "object-cover",
                !item.inStock && "opacity-60"
              )}
              sizes="96px"
            />
            {!item.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-muted-foreground text-white font-mono text-[10px] tracking-wider"
                >
                  ELFOGYOTT
                </Badge>
              </div>
            )}
          </Link>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between min-w-0">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.origin}
              </p>
              <Link
                href={`/kavek/${item.slug}`}
                className="block font-serif text-lg font-medium text-foreground hover:text-primary transition-colors leading-tight truncate"
              >
                {item.name}
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(item.rating)
                          ? "fill-secondary text-secondary"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({item.reviewCount})
                </span>
              </div>
            </div>
            <p
              className={cn(
                "font-mono text-base font-medium",
                !item.inStock && "text-muted-foreground line-through"
              )}
            >
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end justify-between">
            {/* Heart (remove) button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRemove}
                >
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Eltávolítás a kedvencekből</TooltipContent>
            </Tooltip>

            {/* Cart / Notify */}
            {item.inStock ? (
              <Button size="sm" onClick={onAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Kosárba
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={item.notifyOnRestock ? "default" : "outline"}
                    onClick={onToggleNotify}
                  >
                    {item.notifyOnRestock ? (
                      <>
                        <BellOff className="mr-2 h-4 w-4" />
                        Értesítve
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Értesíts
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {item.notifyOnRestock
                    ? "Értesítés kikapcsolása"
                    : "Értesítünk, amint újra elérhető"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
