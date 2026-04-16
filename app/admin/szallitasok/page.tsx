"use client"

import * as React from "react"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { hu } from "date-fns/locale"
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Printer,
  RefreshCw,
  Truck,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface Delivery {
  id: string
  orderId: string
  time: string
  customer: {
    name: string
    phone: string
  }
  address: {
    short: string
    full: string
  }
  items: {
    name: string
    variant: string
    quantity: number
  }[]
  zone: "budapest" | "+20km" | "+40km"
  type: "subscription" | "single"
  status: "pending" | "delivered"
  timeWindow: "morning" | "forenoon" | "afternoon"
}

// Time windows configuration
const TIME_WINDOWS = {
  morning: { label: "Reggel", time: "6:00–9:00", icon: "🌅" },
  forenoon: { label: "Délelőtt", time: "9:00–12:00", icon: "☀️" },
  afternoon: { label: "Délután", time: "14:00–17:00", icon: "🌤️" },
} as const

// Zone badge colors
const ZONE_COLORS = {
  budapest: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  "+20km": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "+40km": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
}

// Mock data generator
function generateMockDeliveries(date: Date): Delivery[] {
  const dayOfWeek = date.getDay()
  
  // No deliveries on Sunday
  if (dayOfWeek === 0) return []
  
  // Fewer deliveries on Saturday
  const baseCount = dayOfWeek === 6 ? 4 : 12
  
  const customers = [
    { name: "Kovács Anna", phone: "+36 30 123 4567" },
    { name: "Nagy Péter", phone: "+36 20 234 5678" },
    { name: "Szabó Éva", phone: "+36 70 345 6789" },
    { name: "Tóth Gábor", phone: "+36 30 456 7890" },
    { name: "Horváth Kata", phone: "+36 20 567 8901" },
    { name: "Kiss Márton", phone: "+36 70 678 9012" },
    { name: "Molnár Zsófia", phone: "+36 30 789 0123" },
    { name: "Varga Balázs", phone: "+36 20 890 1234" },
    { name: "Balogh Réka", phone: "+36 70 901 2345" },
    { name: "Fekete Dániel", phone: "+36 30 012 3456" },
    { name: "Lakatos Eszter", phone: "+36 20 123 4567" },
    { name: "Simon András", phone: "+36 70 234 5678" },
  ]
  
  const addresses = [
    { short: "Andrássy út 42.", full: "1061 Budapest, Andrássy út 42. 3/12" },
    { short: "Váci utca 15.", full: "1052 Budapest, Váci utca 15. fszt. 2" },
    { short: "Dózsa Gy. út 88.", full: "1068 Budapest, Dózsa György út 88. 5/3" },
    { short: "Bartók B. út 134.", full: "1115 Budapest, Bartók Béla út 134. 2/8" },
    { short: "Üllői út 255.", full: "1191 Budapest, Üllői út 255." },
    { short: "Szentendrei út 12.", full: "2000 Szentendre, Szentendrei út 12." },
    { short: "Fő tér 5.", full: "2030 Érd, Fő tér 5. 1/4" },
    { short: "Kossuth L. u. 78.", full: "2100 Gödöllő, Kossuth Lajos u. 78." },
  ]
  
  const products = [
    { name: "Ethiopia Yirgacheffe", variant: "250g, Szemes" },
    { name: "Colombia Supremo", variant: "500g, Őrölt" },
    { name: "Brazil Santos", variant: "1kg, Szemes" },
    { name: "Kenya AA", variant: "250g, Őrölt" },
    { name: "Guatemala Antigua", variant: "500g, Szemes" },
    { name: "Starter Kit", variant: "Csomag" },
  ]
  
  const deliveries: Delivery[] = []
  
  for (let i = 0; i < baseCount; i++) {
    const customer = customers[i % customers.length]
    const address = addresses[i % addresses.length]
    const product = products[i % products.length]
    const isSubscription = i % 3 !== 0
    const zone = i < 8 ? "budapest" : i < 10 ? "+20km" : "+40km"
    const timeWindow = i < 3 ? "morning" : i < 8 ? "forenoon" : "afternoon"
    
    // Randomly mark some as delivered if viewing past/today
    const isPast = date < new Date() && !isToday(date)
    const isDelivered = isPast || (isToday(date) && i < 4)
    
    deliveries.push({
      id: `del-${format(date, "yyyyMMdd")}-${i + 1}`,
      orderId: `CB-${format(date, "yyyyMMdd")}-${String(i + 1).padStart(3, "0")}`,
      time: timeWindow === "morning" 
        ? `${6 + (i % 3)}:${i % 2 === 0 ? "00" : "30"}`
        : timeWindow === "forenoon"
        ? `${9 + (i % 3)}:${i % 2 === 0 ? "00" : "30"}`
        : `${14 + (i % 3)}:${i % 2 === 0 ? "00" : "30"}`,
      customer,
      address,
      items: [
        { ...product, quantity: 1 + (i % 2) },
        ...(i % 4 === 0 ? [{ name: "CraftBrew Bögre", variant: "Fehér", quantity: 1 }] : []),
      ],
      zone,
      type: isSubscription ? "subscription" : "single",
      status: isDelivered ? "delivered" : "pending",
      timeWindow,
    })
  }
  
  return deliveries
}

