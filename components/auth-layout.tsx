"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: React.ReactNode
  imageSrc?: string
  imageAlt?: string
}

export function AuthLayout({ 
  children, 
  imageSrc = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
  imageAlt = "Frissen pörkolt kávé"
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand photography */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight">
            CraftBrew
          </Link>
          <div className="max-w-md">
            <blockquote className="text-2xl font-serif italic leading-relaxed mb-4">
              &ldquo;A tökéletes csésze kávé nem csak ital — ez egy pillanat, amit magadnak adsz.&rdquo;
            </blockquote>
            <p className="text-white/80 text-sm uppercase tracking-wider">
              Kézműves kávé Budapest szívéből
            </p>
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">
            CraftBrew
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
