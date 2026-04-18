import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export const metadata = {
  title: "Eszközök | CraftBrew",
  description: "Prémium kávékészítő eszközök - daralók, kávéfőzők és kiegészítők",
}

export default function EszkozokPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center px-4 py-16 max-w-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-10 h-10 text-primary">
              <path
                fill="currentColor"
                d="M32 8c-8 0-14.5 6.5-14.5 14.5V28H14c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V30c0-1.1-.9-2-2-2h-3.5v-5.5C46.5 14.5 40 8 32 8zm-8.5 20v-5.5c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5V28h-17z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Eszközök
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Hamarosan!
          </p>
          <p className="text-muted-foreground mb-8">
            A prémium kávékészítő eszközök kollekciónk rövidesen elérhető lesz.
            Daralók, pour-over készletek, French press és még sok más.
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
