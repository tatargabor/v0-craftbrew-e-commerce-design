"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ProductCard, ProductCardSkeleton, type Product } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Yirgacheffe Kochere",
    origin: "Etiópia",
    price: 3490,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=750&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    slug: "yirgacheffe-kochere",
  },
  {
    id: "2",
    name: "Colombia Huila",
    origin: "Kolumbia",
    price: 2990,
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=750&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    slug: "colombia-huila",
  },
  {
    id: "3",
    name: "Kenya AA Nyeri",
    origin: "Kenya",
    price: 4290,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=750&fit=crop",
    rating: 4.9,
    reviewCount: 67,
    slug: "kenya-aa-nyeri",
  },
  {
    id: "4",
    name: "Brazil Santos",
    origin: "Brazília",
    price: 2490,
    image: "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&h=750&fit=crop",
    rating: 4.4,
    reviewCount: 156,
    slug: "brazil-santos",
  },
  {
    id: "5",
    name: "Guatemala Antigua",
    origin: "Guatemala",
    price: 3190,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=750&fit=crop",
    rating: 4.7,
    reviewCount: 43,
    isSoldOut: true,
    slug: "guatemala-antigua",
  },
  {
    id: "6",
    name: "Ethiopia Sidamo",
    origin: "Etiópia",
    price: 3690,
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&h=750&fit=crop",
    rating: 4.5,
    reviewCount: 78,
    slug: "ethiopia-sidamo",
  },
  {
    id: "7",
    name: "Colombia Supremo",
    origin: "Kolumbia",
    price: 2790,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=750&fit=crop",
    rating: 4.3,
    reviewCount: 112,
    isNew: true,
    slug: "colombia-supremo",
  },
  {
    id: "8",
    name: "Kenya Peaberry",
    origin: "Kenya",
    price: 4890,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=750&fit=crop",
    rating: 4.9,
    reviewCount: 34,
    slug: "kenya-peaberry",
  },
  {
    id: "9",
    name: "Brazil Cerrado",
    origin: "Brazília",
    price: 2290,
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&h=750&fit=crop",
    rating: 4.2,
    reviewCount: 201,
    slug: "brazil-cerrado",
  },
  {
    id: "10",
    name: "Guatemala Huehuetenango",
    origin: "Guatemala",
    price: 3890,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=750&fit=crop",
    rating: 4.8,
    reviewCount: 56,
    slug: "guatemala-huehuetenango",
  },
  {
    id: "11",
    name: "Ethiopia Harrar",
    origin: "Etiópia",
    price: 3990,
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600&h=750&fit=crop",
    rating: 4.6,
    reviewCount: 45,
    slug: "ethiopia-harrar",
  },
  {
    id: "12",
    name: "Colombia Nariño",
    origin: "Kolumbia",
    price: 3290,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=750&fit=crop",
    rating: 4.7,
    reviewCount: 67,
    slug: "colombia-narino",
  },
]

const ORIGIN_MAP: Record<string, string> = {
  ethiopia: "Etiópia",
  colombia: "Kolumbia",
  kenya: "Kenya",
  brazil: "Brazília",
  guatemala: "Guatemala",
}

export default function KavekPage() {
  const [filters, setFilters] = React.useState<FilterState>({
    origins: [],
    roasts: [],
    processes: [],
    priceRange: [0, 15000],
  })
  const [sort, setSort] = React.useState("popularity")
  const [isLoading, setIsLoading] = React.useState(false)
  const [displayCount, setDisplayCount] = React.useState(8)
  const [showEmptyDemo, setShowEmptyDemo] = React.useState(false)

  // Filter products based on current filters
  const filteredProducts = React.useMemo(() => {
    if (showEmptyDemo) return []

    return MOCK_PRODUCTS.filter((product) => {
      // Origin filter
      if (filters.origins.length > 0) {
        const originKey = Object.entries(ORIGIN_MAP).find(
          ([, value]) => value === product.origin
        )?.[0]
        if (!originKey || !filters.origins.includes(originKey)) return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters, showEmptyDemo])

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts]
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "newest":
        sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // popularity - sort by review count
        sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return sorted
  }, [filteredProducts, sort])

  const displayedProducts = sortedProducts.slice(0, displayCount)
  const hasMore = displayCount < sortedProducts.length

  const loadMore = () => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 8, sortedProducts.length))
      setIsLoading(false)
    }, 800)
  }

  const clearFilters = () => {
    setFilters({
      origins: [],
      roasts: [],
      processes: [],
      priceRange: [0, 15000],
    })
    setShowEmptyDemo(false)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Kávék
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Válogatott specialty kávéink a világ legjobb termőterületeiről érkeznek.
              Minden tétel frissen pörkölt, a kávé karakterét tiszteletben tartva.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          {/* Filters */}
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            resultCount={sortedProducts.length}
          />

          {/* Demo Toggle (for demonstration purposes) */}
          <div className="mt-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmptyDemo(!showEmptyDemo)}
              className="text-xs"
            >
              {showEmptyDemo ? "Mutasd a termékeket" : "Üres állapot demó"}
            </Button>
          </div>

          {/* Product Grid or Empty State */}
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-8">
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    disabled={isLoading}
                    className="min-w-[200px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Betöltés...
                      </>
                    ) : (
                      "Tovább betöltés"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Nincs találat"
              description="A megadott szűrőknek megfelelő termék nem található. Próbálj kevesebb szűrőt, vagy böngéssz az összes kávénk között."
              action={{
                label: "Szűrők törlése",
                onClick: clearFilters,
              }}
            />
          )}
        </div>
      </section>

      {/* Loading Skeleton Demo */}
      <section className="pb-16 md:pb-24 border-t pt-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-serif text-2xl font-medium mb-8">Betöltési állapot (demó)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
