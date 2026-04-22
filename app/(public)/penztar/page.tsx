"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Truck, 
  Store, 
  ArrowRight, 
  ArrowLeft,
  MapPin,
  Clock,
  Gift,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckoutStepper, type Step } from "@/components/checkout-stepper"
import { AddressSelector, type Address } from "@/components/address-selector"
import { PaymentForm, type PaymentData } from "@/components/payment-form"
import { OrderConfirmation } from "@/components/order-confirmation"
import { motion, AnimatePresence } from "framer-motion"

// Demo data
const DEMO_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Otthon",
    line1: "Váci út 45.",
    line2: "3. emelet, 12. ajtó",
    city: "Budapest",
    postalCode: "1134",
    zone: "budapest",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Iroda",
    line1: "Andrássy út 112.",
    city: "Budapest",
    postalCode: "1062",
    zone: "budapest",
  },
]

const DEMO_CART = {
  items: [
    {
      id: "item-1",
      name: "Ethiopia Yirgacheffe",
      variant: "250g · Őrölt",
      quantity: 2,
      price: 3490,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
    },
    {
      id: "item-2",
      name: "Colombia Huila",
      variant: "500g · Szemes",
      quantity: 1,
      price: 4990,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop",
    },
  ],
  subtotal: 11970,
  discount: 500,
  discountLabel: "WELCOME10",
  giftCardApplied: 0,
}

const ZONE_COSTS: Record<Address["zone"], number> = {
  budapest: 990,
  "+20km": 1490,
  "+40km": 1990,
}

type ShippingMethod = "delivery" | "pickup"

