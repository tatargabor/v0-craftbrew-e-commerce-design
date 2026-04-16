"use client"

import * as React from "react"
import { X, Check, Loader2, Tag, Gift } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

// Coupon states
type CouponStatus = "idle" | "loading" | "valid" | "invalid" | "expired" | "not-applicable"

interface CouponInputProps {
  onApply: (code: string) => Promise<{ success: boolean; discount?: number; message?: string }>
  onRemove: () => void
  appliedCode?: string
  appliedDiscount?: number
  className?: string
}

const errorMessages: Record<CouponStatus, string> = {
  idle: "",
  loading: "",
  valid: "",
  invalid: "Érvénytelen kód",
  expired: "Lejárt kupon",
  "not-applicable": "Csak első rendelésnél",
}

export function CouponInput({
  onApply,
  onRemove,
  appliedCode,
  appliedDiscount,
  className,
}: CouponInputProps) {
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<CouponStatus>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || status === "loading") return

    setStatus("loading")
    
    const result = await onApply(code.trim().toUpperCase())
    
    if (result.success) {
      setStatus("valid")
      setCode("")
    } else {
      // Map error messages to status
      if (result.message?.includes("lejárt")) {
        setStatus("expired")
      } else if (result.message?.includes("első")) {
        setStatus("not-applicable")
      } else {
        setStatus("invalid")
      }
    }
  }

  const handleRemove = () => {
    onRemove()
    setStatus("idle")
  }

  const isError = status === "invalid" || status === "expired" || status === "not-applicable"

  // If coupon is applied, show applied state
  if (appliedCode) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Tag className="size-4" />
          Kuponkód
        </Label>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border-green-200 px-3 py-1.5 text-sm font-medium"
          >
            <Check className="size-3.5 mr-1.5" />
            {appliedCode}
            {appliedDiscount && (
              <span className="ml-1.5 text-green-600">
                (−{new Intl.NumberFormat("hu-HU").format(appliedDiscount)} Ft)
              </span>
            )}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            aria-label="Kupon eltávolítása"
          >
            <X className="size-4" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Tag className="size-4" />
        Kuponkód
      </Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            if (isError) setStatus("idle")
          }}
          placeholder="KUPON2024"
          className={cn(
            "flex-1 font-mono uppercase",
            isError && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={status === "loading"}
        />
        <Button 
          type="submit" 
          variant="outline"
          disabled={!code.trim() || status === "loading"}
          className="shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Beváltás"
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-destructive"
          >
            {errorMessages[status]}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

// Gift Card Input
type GiftCardStatus = "idle" | "loading" | "valid" | "depleted" | "expired" | "invalid"

interface GiftCardInputProps {
  onApply: (code: string) => Promise<{ 
    success: boolean
    balance?: number
    amountApplied?: number
    message?: string 
  }>
  onRemove: () => void
  appliedCode?: string
  balance?: number
  amountApplied?: number
  className?: string
}

const giftCardErrorMessages: Record<GiftCardStatus, string> = {
  idle: "",
  loading: "",
  valid: "",
  invalid: "Érvénytelen ajándékkártya",
  depleted: "Az ajándékkártya egyenlege elfogyott",
  expired: "Lejárt ajándékkártya",
}

export function GiftCardInput({
  onApply,
  onRemove,
  appliedCode,
  balance,
  amountApplied,
  className,
}: GiftCardInputProps) {
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<GiftCardStatus>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || status === "loading") return

    setStatus("loading")
    
    const result = await onApply(code.trim().toUpperCase())
    
    if (result.success) {
      setStatus("valid")
      setCode("")
    } else {
      if (result.message?.includes("elfogyott") || result.message?.includes("egyenleg")) {
        setStatus("depleted")
      } else if (result.message?.includes("lejárt")) {
        setStatus("expired")
      } else {
        setStatus("invalid")
      }
    }
  }

  const handleRemove = () => {
    onRemove()
    setStatus("idle")
  }

  const isError = status === "invalid" || status === "expired" || status === "depleted"

  // If gift card is applied, show applied state
  if (appliedCode) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Gift className="size-4" />
          Ajándékkártya
        </Label>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-green-200 px-3 py-1.5 text-sm font-medium"
            >
              <Check className="size-3.5 mr-1.5" />
              {appliedCode}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
              aria-label="Ajándékkártya eltávolítása"
            >
              <X className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Egyenleg: {new Intl.NumberFormat("hu-HU").format(balance || 0)} Ft
            {amountApplied && (
              <span className="text-green-600 ml-2">
                (−{new Intl.NumberFormat("hu-HU").format(amountApplied)} Ft felhasználva)
              </span>
            )}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Gift className="size-4" />
        Ajándékkártya
      </Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            if (isError) setStatus("idle")
          }}
          placeholder="GIFT-XXXX-XXXX"
          className={cn(
            "flex-1 font-mono uppercase",
            isError && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={status === "loading"}
        />
        <Button 
          type="submit" 
          variant="outline"
          disabled={!code.trim() || status === "loading"}
          className="shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Beváltás"
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-destructive"
          >
            {giftCardErrorMessages[status]}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
