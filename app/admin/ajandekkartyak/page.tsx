"use client"

import * as React from "react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import {
  Search,
  Gift,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface Transaction {
  id: string
  date: Date
  type: "PURCHASE" | "REDEMPTION"
  amount: number
  user: string
  balanceAfter: number
}

interface GiftCard {
  id: string
  code: string
  originalAmount: number
  balance: number
  purchasedBy: string
  purchasedByEmail: string
  expiresAt: Date
  status: "active" | "depleted" | "expired"
  transactions: Transaction[]
}

// Generate random code
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const part1 = Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("")
  const part2 = Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("")
  return `GC-${part1}-${part2}`
}

// Seeded data
const INITIAL_GIFT_CARDS: GiftCard[] = [
  {
    id: "1",
    code: "GC-ABCD-1234",
    originalAmount: 10000,
    balance: 4500,
    purchasedBy: "Kiss Péter",
    purchasedByEmail: "peter@example.com",
    expiresAt: new Date("2027-03-15"),
    status: "active",
    transactions: [
      {
        id: "t1",
        date: new Date("2026-03-15"),
        type: "PURCHASE",
        amount: 10000,
        user: "Kiss Péter",
        balanceAfter: 10000,
      },
      {
        id: "t2",
        date: new Date("2026-03-20"),
        type: "REDEMPTION",
        amount: -3500,
        user: "Nagy Anna",
        balanceAfter: 6500,
      },
      {
        id: "t3",
        date: new Date("2026-04-02"),
        type: "REDEMPTION",
        amount: -2000,
        user: "Nagy Anna",
        balanceAfter: 4500,
      },
    ],
  },
  {
    id: "2",
    code: "GC-WXYZ-5678",
    originalAmount: 20000,
    balance: 20000,
    purchasedBy: "Szabó Éva",
    purchasedByEmail: "eva@example.com",
    expiresAt: new Date("2027-06-01"),
    status: "active",
    transactions: [
      {
        id: "t4",
        date: new Date("2026-06-01"),
        type: "PURCHASE",
        amount: 20000,
        user: "Szabó Éva",
        balanceAfter: 20000,
      },
    ],
  },
  {
    id: "3",
    code: "GC-MNOP-9012",
    originalAmount: 5000,
    balance: 0,
    purchasedBy: "Tóth Gábor",
    purchasedByEmail: "gabor@example.com",
    expiresAt: new Date("2027-01-15"),
    status: "depleted",
    transactions: [
      {
        id: "t5",
        date: new Date("2026-01-15"),
        type: "PURCHASE",
        amount: 5000,
        user: "Tóth Gábor",
        balanceAfter: 5000,
      },
      {
        id: "t6",
        date: new Date("2026-02-10"),
        type: "REDEMPTION",
        amount: -5000,
        user: "Kovács Mária",
        balanceAfter: 0,
      },
    ],
  },
  {
    id: "4",
    code: "GC-QRST-3456",
    originalAmount: 15000,
    balance: 8000,
    purchasedBy: "Fehér Zsolt",
    purchasedByEmail: "zsolt@example.com",
    expiresAt: new Date("2025-12-31"),
    status: "expired",
    transactions: [
      {
        id: "t7",
        date: new Date("2024-12-31"),
        type: "PURCHASE",
        amount: 15000,
        user: "Fehér Zsolt",
        balanceAfter: 15000,
      },
      {
        id: "t8",
        date: new Date("2025-03-15"),
        type: "REDEMPTION",
        amount: -7000,
        user: "Horváth Kata",
        balanceAfter: 8000,
      },
    ],
  },
]

export default function GiftCardsPage() {
  const [giftCards] = React.useState<GiftCard[]>(INITIAL_GIFT_CARDS)
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("active")
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState<GiftCard | null>(null)

  // Filter by tab and search
  const filteredCards = giftCards.filter((card) => {
    if (activeTab !== "all" && card.status !== activeTab) {
      return false
    }
    if (
      search &&
      !card.code.toLowerCase().includes(search.toLowerCase()) &&
      !card.purchasedBy.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Counts
  const counts = {
    active: giftCards.filter((c) => c.status === "active").length,
    depleted: giftCards.filter((c) => c.status === "depleted").length,
    expired: giftCards.filter((c) => c.status === "expired").length,
  }

  // Format currency
  function formatCurrency(amount: number) {
    return amount.toLocaleString("hu-HU") + " Ft"
  }

  // Status badge variant
  function getStatusBadge(status: GiftCard["status"]) {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Aktív
          </Badge>
        )
      case "depleted":
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-500">
            Lemerült
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="border-red-400 text-red-500">
            Lejárt
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Ajándékkártyák
          </h1>
          <p className="text-sm text-muted-foreground">
            Ajándékkártyák kezelése és tranzakciók megtekintése
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Keresés kód vagy vásárló alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs + Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Aktív ({counts.active})
          </TabsTrigger>
          <TabsTrigger value="depleted">
            Lemerült ({counts.depleted})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Lejárt ({counts.expired})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kód</TableHead>
                  <TableHead>Eredeti összeg</TableHead>
                  <TableHead>Egyenleg</TableHead>
                  <TableHead>Vásárló</TableHead>
                  <TableHead>Lejárat</TableHead>
                  <TableHead>Státusz</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Gift className="size-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          Nincs találat
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                          {card.code}
                        </code>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(card.originalAmount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-mono ${
                            card.balance === 0
                              ? "text-muted-foreground"
                              : card.balance < card.originalAmount * 0.2
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          {formatCurrency(card.balance)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{card.purchasedBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {card.purchasedByEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(card.expiresAt, "yyyy. MM. dd.", { locale: hu })}
                      </TableCell>
                      <TableCell>{getStatusBadge(card.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCard(card)
                            setDetailOpen(true)
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="size-5" />
              Ajándékkártya részletei
            </DialogTitle>
            <DialogDescription>
              Tranzakciók és egyenleg információk
            </DialogDescription>
          </DialogHeader>

          {selectedCard && (
            <div className="space-y-6 py-4">
              {/* Card Info */}
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Kód</p>
                    <code className="font-mono font-medium">
                      {selectedCard.code}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Státusz</p>
                    {getStatusBadge(selectedCard.status)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Eredeti összeg
                    </p>
                    <p className="font-mono font-medium">
                      {formatCurrency(selectedCard.originalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Aktuális egyenleg
                    </p>
                    <p
                      className={`font-mono font-medium ${
                        selectedCard.balance === 0
                          ? "text-muted-foreground"
                          : "text-green-600"
                      }`}
                    >
                      {formatCurrency(selectedCard.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vásárló</p>
                    <p className="font-medium">{selectedCard.purchasedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCard.purchasedByEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lejárat</p>
                    <p className="font-medium">
                      {format(selectedCard.expiresAt, "yyyy. MMMM d.", {
                        locale: hu,
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Transaction Log */}
              <div>
                <h4 className="mb-3 font-medium">Tranzakciók</h4>
                <div className="space-y-2">
                  {selectedCard.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full ${
                            tx.type === "PURCHASE"
                              ? "bg-green-100 text-green-600"
                              : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {tx.type === "PURCHASE" ? (
                            <ArrowDownLeft className="size-4" />
                          ) : (
                            <ArrowUpRight className="size-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {tx.type === "PURCHASE" ? "Vásárlás" : "Beváltás"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.user} ·{" "}
                            {format(tx.date, "yyyy. MM. dd.", { locale: hu })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-mono font-medium ${
                            tx.amount > 0 ? "text-green-600" : "text-amber-600"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Egyenleg: {formatCurrency(tx.balanceAfter)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Bezárás</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