export default function CheckoutPage() {
  const router = useRouter()
  
  // Auth state (demo: always signed in)
  const isSignedIn = true

  // Checkout state
  const [currentStep, setCurrentStep] = React.useState(0)
  const [shippingMethod, setShippingMethod] = React.useState<ShippingMethod>("delivery")
  const [addresses, setAddresses] = React.useState<Address[]>(DEMO_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(DEMO_ADDRESSES[0].id)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<string | undefined>()
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null)

  // Calculate totals
  const cart = DEMO_CART
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
  const shippingCost = shippingMethod === "pickup" 
    ? 0 
    : selectedAddress 
      ? (cart.subtotal >= 15000 && selectedAddress.zone === "budapest" ? 0 : ZONE_COSTS[selectedAddress.zone])
      : 990
  
  const totalBeforePayment = cart.subtotal - cart.discount - cart.giftCardApplied + shippingCost
  const isZeroAmount = totalBeforePayment <= 0 || cart.giftCardApplied >= (cart.subtotal - cart.discount + shippingCost)

  // Build stepper steps
  const steps: Step[] = React.useMemo(() => {
    const baseSteps: Step[] = [
      { id: "shipping", label: "Szállítás" },
      { id: "payment", label: "Fizetés", skipped: isZeroAmount },
      { id: "confirmation", label: "Megerősítés" },
    ]
    return baseSteps
  }, [isZeroAmount])

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  // Format date
  const getEstimatedDelivery = () => {
    const date = new Date()
    date.setDate(date.getDate() + (shippingMethod === "pickup" ? 1 : 3))
    return date.toLocaleDateString("hu-HU", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    })
  }

  // Handle step navigation
  const handleContinue = () => {
    if (currentStep === 0) {
      // From shipping step
      if (isZeroAmount) {
        // Skip payment, go to confirmation
        processZeroAmountOrder()
      } else {
        setCurrentStep(1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setPaymentError(undefined)
    }
  }

  // Process zero-amount order (gift card covers total)
  const processZeroAmountOrder = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newOrderNumber = `#CB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`
    setOrderNumber(newOrderNumber)
    setCurrentStep(2)
    setIsProcessing(false)
  }

  // Handle payment submission
  const handlePayment = async (data: PaymentData): Promise<{ success: boolean; error?: string }> => {
    setIsProcessing(true)
    setPaymentError(undefined)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Demo: 80% success rate
    const success = Math.random() > 0.2

    if (success) {
      const newOrderNumber = `#CB-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`
      setOrderNumber(newOrderNumber)
      setCurrentStep(2)
      setIsProcessing(false)
      return { success: true }
    } else {
      const error = "A fizetés nem sikerült. Kérjük, ellenőrizd a kártyaadatokat."
      setPaymentError(error)
      setIsProcessing(false)
      return { success: false, error }
    }
  }

  // Handle address management
  const handleAddAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    }
    setAddresses([...addresses, newAddress])
    setSelectedAddressId(newAddress.id)
  }

  // Redirect anonymous users
  React.useEffect(() => {
    if (!isSignedIn) {
      router.push("/bejelentkezes?redirect=/penztar")
    }
  }, [isSignedIn, router])

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Stepper */}
        <CheckoutStepper steps={steps} currentStep={currentStep} className="mb-8" />

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === 2 && orderNumber ? (
            // Step 3: Confirmation
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OrderConfirmation
                orderNumber={orderNumber}
                items={cart.items}
                subtotal={cart.subtotal}
                discount={cart.discount}
                shipping={shippingCost}
                total={totalBeforePayment > 0 ? totalBeforePayment : 0}
                shippingAddress={shippingMethod === "delivery" && selectedAddress ? {
                  name: selectedAddress.name,
                  line1: selectedAddress.line1,
                  line2: selectedAddress.line2,
                  city: selectedAddress.city,
                  postalCode: selectedAddress.postalCode,
                } : undefined}
                isPickup={shippingMethod === "pickup"}
                estimatedDelivery={getEstimatedDelivery()}
              />
            </motion.div>
          ) : (
            // Steps 1-2: Form layout
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-[1fr_380px] gap-8"
            >
              {/* Main Form Area */}
              <div>
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    // Step 1: Shipping
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Szállítási mód</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RadioGroup
                            value={shippingMethod}
                            onValueChange={(v) => setShippingMethod(v as ShippingMethod)}
                            className="space-y-3"
                          >
                            {/* Delivery option */}
                            <label
                              htmlFor="delivery"
                              className={cn(
                                "relative flex cursor-pointer rounded-lg border p-4 transition-all",
                                shippingMethod === "delivery"
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem
                                value="delivery"
                                id="delivery"
                                className="sr-only"
                              />
                              <div className="flex items-start gap-4 w-full">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Truck className="size-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Házhozszállítás</span>
                                    <span className="text-sm text-muted-foreground">
                                      {selectedAddress 
                                        ? (cart.subtotal >= 15000 && selectedAddress.zone === "budapest" 
                                            ? "Ingyenes" 
                                            : formatPrice(ZONE_COSTS[selectedAddress.zone]))
                                        : "Budapest: 990 Ft"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Kiszállítás 1-3 munkanapon belül
                                  </p>
                                </div>
                              </div>
                            </label>

                            {/* Pickup option */}
                            <label
                              htmlFor="pickup"
                              className={cn(
                                "relative flex cursor-pointer rounded-lg border p-4 transition-all",
                                shippingMethod === "pickup"
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem
                                value="pickup"
                                id="pickup"
                                className="sr-only"
                              />
                              <div className="flex items-start gap-4 w-full">
                                <div className="size-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                  <Store className="size-5 text-secondary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">Személyes átvétel</span>
                                    <Badge variant="secondary" className="text-xs">Ingyenes</Badge>
                                  </div>
                                  <p className="font-medium text-sm text-foreground mt-1">
                                    CraftBrew Labor
                                  </p>
                                  <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                                    <p className="flex items-center gap-1.5">
                                      <MapPin className="size-3.5" />
                                      Kazinczy u. 28, 1075 Budapest
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                      <Clock className="size-3.5" />
                                      H–P 7:00–18:00, Szo 8:00–14:00
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </RadioGroup>
                        </CardContent>
                      </Card>

                      {/* Address Selection - only for delivery */}
                      <AnimatePresence>
                        {shippingMethod === "delivery" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Szállítási cím</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <AddressSelector
                                  addresses={addresses}
                                  selectedId={selectedAddressId}
                                  onSelect={setSelectedAddressId}
                                  onAdd={handleAddAddress}
                                />

                                {/* Free shipping note */}
                                {cart.subtotal < 15000 && (
                                  <div className="mt-4 p-3 bg-secondary/10 rounded-lg text-sm">
                                    <p className="flex items-center gap-2 text-secondary">
                                      <Gift className="size-4" />
                                      <span>
                                        15 000 Ft felett <strong>ingyenes</strong> budapesti szállítás
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Estimated delivery */}
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Várható {shippingMethod === "pickup" ? "átvétel" : "kézbesítés"}: </span>
                            <span className="font-medium text-foreground">{getEstimatedDelivery()}</span>
                          </p>
                        </CardContent>
                      </Card>

                      {/* Continue button */}
                      <Button
                        size="lg"
                        className="w-full gap-2"
                        onClick={handleContinue}
                        disabled={shippingMethod === "delivery" && !selectedAddressId || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Feldolgozás...
                          </>
                        ) : isZeroAmount ? (
                          <>
                            Rendelés véglegesítése
                            <ArrowRight className="size-4" />
                          </>
                        ) : (
                          <>
                            Tovább a fizetéshez
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    // Step 2: Payment
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 -ml-2"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="size-4" />
                        Vissza a szállításhoz
                      </Button>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Fizetési adatok</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PaymentForm
                            total={totalBeforePayment}
                            onSubmit={handlePayment}
                            isProcessing={isProcessing}
                            error={paymentError}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:order-last order-first">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Rendelés összesítő</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="size-14 rounded-lg bg-muted overflow-hidden shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.variant} · {item.quantity} db
                            </p>
                          </div>
                          <div className="font-mono text-sm tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Részösszeg</span>
                        <span className="font-mono tabular-nums">{formatPrice(cart.subtotal)}</span>
                      </div>
                      
                      {cart.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">{cart.discountLabel}</span>
                          <span className="font-mono tabular-nums text-green-600">
                            −{formatPrice(cart.discount)}
                          </span>
                        </div>
                      )}

                      {cart.giftCardApplied > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Ajándékkártya</span>
                          <span className="font-mono tabular-nums text-green-600">
                            −{formatPrice(cart.giftCardApplied)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Szállítás</span>
                        <span className="font-mono tabular-nums">
                          {shippingCost === 0 ? "Ingyenes" : formatPrice(shippingCost)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium">Összesen</span>
                      <motion.span
                        key={totalBeforePayment}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="font-serif text-xl font-semibold text-primary tabular-nums"
                      >
                        {formatPrice(totalBeforePayment > 0 ? totalBeforePayment : 0)}
                      </motion.span>
                    </div>

                    {/* Zero amount notice */}
                    {isZeroAmount && (
                      <Alert>
                        <Gift className="size-4" />
                        <AlertTitle>Nincs fizetendő összeg</AlertTitle>
                        <AlertDescription>
                          Az ajándékkártya fedezi a teljes rendelést.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
