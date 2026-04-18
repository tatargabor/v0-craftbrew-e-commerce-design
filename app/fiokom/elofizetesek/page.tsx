"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  RefreshCw,
  Calendar,
  Package,
  Pause,
  Play,
  SkipForward,
  Settings,
  X,
  Check,
  Clock,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { addDays, format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isBefore } from "date-fns"
import { hu } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

import { ROUTES } from "@/lib/routes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

// Types
type DeliveryStatus = "delivered" | "scheduled" | "paused" | "skipped"

interface Delivery {
  date: Date
  status: DeliveryStatus
}

interface Subscription {
  id: string
  name: string
  origin: string
  variant: string
  frequency: string
  frequencyLabel: string
  timeWindow: string
  nextDelivery: Date
  price: number
  originalPrice: number
  status: "active" | "paused"
  pausedUntil?: Date
  image: string
  deliveries: Delivery[]
}

// Mock data
const initialSubscriptions: Subscription[] = [
  {
    id: "sub-001",
    name: "Ethiopia Yirgacheffe",
    origin: "ETIÓPIA",
    variant: "250g, Őrölt",
    frequency: "biweekly",
    frequencyLabel: "Kéthetente",
    timeWindow: "Reggel (6-9)",
    nextDelivery: addDays(new Date(), 3),
    price: 3245,
    originalPrice: 3490,
    status: "active",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop",
    deliveries: [
      { date: addDays(new Date(), -28), status: "delivered" },
      { date: addDays(new Date(), -14), status: "delivered" },
      { date: addDays(new Date(), 3), status: "scheduled" },
      { date: addDays(new Date(), 17), status: "scheduled" },
      { date: addDays(new Date(), 31), status: "scheduled" },
    ],
  },
]

// Format helpers
function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(Math.round(price)) + " Ft"
}

function formatDate(date: Date): string {
  return format(date, "yyyy. MMMM d.", { locale: hu })
}

function formatShortDate(date: Date): string {
  return format(date, "MMM d.", { locale: hu })
}

// Countdown component
function DeliveryCountdown({ date }: { date: Date }) {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return (
      <span className="text-green-600 font-medium">Ma érkezik!</span>
    )
  }

  if (diffDays === 1) {
    return (
      <span className="text-amber-600 font-medium">Holnap</span>
    )
  }

  return (
    <span className="font-medium">{diffDays} nap múlva</span>
  )
}

