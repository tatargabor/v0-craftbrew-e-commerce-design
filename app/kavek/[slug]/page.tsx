"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Heart,
  Package,
  AlertTriangle,
  Truck,
  Shield,
  Leaf,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGallery, ProductGallerySkeleton } from "@/components/product-gallery"
import { VariantSelector, SizeSelector } from "@/components/variant-selector"
import { QuantityStepper } from "@/components/quantity-stepper"
import { RestockNotifyDialog } from "@/components/restock-notify-dialog"
import { TastingNotes, FlavorTags } from "@/components/tasting-notes"
import { ProductReviews, type Review } from "@/components/product-reviews"
import { ProductCard, ProductCardSkeleton, type Product } from "@/components/product-card"

// Mock product data
const mockProduct = {
  id: "ethiopia-yirgacheffe",
  name: "Ethiopia Yirgacheffe",
  origin: "Etiópia",
  region: "Yirgacheffe, Gedeo Zone",
  altitude: "1,800-2,200m",
  process: "Mosott",
  roast: "Világos",
  producer: "Smallholder farmers",
  harvest: "2025 ősz",
  description: `
    A Yirgacheffe régió Etiópia legismertebb és legelismertebb kávétermelő területe. 
    Ez a különleges tétel a régió apró családi gazdaságaiból származik, ahol generációk 
    óta hagyományos módszerekkel termesztik és dolgozzák fel a kávét.
    
    A mosott feldolgozás kiemeli a kávé természetes gyümölcsösségét és virágos aromáit. 
    A világos pörkölés megőrzi az eredet karakterét, és egy elegáns, összetett csészét eredményez.
  `,
  brewingNotes: `
    **Espresso**: 18g kávé, 36g víz, 25-28 másodperc. Élénk citrusos csészét ad.
    
    **V60 / Pour Over**: 15g kávé, 250g víz, 2:30-3:00 perc. A legjobb módszer az összetett aromák kiemelésére.
    
    **French Press**: 30g kávé, 500g víz, 4 perc. Testesebb, de a virágos jegyek itt is átjönnek.
  `,
  images: [
    { src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=1000&fit=crop", alt: "Ethiopia Yirgacheffe kávé csomag" },
    { src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=1000&fit=crop", alt: "Pörkölés közeli" },
    { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=1000&fit=crop", alt: "Elkészített kávé" },
  ],
  flavors: ["Áfonya", "Citrus", "Jázmin", "Csokoládé"],
  tastingNotes: [
    { name: "Áfonya", intensity: 85 },
    { name: "Citrus", intensity: 70 },
    { name: "Jázmin", intensity: 60 },
    { name: "Csokoládé", intensity: 45 },
    { name: "Karamell", intensity: 30 },
  ],
  variants: {
    forma: [
      { value: "szemes", label: "Szemes", disabled: false },
      { value: "orolt-espresso", label: "Őrölt — Espresso", disabled: false },
      { value: "orolt-filter", label: "Őrölt — Filter", disabled: false },
      { value: "drip-bag", label: "Drip Bag", disabled: true, stockCount: 0 },
    ],
    size: [
      { value: "250g", label: "250g", price: 2490, disabled: false, stockCount: 45 },
      { value: "500g", label: "500g", price: 4490, disabled: false, stockCount: 23 },
      { value: "1kg", label: "1kg", price: 7990, disabled: true, stockCount: 0 },
    ],
  },
  rating: 4.7,
  reviewCount: 12,
  reviews: [
    {
      id: "1",
      author: { name: "Kovács Péter", isVerifiedBuyer: true },
      rating: 5,
      title: "Csodálatos áfonya ízjegyek",
      content: "Évek óta kerestem ilyen karakteres etióp kávét. A V60-on készítve igazán kijönnek a gyümölcsös jegyek. Nagyon ajánlom!",
      date: "2026-04-10",
      helpfulCount: 8,
    },
    {
      id: "2",
      author: { name: "Nagy Anna", avatar: "https://i.pravatar.cc/100?img=5", isVerifiedBuyer: true },
      rating: 4,
      title: "Kiváló minőség",
      content: "Nagyon finom, komplex ízvilág. Egyedül az ára lehetne kicsit barátságosabb, de a minőség kétségtelenül prémium.",
      date: "2026-04-05",
      helpfulCount: 3,
    },
    {
      id: "3",
      author: { name: "Szabó Gergő", isVerifiedBuyer: true },
      rating: 5,
      title: "A kedvencem lett",
      content: "Harmadszor rendelek már belőle. Espresso-nak és filter kávénak is tökéletes. A csomagolás is nagyon szép.",
      date: "2026-03-28",
      helpfulCount: 5,
    },
  ] as Review[],
  ratingDistribution: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 },
}

// Cross-sell products
const crossSellProducts: Product[] = [
  {
    id: "2",
    name: "Colombia Huila",
    origin: "Kolumbia",
    price: 2290,
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=750&fit=crop",
    rating: 4.5,
    reviewCount: 8,
    slug: "colombia-huila",
  },
  {
    id: "3",
    name: "Kenya AA",
    origin: "Kenya",
    price: 2890,
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=750&fit=crop",
    rating: 4.8,
    reviewCount: 15,
    isNew: true,
    slug: "kenya-aa",
  },
  {
    id: "4",
    name: "Guatemala Antigua",
    origin: "Guatemala",
    price: 2190,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=750&fit=crop",
    rating: 4.3,
    reviewCount: 6,
    slug: "guatemala-antigua",
  },
  {
    id: "5",
    name: "Brazil Santos",
    origin: "Brazília",
    price: 1890,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=750&fit=crop",
    rating: 4.2,
    reviewCount: 22,
    slug: "brazil-santos",
  },
]

function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

type StockStatus = "in-stock" | "low-stock" | "out-of-stock"

function getStockStatus(count: number | undefined): StockStatus {
  if (count === undefined || count === 0) return "out-of-stock"
  if (count <= 5) return "low-stock"
  return "in-stock"
}

export default function ProductDetailPage() {
  const product = mockProduct
  
  // Variant state
  const [selectedForma, setSelectedForma] = React.useState(
    product.variants.forma.find((v) => !v.disabled)?.value || ""
  )
  const [selectedSize, setSelectedSize] = React.useState(
    product.variants.size.find((v) => !v.disabled)?.value || ""
  )
  const [quantity, setQuantity] = React.useState(1)
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  
  // Mock auth state
  const [isSignedIn] = React.useState(true)
  const userEmail = isSignedIn ? "user@example.com" : undefined
  
  // Calculate current price and stock
  const currentSizeOption = product.variants.size.find((s) => s.value === selectedSize)
  const currentPrice = currentSizeOption?.price || 0
  const currentStock = currentSizeOption?.stockCount
  const stockStatus = getStockStatus(currentStock)
  
  // Check if product is completely out of stock
  const isCompletelyOutOfStock = product.variants.size.every((s) => s.disabled)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAddingToCart(false)
    // Add toast notification here
  }

  const handleWishlist = () => {
    if (!isSignedIn) {
      // Redirect to login
      return
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/kavek">Kávék</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/kavek?origin=etiopia">Etiópia</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section - Editorial layout */}
      <section className="container max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Left: Gallery */}
          <div className="lg:sticky lg:top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product info - flowing editorial style */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Origin label */}
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              {product.origin}
            </p>

            {/* Product name */}
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight text-balance">
              {product.name}
            </h1>

            {/* Rating */}
            <Link
              href="#reviews"
              className="inline-flex items-center gap-2 group"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-5",
                      i < Math.floor(product.rating)
                        ? "fill-secondary text-secondary"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {product.rating} ({product.reviewCount} értékelés)
              </span>
            </Link>

            {/* Price */}
            <div className="space-y-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPrice}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="font-mono text-3xl lg:text-4xl font-bold text-foreground"
                >
                  {formatPrice(currentPrice)}
                </motion.p>
              </AnimatePresence>
              <p className="text-sm text-muted-foreground">Az ár tartalmazza az ÁFÁ-t</p>
            </div>

            {/* Metadata badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                <Leaf className="size-3.5" />
                {product.process}
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                {product.roast} pörkölés
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                {product.altitude}
              </Badge>
            </div>

            {/* Flavor tags */}
            <FlavorTags flavors={product.flavors} />

            <Separator />

            {/* Variant selectors */}
            <div className="space-y-6">
              <VariantSelector
                label="Forma"
                options={product.variants.forma}
                value={selectedForma}
                onChange={setSelectedForma}
              />

              <SizeSelector
                sizes={product.variants.size}
                value={selectedSize}
                onChange={setSelectedSize}
              />
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              {stockStatus === "in-stock" && (
                <>
                  <Package className="size-4 text-success" />
                  <span className="text-sm text-success font-medium">
                    Készleten: {currentStock} db
                  </span>
                </>
              )}
              {stockStatus === "low-stock" && (
                <>
                  <AlertTriangle className="size-4 text-warning" />
                  <span className="text-sm text-warning font-medium">
                    Hamarosan elfogy! Már csak {currentStock} db
                  </span>
                </>
              )}
              {stockStatus === "out-of-stock" && (
                <>
                  <Package className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Elfogyott</span>
                </>
              )}
            </div>

            {/* Quantity & Add to cart */}
            <div className="space-y-4">
              {!isCompletelyOutOfStock && stockStatus !== "out-of-stock" && (
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.min(currentStock || 1, 10)}
                />
              )}

              <div className="flex gap-3">
                {isCompletelyOutOfStock || stockStatus === "out-of-stock" ? (
                  <RestockNotifyDialog
                    productName={product.name}
                    variantInfo={`${selectedForma}, ${selectedSize}`}
                    userEmail={userEmail}
                    onSubmit={async () => {
                      await new Promise((r) => setTimeout(r, 1000))
                    }}
                    className="flex-1"
                  />
                ) : (
                  <Button
                    size="lg"
                    className="flex-1 gap-2 text-base h-14"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Hozzáadás...
                      </>
                    ) : (
                      "Kosárba"
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "size-14 shrink-0",
                    isWishlisted && "border-primary text-primary hover:bg-primary/10"
                  )}
                  onClick={handleWishlist}
                >
                  <Heart
                    className={cn("size-5", isWishlisted && "fill-primary")}
                  />
                  <span className="sr-only">
                    {isWishlisted ? "Eltávolítás a kedvencekből" : "Kedvencekhez"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="size-5 shrink-0" />
                <span>Ingyenes szállítás 10 000 Ft felett</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="size-5 shrink-0" />
                <span>Frissesség garancia</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product story & details */}
      <section className="border-t border-border bg-surface">
        <div className="container max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <Tabs defaultValue="story" className="space-y-8">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="story">Történet</TabsTrigger>
              <TabsTrigger value="tasting">Ízjegyek</TabsTrigger>
              <TabsTrigger value="brewing">Elkészítés</TabsTrigger>
              <TabsTrigger value="details">Részletek</TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-stone max-w-3xl"
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                  A történet
                </h2>
                {product.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="tasting">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl"
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
                  Ízprofil
                </h2>
                <TastingNotes notes={product.tastingNotes} />
              </motion.div>
            </TabsContent>

            <TabsContent value="brewing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-stone max-w-3xl"
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                  Elkészítési javaslatok
                </h2>
                {product.brewingNotes.split("\n\n").map((paragraph, i) => {
                  const [title, ...rest] = paragraph.trim().split(": ")
                  return (
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {title.replace(/\*\*/g, "")}
                      </h3>
                      <p className="text-muted-foreground">{rest.join(": ")}</p>
                    </div>
                  )
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="details">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
                  Termék adatok
                </h2>
                <dl className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                  {[
                    { label: "Eredet", value: product.origin },
                    { label: "Régió", value: product.region },
                    { label: "Tengerszint", value: product.altitude },
                    { label: "Feldolgozás", value: product.process },
                    { label: "Pörkölés", value: product.roast },
                    { label: "Termelő", value: product.producer },
                    { label: "Betakarítás", value: product.harvest },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between py-3 border-b border-border"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="container max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
          Ajánlott mellé
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {crossSellProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-border bg-surface">
        <div className="container max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Értékelések
          </h2>
          <ProductReviews
            reviews={product.reviews}
            averageRating={product.rating}
            totalCount={product.reviewCount}
            ratingDistribution={product.ratingDistribution}
            canReview={isSignedIn}
            onSubmitReview={async () => {
              await new Promise((r) => setTimeout(r, 1000))
            }}
            onMarkHelpful={() => {}}
          />
        </div>
      </section>
    </main>
  )
}

// Loading skeleton
export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <section className="container max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1.2fr_1fr]">
          <ProductGallerySkeleton />
          
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-11 w-24" />
                <Skeleton className="h-11 w-32" />
                <Skeleton className="h-11 w-32" />
              </div>
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </section>
    </main>
  )
}
