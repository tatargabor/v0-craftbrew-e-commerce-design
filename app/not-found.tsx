'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Home, Coffee, BookOpen, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/lib/routes'

// Empty cup illustration - branded, editorial feel
function EmptyCupIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 md:h-64 md:w-64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Saucer */}
      <ellipse
        cx="100"
        cy="170"
        rx="70"
        ry="12"
        className="fill-primary/10"
      />
      <ellipse
        cx="100"
        cy="168"
        rx="60"
        ry="10"
        className="fill-primary/5"
      />
      
      {/* Cup body */}
      <path
        d="M50 80 C50 80, 45 150, 70 160 L130 160 C155 150, 150 80, 150 80 Z"
        className="fill-card stroke-primary/30"
        strokeWidth="2"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="100"
        cy="80"
        rx="50"
        ry="12"
        className="fill-card stroke-primary/30"
        strokeWidth="2"
      />
      
      {/* Inner rim shadow */}
      <ellipse
        cx="100"
        cy="82"
        rx="42"
        ry="8"
        className="fill-primary/5"
      />
      
      {/* Handle */}
      <path
        d="M150 95 C170 95, 175 120, 170 135 C165 150, 155 150, 150 145"
        className="stroke-primary/30 fill-none"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Empty cup interior - subtle sad face */}
      <circle
        cx="85"
        cy="105"
        r="4"
        className="fill-primary/20"
      />
      <circle
        cx="115"
        cy="105"
        r="4"
        className="fill-primary/20"
      />
      <path
        d="M85 125 Q100 118, 115 125"
        className="stroke-primary/20 fill-none"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Steam lines (faded - no coffee) */}
      <path
        d="M80 55 Q85 45, 80 35"
        className="stroke-primary/10 fill-none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M100 50 Q105 38, 100 28"
        className="stroke-primary/10 fill-none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 55 Q125 45, 120 35"
        className="stroke-primary/10 fill-none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Question mark floating */}
      <text
        x="160"
        y="50"
        className="fill-secondary text-2xl font-serif"
        fontSize="32"
      >
        ?
      </text>
    </svg>
  )
}

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/kereses?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <EmptyCupIllustration />
        </div>

        {/* Content */}
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Hoppa! Ez az oldal nem talalhato.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A keresett oldal nem letezik vagy atkoltozott.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Kereses a weboldalon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        {/* Primary CTA */}
        <div className="mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Vissza a fooldalra
            </Link>
          </Button>
        </div>

        {/* Secondary links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.coffees}>
              <Coffee className="mr-2 h-4 w-4" />
              Kavek
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.stories}>
              <BookOpen className="mr-2 h-4 w-4" />
              Sztorik
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="mailto:hello@craftbrew.hu">
              <Mail className="mr-2 h-4 w-4" />
              Kapcsolat
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
