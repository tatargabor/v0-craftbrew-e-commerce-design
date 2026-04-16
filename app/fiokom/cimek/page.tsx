"use client"

import { useState } from "react"
import { Plus, MapPin, MoreHorizontal, Pencil, Trash2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const addresses = [
  {
    id: "1",
    name: "Kovács Anna",
    street: "Kazinczy utca 28.",
    city: "1075 Budapest",
    phone: "+36 30 123 4567",
    isDefault: true,
    zone: "Budapest",
  },
  {
    id: "2",
    name: "Kovács Anna",
    street: "Petőfi Sándor utca 12.",
    city: "2030 Érd",
    phone: "+36 30 123 4567",
    isDefault: false,
    zone: "+20km",
  },
]

export default function CimekPage() {
  const [addressList] = useState(addresses)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Címeim
          </h1>
          <p className="text-muted-foreground">
            Mentett szállítási címeid kezelése
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Új cím
        </Button>
      </div>

      <Separator />

      {/* Addresses Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {addressList.map((address) => (
          <Card key={address.id} className="relative group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.name}</p>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Alapértelmezett
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.street}</p>
                    <p className="text-sm text-muted-foreground">{address.city}</p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {address.zone}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Szerkesztés
                    </DropdownMenuItem>
                    {!address.isDefault && (
                      <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" />
                        Alapértelmezettnek
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Törlés
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
