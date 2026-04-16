"use client"

import * as React from "react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import {
  Search,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Package,
  RefreshCw,
} from "lucide-react"
import { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  OrderDetailSheet,
  Order,
  OrderStatus,
} from "@/components/admin/order-detail-sheet"

// Status configuration
const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Minden státusz" },
  { value: "new", label: "Új" },
  { value: "processing", label: "Feldolgozás" },
  { value: "packed", label: "Csomagolva" },
  { value: "shipping", label: "Szállítás" },
  { value: "delivered", label: "Kézbesítve" },
  { value: "cancelled", label: "Lemondva" },
  { value: "returning", label: "Visszaküldés" },
]

const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  packed: "bg-orange-100 text-orange-800 border-orange-200",
  shipping: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  returning: "bg-gray-100 text-gray-800 border-gray-200",
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Új",
  processing: "Feldolgozás",
  packed: "Csomagolva",
  shipping: "Szállítás",
  delivered: "Kézbesítve",
  cancelled: "Lemondva",
  returning: "Visszaküldés",
}

// Mock data generator
function generateMockOrders(): Order[] {
  const statuses: OrderStatus[] = ["new", "processing", "packed", "shipping", "delivered", "cancelled", "returning"]
  const names = ["Kovács Anna", "Nagy Péter", "Szabó Márta", "Tóth Gábor", "Kiss Éva", "Horváth László"]
  const products = [
    { name: "Ethiopia Yirgacheffe", variant: "250g, Egész szem", price: 3490, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop" },
    { name: "Colombia Supremo", variant: "500g, Őrölt", price: 4990, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop" },
    { name: "Brazil Santos", variant: "1kg, Egész szem", price: 7990, image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=100&h=100&fit=crop" },
  ]

  return Array.from({ length: 50 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const name = names[Math.floor(Math.random() * names.length)]
    const orderItems = products
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((p, idx) => ({
        id: `item-${i}-${idx}`,
        ...p,
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: p.price,
      }))
    
    const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const shipping = subtotal > 15000 ? 0 : 990
    const couponDiscount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0
    const giftCard = Math.random() > 0.9 ? 5000 : 0
    const total = subtotal - couponDiscount - giftCard + shipping
    const vat = Math.floor(total * 0.27 / 1.27)

    // Build timeline based on status
    const timeline: Order["timeline"] = [{ status: "new", timestamp: createdAt, adminName: "Rendszer" }]
    const statusOrder: OrderStatus[] = ["new", "processing", "packed", "shipping", "delivered"]
    const currentIndex = statusOrder.indexOf(status)
    
    if (currentIndex > 0) {
      for (let j = 1; j <= currentIndex; j++) {
        timeline.push({
          status: statusOrder[j],
          timestamp: new Date(createdAt.getTime() + j * 4 * 60 * 60 * 1000),
          adminName: "Admin User",
        })
      }
    }
    
    if (status === "cancelled") {
      timeline.push({ status: "cancelled", timestamp: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000), adminName: "Admin User" })
    }
    
    if (status === "returning") {
      timeline.push(
        { status: "delivered", timestamp: new Date(createdAt.getTime() + 4 * 24 * 60 * 60 * 1000), adminName: "Futár" },
        { status: "returning", timestamp: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000), adminName: "Admin User" }
      )
    }

    return {
      id: `order-${i + 1}`,
      orderNumber: `#CB-${format(createdAt, "yyyyMMdd")}-${String(i + 1).padStart(3, "0")}`,
      stripePaymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
      status,
      customer: {
        name,
        email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
        phone: `+36 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
        previousOrders: Math.floor(Math.random() * 10),
      },
      shipping: {
        address: `Példa utca ${Math.floor(Math.random() * 100) + 1}.`,
        city: "Budapest",
        postalCode: `${Math.floor(Math.random() * 23 + 1)}${Math.floor(Math.random() * 90 + 10).toString().padStart(2, "0")}`,
        zone: (["budapest", "20km", "40km"] as const)[Math.floor(Math.random() * 3)],
        method: Math.random() > 0.2 ? "delivery" : "pickup",
        estimatedDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
      items: orderItems,
      totals: {
        subtotal,
        couponDiscount,
        giftCard,
        shipping,
        vat,
        total,
      },
      timeline,
      createdAt,
    }
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
}

// Loading skeleton
function TableSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

// Empty state
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={6} className="h-64">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Nincs találat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Próbálj más szűrési feltételeket használni.
            </p>
            <Button variant="outline" className="mt-4" onClick={onReset}>
              Szűrők törlése
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

// Error state
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Hiba történt</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Nem sikerült betölteni a rendeléseket.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Újra
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default function AdminOrdersPage() {
  // State
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  
  // Filters
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | "all">("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Pagination
  const [page, setPage] = React.useState(1)
  const pageSize = 10
  
  // Detail sheet
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Load orders
  React.useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(false)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setOrders(generateMockOrders())
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false
      
      // Date range filter
      if (dateRange?.from && order.createdAt < dateRange.from) return false
      if (dateRange?.to) {
        const endOfDay = new Date(dateRange.to)
        endOfDay.setHours(23, 59, 59, 999)
        if (order.createdAt > endOfDay) return false
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query)
        const matchesCustomer = order.customer.name.toLowerCase().includes(query)
        const matchesEmail = order.customer.email.toLowerCase().includes(query)
        if (!matchesOrderNumber && !matchesCustomer && !matchesEmail) return false
      }
      
      return true
    })
  }, [orders, statusFilter, dateRange, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize)
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize)

  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all")
    setDateRange(undefined)
    setSearchQuery("")
    setPage(1)
  }

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus, reason?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order
        return {
          ...order,
          status: newStatus,
          timeline: [
            ...order.timeline,
            {
              status: newStatus,
              timestamp: new Date(),
              adminName: "Admin User",
            },
          ],
        }
      })
    )
    
    // Update selected order if it's the one being changed
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => {
        if (!prev) return null
        return {
          ...prev,
          status: newStatus,
          timeline: [
            ...prev.timeline,
            {
              status: newStatus,
              timestamp: new Date(),
              adminName: "Admin User",
            },
          ],
        }
      })
    }
  }

  // Open order detail
  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rendelések</h1>
        <p className="text-muted-foreground">
          Rendelések kezelése és feldolgozása
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as OrderStatus | "all")
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Státusz" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal sm:w-[280px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM d", { locale: hu })} -{" "}
                      {format(dateRange.to, "MMM d", { locale: hu })}
                    </>
                  ) : (
                    format(dateRange.from, "MMM d", { locale: hu })
                  )
                ) : (
                  <span className="text-muted-foreground">Dátum szűrés</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  setPage(1)
                }}
                numberOfMonths={2}
                locale={hu}
              />
            </PopoverContent>
          </Popover>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rendelés # vagy vásárló..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredOrders.length} rendelés
        </p>
      </div>

      {/* Error state */}
      {error && <ErrorState onRetry={() => window.location.reload()} />}

      {/* Table */}
      {!error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Szám</TableHead>
                <TableHead>Vásárló</TableHead>
                <TableHead className="w-[120px]">Dátum</TableHead>
                <TableHead className="w-[120px] text-right">Összeg</TableHead>
                <TableHead className="w-[140px]">Állapot</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            
            {loading ? (
              <TableSkeleton />
            ) : filteredOrders.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openOrderDetail(order)}
                  >
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(order.createdAt, "MMM d, HH:mm", { locale: hu })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatPrice(order.totals.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${STATUS_BADGE_STYLES[order.status]} border`}
                      >
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Részletek
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredOrders.length)} / {filteredOrders.length} rendelés
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 text-sm">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Order Detail Sheet */}
      <OrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