// Format date for display
function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Ma"
  if (isTomorrow(date)) return "Holnap"
  if (isYesterday(date)) return "Tegnap"
  return format(date, "yyyy. MMMM d., EEEE", { locale: hu })
}

// Delivery row component
function DeliveryRow({
  delivery,
  isSelected,
  onSelect,
  onStatusChange,
}: {
  delivery: Delivery
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onStatusChange: (delivered: boolean) => void
}) {
  const isDelivered = delivery.status === "delivered"
  
  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-lg border p-4 transition-colors print:border-gray-300 print:p-2",
        isDelivered 
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20" 
          : "border-border bg-card hover:bg-muted/50",
        isSelected && !isDelivered && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {/* Checkbox */}
      <div className="print:hidden">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={isDelivered}
          aria-label={`Kiválasztás: ${delivery.customer.name}`}
        />
      </div>
      
      {/* Print checkbox */}
      <div className="hidden size-4 border border-gray-400 print:block" />
      
      {/* Time */}
      <div className="w-14 shrink-0 text-center">
        <span className="font-mono text-sm font-medium">{delivery.time}</span>
      </div>
      
      {/* Customer */}
      <div className="w-36 shrink-0">
        <p className="font-medium text-sm truncate">{delivery.customer.name}</p>
        <p className="text-xs text-muted-foreground print:text-gray-600">{delivery.customer.phone}</p>
      </div>
      
      {/* Address */}
      <div className="w-40 shrink-0">
        <p className="text-sm truncate" title={delivery.address.full}>
          {delivery.address.short}
        </p>
      </div>
      
      {/* Items */}
      <div className="min-w-0 flex-1">
        {delivery.items.map((item, idx) => (
          <p key={idx} className="text-sm truncate">
            <span className="font-medium">{item.quantity}×</span>{" "}
            {item.name}
            <span className="text-muted-foreground print:text-gray-500"> · {item.variant}</span>
          </p>
        ))}
      </div>
      
      {/* Badges */}
      <div className="flex shrink-0 items-center gap-2 print:hidden">
        <Badge variant="outline" className={cn("text-xs", ZONE_COLORS[delivery.zone])}>
          {delivery.zone === "budapest" ? "BP" : delivery.zone}
        </Badge>
        {delivery.type === "subscription" && (
          <Badge variant="secondary" className="text-xs">
            <RefreshCw className="mr-1 size-3" />
            Előf.
          </Badge>
        )}
      </div>
      
      {/* Status */}
      <div className="w-28 shrink-0 text-right print:hidden">
        {isDelivered ? (
          <Badge className="bg-emerald-600 hover:bg-emerald-600">
            <Check className="mr-1 size-3" />
            Kézbesítve
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <CheckCircle2 className="mr-1 size-3" />
            Kész
          </Button>
        )}
      </div>
      
      {/* Print status */}
      <div className="hidden w-20 text-right print:block">
        {isDelivered ? "✓" : "○"}
      </div>
    </div>
  )
}

// Skeleton row
function DeliveryRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="size-4 rounded" />
      <Skeleton className="h-4 w-14" />
      <div className="w-36 space-y-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-12 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  )
}

// Empty state
function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          {/* Truck illustration */}
          <div className="flex size-24 items-center justify-center rounded-full bg-muted">
            <Truck className="size-12 text-muted-foreground" />
          </div>
          <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-background shadow">
            <Check className="size-4 text-emerald-600" />
          </div>
        </div>
        <h3 className="mb-2 font-serif text-xl">Nincs ütemezett szállítás</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Erre a napra nincs szállítás ütemezve. Válassz másik napot a naptárból.
        </p>
      </CardContent>
    </Card>
  )
}

