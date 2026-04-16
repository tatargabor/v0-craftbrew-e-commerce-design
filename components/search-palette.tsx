'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Coffee,
  Package,
  Shirt,
  Gift,
  RefreshCw,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

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
  { icon: RefreshCw, label: 'Előfizetés', href: '/elofizetes', description: 'Rendszeres kávészállítás' },
  { icon: BookOpen, label: 'Sztorik', href: '/sztorik', description: 'Blog és történetek' },
]

// Mock search results — replace with real search
const MOCK_PRODUCTS = [
  { id: '1', name: 'Ethiopia Yirgacheffe', category: 'Kávék', href: '/kavek/ethiopia-yirgacheffe' },
  { id: '2', name: 'Colombia Huila', category: 'Kávék', href: '/kavek/colombia-huila' },
  { id: '3', name: 'Chemex 6 csészés', category: 'Eszközök', href: '/eszkozok/chemex-6' },
  { id: '4', name: 'V60 Pour Over szett', category: 'Eszközök', href: '/eszkozok/v60-szett' },
  { id: '5', name: 'CraftBrew póló', category: 'Merch', href: '/merch/polo' },
]

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
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Keresés"
      description="Keress termékeket, kategóriákat vagy tartalmakat"
    >
      <CommandInput
        placeholder="Keress termékeket, kategóriákat..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nincs találat a keresésre.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Próbálj más kulcsszavakat.
            </p>
          </div>
        </CommandEmpty>

        {/* Search Results */}
        {filteredProducts.length > 0 && (
          <CommandGroup heading="Termékek">
            {filteredProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => handleSelect(product.href)}
                className="cursor-pointer"
              >
                <Coffee className="mr-2 size-4 text-primary" />
                <span className="flex-1">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.category}
                </span>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => handleSelect(`/kereses?q=${encodeURIComponent(query)}`)}
              className="cursor-pointer"
            >
              <ArrowRight className="mr-2 size-4" />
              <span>
                Összes találat: <strong>{`"${query}"`}</strong>
              </span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Quick Links */}
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
                  <link.icon className="mr-2 size-4 text-primary" />
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
