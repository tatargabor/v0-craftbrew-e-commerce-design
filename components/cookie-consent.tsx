"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { X, Cookie, Lock } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = "craftbrew-cookie-consent"

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

const cookieCategories = [
  {
    key: "necessary" as const,
    label: "Szükséges",
    description:
      "Ezek a sütik elengedhetetlenek a weboldal működéséhez. Nem kapcsolhatók ki.",
    locked: true,
  },
  {
    key: "functional" as const,
    label: "Funkcionális",
    description:
      "Ezek a sütik lehetővé teszik a továbbfejlesztett funkciókat és személyre szabást.",
    locked: false,
  },
  {
    key: "analytics" as const,
    label: "Analitika",
    description:
      "Ezek a sütik segítenek megérteni, hogyan használják a látogatók a weboldalt.",
    locked: false,
  },
  {
    key: "marketing" as const,
    label: "Marketing",
    description:
      "Ezek a sütik a releváns hirdetések megjelenítéséhez használatosak.",
    locked: false,
  },
]

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Check if consent was already given
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      setPreferences(JSON.parse(stored))
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setIsVisible(false)
    setShowPreferences(false)
  }

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleDecline = () => {
    savePreferences(defaultPreferences)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Preference controls content (shared between Dialog and Sheet)
  const PreferenceControls = () => (
    <div className="space-y-4">
      {cookieCategories.map((category, index) => (
        <div key={category.key}>
          <div className="flex items-start justify-between gap-4 py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {category.label}
                </span>
                {category.locked && (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
            </div>
            <Switch
              checked={preferences[category.key]}
              onCheckedChange={() => togglePreference(category.key)}
              disabled={category.locked}
              aria-label={`${category.label} sütik`}
            />
          </div>
          {index < cookieCategories.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )

  if (!isVisible) return null

  return (
    <>
      {/* Banner - Desktop: bottom bar, Mobile: bottom card */}
      <div
        className={`fixed z-50 ${
          isMobile
            ? "bottom-4 left-4 right-4"
            : "bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm"
        }`}
      >
        {isMobile ? (
          <Card className="shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary shrink-0" />
                  <h3 className="font-medium text-foreground">
                    Süti szabályzat
                  </h3>
                </div>
                <button
                  onClick={handleDecline}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  aria-label="Elutasítás"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sütiket használunk a weboldal működéséhez és a felhasználói
                élmény javításához.{" "}
                <Link
                  href={ROUTES.cookies}
                  className="text-primary hover:underline"
                >
                  Tudj meg többet
                </Link>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowPreferences(true)}
                >
                  Beállítások
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleAcceptAll}
                >
                  Elfogadás
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Cookie className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">
                    Süti szabályzat
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sütiket használunk a weboldal működéséhez és a felhasználói
                    élmény javításához.{" "}
                    <Link
                      href={ROUTES.cookies}
                      className="text-primary hover:underline"
                    >
                      Tudj meg többet
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  aria-label="Elutasítás"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                >
                  Beállítások
                </Button>
                <Button onClick={handleAcceptAll}>Elfogadás</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences - Mobile: Sheet, Desktop: Dialog */}
      {isMobile ? (
        <Sheet open={showPreferences} onOpenChange={setShowPreferences}>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Süti beállítások</SheetTitle>
              <SheetDescription>
                Válaszd ki, mely sütiket engedélyezed a weboldal használata
                során.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 overflow-y-auto flex-1">
              <PreferenceControls />
            </div>
            <SheetFooter className="flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSavePreferences}
              >
                Mentés
              </Button>
              <Button className="flex-1" onClick={handleAcceptAll}>
                Mind elfogadása
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Süti beállítások</DialogTitle>
              <DialogDescription>
                Válaszd ki, mely sütiket engedélyezed a weboldal használata
                során.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <PreferenceControls />
            </div>
            <DialogFooter className="flex-row gap-2 sm:justify-end">
              <Button variant="outline" onClick={handleSavePreferences}>
                Mentés
              </Button>
              <Button onClick={handleAcceptAll}>Mind elfogadása</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Hook to reopen cookie preferences from footer
export function useCookiePreferences() {
  const openPreferences = () => {
    // Clear consent to show banner again
    localStorage.removeItem(COOKIE_CONSENT_KEY)
    window.location.reload()
  }

  return { openPreferences }
}