// Calendar visualization component
function DeliveryCalendar({
  deliveries,
  currentMonth,
  onMonthChange,
}: {
  deliveries: Delivery[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
}) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Padding for first week
  const startDay = getDay(monthStart)
  const paddingDays = startDay === 0 ? 6 : startDay - 1 // Monday = 0

  const getDeliveryForDay = (day: Date): Delivery | undefined => {
    return deliveries.find((d) => isSameDay(d.date, day))
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "delivered":
        return <Check className="h-3 w-3 text-green-600" />
      case "scheduled":
        return <Clock className="h-3 w-3 text-primary" />
      case "paused":
        return <Pause className="h-3 w-3 text-amber-600" />
      case "skipped":
        return <X className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="font-medium">
          {format(currentMonth, "yyyy. MMMM", { locale: hu })}
        </h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for padding */}
        {Array.from({ length: paddingDays }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const delivery = getDeliveryForDay(day)
          const isCurrentDay = isToday(day)
          const isPast = isBefore(day, new Date()) && !isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-md text-sm relative",
                isCurrentDay && "bg-primary/10 font-medium",
                isPast && "text-muted-foreground",
                delivery && "ring-1 ring-inset",
                delivery?.status === "delivered" && "ring-green-200 bg-green-50",
                delivery?.status === "scheduled" && "ring-primary/30 bg-primary/5",
                delivery?.status === "paused" && "ring-amber-200 bg-amber-50",
                delivery?.status === "skipped" && "ring-muted bg-muted/50"
              )}
            >
              <span>{format(day, "d")}</span>
              {delivery && (
                <div className="absolute bottom-0.5">
                  {getStatusIcon(delivery.status)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <Check className="h-3 w-3 text-green-600" />
          <span>Kiszállítva</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-primary" />
          <span>Ütemezett</span>
        </div>
        <div className="flex items-center gap-1">
          <Pause className="h-3 w-3 text-amber-600" />
          <span>Szüneteltetve</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="h-3 w-3 text-muted-foreground" />
          <span>Kihagyva</span>
        </div>
      </div>
    </div>
  )
}

// Pause dialog
function PauseDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (range: DateRange, reason: string) => void
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [reason, setReason] = useState("")

  const handleConfirm = () => {
    if (dateRange) {
      onConfirm(dateRange, reason)
      setDateRange(undefined)
      setReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Előfizetés szüneteltetése</DialogTitle>
          <DialogDescription>
            Válaszd ki, hogy mikortól meddig szeretnéd szüneteltetni az előfizetésedet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={{ before: addDays(new Date(), 1) }}
              numberOfMonths={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pause-reason">Megjegyzés (opcionális)</Label>
            <Textarea
              id="pause-reason"
              placeholder="Pl.: Nyaralás, költözés..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
          <Button onClick={handleConfirm} disabled={!dateRange?.from || !dateRange?.to}>
            Szüneteltetés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Skip dialog
function SkipDialog({
  open,
  onOpenChange,
  deliveries,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  deliveries: Delivery[]
  onConfirm: (date: Date) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const upcomingDeliveries = deliveries.filter(
    (d) => d.status === "scheduled" && !isBefore(d.date, new Date())
  )

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate)
      setSelectedDate(undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Szállítás kihagyása</DialogTitle>
          <DialogDescription>
            Válaszd ki, melyik ütemezett szállítást szeretnéd kihagyni.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedDate?.toISOString()}
          onValueChange={(val) => setSelectedDate(new Date(val))}
          className="space-y-2"
        >
          {upcomingDeliveries.map((delivery) => (
            <Label
              key={delivery.date.toISOString()}
              htmlFor={delivery.date.toISOString()}
              className="cursor-pointer"
            >
              <Card
                className={cn(
                  "transition-all",
                  selectedDate && isSameDay(selectedDate, delivery.date) && "ring-2 ring-primary"
                )}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{formatDate(delivery.date)}</span>
                  </div>
                  <RadioGroupItem
                    value={delivery.date.toISOString()}
                    id={delivery.date.toISOString()}
                  />
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDate}>
            Kihagyás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Cancel dialog
function CancelDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string, details: string) => void
}) {
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  const reasons = [
    { value: "too-much", label: "Túl sok kávém van" },
    { value: "too-expensive", label: "Túl drága" },
    { value: "quality", label: "Nem tetszik a minőség" },
    { value: "moving", label: "Költözöm" },
    { value: "other", label: "Egyéb" },
  ]

  const handleConfirm = () => {
    onConfirm(reason, details)
    setReason("")
    setDetails("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Előfizetés lemondása</DialogTitle>
          <DialogDescription>
            Sajnáljuk, hogy mész! Kérjük, oszd meg velünk a lemondás okát.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Lemondás oka</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Válassz egy okot..." />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-details">További részletek (opcionális)</Label>
            <Textarea
              id="cancel-details"
              placeholder="Oszd meg velünk, hogyan javíthatnánk..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason}
          >
            Lemondás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Modify sheet
function ModifySheet({
  open,
  onOpenChange,
  subscription,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription | null
  onSave: (updates: Partial<Subscription>) => void
}) {
  const [frequency, setFrequency] = useState(subscription?.frequency || "")
  const [timeWindow, setTimeWindow] = useState(subscription?.timeWindow || "")

  const frequencies = [
    { id: "daily", label: "Naponta", discount: 15 },
    { id: "weekly", label: "Hetente", discount: 10 },
    { id: "biweekly", label: "Kéthetente", discount: 7 },
    { id: "monthly", label: "Havonta", discount: 5 },
  ]

  const timeWindows = [
    { id: "morning", label: "Reggel (6-9)" },
    { id: "midday", label: "Délelőtt (9-12)" },
    { id: "afternoon", label: "Délután (14-17)" },
  ]

  const handleSave = () => {
    const selectedFreq = frequencies.find((f) => f.id === frequency)
    onSave({
      frequency,
      frequencyLabel: selectedFreq?.label || "",
      timeWindow,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Előfizetés módosítása</SheetTitle>
          <SheetDescription>
            Módosítsd az előfizetésed beállításait
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Frequency */}
          <div className="space-y-3">
            <Label>Gyakoriság</Label>
            <RadioGroup value={frequency} onValueChange={setFrequency}>
              {frequencies.map((freq) => (
                <Label
                  key={freq.id}
                  htmlFor={freq.id}
                  className="cursor-pointer"
                >
                  <Card
                    className={cn(
                      "transition-all",
                      frequency === freq.id && "ring-2 ring-primary"
                    )}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{freq.label}</span>
                        <Badge variant="secondary">-{freq.discount}%</Badge>
                      </div>
                      <RadioGroupItem value={freq.id} id={freq.id} />
                    </CardContent>
                  </Card>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Time window */}
          <div className="space-y-3">
            <Label>Kiszállítási időablak</Label>
            <RadioGroup value={timeWindow} onValueChange={setTimeWindow}>
              {timeWindows.map((tw) => (
                <Label key={tw.id} htmlFor={tw.id} className="cursor-pointer">
                  <Card
                    className={cn(
                      "transition-all",
                      timeWindow === tw.id && "ring-2 ring-primary"
                    )}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-medium">{tw.label}</span>
                      <RadioGroupItem value={tw.id} id={tw.id} />
                    </CardContent>
                  </Card>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Mentés
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Coffee className="h-16 w-16 text-primary/60" />
        </motion.div>
        <motion.div
          className="absolute -right-2 -top-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-secondary" />
        </motion.div>
      </div>
      <h3 className="font-serif text-2xl font-medium mb-2">
        Még nincs aktív előfizetésed
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Indíts egy előfizetést, és minden szállítással akár 15% kedvezményt kapsz.
        A friss kávé magától érkezik.
      </p>
      <Button asChild size="lg">
        <Link href={ROUTES.subscriptionNew}>
          <Package className="mr-2 h-5 w-5" />
          Indíts egyet
        </Link>
      </Button>
    </div>
  )
}

// Main component
export default function ElofizetesekPage() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const [skipDialogOpen, setSkipDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [modifySheetOpen, setModifySheetOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  
  // Demo toggle
  const [showEmpty, setShowEmpty] = useState(false)

  const displayedSubscriptions = showEmpty ? [] : subscriptions

  const handlePause = (range: DateRange, reason: string) => {
    if (selectedSubscription && range.from && range.to) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? { ...sub, status: "paused" as const, pausedUntil: range.to }
            : sub
        )
      )
      setPauseDialogOpen(false)
    }
  }

  const handleResume = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? { ...sub, status: "active" as const, pausedUntil: undefined }
          : sub
      )
    )
  }

  const handleSkip = (date: Date) => {
    if (selectedSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? {
                ...sub,
                deliveries: sub.deliveries.map((d) =>
                  isSameDay(d.date, date) ? { ...d, status: "skipped" as const } : d
                ),
              }
            : sub
        )
      )
      setSkipDialogOpen(false)
    }
  }

  const handleCancel = (reason: string, details: string) => {
    if (selectedSubscription) {
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== selectedSubscription.id))
      setCancelDialogOpen(false)
    }
  }

  const handleModify = (updates: Partial<Subscription>) => {
    if (selectedSubscription) {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id ? { ...sub, ...updates } : sub
        )
      )
      setModifySheetOpen(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Előfizetéseim
          </h1>
          <p className="text-muted-foreground">
            Aktív előfizetéseid és szállítási naptár
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEmpty(!showEmpty)}>
            {showEmpty ? "Mutasd" : "Üres állapot"}
          </Button>
          <Button asChild>
            <Link href={ROUTES.subscriptionNew}>
              <Package className="mr-2 h-4 w-4" />
              Új előfizetés
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {displayedSubscriptions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {displayedSubscriptions.map((sub) => (
            <Card key={sub.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Editorial header */}
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-background shadow-lg">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {sub.origin}
                        </p>
                        <h2 className="font-serif text-2xl font-medium">{sub.name}</h2>
                        <p className="text-sm text-muted-foreground">{sub.variant}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {sub.status === "active" ? (
                        <Badge variant="default" className="bg-green-600">
                          Aktív
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          Szüneteltetve {sub.pausedUntil && formatShortDate(sub.pausedUntil)}-ig
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
                  {/* Next delivery & info */}
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Következő szállítás</p>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-2xl font-medium">
                          {formatDate(sub.nextDelivery)}
                        </span>
                      </div>
                      <p className="text-primary mt-1">
                        <DeliveryCountdown date={sub.nextDelivery} />
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Gyakoriság
                        </span>
                        <span className="font-medium">{sub.frequencyLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Időablak
                        </span>
                        <span className="font-medium">{sub.timeWindow}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ár / szállítás</span>
                        <span className="font-mono font-medium flex items-center gap-2">
                          {formatPrice(sub.price)}
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            -{Math.round((1 - sub.price / sub.originalPrice) * 100)}%
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="p-6 lg:col-span-2">
                    <DeliveryCalendar
                      deliveries={sub.deliveries}
                      currentMonth={calendarMonth}
                      onMonthChange={setCalendarMonth}
                    />
                  </div>
                </div>

                {/* Actions footer */}
                <div className="border-t bg-muted/30 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubscription(sub)
                        setModifySheetOpen(true)
                      }}
                    >
                      <Settings className="mr-1 h-4 w-4" />
                      Módosítás
                    </Button>

                    {sub.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubscription(sub)
                          setPauseDialogOpen(true)
                        }}
                      >
                        <Pause className="mr-1 h-4 w-4" />
                        Szüneteltetés
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResume(sub.id)}
                      >
                        <Play className="mr-1 h-4 w-4" />
                        Folytatás
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubscription(sub)
                        setSkipDialogOpen(true)
                      }}
                    >
                      <SkipForward className="mr-1 h-4 w-4" />
                      Kihagyás
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedSubscription(sub)
                        setCancelDialogOpen(true)
                      }}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Lemondás
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <PauseDialog
        open={pauseDialogOpen}
        onOpenChange={setPauseDialogOpen}
        onConfirm={handlePause}
      />
      <SkipDialog
        open={skipDialogOpen}
        onOpenChange={setSkipDialogOpen}
        deliveries={selectedSubscription?.deliveries || []}
        onConfirm={handleSkip}
      />
      <CancelDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancel}
      />
      <ModifySheet
        open={modifySheetOpen}
        onOpenChange={setModifySheetOpen}
        subscription={selectedSubscription}
        onSave={handleModify}
      />
    </div>
  )
}
