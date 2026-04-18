import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export const metadata = {
  title: "Csomagok | CraftBrew",
  description: "Kávé csomagok és ajándékkosarak - válogatott összeállítások",
}

export default function CsomagokPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center px-4 py-16 max-w-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-10 h-10 text-primary">
              <path
                fill="currentColor"
                d="M50 18H14c-1.1 0-2 .9-2 2v4h40v-4c0-1.1-.9-2-2-2zM12 28v18c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V28H12zm20 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Csomagok
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Hamarosan!
          </p>
          <p className="text-muted-foreground mb-8">
            Válogatott kávé csomagjaink és ajándékkosaraink hamarosan elérhetőek.
            Tökéletes ajándék kávérajongóknak.
          </p>
          <Button asChild>
            <Link href={ROUTES.coffees}>
              Nézd meg a kávéinkat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
