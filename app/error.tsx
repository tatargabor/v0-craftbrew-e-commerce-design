'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, Mail, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Cracked cup illustration - branded, editorial feel
function CrackedCupIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 md:h-64 md:w-64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spilled coffee puddle */}
      <ellipse
        cx="65"
        cy="175"
        rx="45"
        ry="8"
        className="fill-primary/20"
      />
      <ellipse
        cx="70"
        cy="173"
        rx="35"
        ry="6"
        className="fill-primary/15"
      />
      
      {/* Saucer (tilted) */}
      <ellipse
        cx="115"
        cy="168"
        rx="55"
        ry="10"
        className="fill-primary/10"
        transform="rotate(-5 115 168)"
      />
      
      {/* Cup body (tilted, cracked) */}
      <path
        d="M70 85 C70 85, 62 145, 85 158 L140 155 C162 142, 158 82, 158 82 Z"
        className="fill-card stroke-primary/30"
        strokeWidth="2"
        transform="rotate(-8 114 120)"
      />
      
      {/* Crack lines */}
      <path
        d="M95 90 L88 115 L100 130 L92 155"
        className="stroke-destructive/60 fill-none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M88 115 L78 120"
        className="stroke-destructive/40 fill-none"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 130 L108 138"
        className="stroke-destructive/40 fill-none"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Cup rim */}
      <ellipse
        cx="114"
        cy="82"
        rx="45"
        ry="11"
        className="fill-card stroke-primary/30"
        strokeWidth="2"
        transform="rotate(-8 114 82)"
      />
      
      {/* Handle (broken piece nearby) */}
      <path
        d="M155 92 C172 95, 175 115, 168 128"
        className="stroke-primary/30 fill-none"
        strokeWidth="7"
        strokeLinecap="round"
        transform="rotate(-8 160 110)"
      />
      
      {/* Broken handle piece on ground */}
      <path
        d="M160 160 C165 155, 170 158, 168 165"
        className="stroke-primary/30 fill-none"
        strokeWidth="5"
        strokeLinecap="round"
      />
      
      {/* Coffee drips */}
      <circle cx="55" cy="140" r="3" className="fill-primary/30" />
      <circle cx="48" cy="155" r="4" className="fill-primary/25" />
      <circle cx="62" cy="150" r="2" className="fill-primary/35" />
      
      {/* Sad steam (drooping) */}
      <path
        d="M100 60 Q95 50, 100 45 Q95 40, 98 30"
        className="stroke-primary/15 fill-none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Exclamation mark */}
      <text
        x="165"
        y="45"
        className="fill-destructive text-2xl font-serif"
        fontSize="28"
      >
        !
      </text>
    </svg>
  )
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <CrackedCupIllustration />
        </div>

        {/* Content */}
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Valami hiba tortent.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Probald ujra kesobb, vagy lepj kapcsolatba velunk.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground/60">
            Hibakod: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="outline" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Probald ujra
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Fooldal
            </Link>
          </Button>
        </div>

        {/* Contact link */}
        <div className="mt-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="mailto:hello@craftbrew.hu">
              <Mail className="mr-2 h-4 w-4" />
              hello@craftbrew.hu
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
