"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Heart, ArrowRight, Search, Coffee, BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/product-card"

// --- Types ---
interface Product {
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

interface Story {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  readTime: string
  date: string
  slug: string
}

// --- Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Ethiopia Yirgacheffe",
    origin: "Etiópia",
    price: 4990,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    slug: "ethiopia-yirgacheffe",
  },
  {
    id: "2",
    name: "Colombia Huila",
    origin: "Kolumbia",
    price: 3990,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    slug: "colombia-huila",
  },
  {
    id: "3",
    name: "Kenya AA",
    origin: "Kenya",
    price: 5490,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=500&fit=crop",
    rating: 4.9,
    reviewCount: 67,
    slug: "kenya-aa",
  },
  {
    id: "4",
    name: "Guatemala Antigua",
    origin: "Guatemala",
    price: 4290,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=500&fit=crop",
    rating: 4.5,
    reviewCount: 45,
    slug: "guatemala-antigua",
  },
  {
    id: "5",
    name: "Brazil Santos",
    origin: "Brazília",
    price: 2990,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=500&fit=crop",
    rating: 4.3,
    reviewCount: 156,
    slug: "brazil-santos",
  },
  {
    id: "6",
    name: "Rwanda Nyungwe",
    origin: "Ruanda",
    price: 5990,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 34,
    isNew: true,
    slug: "rwanda-nyungwe",
  },
  {
    id: "7",
    name: "Costa Rica Tarrazu",
    origin: "Costa Rica",
    price: 4590,
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=500&fit=crop",
    rating: 4.4,
    reviewCount: 78,
    slug: "costa-rica-tarrazu",
  },
  {
    id: "8",
    name: "Chemex 6 csészés",
    origin: "Eszközök",
    price: 18990,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=500&fit=crop",
    rating: 4.9,
    reviewCount: 234,
    slug: "chemex-6",
  },
  {
    id: "9",
    name: "V60 Pour Over szett",
    origin: "Eszközök",
    price: 12990,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 189,
    slug: "v60-szett",
  },
  {
    id: "10",
    name: "Aeropress",
    origin: "Eszközök",
    price: 14990,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 312,
    slug: "aeropress",
  },
  {
    id: "11",
    name: "Baratza Encore daráló",
    origin: "Eszközök",
    price: 54990,
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 145,
    slug: "baratza-encore",
  },
  {
    id: "12",
    name: "CraftBrew póló",
    origin: "Merch",
    price: 7990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    rating: 4.5,
    reviewCount: 56,
    slug: "craftbrew-polo",
  },
  {
    id: "13",
    name: "Kávés ajándékcsomag",
    origin: "Csomagok",
    price: 14990,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=500&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    slug: "ajandekcsomag",
  },
  {
    id: "14",
    name: "Starter szett",
    origin: "Csomagok",
    price: 24990,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 67,
    slug: "starter-szett",
  },
]

const MOCK_STORIES: Story[] = [
  {
    id: "1",
    title: "A kávé útja a cserjétől a csészéig",
    excerpt: "Fedezd fel a specialty kávé teljes útját, a termesztéstől az elkészítésig.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop",
    category: "Tudástár",
    readTime: "8 perc",
    date: "2026. márc. 15.",
    slug: "kave-utja",
  },
  {
    id: "2",
    title: "Pour over technikák haladóknak",
    excerpt: "Emeld a következő szintre a V60 és Chemex készítési módszereidet.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    category: "Elkészítés",
    readTime: "6 perc",
    date: "2026. márc. 10.",
    slug: "pour-over-technikak",
  },
  {
    id: "3",
    title: "Etióp kávéfarmok története",
    excerpt: "Látogatás a kávé szülőföldjére, ahol minden elkezdődött.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop",
    category: "Eredet",
    readTime: "10 perc",
    date: "2026. feb. 28.",
    slug: "etiop-kavefarmok",
  },
  {
    id: "4",
    title: "Cold brew készítése otthon",
    excerpt: "A tökéletes hidegen készült kávé titkai egyszerű eszközökkel.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop",
    category: "Elkészítés",
    readTime: "5 perc",
    date: "2026. feb. 20.",
    slug: "cold-brew-otthon",
  },
  {
    id: "5",
    title: "A pörkölés művészete",
    excerpt: "Így alakul át a zöld kávé aromás élménnyé a CraftBrew műhelyében.",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop",
    category: "Műhely",
    readTime: "7 perc",
    date: "2026. feb. 15.",
    slug: "porkoles-muveszete",
  },
  {
    id: "6",
    title: "Specialty kávé vs. kereskedelmi kávé",
    excerpt: "Mi a különbség és miért érdemes minőségi kávét választani?",
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&h=400&fit=crop",
    category: "Tudástár",
    readTime: "6 perc",
    date: "2026. jan. 30.",
    slug: "specialty-vs-kereskedelmi",
  },
  {
    id: "7",
    title: "Kávé és egészség",
    excerpt: "A legújabb kutatások a kávéfogyasztás pozitív hatásairól.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop",
    category: "Tudástár",
    readTime: "8 perc",
    date: "2026. jan. 15.",
    slug: "kave-es-egeszseg",
  },
]

