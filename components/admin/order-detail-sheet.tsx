"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import {
  Copy,
  Check,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  AlertTriangle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// Types
export type OrderStatus =
  | "new"
  | "processing"
  | "packed"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "returning"

export interface OrderItem {
  id: string
  name: string
  variant: string
  quantity: number
  unitPrice: number
  image: string
}

export interface OrderTimeline {
  status: OrderStatus
  timestamp: Date
  adminName?: string
}

export interface Order {
  id: string
  orderNumber: string
  stripePaymentId: string
  status: OrderStatus
  customer: {
    name: string
    email: string
    phone: string
    previousOrders: number
  }
  shipping: {
    address: string
    city: string
    postalCode: string
    zone: "budapest" | "20km" | "40km"
    method: "delivery" | "pickup"
    estimatedDate: Date
  }
  items: OrderItem[]
  totals: {
    subtotal: number
    couponDiscount: number
    giftCard: number
    shipping: number
    vat: number
    total: number
  }
  timeline: OrderTimeline[]
  createdAt: Date
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  new: { label: "Új", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  processing: { label: "Feldolgozás", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Package },
  packed: { label: "Csomagolva", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Package },
  shipping: { label: "Szállítás", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
  delivered: { label: "Kézbesítve", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Lemondva", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  returning: { label: "Visszaküldés folyamatban", color: "bg-gray-100 text-gray-800 border-gray-200", icon: RotateCcw },
}

const STATUS_FLOW: OrderStatus[] = ["new", "processing", "packed", "shipping", "delivered"]

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={`${config.color} border`}>
      {config.label}
    </Badge>
  )
}

interface OrderDetailSheetProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, newStatus: OrderStatus, reason?: string) => void
}

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: OrderDetailSheetProps) {
  const [copied, setCopied] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false)
  const [cancelReason, setCancelReason] = React.useState("")
  const [confirmText, setConfirmText] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState(false)

  if (!order) return null

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status)
  const nextStatus = currentStatusIndex >= 0 && currentStatusIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentStatusIndex + 1]
    : null

  const canAdvance = order.status !== "cancelled" && order.status !== "returning" && nextStatus
  const canCancel = order.status !== "cancelled" && order.status !== "delivered" && order.status !== "returning"
  const canReturn = order.status === "delivered"

  const handleCopyPaymentId = async () => {
    await navigator.clipboard.writeText(order.stripePaymentId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Stripe Payment ID másolva")
  }

  const handleAdvanceStatus = async () => {
    if (!nextStatus) return
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onStatusChange(order.id, nextStatus)
    setIsUpdating(false)
    toast.success(`Státusz frissítve: ${STATUS_CONFIG[nextStatus].label}`)
  }

  const handleCancel = async () => {
    if (confirmText !== "LEMONDÁS") return
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onStatusChange(order.id, "cancelled", cancelReason)
    setIsUpdating(false)
    setCancelDialogOpen(false)
    setCancelReason("")
    setConfirmText("")
    toast.success("Rendelés lemondva")
  }

  const handleReturn = async () => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onStatusChange(order.id, "returning")
    setIsUpdating(false)
    setReturnDialogOpen(false)
    toast.success("Visszaküldés elindítva")
  }

  const getNextStatusLabel = () => {
    if (!nextStatus) return null
    const labels: Record<string, string> = {
      processing: "Feldolgozás",
      packed: "Csomagolva",
      shipping: "Szállítás",
      delivered: "Kézbesítve",
    }
    return labels[nextStatus]
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SheetTitle className="font-mono text-xl">
                  {order.orderNumber}
                </SheetTitle>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">{order.stripePaymentId}</span>
                  <button
                    onClick={handleCopyPaymentId}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Customer Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Vásárló</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${order.customer.email}`} className="text-primary hover:underline">
                    {order.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
                <Separator className="my-2" />
                <Link
                  href={`/admin/ugyfelek?email=${order.customer.email}`}
                  className="text-xs text-primary hover:underline"
                >
                  Korábbi rendelések: {order.customer.previousOrders}
                </Link>
              </CardContent>
            </Card>

            {/* Shipping Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Szállítás</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p>{order.shipping.address}</p>
                    <p>{order.shipping.postalCode} {order.shipping.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {order.shipping.zone === "budapest" ? "Budapest" : 
                     order.shipping.zone === "20km" ? "+20 km" : "+40 km"}
                  </Badge>
                  <span className="text-muted-foreground">
                    {order.shipping.method === "delivery" ? "Házhozszállítás" : "Személyes átvétel"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Várható: {format(order.shipping.estimatedDate, "yyyy. MMM d.", { locale: hu })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tételek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">{item.quantity} db</p>
                      <p className="font-mono">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Összesítés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Részösszeg</span>
                  <span className="font-mono">{formatPrice(order.totals.subtotal)}</span>
                </div>
                {order.totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Kupon kedvezmény</span>
                    <span className="font-mono">-{formatPrice(order.totals.couponDiscount)}</span>
                  </div>
                )}
                {order.totals.giftCard > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Ajándékkártya</span>
                    <span className="font-mono">-{formatPrice(order.totals.giftCard)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Szállítás</span>
                  <span className="font-mono">
                    {order.totals.shipping === 0 ? "Ingyenes" : formatPrice(order.totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ÁFA (27%)</span>
                  <span className="font-mono">{formatPrice(order.totals.vat)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Összesen</span>
                  <span className="font-mono">{formatPrice(order.totals.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Státusz előzmények</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4">
                  {order.timeline.map((event, index) => {
                    const config = STATUS_CONFIG[event.status]
                    const Icon = config.icon
                    const isLast = index === order.timeline.length - 1
                    
                    return (
                      <div key={index} className="relative flex gap-3">
                        {!isLast && (
                          <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                        )}
                        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background ${
                          isLast ? "border-primary" : "border-muted"
                        }`}>
                          <Icon className={`h-3 w-3 ${isLast ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`text-sm font-medium ${isLast ? "" : "text-muted-foreground"}`}>
                            {config.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(event.timestamp, "yyyy. MMM d. HH:mm", { locale: hu })}
                            {event.adminName && ` · ${event.adminName}`}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {canAdvance && (
                <Button
                  className="w-full"
                  onClick={handleAdvanceStatus}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Frissítés..." : getNextStatusLabel()}
                </Button>
              )}
              
              {canReturn && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setReturnDialogOpen(true)}
                  disabled={isUpdating}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Visszaküldés indítása
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isUpdating}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Lemondás
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Rendelés lemondása
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ez a művelet nem vonható vissza. A vásárló értesítést kap a lemondásról.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Lemondás oka</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Kérjük, adja meg a lemondás okát..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Írja be a megerősítéshez: <span className="font-mono font-bold">LEMONDÁS</span>
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="LEMONDÁS"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setCancelReason("")
              setConfirmText("")
            }}>
              Mégsem
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={confirmText !== "LEMONDÁS" || isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? "Feldolgozás..." : "Lemondás megerősítése"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Confirmation Dialog */}
      <AlertDialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Visszaküldés indítása</AlertDialogTitle>
            <AlertDialogDescription>
              A vásárló értesítést kap a visszaküldési folyamat elindításáról és a visszaküldési címkét.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégsem</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturn} disabled={isUpdating}>
              {isUpdating ? "Feldolgozás..." : "Visszaküldés indítása"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
