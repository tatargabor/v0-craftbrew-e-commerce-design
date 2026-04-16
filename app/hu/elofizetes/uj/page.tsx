"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Step definitions
const STEPS = [
  { id: 1, label: "Kávé", icon: Coffee },
  { id: 2, label: "Méret", icon: Coffee },
  { id: 3, label: "Gyakoriság", icon: Clock },
  { id: 4, label: "Szállítás", icon: MapPin },
  { id: 5, label: "Összegzés", icon: Check },
]

// Mock data
const coffees = [
  {
    id: "ethiopia-yirgacheffe",
    name: "Ethiopia Yirgacheffe",
    origin: "ETIÓPIA",
    notes: "Citrus, Virágos, Tea-szerű",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop",
    basePrice: 3490,
  },
  {
    id: "colombia-supremo",
    name: "Colombia Supremo",
    origin: "KOLUMBIA",
    notes: "Karamell, Dió, Kiegyensúlyozott",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    basePrice: 2990,
  },
  {
    id: "guatemala-antigua",
    name: "Guatemala Antigua",
    origin: "GUATEMALA",
    notes: "Csokoládé, Füstös, Fűszeres",
    image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=300&h=300&fit=crop",
    basePrice: 3290,
  },
  {
    id: "kenya-aa",
    name: "Kenya AA",
    origin: "KENYA",
    notes: "Bogyós, Boros, Élénk",
    image: "https://images.unsplash.com/photo-1442411210769-b95c4632195e?w=300&h=300&fit=crop",
    basePrice: 3790,
  },
]

const sizes = [
  { id: "250g", label: "250g", multiplier: 1 },
  { id: "500g", label: "500g", multiplier: 1.85, badge: "Népszerű" },
  { id: "1kg", label: "1kg", multiplier: 3.5, badge: "-10%" },
]

const frequencies = [
  { id: "daily", label: "Naponta", discount: 15, budapestOnly: true },
  { id: "weekly", label: "Hetente", discount: 10 },
  { id: "biweekly", label: "Kéthetente", discount: 7 },
  { id: "monthly", label: "Havonta", discount: 5 },
]

const timeWindows = [
  { id: "morning", label: "Reggel", time: "6:00 - 9:00" },
  { id: "midday", label: "Délelőtt", time: "9:00 - 12:00" },
  { id: "afternoon", label: "Délután", time: "14:00 - 17:00" },
]

const savedAddresses = [
  {
    id: "addr-1",
    label: "Otthon",
    name: "Kovács János",
    address: "Andrássy út 42., 1061 Budapest",
    zone: "budapest",
  },
  {
    id: "addr-2",
    label: "Munkahely",
    name: "Kovács János",
    address: "Váci út 1-3., 1062 Budapest",
    zone: "budapest",
  },
]

// Format price with Hungarian locale
function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(Math.round(price)) + " Ft"
}

