"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"

interface ProductGalleryProps {
  images: {
    src: string
    alt: string
  }[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap())
    })
  }, [api])

  const goToSlide = (index: number) => {
    api?.scrollTo(index)
    setSelectedIndex(index)
  }

  return (
    <>
      {/* Mobile: Swipeable Carousel */}
      <div className="lg:hidden">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-0">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "size-2 rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Kép ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Editorial stacked layout with zoom */}
      <div className="hidden lg:block space-y-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted group cursor-zoom-in"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            onClick={() => {
              setSelectedIndex(index)
              setIsZoomed(true)
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={index === 0}
            />
            
            {/* Zoom hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <ZoomIn className="size-5 text-foreground" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{productName} - Kép nagyítás</DialogTitle>
          
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 rounded-full"
              onClick={() => setIsZoomed(false)}
            >
              <X className="size-6" />
              <span className="sr-only">Bezárás</span>
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/10 rounded-full size-12"
                  onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="size-8" />
                  <span className="sr-only">Előző kép</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/10 rounded-full size-12"
                  onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
                >
                  <ChevronRight className="size-8" />
                  <span className="sr-only">Következő kép</span>
                </Button>
              </>
            )}

            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "relative size-14 rounded-md overflow-hidden transition-all duration-200",
                      index === selectedIndex
                        ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ProductGallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/5] rounded-lg bg-muted animate-pulse" />
      <div className="hidden lg:block aspect-[4/5] rounded-lg bg-muted animate-pulse" />
    </div>
  )
}
