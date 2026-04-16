"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
}

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  sections: Section[]
  children: React.ReactNode
  pdfUrl?: string
}

export function LegalPageLayout({
  title,
  lastUpdated,
  sections,
  children,
  pdfUrl = "#",
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Find active section based on scroll position
      const sectionElements = sections.map((s) => document.getElementById(s.id))
      const scrollPosition = window.scrollY + 120

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.offsetTop - offset
      window.scrollTo({ top: elementPosition, behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            CraftBrew
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex gap-12">
          {/* Sticky Table of Contents - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Tartalomjegyzék
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-[720px]">
            {/* Title */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Utolsó frissítés: {lastUpdated}
              </p>
            </div>

            <Separator className="mb-8" />

            {/* Content */}
            <div className="prose prose-stone max-w-none">
              {children}
            </div>

            <Separator className="my-8" />

            {/* Download PDF */}
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <a href={pdfUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Letöltés PDF
                </a>
              </Button>
            </div>
          </main>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300",
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Vissza a tetejére"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  )
}
