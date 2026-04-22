'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Coffee, Package, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Demo users for state showcase
const DEMO_USER = {
  name: 'Kovács Anna',
  email: 'anna.kovacs@example.com',
  avatarUrl: undefined,
}

export default function DemoPage() {
  const [isSignedIn, setIsSignedIn] = React.useState(false)
  const [cartCount, setCartCount] = React.useState(0)
  const [wishlistCount, setWishlistCount] = React.useState(2)
  const [locale, setLocale] = React.useState<'hu' | 'en'>('hu')

  return (
    <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 to-background">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block text-sm font-medium tracking-wide text-secondary"
              >
                Specialty kávé, kézműves gondossággal
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 font-serif text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              >
                Minden csésze{' '}
                <span className="text-primary">egy történet</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                Frissen pörkölt specialty kávék a világ legjobb termőterületeiről. 
                Fedezd fel az ízek végtelen világát.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Coffee className="mr-2 size-5" />
                  Kávék felfedezése
                </Button>
                <Button variant="outline" size="lg">
                  <Package className="mr-2 size-5" />
                  Előfizetés
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* State Demo Section */}
        <section className="border-t bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Komponens állapotok demonstrációja
              </h2>
              <p className="mt-2 text-muted-foreground">
                Interaktív vezérlők a header különböző állapotainak teszteléséhez
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Auth State */}
              <div className="rounded-lg border bg-background p-6">
                <h3 className="flex items-center gap-2 font-medium">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </span>
                  Felhasználói állapot
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Váltás bejelentkezett és vendég állapot között
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Badge variant={isSignedIn ? 'default' : 'outline'}>
                    {isSignedIn ? 'Bejelentkezve' : 'Vendég'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSignedIn(!isSignedIn)}
                  >
                    {isSignedIn ? 'Kijelentkezés' : 'Bejelentkezés'}
                  </Button>
                </div>
              </div>

              {/* Cart State */}
              <div className="rounded-lg border bg-background p-6">
                <h3 className="flex items-center gap-2 font-medium">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </span>
                  Kosár állapot
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Termékek hozzáadása/eltávolítása (badge animáció)
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-md border px-3 py-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setCartCount(Math.max(0, cartCount - 1))}
                      disabled={cartCount === 0}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center font-mono text-sm">
                      {cartCount}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setCartCount(cartCount + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCartCount(100)}
                  >
                    99+ teszt
                  </Button>
                </div>
              </div>

              {/* Language State */}
              <div className="rounded-lg border bg-background p-6">
                <h3 className="flex items-center gap-2 font-medium">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </span>
                  Nyelv
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nyelvválasztás (HU/EN)
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Badge variant={locale === 'hu' ? 'default' : 'outline'}>
                    Magyar
                  </Badge>
                  <Badge variant={locale === 'en' ? 'default' : 'outline'}>
                    English
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Instructions */}
            <div className="rounded-lg border border-dashed p-6">
              <h3 className="flex items-center gap-2 font-medium text-foreground">
                <ShoppingBag className="size-5 text-primary" />
                Tesztelési útmutató
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>Keresés:</strong> Kattints a nagyító ikonra vagy nyomd meg a <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd> billentyűkombinációt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>Mobil menü:</strong> Méretezd át a böngészőt vagy használj fejlesztői eszközöket
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>Kosár badge:</strong> A &quot;+&quot; gombbal adj hozzá terméket és figyeld az animációt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>
                    <strong>Görgetés:</strong> Görgess le és figyeld a header háttérváltozását
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Spacer for scroll testing */}
        <section className="bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              Görgesd az oldalt a header viselkedésének teszteléséhez
            </p>
          </div>
        </section>
    </div>
  )
}