// Progress indicator component
function WizardProgress({
  currentStep,
  completedSteps,
}: {
  currentStep: number
  completedSteps: number[]
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id)
        const isCurrent = currentStep === step.id
        const isUpcoming = !isCompleted && !isCurrent

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary ring-4 ring-primary/20",
                  isUpcoming && "border-muted-foreground/30 bg-background text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isCurrent && "text-primary",
                  isUpcoming && "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 transition-colors",
                  completedSteps.includes(step.id + 1) || currentStep > step.id
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Step 1: Coffee selection
function CoffeeStep({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Válaszd ki a kávédat
        </h2>
        <p className="text-muted-foreground">
          Prémium single-origin kávéink közül
        </p>
      </div>

      <RadioGroup
        value={selected || ""}
        onValueChange={onSelect}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {coffees.map((coffee) => (
          <Label key={coffee.id} htmlFor={coffee.id} className="cursor-pointer">
            <Card
              className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-md",
                selected === coffee.id && "ring-2 ring-primary shadow-md"
              )}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={coffee.image}
                      alt={coffee.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {coffee.origin}
                    </p>
                    <h3 className="font-serif text-lg font-medium">
                      {coffee.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {coffee.notes}
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {formatPrice(coffee.basePrice)}tól
                    </p>
                  </div>
                  <RadioGroupItem
                    value={coffee.id}
                    id={coffee.id}
                    className="absolute right-4 top-4"
                  />
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}

// Step 2: Size selection
function SizeStep({
  selected,
  onSelect,
  basePrice,
}: {
  selected: string | null
  onSelect: (id: string) => void
  basePrice: number
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Mekkora csomagot szeretnél?
        </h2>
        <p className="text-muted-foreground">
          Nagyobb kiszerelés = jobb ár
        </p>
      </div>

      <RadioGroup
        value={selected || ""}
        onValueChange={onSelect}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        {sizes.map((size) => {
          const price = basePrice * size.multiplier
          return (
            <Label key={size.id} htmlFor={size.id} className="cursor-pointer">
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-200 hover:shadow-md text-center",
                  selected === size.id && "ring-2 ring-primary shadow-md"
                )}
              >
                <CardContent className="p-6 space-y-3">
                  {size.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-2 bg-secondary text-secondary-foreground"
                    >
                      {size.badge}
                    </Badge>
                  )}
                  <div className="font-serif text-3xl font-medium">
                    {size.label}
                  </div>
                  <div className="font-mono text-xl font-medium text-primary">
                    {formatPrice(price)}
                  </div>
                  <RadioGroupItem
                    value={size.id}
                    id={size.id}
                    className="mx-auto"
                  />
                </CardContent>
              </Card>
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}

// Step 3: Frequency selection
function FrequencyStep({
  selected,
  onSelect,
  userZone,
}: {
  selected: string | null
  onSelect: (id: string) => void
  userZone: string
}) {
  const isOutsideBudapest = userZone !== "budapest"

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl md:text-3xl font-medium">
            Milyen gyakran szállítsunk?
          </h2>
          <p className="text-muted-foreground">
            Gyakoribb szállítás = nagyobb kedvezmény
          </p>
        </div>

        <RadioGroup
          value={selected || ""}
          onValueChange={onSelect}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          {frequencies.map((freq) => {
            const isDisabled = freq.budapestOnly && isOutsideBudapest

            const cardContent = (
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-200",
                  !isDisabled && "hover:shadow-md cursor-pointer",
                  selected === freq.id && "ring-2 ring-primary shadow-md",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl font-medium">
                          {freq.label}
                        </span>
                        {isDisabled && (
                          <Info className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-600 text-white"
                      >
                        -{freq.discount}%
                      </Badge>
                    </div>
                    {!isDisabled && (
                      <RadioGroupItem value={freq.id} id={freq.id} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )

            if (isDisabled) {
              return (
                <Tooltip key={freq.id}>
                  <TooltipTrigger asChild>
                    <div>{cardContent}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Csak Budapesten elérhető</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Label key={freq.id} htmlFor={freq.id} className="cursor-pointer">
                {cardContent}
              </Label>
            )
          })}
        </RadioGroup>
      </div>
    </TooltipProvider>
  )
}

// Step 4: Delivery details
function DeliveryStep({
  selectedAddress,
  onSelectAddress,
  selectedTime,
  onSelectTime,
}: {
  selectedAddress: string | null
  onSelectAddress: (id: string) => void
  selectedTime: string | null
  onSelectTime: (id: string) => void
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Szállítási részletek
        </h2>
        <p className="text-muted-foreground">
          Hova és mikor szállítsunk?
        </p>
      </div>

      {/* Address Selection */}
      <div className="space-y-4">
        <h3 className="font-medium">Szállítási cím</h3>
        <RadioGroup
          value={selectedAddress || ""}
          onValueChange={onSelectAddress}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {savedAddresses.map((addr) => (
            <Label key={addr.id} htmlFor={addr.id} className="cursor-pointer">
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-200 hover:shadow-md",
                  selectedAddress === addr.id && "ring-2 ring-primary shadow-md"
                )}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{addr.label}</Badge>
                    <RadioGroupItem value={addr.id} id={addr.id} />
                  </div>
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-muted-foreground">{addr.address}</p>
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
        <Button variant="outline" size="sm" asChild>
          <Link href="/fiokom/cimek">+ Új cím hozzáadása</Link>
        </Button>
      </div>

      <Separator />

      {/* Time Window Selection */}
      <div className="space-y-4">
        <h3 className="font-medium">Kiszállítási időablak</h3>
        <RadioGroup
          value={selectedTime || ""}
          onValueChange={onSelectTime}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {timeWindows.map((tw) => (
            <Label key={tw.id} htmlFor={tw.id} className="cursor-pointer">
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-200 hover:shadow-md text-center",
                  selectedTime === tw.id && "ring-2 ring-primary shadow-md"
                )}
              >
                <CardContent className="p-4 space-y-1">
                  <div className="font-medium">{tw.label}</div>
                  <div className="text-sm text-muted-foreground">{tw.time}</div>
                  <RadioGroupItem value={tw.id} id={tw.id} className="mx-auto" />
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

// Step 5: Summary
function SummaryStep({
  coffee,
  size,
  frequency,
  address,
  timeWindow,
  totalPrice,
  savings,
}: {
  coffee: (typeof coffees)[0] | undefined
  size: (typeof sizes)[0] | undefined
  frequency: (typeof frequencies)[0] | undefined
  address: (typeof savedAddresses)[0] | undefined
  timeWindow: (typeof timeWindows)[0] | undefined
  totalPrice: number
  savings: number
}) {
  if (!coffee || !size || !frequency || !address || !timeWindow) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="h-10 w-10 mx-auto text-primary" />
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          Összegzés
        </h2>
        <p className="text-muted-foreground">
          Ellenőrizd a részleteket
        </p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 space-y-6">
          {/* Product */}
          <div className="flex gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={coffee.image}
                alt={coffee.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {coffee.origin}
              </p>
              <h3 className="font-serif text-lg font-medium">{coffee.name}</h3>
              <p className="text-sm text-muted-foreground">{size.label}</p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gyakoriság</span>
              <span className="font-medium flex items-center gap-2">
                {frequency.label}
                <Badge variant="default" className="bg-green-600">
                  -{frequency.discount}%
                </Badge>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Időablak</span>
              <span className="font-medium">
                {timeWindow.label} ({timeWindow.time})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Szállítási cím</span>
              <span className="font-medium text-right max-w-[200px]">
                {address.address}
              </span>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Eredeti ár</span>
              <span className="line-through text-muted-foreground">
                {formatPrice(totalPrice + savings)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Előfizetői kedvezmény</span>
              <span>-{formatPrice(savings)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-medium">
              <span>Összesen / szállítás</span>
              <span className="font-mono">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main wizard component
export default function SubscriptionWizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [selectedCoffee, setSelectedCoffee] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<string | null>(null)

  // Derived data
  const coffee = coffees.find((c) => c.id === selectedCoffee)
  const size = sizes.find((s) => s.id === selectedSize)
  const frequency = frequencies.find((f) => f.id === selectedFrequency)
  const address = savedAddresses.find((a) => a.id === selectedAddress)
  const timeWindow = timeWindows.find((t) => t.id === selectedTimeWindow)

  // Price calculation
  const { totalPrice, savings } = useMemo(() => {
    if (!coffee || !size || !frequency) {
      return { totalPrice: 0, savings: 0 }
    }
    const basePrice = coffee.basePrice * size.multiplier
    const discountAmount = basePrice * (frequency.discount / 100)
    return {
      totalPrice: basePrice - discountAmount,
      savings: discountAmount,
    }
  }, [coffee, size, frequency])

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedCoffee
      case 2:
        return !!selectedSize
      case 3:
        return !!selectedFrequency
      case 4:
        return !!selectedAddress && !!selectedTimeWindow
      case 5:
        return true
      default:
        return false
    }
  }

  const completedSteps = [1, 2, 3, 4, 5].filter(
    (step) => step < currentStep && isStepValid(step)
  )

  const handleNext = () => {
    if (currentStep < 5 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/fiokom/elofizetesek?created=true")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/kavek"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Vissza
            </Link>
            <h1 className="font-serif text-xl font-medium">Új előfizetés</h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4">
          <WizardProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <CoffeeStep
                selected={selectedCoffee}
                onSelect={setSelectedCoffee}
              />
            )}
            {currentStep === 2 && (
              <SizeStep
                selected={selectedSize}
                onSelect={setSelectedSize}
                basePrice={coffee?.basePrice || 0}
              />
            )}
            {currentStep === 3 && (
              <FrequencyStep
                selected={selectedFrequency}
                onSelect={setSelectedFrequency}
                userZone={address?.zone || "budapest"}
              />
            )}
            {currentStep === 4 && (
              <DeliveryStep
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                selectedTime={selectedTimeWindow}
                onSelectTime={setSelectedTimeWindow}
              />
            )}
            {currentStep === 5 && (
              <SummaryStep
                coffee={coffee}
                size={size}
                frequency={frequency}
                address={address}
                timeWindow={timeWindow}
                totalPrice={totalPrice}
                savings={savings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Vissza
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
                Tovább
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Feldolgozás...
                  </span>
                ) : (
                  "Előfizetés indítása"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