const SUGGESTIONS = ["kávé", "espresso", "drip", "chemex", "etióp", "kolumbiai"]

// --- Helper ---
function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-secondary/30 text-foreground rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

// --- Components ---
function SearchResultProduct({
  product,
  query,
}: {
  product: Product
  query: string
}) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/kavek/${product.slug}`} className="block">
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
              <Badge
                variant="secondary"
                className="bg-muted-foreground text-white font-mono text-xs tracking-wider"
              >
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
          </Button>

          {/* Quick Add */}
          {!product.isSoldOut && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="w-full bg-primary/95 backdrop-blur-sm hover:bg-primary"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                Kosárba
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.origin}
          </p>
          <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-tight text-balance">
            {highlightMatch(product.name, query)}
          </h3>
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
          <p
            className={cn(
              "font-mono text-base font-medium",
              product.isSoldOut
                ? "text-muted-foreground line-through"
                : "text-foreground"
            )}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}

function SearchResultStory({
  story,
  query,
}: {
  story: Story
  query: string
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/sztorik/${story.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-none hover:bg-muted/50 transition-colors">
          <div className="flex gap-4 p-4">
            <div className="relative w-32 aspect-[3/2] flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {story.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {story.readTime}
                </span>
              </div>
              <h3 className="font-serif text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {highlightMatch(story.title, query)}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {story.excerpt}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.article>
  )
}

function StorySkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <Skeleton className="w-32 aspect-[3/2] flex-shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

// --- Main Page ---
export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = React.useState(initialQuery)
  const [filter, setFilter] = React.useState<"all" | "products" | "stories">("all")
  const [sort, setSort] = React.useState("relevance")
  const [isLoading, setIsLoading] = React.useState(true)

  // Simulate loading
  React.useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [initialQuery])

  // Filter results based on query
  const filteredProducts = React.useMemo(() => {
    if (!initialQuery) return []
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(initialQuery.toLowerCase())
    )
  }, [initialQuery])

  const filteredStories = React.useMemo(() => {
    if (!initialQuery) return []
    return MOCK_STORIES.filter(
      (s) =>
        s.title.toLowerCase().includes(initialQuery.toLowerCase()) ||
        s.excerpt.toLowerCase().includes(initialQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(initialQuery.toLowerCase())
    )
  }, [initialQuery])

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts]
    switch (sort) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "newest":
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default:
        return sorted
    }
  }, [filteredProducts, sort])

  const totalProducts = sortedProducts.length
  const totalStories = filteredStories.length
  const hasResults = totalProducts > 0 || totalStories > 0

  const visibleProducts = filter === "stories" ? [] : sortedProducts.slice(0, 12)
  const visibleStories = filter === "products" ? [] : filteredStories.slice(0, 6)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/kereses?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Keress termékeket, sztorikat..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base rounded-full border-muted-foreground/20"
              />
            </div>
          </form>

          {/* Results Title */}
          {initialQuery && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-2">
                Találatok: &apos;{initialQuery}&apos;
              </h1>
              {hasResults && !isLoading && (
                <p className="text-muted-foreground">
                  <span className="font-mono">{totalProducts}</span> termék
                  <span className="mx-2">·</span>
                  <span className="font-mono">{totalStories}</span> sztori
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters & Sort */}
      {initialQuery && hasResults && (
        <div className="border-b bg-background sticky top-[73px] z-10">
          <div className="container max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter Chips */}
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="rounded-full"
                >
                  Mind
                </Button>
                <Button
                  variant={filter === "products" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("products")}
                  className="rounded-full"
                >
                  <Coffee className="size-4 mr-1.5" />
                  Csak termékek
                </Button>
                <Button
                  variant={filter === "stories" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("stories")}
                  className="rounded-full"
                >
                  <BookOpen className="size-4 mr-1.5" />
                  Csak sztorik
                </Button>
              </div>

              {/* Sort */}
              {filter !== "stories" && (
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Rendezés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="price-asc">Ár növekvő</SelectItem>
                    <SelectItem value="price-desc">Ár csökkenő</SelectItem>
                    <SelectItem value="newest">Legújabb</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Products Skeleton */}
              {filter !== "stories" && (
                <section>
                  <Skeleton className="h-6 w-32 mb-6" />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* Stories Skeleton */}
              {filter !== "products" && (
                <section>
                  <Skeleton className="h-6 w-32 mb-6" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <StorySkeleton key={i} />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          ) : !hasResults ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              {/* Empty State Illustration */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Coffee cup */}
                  <motion.path
                    d="M60 80 L60 140 Q60 160 80 160 L120 160 Q140 160 140 140 L140 80 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted-foreground/30"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  {/* Handle */}
                  <motion.path
                    d="M140 90 Q170 90 170 120 Q170 150 140 150"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-muted-foreground/30"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                  {/* Question mark */}
                  <motion.text
                    x="100"
                    y="130"
                    textAnchor="middle"
                    className="text-5xl font-serif fill-muted-foreground/50"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    ?
                  </motion.text>
                  {/* Steam */}
                  <motion.path
                    d="M80 70 Q85 50 80 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-muted-foreground/20"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <motion.path
                    d="M100 65 Q105 45 100 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-muted-foreground/20"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <motion.path
                    d="M120 70 Q125 50 120 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-muted-foreground/20"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.4, repeat: Infinity, repeatType: "reverse" }}
                  />
                </svg>
              </div>

              <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
                Nincs találat &apos;{initialQuery}&apos;-re
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Próbálj más kulcsszavakat, vagy böngéssz a kategóriáink között.
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="text-sm text-muted-foreground">Próbáld meg:</span>
                {SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => router.push(`/kereses?q=${encodeURIComponent(suggestion)}`)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>

              <Button asChild>
                <Link href="/kavek">Böngéssz a kávék között</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Products Section */}
              {visibleProducts.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-medium text-foreground">
                      Termékek
                    </h2>
                    {totalProducts > 12 && filter !== "products" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/kereses?q=${encodeURIComponent(initialQuery)}&filter=products`}
                          onClick={() => setFilter("products")}
                        >
                          Mind a {totalProducts} termék
                          <ArrowRight className="size-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {(filter === "products" ? sortedProducts : visibleProducts).map(
                      (product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <SearchResultProduct
                            product={product}
                            query={initialQuery}
                          />
                        </motion.div>
                      )
                    )}
                  </div>
                </section>
              )}

              {/* Separator */}
              {visibleProducts.length > 0 &&
                visibleStories.length > 0 &&
                filter === "all" && <Separator />}

              {/* Stories Section */}
              {visibleStories.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-medium text-foreground">
                      Sztorik
                    </h2>
                    {totalStories > 6 && filter !== "stories" && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/kereses?q=${encodeURIComponent(initialQuery)}&filter=stories`}
                          onClick={() => setFilter("stories")}
                        >
                          Mind a {totalStories} sztori
                          <ArrowRight className="size-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(filter === "stories" ? filteredStories : visibleStories).map(
                      (story, i) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <SearchResultStory story={story} query={initialQuery} />
                        </motion.div>
                      )
                    )}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
