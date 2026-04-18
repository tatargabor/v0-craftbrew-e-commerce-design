"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, ArrowLeft, Coffee } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartItem, CartItemSkeleton } from "@/components/cart-item"
import { CartSummary, CartSummarySkeleton } from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { ROUTES } from "@/lib/routes"

// Demo cart items
const DEMO_CART_ITEMS = [
  {
    id: "1",
    name: "Ethiopia Yirgacheffe",
    variant: "Szemes, 500g",
    slug: "ethiopia-yirgacheffe",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
    price: 4990,
    quantity: 2,
  },
  {
    id: "2",
    name: "Colombia Supremo",
    variant: "Őrölt, 250g",
    slug: "colombia-supremo",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop",
    price: 3490,
    quantity: 1,
  },
  {
    id: "3",
    name: "Hario V60 Dripper",
    variant: "Kerámia, Fehér",
    slug: "hario-v60-dripper",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    price: 8990,
    quantity: 1,
  },
]

// Demo coupon codes
const VALID_COUPONS: Record<string, { discount: number; type: "fixed" | "percent"; firstOrderOnly?: boolean }> = {
  "WELCOME10": { discount: 10, type: "percent", firstOrderOnly: true },
  "KAVE500": { discount: 500, type: "fixed" },
  "SUMMER20": { discount: 20, type: "percent" },
}

// Demo gift cards
const VALID_GIFT_CARDS: Record<string, { balance: number; expired?: boolean }> = {
  "GIFT-ABCD-1234": { balance: 10000 },
  "GIFT-WXYZ-5678": { balance: 5000 },
  "GIFT-DEMO-0000": { balance: 0 },
  "GIFT-EXP-9999": { balance: 3000, expired: true },
}

