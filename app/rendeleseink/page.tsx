"use client"

import Link from "next/link"
import { Package, ChevronRight, Truck, CheckCircle, Clock } from "lucide-react"
import { ROUTES } from "@/lib/routes"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Demo orders
const orders = [
  {
    id: "CB-20260412-003",
    date: "2026. április 12.",
    status: "delivering",
    statusLabel: "Kiszállítás alatt",
    total: "12 490 Ft",
    items: [
      {
        name: "Ethiopia Yirgacheffe",
        variant: "250g, Őrölt",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop",
      },
      {
        name: "Colombia Huila",
        variant: "500g, Szemes",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: "CB-20260328-012",
    date: "2026. március 28.",
    status: "delivered",
    statusLabel: "Kézbesítve",
    total: "8 970 Ft",
    items: [
      {
        name: "Brazil Santos",
        variant: "250g, Szemes",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: "CB-20260215-007",
    date: "2026. február 15.",
    status: "delivered",
    statusLabel: "Kézbesítve",
    total: "24 750 Ft",
    items: [
      {
        name: "Specialty Válogatás",
        variant: "3x250g csomag",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop",
      },
      {
        name: "Hario V60 Szett",
        variant: "Fehér, 02",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop",
      },
    ],
  },
]

const statusConfig = {
  pending: {
    icon: Clock,
    variant: "outline" as const,
    className: "text-muted-foreground",
  },
  delivering: {
    icon: Truck,
    variant: "secondary" as const,
    className: "text-amber-600",
  },
  delivered: {
    icon: CheckCircle,
    variant: "default" as const,
    className: "text-green-600",
  },
}

export default function RendeleseinkPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Rendeléseim
        </h1>
        <p className="text-muted-foreground">
          Korábbi rendeléseid és azok állapota
        </p>
      </div>

      <Separator />

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
          const StatusIcon = statusInfo.icon

          return (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 bg-muted/30">
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Rendelés
                      </p>
                      <p className="font-mono text-sm font-medium">{order.id}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8 hidden md:block" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Dátum
                      </p>
                      <p className="text-sm">{order.date}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8 hidden md:block" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Összeg
                      </p>
                      <p className="font-mono text-sm font-medium">{order.total}</p>
                    </div>
                  </div>
                  <Badge variant={statusInfo.variant} className="gap-1.5">
                    <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.className}`} />
                    {order.statusLabel}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6 space-y-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mennyiség: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between p-4 md:p-6 pt-0">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/rendeleseink/${order.id}`}>
                      Részletek
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      Újrarendelés
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State (hidden, for reference) */}
      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-medium mb-2">
            Még nincsenek rendeléseid
          </h3>
          <p className="text-muted-foreground mb-6">
            Fedezd fel kávéinkat és rendeld meg az első csomagod!
          </p>
          <Button asChild>
            <Link href={ROUTES.coffees}>Kávék böngészése</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
