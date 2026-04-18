"use client"

import Link from "next/link"
import { ArrowRight, Package, Heart, MapPin, User, Edit } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/lib/routes"

// Demo data
const userData = {
  name: "Kovács Anna",
  email: "anna.kovacs@email.hu",
}

const defaultAddress = {
  name: "Kovács Anna",
  street: "Kazinczy utca 28.",
  city: "1075 Budapest",
}

const lastOrder = {
  id: "CB-20260412-003",
  status: "Kiszállítás alatt",
  statusVariant: "secondary" as const,
}

const wishlistData = {
  count: 7,
  thumbnails: [
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=100&h=100&fit=crop",
  ],
}

export default function FiokomPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Fiókom
        </h1>
        <p className="text-lg text-muted-foreground">
          Üdv újra, <span className="text-foreground font-medium">{userData.name}</span>!
        </p>
      </div>

      <Separator />

      {/* Summary Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Adataim Card */}
        <Card className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Adataim</CardTitle>
              </div>
              <Link 
                href={ROUTES.account} 
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Szerkesztés</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium text-foreground">{userData.name}</p>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </CardContent>
        </Card>

        {/* Címeim Card */}
        <Card className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Címeim</CardTitle>
              </div>
              <Link 
                href={ROUTES.accountAddresses} 
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group-hover:translate-x-0.5"
              >
                <span>Mind</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium text-foreground">{defaultAddress.name}</p>
            <p className="text-sm text-muted-foreground">{defaultAddress.street}</p>
            <p className="text-sm text-muted-foreground">{defaultAddress.city}</p>
          </CardContent>
        </Card>

        {/* Rendeléseim Card */}
        <Card className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Rendeléseim</CardTitle>
              </div>
              <Link 
                href={ROUTES.orders} 
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group-hover:translate-x-0.5"
              >
                <span>Mind</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Utolsó rendelés</p>
                <p className="font-mono text-sm text-foreground">{lastOrder.id}</p>
              </div>
              <Badge variant={lastOrder.statusVariant} className="font-normal">
                {lastOrder.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Kedvenceim Card */}
        <Card className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium">Kedvenceim</CardTitle>
              </div>
              <Link 
                href={ROUTES.accountWishlist} 
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group-hover:translate-x-0.5"
              >
                <span>Mind</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {wishlistData.thumbnails.map((src, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background overflow-hidden"
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {wishlistData.count > 3 && (
                  <span className="ml-3 text-sm text-muted-foreground">
                    +{wishlistData.count - 3} további
                  </span>
                )}
              </div>
              <span className="text-2xl font-serif font-medium text-foreground">
                {wishlistData.count}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
