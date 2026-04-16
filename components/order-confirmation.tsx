"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Package, MapPin, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

interface OrderItem {
  id: string
  name: string
  variant?: string
  quantity: number
  price: number
  image: string
}

interface OrderAddress {
  name: string
  line1: string
  line2?: string
  city: string
  postalCode: string
}

interface OrderConfirmationProps {
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  discount?: number
  shipping: number
  total: number
  shippingAddress?: OrderAddress
  isPickup?: boolean
  estimatedDelivery?: string
  className?: string
}

export function OrderConfirmation({
  orderNumber,
  items,
  subtotal,
  discount,
  shipping,
  total,
  shippingAddress,
  isPickup,
  estimatedDelivery,
  className,
}: OrderConfirmationProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className="size-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="size-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
          Köszönjük a rendelést!
        </h1>
        <p className="text-muted-foreground mb-4">
          Visszaigazolást küldtünk az email címedre.
        </p>
        <p className="font-mono text-lg font-medium text-primary">
          {orderNumber}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Order Items */}
            <div>
              <h2 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Package className="size-4" />
                Rendelés összesítő
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="size-16 rounded-lg bg-muted overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} db
                      </p>
                    </div>
                    <div className="font-mono text-sm tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Részösszeg</span>
                <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              {discount && discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Kedvezmény</span>
                  <span className="font-mono tabular-nums text-green-600">
                    −{formatPrice(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Szállítás</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? "Ingyenes" : formatPrice(shipping)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Összesen</span>
                <span className="font-mono tabular-nums text-lg text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Shipping / Pickup Info */}
            <div>
              <h2 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <MapPin className="size-4" />
                {isPickup ? "Személyes átvétel" : "Szállítási cím"}
              </h2>
              {isPickup ? (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">CraftBrew Labor</p>
                  <p>Kazinczy u. 28, 1075 Budapest</p>
                  <p>H–P 7:00–18:00, Szo 8:00–14:00</p>
                </div>
              ) : shippingAddress ? (
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{shippingAddress.name}</p>
                  <p>{shippingAddress.line1}</p>
                  {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                  <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                </div>
              ) : null}
              
              {estimatedDelivery && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Várható kézbesítés: </span>
                  <span className="font-medium text-foreground">{estimatedDelivery}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 mt-6"
      >
        <Button asChild className="flex-1">
          <Link href="/fiok/rendelesek">
            Rendeléseim
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/kavek">
            Tovább vásárolok
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
