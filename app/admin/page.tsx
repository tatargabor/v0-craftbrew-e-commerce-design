'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw,
  AlertTriangle,
  Package,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Mock data
const KPI_DATA = [
  {
    title: 'Mai bevétel',
    value: '487 320 Ft',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: 'vs. tegnap',
  },
  {
    title: 'Rendelések ma',
    value: '24',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: ShoppingCart,
    description: 'vs. tegnap',
  },
  {
    title: 'Aktív előfizetők',
    value: '1,247',
    change: '+3.1%',
    changeType: 'positive' as const,
    icon: RefreshCw,
    description: 'vs. múlt hét',
  },
  {
    title: 'Új regisztráció (7 nap)',
    value: '89',
    change: '-2.4%',
    changeType: 'negative' as const,
    icon: Users,
    description: 'vs. előző 7 nap',
  },
]

const REVENUE_DATA = [
  { day: 'Hét', revenue: 324000, orders: 18 },
  { day: 'Ked', revenue: 412000, orders: 24 },
  { day: 'Sze', revenue: 389000, orders: 21 },
  { day: 'Csü', revenue: 456000, orders: 26 },
  { day: 'Pén', revenue: 521000, orders: 32 },
  { day: 'Szo', revenue: 478000, orders: 28 },
  { day: 'Vas', revenue: 487000, orders: 24 },
]

const TOP_PRODUCTS = [
  {
    id: '1',
    name: 'Ethiopia Yirgacheffe',
    image: '/placeholder.svg?height=40&width=40',
    unitsSold: 47,
    revenue: 117500,
  },
  {
    id: '2',
    name: 'Colombia Huila',
    image: '/placeholder.svg?height=40&width=40',
    unitsSold: 38,
    revenue: 95000,
  },
  {
    id: '3',
    name: 'Kenya AA',
    image: '/placeholder.svg?height=40&width=40',
    unitsSold: 31,
    revenue: 86800,
  },
  {
    id: '4',
    name: 'Guatemala Antigua',
    image: '/placeholder.svg?height=40&width=40',
    unitsSold: 28,
    revenue: 70000,
  },
  {
    id: '5',
    name: 'Brazil Santos',
    image: '/placeholder.svg?height=40&width=40',
    unitsSold: 24,
    revenue: 52800,
  },
]

const LOW_STOCK = [
  { id: '1', name: 'Ethiopia Yirgacheffe 500g', stock: 3, threshold: 10 },
  { id: '2', name: 'Chemex 6 cup', stock: 2, threshold: 5 },
  { id: '3', name: 'Hario V60 02', stock: 5, threshold: 10 },
  { id: '4', name: 'Kenya AA 250g', stock: 8, threshold: 15 },
]

const AUDIT_LOG = [
  {
    id: '1',
    admin: 'Kovács Anna',
    action: 'Új termék hozzáadva: Rwanda Nyungwe',
    timestamp: '14:32',
  },
  {
    id: '2',
    admin: 'Nagy Péter',
    action: 'Rendelés #CB-20260415-042 kiszállítva',
    timestamp: '13:45',
  },
  {
    id: '3',
    admin: 'Kovács Anna',
    action: 'Kupon létrehozva: SPRING20',
    timestamp: '12:18',
  },
  {
    id: '4',
    admin: 'Nagy Péter',
    action: 'Előfizetés szüneteltetve: #SUB-0892',
    timestamp: '11:02',
  },
  {
    id: '5',
    admin: 'Szabó Márk',
    action: 'Értékelés jóváhagyva: Ethiopia Yirgacheffe',
    timestamp: '10:30',
  },
]

const chartConfig = {
  revenue: {
    label: 'Bevétel',
    color: 'hsl(var(--primary))',
  },
  orders: {
    label: 'Rendelések',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig

function formatCurrency(value: number) {
  return new Intl.NumberFormat('hu-HU').format(value) + ' Ft'
}

function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  isLoading,
}: {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: React.ElementType
  description: string
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span
            className={cn(
              'flex items-center font-medium',
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {changeType === 'positive' ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Package className="h-10 w-10 text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Üdv, Admin! Itt a mai összefoglaló.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI_DATA.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} isLoading={isLoading} />
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Bevétel (7 nap)
          </CardTitle>
          <CardDescription>
            Napi bevétel és rendelésszám az elmúlt héten
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          if (name === 'revenue') {
                            return [formatCurrency(value as number), 'Bevétel']
                          }
                          return [value, 'Rendelések']
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Two Column Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top termékek ma</CardTitle>
              <CardDescription>Legtöbbet eladott termékek</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.adminProducts}>
                Összes
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : TOP_PRODUCTS.length === 0 ? (
              <EmptyState message="Még nincs adat" />
            ) : (
              <div className="space-y-4">
                {TOP_PRODUCTS.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.unitsSold} db eladva
                      </p>
                    </div>
                    <span className="text-sm font-mono">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Alacsony készlet
              </CardTitle>
              <CardDescription>Termékek, amik hamarosan elfogynak</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`${ROUTES.adminProducts}?filter=low-stock`}>
                Összes
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : LOW_STOCK.length === 0 ? (
              <EmptyState message="Minden készleten van" />
            ) : (
              <div className="space-y-4">
                {LOW_STOCK.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md',
                        item.stock <= 3
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      )}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Küszöb: {item.threshold} db
                      </p>
                    </div>
                    <Badge
                      variant={item.stock <= 3 ? 'destructive' : 'secondary'}
                      className="font-mono"
                    >
                      {item.stock} db
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Legutóbbi műveletek</CardTitle>
            <CardDescription>Admin tevékenységek naplója</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            Teljes napló
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : AUDIT_LOG.length === 0 ? (
            <EmptyState message="Még nincs adat" />
          ) : (
            <div className="space-y-4">
              {AUDIT_LOG.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-muted">
                      {log.admin.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      <span className="font-medium">{log.admin}</span>
                      {' · '}
                      <span className="text-muted-foreground">{log.action}</span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
