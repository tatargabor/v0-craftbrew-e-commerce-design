'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Coffee,
  Package,
  Shirt,
  Gift,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Star,
  Search,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  DEFAULT_SEARCH_PRODUCTS,
  DEFAULT_SEARCH_STORIES,
  type SearchProduct,
  type SearchStory,
} from '@/lib/search-fixtures'
import { Badge } from '@/components/ui/badge'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const QUICK_LINKS = [
  { icon: Coffee, label: 'Kávék', href: '/kavek', description: 'Specialty kávék' },
  { icon: Package, label: 'Eszközök', href: '/eszkozok', description: 'Kávékészítő eszközök' },
  { icon: Shirt, label: 'Merch', href: '/merch', description: 'Ruházat és kiegészítők' },
  { icon: Gift, label: 'Csomagok', href: '/csomagok', description: 'Ajándék összeállítások' },
  { icon: RefreshCw, label: 'Előfizetés', href: '/hu/elofizetes/uj', description: 'Rendszeres kávészállítás' },
  { icon: BookOpen, label: 'Sztorik', href: '/sztorik', description: 'Blog és történetek' },
]

function formatPrice(price: number): string {
  return price.toLocaleString('hu-HU').replace(/,/g, ' ') + ' Ft'
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-secondary/30 text-foreground rounded-sm">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

interface SearchPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Search results for products. When omitted, the component falls back to
   * `DEFAULT_SEARCH_PRODUCTS` (design-time fixtures from `lib/search-fixtures`).
   * Production callers pass real results fetched from `/api/search`.
   */
  products?: SearchProduct[]
  /**
   * Search results for stories. When omitted, falls back to
   * `DEFAULT_SEARCH_STORIES`. Production callers pass real results.
   */
  stories?: SearchStory[]
}

export function SearchPalette({
  open,
  onOpenChange,
  products = DEFAULT_SEARCH_PRODUCTS,
  stories = DEFAULT_SEARCH_STORIES,
}: SearchPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleSelect = (href: string) => {
    onOpenChange(false)
    setQuery('')
    router.push(href)
  }

  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.origin.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  const filteredStories = query
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : []

  const hasResults = filteredProducts.length > 0 || filteredStories.length > 0

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Keresés"
      description="Keress termékeket, kategóriákat vagy tartalmakat"
    >
      <CommandInput
        placeholder="Keress termékeket, sztorikat..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>
          <div className="py-8 text-center">
            <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nincs találat &apos;{query}&apos;-re
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Próbáld meg: kávé, espresso, drip
            </p>
          </div>
        </CommandEmpty>

        {/* Search Results - Products */}
        {filteredProducts.length > 0 && (
          <CommandGroup heading="Termékek">
            {filteredProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => handleSelect(product.href)}
                className="cursor-pointer py-3"
              >
                <div className="relative size-10 rounded-md overflow-hidden bg-muted mr-3 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {highlightMatch(product.name, query)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{product.origin}</span>
                    <span>·</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="size-3 fill-secondary text-secondary" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {formatPrice(product.price)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Search Results - Stories */}
        {filteredStories.length > 0 && (
          <>
            {filteredProducts.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Sztorik">
              {filteredStories.map((story) => (
                <CommandItem
                  key={story.id}
                  value={story.title}
                  onSelect={() => handleSelect(story.href)}
                  className="cursor-pointer py-3"
                >
                  <div className="relative size-10 rounded-md overflow-hidden bg-muted mr-3 flex-shrink-0">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {highlightMatch(story.title, query)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {story.category}
                      </Badge>
                      <span>{story.readTime}</span>
                    </div>
                  </div>
                  <BookOpen className="size-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* View All Results */}
        {hasResults && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSelect(`/kereses?q=${encodeURIComponent(query)}`)}
                className="cursor-pointer justify-center text-primary"
              >
                <span className="font-medium">Összes találat megtekintése</span>
                <ArrowRight className="size-4 ml-1.5" />
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Quick Links - when no query */}
        {!query && (
          <>
            <CommandGroup heading="Gyors navigáció">
              {QUICK_LINKS.map((link) => (
                <CommandItem
                  key={link.href}
                  value={link.label}
                  onSelect={() => handleSelect(link.href)}
                  className="cursor-pointer"
                >
                  <div className={cn(
                    "size-8 rounded-md flex items-center justify-center mr-3",
                    "bg-primary/10 text-primary"
                  )}>
                    <link.icon className="size-4" />
                  </div>
                  <span className="flex-1">{link.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {link.description}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tippek">
              <CommandItem disabled className="opacity-60">
                <span className="text-xs">
                  Nyomd meg a{' '}
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>{' '}
                  billentyűkombinációt a gyors kereséshez
                </span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
