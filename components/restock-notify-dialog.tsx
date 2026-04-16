"use client"

import * as React from "react"
import { Bell, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RestockNotifyDialogProps {
  productName: string
  variantInfo?: string
  userEmail?: string // Pre-filled if signed in
  onSubmit: (email: string) => Promise<void>
  className?: string
}

export function RestockNotifyDialog({
  productName,
  variantInfo,
  userEmail,
  onSubmit,
  className,
}: RestockNotifyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState(userEmail || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await onSubmit(email)
      setIsSuccess(true)
      setTimeout(() => {
        setOpen(false)
        // Reset state after dialog closes
        setTimeout(() => setIsSuccess(false), 300)
      }, 2000)
    } catch {
      // Handle error - could add error state here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "w-full gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
            className
          )}
        >
          <Bell className="size-4" />
          Értesíts ha újra elérhető
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Értesítés kérése
          </DialogTitle>
          <DialogDescription>
            Értesítünk, amint a <span className="font-medium text-foreground">{productName}</span>
            {variantInfo && <span className="font-medium text-foreground"> ({variantInfo})</span>} újra elérhető lesz.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-success/10 p-3 mb-4">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <p className="text-lg font-medium text-foreground">Feliratkoztál!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Emailben értesítünk, ha újra kapható.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="restock-email">Email cím</Label>
              <Input
                id="restock-email"
                type="email"
                placeholder="pelda@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-surface"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Feliratkozás...
                </>
              ) : (
                <>
                  <Bell className="size-4 mr-2" />
                  Feliratkozás értesítésre
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Csak erről a termékről küldünk értesítést. Bármikor leiratkozhatsz.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
