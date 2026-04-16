"use client"

import * as React from "react"
import { CreditCard, Lock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentFormProps {
  total: number
  onSubmit: (data: PaymentData) => Promise<{ success: boolean; error?: string }>
  isProcessing: boolean
  error?: string
  className?: string
}

export interface PaymentData {
  cardNumber: string
  expiry: string
  cvc: string
  cardholderName: string
}

interface FieldState {
  value: string
  error: string | null
  touched: boolean
}

export function PaymentForm({
  total,
  onSubmit,
  isProcessing,
  error,
  className,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = React.useState<FieldState>({
    value: "",
    error: null,
    touched: false,
  })
  const [expiry, setExpiry] = React.useState<FieldState>({
    value: "",
    error: null,
    touched: false,
  })
  const [cvc, setCvc] = React.useState<FieldState>({
    value: "",
    error: null,
    touched: false,
  })
  const [cardholderName, setCardholderName] = React.useState<FieldState>({
    value: "",
    error: null,
    touched: false,
  })

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    const groups = digits.match(/.{1,4}/g)
    return groups ? groups.join(" ") : ""
  }

  // Format expiry as MM/YY with auto-slash
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2)
    }
    return digits
  }

  // Format CVC (3-4 digits)
  const formatCvc = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 4)
  }

  // Validation functions
  const validateCardNumber = (value: string): string | null => {
    const digits = value.replace(/\D/g, "")
    if (digits.length < 16) return "A kártyaszám 16 számjegyből áll"
    // Luhn algorithm check
    let sum = 0
    let isEven = false
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    if (sum % 10 !== 0) return "Érvénytelen kártyaszám"
    return null
  }

  const validateExpiry = (value: string): string | null => {
    const parts = value.split("/")
    if (parts.length !== 2) return "Érvénytelen formátum (HH/ÉÉ)"
    const month = parseInt(parts[0], 10)
    const year = parseInt("20" + parts[1], 10)
    if (month < 1 || month > 12) return "Érvénytelen hónap"
    const now = new Date()
    const expiryDate = new Date(year, month - 1)
    if (expiryDate < now) return "A kártya lejárt"
    return null
  }

  const validateCvc = (value: string): string | null => {
    if (value.length < 3) return "A CVC 3-4 számjegyből áll"
    return null
  }

  const validateName = (value: string): string | null => {
    if (value.trim().length < 2) return "Add meg a kártyatulajdonos nevét"
    return null
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber({
      value: formatted,
      error: cardNumber.touched ? validateCardNumber(formatted) : null,
      touched: cardNumber.touched,
    })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setExpiry({
      value: formatted,
      error: expiry.touched ? validateExpiry(formatted) : null,
      touched: expiry.touched,
    })
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvc(e.target.value)
    setCvc({
      value: formatted,
      error: cvc.touched ? validateCvc(formatted) : null,
      touched: cvc.touched,
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName({
      value: e.target.value,
      error: cardholderName.touched ? validateName(e.target.value) : null,
      touched: cardholderName.touched,
    })
  }

  const handleBlur = (field: "cardNumber" | "expiry" | "cvc" | "name") => {
    switch (field) {
      case "cardNumber":
        setCardNumber((prev) => ({
          ...prev,
          touched: true,
          error: validateCardNumber(prev.value),
        }))
        break
      case "expiry":
        setExpiry((prev) => ({
          ...prev,
          touched: true,
          error: validateExpiry(prev.value),
        }))
        break
      case "cvc":
        setCvc((prev) => ({
          ...prev,
          touched: true,
          error: validateCvc(prev.value),
        }))
        break
      case "name":
        setCardholderName((prev) => ({
          ...prev,
          touched: true,
          error: validateName(prev.value),
        }))
        break
    }
  }

  const isValid =
    !validateCardNumber(cardNumber.value) &&
    !validateExpiry(expiry.value) &&
    !validateCvc(cvc.value) &&
    !validateName(cardholderName.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Touch all fields
    setCardNumber((prev) => ({ ...prev, touched: true, error: validateCardNumber(prev.value) }))
    setExpiry((prev) => ({ ...prev, touched: true, error: validateExpiry(prev.value) }))
    setCvc((prev) => ({ ...prev, touched: true, error: validateCvc(prev.value) }))
    setCardholderName((prev) => ({ ...prev, touched: true, error: validateName(prev.value) }))

    if (!isValid) return

    await onSubmit({
      cardNumber: cardNumber.value.replace(/\s/g, ""),
      expiry: expiry.value,
      cvc: cvc.value,
      cardholderName: cardholderName.value,
    })
  }

  // Detect card type for icon
  const getCardType = (number: string): "visa" | "mastercard" | "amex" | null => {
    const digits = number.replace(/\s/g, "")
    if (digits.startsWith("4")) return "visa"
    if (digits.startsWith("5") || (digits.startsWith("2") && parseInt(digits.slice(0, 4)) >= 2221 && parseInt(digits.slice(0, 4)) <= 2720)) return "mastercard"
    if (digits.startsWith("34") || digits.startsWith("37")) return "amex"
    return null
  }

  const cardType = getCardType(cardNumber.value)

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertTitle>Fizetési hiba</AlertTitle>
              <AlertDescription>
                {error}
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  disabled={isProcessing}
                >
                  Próbáld újra
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Kártyaszám</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber.value}
            onChange={handleCardNumberChange}
            onBlur={() => handleBlur("cardNumber")}
            className={cn(
              "font-mono pl-10 pr-12",
              cardNumber.error && cardNumber.touched && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isProcessing}
          />
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          
          {/* Card type indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {cardType === "visa" && (
              <span className="text-xs font-bold text-blue-600">VISA</span>
            )}
            {cardType === "mastercard" && (
              <span className="text-xs font-bold text-orange-600">MC</span>
            )}
            {cardType === "amex" && (
              <span className="text-xs font-bold text-blue-800">AMEX</span>
            )}
          </div>
        </div>
        {cardNumber.error && cardNumber.touched && (
          <p className="text-sm text-destructive">{cardNumber.error}</p>
        )}
      </div>

      {/* Expiry & CVC Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Lejárat</Label>
          <Input
            id="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="HH/ÉÉ"
            value={expiry.value}
            onChange={handleExpiryChange}
            onBlur={() => handleBlur("expiry")}
            className={cn(
              "font-mono",
              expiry.error && expiry.touched && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isProcessing}
          />
          {expiry.error && expiry.touched && (
            <p className="text-sm text-destructive">{expiry.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={cvc.value}
            onChange={handleCvcChange}
            onBlur={() => handleBlur("cvc")}
            className={cn(
              "font-mono",
              cvc.error && cvc.touched && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isProcessing}
          />
          {cvc.error && cvc.touched && (
            <p className="text-sm text-destructive">{cvc.error}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Kártyatulajdonos neve</Label>
        <Input
          id="cardholderName"
          type="text"
          autoComplete="cc-name"
          placeholder="KOVÁCS JÁNOS"
          value={cardholderName.value}
          onChange={handleNameChange}
          onBlur={() => handleBlur("name")}
          className={cn(
            "uppercase",
            cardholderName.error && cardholderName.touched && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={isProcessing}
        />
        {cardholderName.error && cardholderName.touched && (
          <p className="text-sm text-destructive">{cardholderName.error}</p>
        )}
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Lock className="size-4 shrink-0" />
        <p>
          A fizetés biztonságos és titkosított. Kártyaadataidat nem tároljuk.
        </p>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="text-xs font-bold text-blue-600">VISA</span>
          <span className="text-xs font-bold text-orange-600">MC</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isProcessing || (!isValid && cardNumber.touched && expiry.touched && cvc.touched && cardholderName.touched)}
      >
        {isProcessing ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Feldolgozás...
          </>
        ) : (
          <>
            Fizetés · {formatPrice(total)}
          </>
        )}
      </Button>
    </form>
  )
}
