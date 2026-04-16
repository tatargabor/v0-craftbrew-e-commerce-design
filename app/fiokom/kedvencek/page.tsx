"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const wishlistItems = [
  {
    id: "1",
    name: "Ethiopia Yirgacheffe",
    origin: "Etiópia",
    price: "3 490 Ft",
    inStock: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop",
    slug: "ethiopia-yirgacheffe",
  },
  {
    id: "2",
    name: "Colombia Huila",
    origin: "Kolumbia",
    price: "3 290 Ft",
    inStock: true,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
    slug: "colombia-huila",
  },
  {
    id: "3",
    name: "Kenya AA",
    origin: "Kenya",
    price: "4 190 Ft",
    inStock: false,
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=200&h=200&fit=crop",
    slug: "kenya-aa",
  },
  {
    id: "4",
    name: "Brazil Santos",
    origin: "Brazília",
    price: "2 990 Ft",
    inStock: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop",
    slug: "brazil-santos",
  },
]

export default function KedvencekPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Kedvenceim
        </h1>
        <p className="text-muted-foreground">
          {wishlistItems.length} termék a kedvenceid között
        </p>
      </div>

      <Separator />

      {/* Wishlist Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Image */}
                <Link 
                  href={`/kavek/${item.slug}`}
                  className="relative h-32 w-32 flex-shrink-0 overflow-hidden bg-muted"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="secondary">Elfogyott</Badge>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.origin}
                    </p>
                    <Link 
                      href={`/kavek/${item.slug}`}
                      className="font-serif text-lg font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-mono text-sm mt-1">{item.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    {item.inStock ? (
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Kosárba
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        Nincs készleten
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (hidden, for reference) */}
      {wishlistItems.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-medium mb-2">
            Még nincsenek kedvenceid
          </h3>
          <p className="text-muted-foreground mb-6">
            Mentsd el kedvenc kávéidat a szív ikonra kattintva
          </p>
          <Button asChild>
            <Link href="/kavek">Kávék böngészése</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