// Summary bar
function SummaryBar({ deliveries }: { deliveries: Delivery[] }) {
  const total = deliveries.length
  const subscriptions = deliveries.filter(d => d.type === "subscription").length
  const singles = deliveries.filter(d => d.type === "single").length
  const budapest = deliveries.filter(d => d.zone === "budapest").length
  const plus20 = deliveries.filter(d => d.zone === "+20km").length
  const plus40 = deliveries.filter(d => d.zone === "+40km").length
  const delivered = deliveries.filter(d => d.status === "delivered").length
  
  return (
    <div className="sticky bottom-0 z-10 -mx-6 -mb-6 border-t bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 print:hidden">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <span className="font-medium">Összesen: {total}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-4">
          <span>
            <RefreshCw className="mr-1 inline size-3 text-muted-foreground" />
            Előfizetés: <strong>{subscriptions}</strong>
          </span>
          <span>
            Egyszeri: <strong>{singles}</strong>
          </span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-4">
          <span className={ZONE_COLORS.budapest.replace("bg-", "text-").split(" ")[0]}>
            Budapest: <strong>{budapest}</strong>
          </span>
          {plus20 > 0 && (
            <span className={ZONE_COLORS["+20km"].replace("bg-", "text-").split(" ")[0]}>
              +20km: <strong>{plus20}</strong>
            </span>
          )}
          {plus40 > 0 && (
            <span className={ZONE_COLORS["+40km"].replace("bg-", "text-").split(" ")[0]}>
              +40km: <strong>{plus40}</strong>
            </span>
          )}
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>Kézbesítve: <strong>{delivered}/{total}</strong></span>
        </div>
      </div>
    </div>
  )
}

// Print header
function PrintHeader({ date }: { date: Date }) {
  return (
    <div className="mb-6 hidden print:block">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">CraftBrew Szállítások</h1>
          <p className="text-gray-600">{format(date, "yyyy. MMMM d., EEEE", { locale: hu })}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Nyomtatva: {format(new Date(), "yyyy.MM.dd HH:mm")}</p>
        </div>
      </div>
    </div>
  )
}

