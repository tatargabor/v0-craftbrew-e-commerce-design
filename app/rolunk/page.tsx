import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export const metadata = {
  title: "Rólunk | CraftBrew",
  description: "Ismerd meg a CraftBrew történetét és a csapatot",
}

export default function RolunkPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center px-4 py-16 max-w-xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Rólunk
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Hamarosan!
          </p>
          <p className="text-muted-foreground mb-8">
            A CraftBrew történetét és a csapatunkat bemutató oldal készül.
          </p>
          <Button asChild>
            <Link href={ROUTES.home}>
              Vissza a főoldalra
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
