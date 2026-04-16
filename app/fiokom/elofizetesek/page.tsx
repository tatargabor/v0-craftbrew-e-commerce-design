"use client"

import Link from "next/link"
import { RefreshCw, Calendar, Package, Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const subscriptions = [
  {
    id: "sub-001",
    name: "Ethiopia Yirgacheffe",
    variant: "250g, Őrölt",
    frequency: "2 hetente",
    nextDelivery: "2026. április 26.",
    price: "3 490 Ft",
    status: "active",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop",
  },
]

export default function ElofizetesekPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Előfizetéseim
        </h1>
        <p className="text-muted-foreground">
          Aktív előfizetéseid és azok kezelése
        </p>
      </div>

      <Separator />

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{sub.name}</h3>
                      <Badge variant="default" className="bg-green-600">
                        Aktív
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.variant}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-4 w-4" />
                        {sub.frequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Következő: {sub.nextDelivery}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <p className="font-mono text-lg font-medium">{sub.price}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Pause className="mr-1 h-4 w-4" />
                      Szüneteltetés
                    </Button>
                    <Button variant="ghost" size="sm">
                      Részletek
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upsell */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Új előfizetés indítása</h3>
                <p className="text-sm text-muted-foreground">
                  Kapj 10% kedvezményt minden előfizetéses rendelésnél
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/kavek">Kávék böngészése</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
