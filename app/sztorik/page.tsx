"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Clock, ChevronRight, Coffee, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

// Types
interface Story {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readingTime: number
  coverImage: string
  featured?: boolean
  views: number
}

// Categories
const categories = [
  { id: "all", label: "Mind" },
  { id: "origin", label: "Eredetsztorik" },
  { id: "roasting", label: "Pörkölés" },
  { id: "brewing", label: "Főzési útmutatók" },
  { id: "health", label: "Egészség" },
  { id: "gifts", label: "Ajándékötletek" },
]

// Mock stories
const stories: Story[] = [
  {
    id: "1",
    slug: "ethiopia-yirgacheffe-tortenete",
    title: "Yirgacheffe: Az etióp felföld rejtett kincse",
    excerpt: "Utazás a kávé bölcsőjébe, ahol minden csésze mögött generációk tudása és szenvedélye áll.",
    category: "Eredetsztorik",
    categorySlug: "origin",
    author: { name: "Kovács Anna", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    publishedAt: "2026. április 10.",
    readingTime: 8,
    coverImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
    featured: true,
    views: 2340,
  },
  {
    id: "2",
    slug: "light-roast-titkai",
    title: "A világos pörkölés művészete",
    excerpt: "Miért választják egyre többen a light roast kávékat, és hogyan hozhatod ki belőlük a legtöbbet?",
    category: "Pörkölés",
    categorySlug: "roasting",
    author: { name: "Nagy Péter", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    publishedAt: "2026. április 8.",
    readingTime: 6,
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    featured: true,
    views: 1856,
  },
  {
    id: "3",
    slug: "v60-pour-over-guide",
    title: "V60 Pour Over: A tökéletes csésze útmutatója",
    excerpt: "Lépésről lépésre megtanítjuk, hogyan készíts barista minőségű filterkávét otthon.",
    category: "Főzési útmutatók",
    categorySlug: "brewing",
    author: { name: "Tóth Bence", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    publishedAt: "2026. április 5.",
    readingTime: 10,
    coverImage: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800&h=600&fit=crop",
    views: 3210,
  },
  {
    id: "4",
    slug: "kave-es-egeszseg",
    title: "Mit mond a tudomány a kávéról?",
    excerpt: "A legfrissebb kutatások eredményei a kávéfogyasztás egészségügyi hatásairól.",
    category: "Egészség",
    categorySlug: "health",
    author: { name: "Dr. Szabó Mária", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" },
    publishedAt: "2026. április 3.",
    readingTime: 7,
    coverImage: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&h=600&fit=crop",
    views: 1540,
  },
  {
    id: "5",
    slug: "kave-ajandek-otletek",
    title: "Ajándékötletek kávérajongóknak",
    excerpt: "A legjobb ajándékok azoknak, akik imádják a kávét — minden árkategóriában.",
    category: "Ajándékötletek",
    categorySlug: "gifts",
    author: { name: "Kiss Laura", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    publishedAt: "2026. március 28.",
    readingTime: 5,
    coverImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop",
    views: 980,
  },
  {
    id: "6",
    slug: "colombia-kave-utazas",
    title: "Kolumbia: A kávétermesztés szíve",
    excerpt: "Egy hónap a kolumbiai kávéfarmokon — beszámoló a világ egyik legjobb kávéjának forrásáról.",
    category: "Eredetsztorik",
    categorySlug: "origin",
    author: { name: "Kovács Anna", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    publishedAt: "2026. március 25.",
    readingTime: 12,
    coverImage: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&h=600&fit=crop",
    views: 2100,
  },
  {
    id: "7",
    slug: "cold-brew-keszites",
    title: "Cold Brew otthon: Egyszerűbb, mint gondolnád",
    excerpt: "A nyár kedvenc kávéja pár egyszerű lépésben — recept és tippek.",
    category: "Főzési útmutatók",
    categorySlug: "brewing",
    author: { name: "Tóth Bence", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    publishedAt: "2026. március 20.",
    readingTime: 6,
    coverImage: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop",
    views: 1890,
  },
  {
    id: "8",
    slug: "medium-roast-egyensuly",
    title: "A medium pörkölés: Az arany középút",
    excerpt: "Miért a medium roast a legnépszerűbb választás, és miben különbözik a többitől?",
    category: "Pörkölés",
    categorySlug: "roasting",
    author: { name: "Nagy Péter", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    publishedAt: "2026. március 15.",
    readingTime: 5,
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop",
    views: 1230,
  },
]

// Empty state
function EmptyCategory({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Coffee className="h-16 w-16 text-primary/40" />
        </motion.div>
        <motion.div
          className="absolute -right-1 -top-1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-5 w-5 text-secondary" />
        </motion.div>
      </div>
      <h3 className="font-serif text-xl font-medium mb-2">
        Hamarosan érkeznek sztorik
      </h3>
      <p className="text-muted-foreground max-w-md">
        Ebben a kategóriában még készülnek a tartalmak. Nézz vissza hamarosan!
      </p>
    </div>
  )
}

// Featured story card (large)
function FeaturedStoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/sztorik/${story.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src={story.coverImage}
              alt={story.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <Badge variant="secondary" className="mb-3 bg-secondary text-secondary-foreground">
                {story.category}
              </Badge>
              <h2 className="font-serif text-2xl md:text-4xl font-medium mb-3 leading-tight text-balance">
                {story.title}
              </h2>
              <p className="text-white/80 mb-4 max-w-2xl line-clamp-2 text-pretty">
                {story.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage src={story.author.avatar} />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{story.author.name}</span>
                </div>
                <span className="text-sm text-white/60">{story.publishedAt}</span>
                <span className="text-sm text-white/60 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {story.readingTime} perc olvasás
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Regular story card
function StoryCard({ story, size = "medium" }: { story: Story; size?: "small" | "medium" | "large" }) {
  return (
    <Link href={`/sztorik/${story.slug}`}>
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0 h-full flex flex-col">
          <div
            className={cn(
              "relative overflow-hidden",
              size === "large" && "aspect-[4/3]",
              size === "medium" && "aspect-[3/2]",
              size === "small" && "aspect-[16/9]"
            )}
          >
            <img
              src={story.coverImage}
              alt={story.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
            >
              {story.category}
            </Badge>
          </div>
          <div className="p-4 md:p-5 flex flex-col flex-1">
            <h3
              className={cn(
                "font-serif font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2 text-balance",
                size === "large" && "text-xl md:text-2xl",
                size === "medium" && "text-lg",
                size === "small" && "text-base"
              )}
            >
              {story.title}
            </h3>
            {size !== "small" && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                {story.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{story.author.name}</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {story.readingTime} perc
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function SztorikPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort stories
  const filteredStories = useMemo(() => {
    let result = [...stories]

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((s) => s.categorySlug === activeCategory)
    }

    // Sort
    if (sortBy === "popular") {
      result.sort((a, b) => b.views - a.views)
    }
    // Default is newest (already sorted in mock data)

    return result
  }, [activeCategory, sortBy])

  // Get featured stories (only on "all" category)
  const featuredStories = activeCategory === "all" ? stories.filter((s) => s.featured) : []
  const regularStories = activeCategory === "all"
    ? filteredStories.filter((s) => !s.featured)
    : filteredStories

  // Check if category is empty
  const isCategoryEmpty = filteredStories.length === 0

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4 text-balance">
              Sztorik
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Történetek a kávé világából — az ültetvényektől a csészéig.
              Fedezd fel az eredeteket, tanuld meg a technikákat, és merülj el
              a specialty coffee kultúrájában.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category tabs - desktop */}
            <Tabs
              value={activeCategory}
              onValueChange={(val) => {
                setActiveCategory(val)
                setCurrentPage(1)
              }}
              className="hidden md:block"
            >
              <TabsList className="bg-muted/50">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Category select - mobile */}
            <Select
              value={activeCategory}
              onValueChange={(val) => {
                setActiveCategory(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="md:hidden w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as "newest" | "popular")}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Legújabb</SelectItem>
                <SelectItem value="popular">Legolvasottabb</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container max-w-6xl mx-auto px-4">
          {isCategoryEmpty ? (
            <EmptyCategory category={activeCategory} />
          ) : (
            <div className="space-y-12">
              {/* Featured stories (only on "all") */}
              {featuredStories.length > 0 && (
                <div className="space-y-6">
                  {/* Main featured */}
                  <FeaturedStoryCard story={featuredStories[0]} />

                  {/* Secondary featured */}
                  {featuredStories.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredStories.slice(1).map((story) => (
                        <StoryCard key={story.id} story={story} size="large" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Regular stories - magazine mosaic layout */}
              {regularStories.length > 0 && (
                <div>
                  {activeCategory === "all" && featuredStories.length > 0 && (
                    <h2 className="font-serif text-2xl font-medium mb-6">
                      További sztorik
                    </h2>
                  )}

                  {/* Asymmetric grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {regularStories.map((story, index) => {
                      // Create varied card sizes for magazine feel
                      const pattern = index % 5
                      let colSpan = "md:col-span-4"
                      let size: "small" | "medium" | "large" = "medium"

                      if (pattern === 0) {
                        colSpan = "md:col-span-8"
                        size = "large"
                      } else if (pattern === 1 || pattern === 2) {
                        colSpan = "md:col-span-4"
                        size = "medium"
                      } else if (pattern === 3) {
                        colSpan = "md:col-span-6"
                        size = "medium"
                      } else {
                        colSpan = "md:col-span-6"
                        size = "medium"
                      }

                      return (
                        <div key={story.id} className={colSpan}>
                          <StoryCard story={story} size={size} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {[1, 2, 3].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < 3) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === 3 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
