'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Coffee, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/lib/routes'

// Empty bag illustration - product not found variant
function EmptyBagIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 md:h-56 md:w-56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow */}
      <ellipse
        cx="100"
        cy="175"
        rx="50"
        ry="8"
        className="fill-primary/10"
      />
      
      {/* Coffee bag body */}
      <path
        d="M55 60 L55 155 C55 160, 60 165, 65 165 L135 165 C140 165, 145 160, 145 155 L145 60 Z"
        className="fill-card stroke-primary/30"
        strokeWidth="2"
      />
      
      {/* Bag top fold */}
      <path
        d="M55 60 L65 45 L135 45 L145 60 Z"
        className="fill-primary/5 stroke-primary/30"
        strokeWidth="2"
      />
      
      {/* Bag crimp/seal */}
      <rect
        x="70"
        y="38"
        width="60"
        height="8"
        rx="2"
        className="fill-primary/20"
      />
      
      {/* Coffee bean logo (faded) */}
      <ellipse
        cx="100"
        cy="105"
        rx="25"
        ry="30"
        className="fill-primary/10"
        transform="rotate(-20 100 105)"
      />
      <path
        d="M95 85 Q100 105, 95 125"
        className="stroke-primary/15 fill-none"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* "Empty" indicator - crossed out */}
      <circle
        cx="100"
        cy="105"
        r="35"
        className="stroke-primary/20 fill-none"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      
      {/* Question marks */}
      <text
        x="60"
        y="140"
        className="fill-secondary/60 font-serif"
        fontSize="18"
      >
        ?
      </text>
      <text
        x="130"
        y="90"
        className="fill-secondary/60 font-serif"
        fontSize="14"
      >
        ?
      </text>
      
      {/* Magnifying glass searching */}
      <circle
        cx="155"
        cy="50"
        r="15"
        className="stroke-secondary fill-none"
        strokeWidth="2"
      />
      <path
        d="M166 61 L178 73"
        className="stroke-secondary"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ProductNotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/kereses?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <EmptyBagIllustration />
        </div>

        {/* Content */}
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Nem talaltuk a tereket
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ez a kave mar nem elerheto, vagy nem letezik.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Keress mas kavet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        {/* Primary CTA */}
        <div className="mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={ROUTES.coffees}>
              <Coffee className="mr-2 h-4 w-4" />
              Vissza a kavekhoz
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vissza az elozo oldalra
          </Button>
        </div>
      </div>
    </div>
  )
}