export default function CartPage() {
  const router = useRouter()
  
  // Demo state
  const [demoState, setDemoState] = React.useState<"filled" | "empty" | "loading">("filled")
  const [isSignedIn, setIsSignedIn] = React.useState(true)
  const [isFirstOrder, setIsFirstOrder] = React.useState(false)
  const [hasPromoDay, setHasPromoDay] = React.useState(false)
  
  // Cart state
  const [items, setItems] = React.useState(DEMO_CART_ITEMS)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCheckingOut, setIsCheckingOut] = React.useState(false)
  
  // Coupon state
  const [couponCode, setCouponCode] = React.useState<string | undefined>()
  const [couponDiscount, setCouponDiscount] = React.useState<number | undefined>()
  
  // Gift card state
  const [giftCardCode, setGiftCardCode] = React.useState<string | undefined>()
  const [giftCardBalance, setGiftCardBalance] = React.useState<number | undefined>()
  const [giftCardApplied, setGiftCardApplied] = React.useState<number | undefined>()

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponDiscount || 0
  const promoDiscount = hasPromoDay ? Math.floor(subtotal * 0.05) : 0
  const giftCardAmount = giftCardApplied || 0
  const total = Math.max(0, subtotal - discount - promoDiscount - giftCardAmount)

  // Handlers
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const handleRemove = (id: string) => {
    const item = items.find(i => i.id === id)
    setItems(prev => prev.filter(item => item.id !== id))
    
    if (item) {
      toast.success(`${item.name} eltávolítva`, {
        action: {
          label: "Visszavonás",
          onClick: () => setItems(prev => [...prev, item]),
        },
      })
    }
  }

  const handleApplyCoupon = async (code: string): Promise<{ success: boolean; discount?: number; message?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const coupon = VALID_COUPONS[code]
    
    if (!coupon) {
      return { success: false, message: "Érvénytelen kód" }
    }
    
    if (coupon.firstOrderOnly && !isFirstOrder) {
      return { success: false, message: "Csak első rendelésnél érvényes" }
    }
    
    const discountAmount = coupon.type === "percent" 
      ? Math.floor(subtotal * (coupon.discount / 100))
      : coupon.discount
    
    setCouponCode(code)
    setCouponDiscount(discountAmount)
    
    toast.success(`Kupon beváltva: −${new Intl.NumberFormat("hu-HU").format(discountAmount)} Ft`)
    
    return { success: true, discount: discountAmount }
  }

  const handleRemoveCoupon = () => {
    setCouponCode(undefined)
    setCouponDiscount(undefined)
    toast.info("Kupon eltávolítva")
  }

  const handleApplyGiftCard = async (code: string): Promise<{ success: boolean; balance?: number; amountApplied?: number; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const giftCard = VALID_GIFT_CARDS[code]
    
    if (!giftCard) {
      return { success: false, message: "Érvénytelen ajándékkártya" }
    }
    
    if (giftCard.expired) {
      return { success: false, message: "Lejárt ajándékkártya" }
    }
    
    if (giftCard.balance === 0) {
      return { success: false, message: "Az ajándékkártya egyenlege elfogyott" }
    }
    
    const remainingTotal = subtotal - (couponDiscount || 0) - promoDiscount
    const amountToApply = Math.min(giftCard.balance, remainingTotal)
    
    setGiftCardCode(code)
    setGiftCardBalance(giftCard.balance)
    setGiftCardApplied(amountToApply)
    
    toast.success(`Ajándékkártya beváltva: −${new Intl.NumberFormat("hu-HU").format(amountToApply)} Ft`)
    
    return { success: true, balance: giftCard.balance, amountApplied: amountToApply }
  }

  const handleRemoveGiftCard = () => {
    setGiftCardCode(undefined)
    setGiftCardBalance(undefined)
    setGiftCardApplied(undefined)
    toast.info("Ajándékkártya eltávolítva")
  }

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/bejelentkezes?redirect=/kosar")
      return
    }
    
    setIsCheckingOut(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success("Átirányítás a pénztárhoz...")
    // router.push("/penztar")
    setIsCheckingOut(false)
  }

  // Demo state handlers
  const handleDemoStateChange = (state: "filled" | "empty" | "loading") => {
    setDemoState(state)
    if (state === "empty") {
      setItems([])
    } else if (state === "filled") {
      setItems(DEMO_CART_ITEMS)
    } else if (state === "loading") {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 2000)
    }
  }

  const displayItems = demoState === "empty" ? [] : items
  const showLoading = demoState === "loading" || isLoading

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader cartCount={displayItems.reduce((sum, item) => sum + item.quantity, 0)} />
      
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href={ROUTES.coffees}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="size-4" />
              Vissza a vásárláshoz
            </Link>
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Kosár
            </h1>
          </div>

          {/* Demo Controls */}
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-dashed border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Demo vezérlők</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <Button
                  variant={demoState === "filled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoStateChange("filled")}
                >
                  Teli kosár
                </Button>
                <Button
                  variant={demoState === "empty" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoStateChange("empty")}
                >
                  Üres kosár
                </Button>
                <Button
                  variant={demoState === "loading" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoStateChange("loading")}
                >
                  Betöltés
                </Button>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex gap-2">
                <Button
                  variant={isSignedIn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSignedIn(!isSignedIn)}
                >
                  {isSignedIn ? "Bejelentkezve" : "Kijelentkezve"}
                </Button>
                <Button
                  variant={isFirstOrder ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsFirstOrder(!isFirstOrder)}
                >
                  {isFirstOrder ? "Első rendelés" : "Visszatérő"}
                </Button>
                <Button
                  variant={hasPromoDay ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasPromoDay(!hasPromoDay)}
                >
                  {hasPromoDay ? "Promo nap" : "Normál nap"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Teszt kuponok: WELCOME10 (első rendelés), KAVE500, SUMMER20 | Teszt ajándékkártyák: GIFT-ABCD-1234, GIFT-WXYZ-5678
            </p>
          </div>

          {/* Content */}
          {showLoading ? (
            <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-12">
              <div className="space-y-0">
                {[...Array(3)].map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </div>
              <CartSummarySkeleton />
            </div>
          ) : displayItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-12">
              {/* Items List */}
              <div>
                <AnimatePresence mode="popLayout">
                  {displayItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary Sidebar - Desktop */}
              <div className="hidden lg:block">
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  discountLabel={couponCode ? `Kupon: ${couponCode}` : undefined}
                  promoDiscount={promoDiscount}
                  promoLabel="Promo nap kedvezmény"
                  giftCardAmount={giftCardAmount}
                  shipping="calculate"
                  total={total}
                  couponCode={couponCode}
                  couponDiscount={couponDiscount}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  giftCardCode={giftCardCode}
                  giftCardBalance={giftCardBalance}
                  giftCardApplied={giftCardApplied}
                  onApplyGiftCard={handleApplyGiftCard}
                  onRemoveGiftCard={handleRemoveGiftCard}
                  isSignedIn={isSignedIn}
                  onCheckout={handleCheckout}
                  isCheckingOut={isCheckingOut}
                />
              </div>

              {/* Summary - Mobile (stacked) */}
              <div className="lg:hidden">
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  discountLabel={couponCode ? `Kupon: ${couponCode}` : undefined}
                  promoDiscount={promoDiscount}
                  promoLabel="Promo nap kedvezmény"
                  giftCardAmount={giftCardAmount}
                  shipping="calculate"
                  total={total}
                  couponCode={couponCode}
                  couponDiscount={couponDiscount}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  giftCardCode={giftCardCode}
                  giftCardBalance={giftCardBalance}
                  giftCardApplied={giftCardApplied}
                  onApplyGiftCard={handleApplyGiftCard}
                  onRemoveGiftCard={handleRemoveGiftCard}
                  isSignedIn={isSignedIn}
                  onCheckout={handleCheckout}
                  isCheckingOut={isCheckingOut}
                  className="static"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile CTA */}
        {!showLoading && displayItems.length > 0 && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Összesen</p>
                <p className="font-serif text-xl font-semibold text-primary tabular-nums">
                  {new Intl.NumberFormat("hu-HU").format(total)} Ft
                </p>
              </div>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                <ShoppingBag className="size-4" />
                {isSignedIn ? "Pénztár" : "Bejelentkezés"}
              </Button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter className={displayItems.length > 0 ? "pb-24 lg:pb-0" : ""} />
      <Toaster position="bottom-right" />
    </div>
  )
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Branded illustration */}
      <div className="relative mb-8">
        <div className="size-32 rounded-full bg-muted flex items-center justify-center">
          <Coffee className="size-14 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-secondary/20 flex items-center justify-center">
          <ShoppingBag className="size-6 text-secondary" />
        </div>
      </div>

      <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
        A kosarad üres
      </h2>
      <p className="text-muted-foreground max-w-sm mb-8 text-balance">
        Úgy tűnik, még nem találtad meg a tökéletes kávét. Nézz körül a kínálatunkban!
      </p>

      <Button asChild size="lg">
        <Link href={ROUTES.coffees}>
          Vásárlás folytatása
        </Link>
      </Button>
    </motion.div>
  )
}
