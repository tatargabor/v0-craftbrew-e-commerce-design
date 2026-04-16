"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    isVerifiedBuyer?: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  helpfulCount: number
  isHelpful?: boolean
}

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  canReview?: boolean // User has purchased and hasn't reviewed
  onSubmitReview?: (data: { rating: number; title: string; content: string }) => Promise<void>
  onMarkHelpful?: (reviewId: string) => void
  className?: string
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function ProductReviews({
  reviews,
  averageRating,
  totalCount,
  ratingDistribution,
  canReview,
  onSubmitReview,
  onMarkHelpful,
  className,
}: ProductReviewsProps) {
  return (
    <div className={cn("space-y-8", className)} id="reviews">
      {/* Summary */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Left: Average & distribution */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="font-serif text-5xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-5",
                    i < Math.round(averageRating)
                      ? "fill-secondary text-secondary"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} értékelés alapján
            </p>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution]
              const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-3">{rating}</span>
                  <Star className="size-3.5 fill-secondary text-secondary" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Write review CTA */}
          {canReview && onSubmitReview && (
            <WriteReviewDialog onSubmit={onSubmitReview} />
          )}
        </div>

        {/* Right: Recent reviews */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground">Még nincsenek értékelések</p>
              <p className="text-sm text-muted-foreground mt-1">
                Legyél te az első, aki értékeli ezt a terméket!
              </p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <ReviewCard review={review} onMarkHelpful={onMarkHelpful} />
                {index < reviews.length - 1 && <Separator className="mt-6" />}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  onMarkHelpful,
}: {
  review: Review
  onMarkHelpful?: (id: string) => void
}) {
  const [isHelpful, setIsHelpful] = React.useState(review.isHelpful || false)
  const [helpfulCount, setHelpfulCount] = React.useState(review.helpfulCount)

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true)
      setHelpfulCount((c) => c + 1)
      onMarkHelpful?.(review.id)
    }
  }

  return (
    <article className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={review.author.avatar} alt={review.author.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {review.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{review.author.name}</span>
              {review.author.isVerifiedBuyer && (
                <span className="text-xs text-success font-medium">Ellenőrzött vásárló</span>
              )}
            </div>
            <time className="text-xs text-muted-foreground">{formatDate(review.date)}</time>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < review.rating ? "fill-secondary text-secondary" : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground">{review.title}</h4>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.content}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 text-muted-foreground hover:text-foreground",
            isHelpful && "text-primary"
          )}
          onClick={handleHelpful}
          disabled={isHelpful}
        >
          <ThumbsUp className={cn("size-4", isHelpful && "fill-primary")} />
          Hasznos ({helpfulCount})
        </Button>
      </div>
    </article>
  )
}

function WriteReviewDialog({
  onSubmit,
}: {
  onSubmit: (data: { rating: number; title: string; content: string }) => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [rating, setRating] = React.useState(0)
  const [hoveredRating, setHoveredRating] = React.useState(0)
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !title || !content) return

    setIsSubmitting(true)
    try {
      await onSubmit({ rating, title, content })
      setOpen(false)
      setRating(0)
      setTitle("")
      setContent("")
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2">
          <MessageSquare className="size-4" />
          Értékelés írása
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Értékelés írása</DialogTitle>
          <DialogDescription>
            Oszd meg véleményed a termékről más vásárlókkal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Star rating */}
          <div className="space-y-2">
            <Label>Értékelés</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      (hoveredRating || rating) > i
                        ? "fill-secondary text-secondary"
                        : "fill-muted text-muted hover:fill-secondary/50 hover:text-secondary/50"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-title">Cím</Label>
            <Input
              id="review-title"
              placeholder="Foglald össze egy mondatban"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-surface"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-content">Vélemény</Label>
            <textarea
              id="review-content"
              placeholder="Írd le részletesen a tapasztalataidat..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className={cn(
                "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "resize-none"
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || rating === 0 || !title || !content}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Küldés...
              </>
            ) : (
              "Értékelés beküldése"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
