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

// Mock search results
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Ethiopia Yirgacheffe',
    origin: 'Etiópia',
    price: 4990,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&h=80&fit=crop',
    rating: 4.8,
    href: '/kavek/ethiopia-yirgacheffe',
  },
  {
    id: '2',
    name: 'Colombia Huila',
    origin: 'Kolumbia',
    price: 3990,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop',
    rating: 4.6,
    href: '/kavek/colombia-huila',
  },
  {
    id: '3',
    name: 'Kenya AA',
    origin: 'Kenya',
    price: 5490,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop',
    rating: 4.9,
    href: '/kavek/kenya-aa',
  },
  {
    id: '4',
    name: 'Chemex 6 csészés',
    origin: 'Eszközök',
    price: 18990,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
    rating: 4.9,
    href: '/eszkozok/chemex-6',
  },
  {
    id: '5',
    name: 'V60 Pour Over szett',
    origin: 'Eszközök',
    price: 12990,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=80&h=80&fit=crop',
    rating: 4.7,
    href: '/eszkozok/v60-szett',
  },
  {
    id: '6',
    name: 'CraftBrew póló',
    origin: 'Merch',
    price: 7990,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop',
    rating: 4.5,
    href: '/merch/craftbrew-polo',
  },
  {
    id: '7',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    price: 4290,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop',
    rating: 4.5,
    href: '/kavek/guatemala-antigua',
  },
]

const MOCK_STORIES = [
  {
    id: '1',
    title: 'A kávé útja a cserjétől a csészéig',
    category: 'Tudástár',
    readTime: '8 perc',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=80&h=80&fit=crop',
    href: '/sztorik/kave-utja',
  },
  {
    id: '2',
    title: 'Pour over technikák haladóknak',
    category: 'Elkészítés',
    readTime: '6 perc',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop',
    href: '/sztorik/pour-over-technikak',
  },
  {
    id: '3',
    title: 'Etióp kávéfarmok története',
    category: 'Eredet',
    readTime: '10 perc',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&h=80&fit=crop',
    href: '/sztorik/etiop-kavefarmok',
  },
  {
    id: '4',
    title: 'Cold brew készítése otthon',
    category: 'Elkészítés',
    readTime: '5 perc',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop',
    href: '/sztorik/cold-brew-otthon',
  },
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
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
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
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.origin.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  const filteredStories = query
    ? MOCK_STORIES.filter(
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
