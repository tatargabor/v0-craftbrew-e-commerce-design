"use client"

import * as React from "react"
import { ShoppingBag, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { CouponInput, GiftCardInput } from "@/components/coupon-input"
import { motion, AnimatePresence } from "framer-motion"

interface CartSummaryProps {
  subtotal: number
  discount?: number
  discountLabel?: string
  promoDiscount?: number
  promoLabel?: string
  giftCardAmount?: number
  shipping?: number | "calculate"
  total: number
  // Coupon state
  couponCode?: string
  couponDiscount?: number
  onApplyCoupon: (code: string) => Promise<{ success: boolean; discount?: number; message?: string }>
  onRemoveCoupon: () => void
  // Gift card state
  giftCardCode?: string
  giftCardBalance?: number
  giftCardApplied?: number
  onApplyGiftCard: (code: string) => Promise<{ success: boolean; balance?: number; amountApplied?: number; message?: string }>
  onRemoveGiftCard: () => void
  // User state
  isSignedIn: boolean
  onCheckout: () => void
  isCheckingOut?: boolean
  className?: string
}

export function CartSummary({
  subtotal,
  discount,
  discountLabel,
  promoDiscount,
  promoLabel,
  giftCardAmount,
  shipping,
  total,
  couponCode,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  giftCardCode,
  giftCardBalance,
  giftCardApplied,
  onApplyGiftCard,
  onRemoveGiftCard,
  isSignedIn,
  onCheckout,
  isCheckingOut,
  className,
}: CartSummaryProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Coupon & Gift Card Inputs */}
        <div className="space-y-4">
          <CouponInput
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            appliedCode={couponCode}
            appliedDiscount={couponDiscount}
          />
          
          <GiftCardInput
            onApply={onApplyGiftCard}
            onRemove={onRemoveGiftCard}
            appliedCode={giftCardCode}
            balance={giftCardBalance}
            amountApplied={giftCardApplied}
          />
        </div>

        <Separator />

        {/* Summary Lines */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Részösszeg</span>
            <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
          </div>

          <AnimatePresence>
            {discount && discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between text-sm overflow-hidden"
              >
                <span className="text-green-600">{discountLabel || "Kedvezmény"}</span>
                <span className="font-mono tabular-nums text-green-600">
                  −{formatPrice(discount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {promoDiscount && promoDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between text-sm overflow-hidden"
              >
                <span className="text-secondary flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  {promoLabel || "Promo nap kedvezmény"}
                </span>
                <span className="font-mono tabular-nums text-secondary">
                  −{formatPrice(promoDiscount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {giftCardAmount && giftCardAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-between text-sm overflow-hidden"
              >
                <span className="text-green-600">Ajándékkártya</span>
                <span className="font-mono tabular-nums text-green-600">
                  −{formatPrice(giftCardAmount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Szállítás</span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {shipping === "calculate" 
                ? "kalkuláció pénztárnál" 
                : shipping === 0 
                  ? "Ingyenes" 
                  : formatPrice(shipping || 0)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-medium text-foreground">Összesen</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-serif text-2xl font-semibold text-primary tabular-nums"
          >
            {formatPrice(total)}
          </motion.span>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={onCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Feldolgozás...
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" />
              {isSignedIn ? "Tovább a pénztárhoz" : "Bejelentkezés a fizetéshez"}
            </>
          )}
        </Button>

        {/* Free shipping threshold hint */}
        {subtotal < 15000 && (
          <p className="text-xs text-center text-muted-foreground">
            Még {formatPrice(15000 - subtotal)} a ingyenes szállításig
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function CartSummarySkeleton() {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Separator />
        <div className="flex justify-between items-baseline">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  )
}
