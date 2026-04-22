import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/routes"

export const metadata = {
  title: "Merch | CraftBrew",
  description: "CraftBrew márkás termékek - bögrék, pólók és kiegészítők",
}

export default function MerchPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center px-4 py-16 max-w-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/50 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-10 h-10 text-primary">
              <path
                fill="currentColor"
                d="M48 16H16c-2.2 0-4 1.8-4 4v8c0 2.2 1.8 4 4 4h2v16c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4V32h2c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4zM16 28v-8h32v8h-2V20H18v8h-2zm24 20H22V32h18v16z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Merch
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Hamarosan!
          </p>
          <p className="text-muted-foreground mb-8">
            A CraftBrew márkás termékek kollekciója készül.
            Bögrék, pólók és exkluzív kiegészítők várnak rád.
          </p>
          <Button asChild>
            <Link href={ROUTES.coffees}>
              Nézd meg a kávéinkat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
    </div>
  )
}