// Main component
export default function DeliveriesPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [deliveries, setDeliveries] = React.useState<Delivery[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [showBulkDialog, setShowBulkDialog] = React.useState(false)
  
  // Load deliveries when date changes
  React.useEffect(() => {
    setLoading(true)
    setSelectedIds(new Set())
    
    // Simulate API call
    const timer = setTimeout(() => {
      setDeliveries(generateMockDeliveries(selectedDate))
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [selectedDate])
  
  // Group deliveries by time window
  const groupedDeliveries = React.useMemo(() => {
    const groups: Record<keyof typeof TIME_WINDOWS, Delivery[]> = {
      morning: [],
      forenoon: [],
      afternoon: [],
    }
    
    deliveries.forEach(delivery => {
      groups[delivery.timeWindow].push(delivery)
    })
    
    return groups
  }, [deliveries])
  
  // Pending deliveries for bulk actions
  const pendingDeliveries = deliveries.filter(d => d.status === "pending")
  const selectedPendingCount = [...selectedIds].filter(
    id => deliveries.find(d => d.id === id)?.status === "pending"
  ).length
  
  // Handle single delivery status change
  const handleStatusChange = (id: string, delivered: boolean) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === id ? { ...d, status: delivered ? "delivered" : "pending" } : d
      )
    )
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    
    const delivery = deliveries.find(d => d.id === id)
    if (delivery) {
      toast.success(`${delivery.customer.name} szállítása kézbesítettnek jelölve`)
    }
  }
  
  // Handle bulk mark as delivered
  const handleBulkDeliver = () => {
    const idsToUpdate = selectedIds.size > 0 
      ? [...selectedIds] 
      : pendingDeliveries.map(d => d.id)
    
    setDeliveries(prev =>
      prev.map(d =>
        idsToUpdate.includes(d.id) ? { ...d, status: "delivered" } : d
      )
    )
    setSelectedIds(new Set())
    setShowBulkDialog(false)
    
    toast.success(`${idsToUpdate.length} szállítás kézbesítettnek jelölve`)
  }
  
  // Handle select all in a group
  const handleSelectGroup = (timeWindow: keyof typeof TIME_WINDOWS, checked: boolean) => {
    const groupIds = groupedDeliveries[timeWindow]
      .filter(d => d.status === "pending")
      .map(d => d.id)
    
    setSelectedIds(prev => {
      const next = new Set(prev)
      groupIds.forEach(id => {
        if (checked) {
          next.add(id)
        } else {
          next.delete(id)
        }
      })
      return next
    })
  }
  
  // Handle print
  const handlePrint = () => {
    window.print()
  }
  
  return (
    <div className="flex flex-col gap-6 p-6 print:p-0">
      <PrintHeader date={selectedDate} />
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="font-serif text-2xl font-bold">Szállítások</h1>
          <p className="text-muted-foreground">
            {formatDateLabel(selectedDate)}
            {!isToday(selectedDate) && !isTomorrow(selectedDate) && !isYesterday(selectedDate) && (
              <span> · {format(selectedDate, "yyyy. MMMM d.", { locale: hu })}</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 size-4" />
                {format(selectedDate, "yyyy. MMM d.", { locale: hu })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={hu}
              />
            </PopoverContent>
          </Popover>
          
          {/* Print button */}
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="size-4" />
            <span className="sr-only">Nyomtatás</span>
          </Button>
          
          {/* Bulk deliver button */}
          {pendingDeliveries.length > 0 && (
            <Button
              onClick={() => setShowBulkDialog(true)}
              disabled={selectedPendingCount === 0 && pendingDeliveries.length === 0}
            >
              <CheckCircle2 className="mr-2 size-4" />
              {selectedPendingCount > 0
                ? `Kijelöltek kézbesítve (${selectedPendingCount})`
                : "Mind kézbesítve"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {(["morning", "forenoon", "afternoon"] as const).map((window) => (
            <div key={window} className="space-y-3">
              <Skeleton className="h-6 w-48" />
              {[1, 2, 3].map((i) => (
                <DeliveryRowSkeleton key={i} />
              ))}
            </div>
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <EmptyState />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-6 print:p-0">
            <div className="space-y-8">
              {(["morning", "forenoon", "afternoon"] as const).map((timeWindow) => {
                const windowDeliveries = groupedDeliveries[timeWindow]
                if (windowDeliveries.length === 0) return null
                
                const windowConfig = TIME_WINDOWS[timeWindow]
                const pendingInGroup = windowDeliveries.filter(d => d.status === "pending")
                const allSelected = pendingInGroup.length > 0 && 
                  pendingInGroup.every(d => selectedIds.has(d.id))
                const someSelected = pendingInGroup.some(d => selectedIds.has(d.id))
                
                return (
                  <div key={timeWindow}>
                    {/* Sticky group header */}
                    <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center gap-3 border-b bg-card px-6 py-3 print:static print:border-gray-300 print:bg-gray-100">
                      <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                          if (el) {
                            (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = 
                              someSelected && !allSelected
                          }
                        }}
                        onCheckedChange={(checked) => handleSelectGroup(timeWindow, !!checked)}
                        disabled={pendingInGroup.length === 0}
                        className="print:hidden"
                        aria-label={`Mind kiválasztása: ${windowConfig.label}`}
                      />
                      <Clock className="size-4 text-muted-foreground print:hidden" />
                      <span className="font-medium">
                        {windowConfig.label}
                      </span>
                      <span className="text-muted-foreground print:text-gray-600">
                        ({windowConfig.time})
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {windowDeliveries.length} szállítás
                      </Badge>
                    </div>
                    
                    {/* Delivery rows */}
                    <div className="space-y-2">
                      {windowDeliveries.map((delivery) => (
                        <DeliveryRow
                          key={delivery.id}
                          delivery={delivery}
                          isSelected={selectedIds.has(delivery.id)}
                          onSelect={(checked) => {
                            setSelectedIds(prev => {
                              const next = new Set(prev)
                              if (checked) {
                                next.add(delivery.id)
                              } else {
                                next.delete(delivery.id)
                              }
                              return next
                            })
                          }}
                          onStatusChange={(delivered) => handleStatusChange(delivery.id, delivered)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Summary bar */}
            <SummaryBar deliveries={deliveries} />
          </CardContent>
        </Card>
      )}
      
      {/* Bulk confirmation dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Szállítások kézbesítése</DialogTitle>
            <DialogDescription>
              {selectedPendingCount > 0
                ? `${selectedPendingCount} kijelölt szállítást jelölsz kézbesítettnek.`
                : `Mind a ${pendingDeliveries.length} függőben lévő szállítást kézbesítettnek jelölöd.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Mégse
            </Button>
            <Button onClick={handleBulkDeliver}>
              <Check className="mr-2 size-4" />
              Kézbesítés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          
          main {
            visibility: visible !important;
          }
          
          main * {
            visibility: visible !important;
          }
          
          nav, aside, header, footer, [data-slot="sidebar"] {
            display: none !important;
          }
          
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
