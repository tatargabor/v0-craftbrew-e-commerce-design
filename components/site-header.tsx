'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  LogIn,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { SearchPalette } from '@/components/search-palette'

const NAV_LINKS = [
  { href: ROUTES.coffees, label: 'Kávék' },
  { href: ROUTES.equipment, label: 'Eszközök' },
  { href: ROUTES.merch, label: 'Merch' },
  { href: ROUTES.bundles, label: 'Csomagok' },
  { href: ROUTES.subscription, label: 'Előfizetés' },
  { href: ROUTES.stories, label: 'Sztorik' },
] as const

interface SiteHeaderProps {
  user?: {
    name: string
    email: string
    avatarUrl?: string
  } | null
  cartCount?: number
  wishlistCount?: number
  locale?: 'hu' | 'en'
  onLocaleChange?: (locale: 'hu' | 'en') => void
}

export function SiteHeader({
  user = null,
  cartCount = 0,
  wishlistCount = 0,
  locale = 'hu',
  onLocaleChange,
}: SiteHeaderProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [prevCartCount, setPrevCartCount] = React.useState(cartCount)
  const [cartBounce, setCartBounce] = React.useState(false)

  // Scroll detection for header styling
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cart bounce animation on item add
  React.useEffect(() => {
    if (cartCount > prevCartCount) {
      setCartBounce(true)
      const timeout = setTimeout(() => setCartBounce(false), 300)
      return () => clearTimeout(timeout)
    }
    setPrevCartCount(cartCount)
  }, [cartCount, prevCartCount])

  const displayCartCount = cartCount > 99 ? '99+' : cartCount

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link
              href={ROUTES.home}
              className="flex-shrink-0 transition-opacity hover:opacity-80"
            >
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                CraftBrew
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-4 -bottom-px h-0.5 bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Keresés"
              >
                <Search className="size-5" />
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLocaleChange?.(locale === 'hu' ? 'en' : 'hu')}
                className="hidden text-xs font-medium text-muted-foreground hover:text-foreground sm:flex"
              >
                {locale === 'hu' ? 'EN' : 'HU'}
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative hidden text-muted-foreground hover:text-foreground sm:flex"
              >
                <Link href={ROUTES.accountWishlist} aria-label="Kedvencek">
                  <Heart className="size-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Link href={ROUTES.cart} aria-label={`Kosár${cartCount > 0 ? ` (${displayCartCount} termék)` : ''}`}>
                  <motion.div
                    animate={cartBounce ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ShoppingBag className="size-5" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    {cartCount > 0 && (
                      <motion.span
                        key={displayCartCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                      >
                        {displayCartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>

              {/* User Menu / Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden sm:flex"
                      aria-label="Felhasználói menü"
                    >
                      <Avatar className="size-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.account}>
                        <User className="mr-2 size-4" />
                        Fiókom
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.orders}>
                        <ShoppingBag className="mr-2 size-4" />
                        Rendeléseim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.accountWishlist}>
                        <Heart className="mr-2 size-4" />
                        Kedvenceim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => {
                        // Handle logout
                      }}
                    >
                      Kijelentkezés
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden text-muted-foreground hover:text-foreground sm:flex"
                >
                  <Link href={ROUTES.login} aria-label="Bejelentkezés">
                    <LogIn className="size-5" />
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Menü"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm bg-background p-0">
                  <SheetHeader className="border-b p-6">
                    <SheetTitle className="font-serif text-2xl font-bold">
                      CraftBrew
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col p-6">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'py-3 text-lg font-medium transition-colors',
                            isActive
                              ? 'text-primary'
                              : 'text-foreground hover:text-primary'
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>
                  <Separator />
                  <div className="flex flex-col gap-4 p-6">
                    {/* Mobile User Section */}
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href={ROUTES.login} onClick={() => setMobileMenuOpen(false)}>
                          <LogIn className="mr-2 size-4" />
                          Bejelentkezés
                        </Link>
                      </Button>
                    )}

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={ROUTES.accountWishlist}>
                          <Heart className="mr-2 size-4" />
                          Kedvencek
                          {wishlistCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {wishlistCount}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onLocaleChange?.(locale === 'hu' ? 'en' : 'hu')
                        }}
                      >
                        {locale === 'hu' ? 'EN' : 'HU'}
                      </Button>
                    </div>

                    {user && (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                          <Link
                            href={ROUTES.account}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 text-sm hover:text-primary"
                          >
                            Fiókom
                          </Link>
                          <Link
                            href={ROUTES.orders}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 text-sm hover:text-primary"
                          >
                            Rendeléseim
                          </Link>
                          <button
                            onClick={() => {
                              // Handle logout
                              setMobileMenuOpen(false)
                            }}
                            className="py-2 text-left text-sm text-destructive hover:text-destructive/80"
                          >
                            Kijelentkezés
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Palette */}
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
