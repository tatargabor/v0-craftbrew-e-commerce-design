"use client"

import * as React from "react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  CalendarIcon,
  Ticket,
} from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

// Types
interface Coupon {
  id: string
  code: string
  type: "percent" | "fixed"
  value: number
  minOrder: number
  maxUses: number | null
  usedCount: number
  categories: string[]
  firstOrderOnly: boolean
  expiresAt: Date | null
  active: boolean
  createdAt: Date
}

// Seeded data
const INITIAL_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "ELSO10",
    type: "percent",
    value: 10,
    minOrder: 0,
    maxUses: null,
    usedCount: 342,
    categories: [],
    firstOrderOnly: true,
    expiresAt: null,
    active: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    code: "NYAR2026",
    type: "percent",
    value: 15,
    minOrder: 5000,
    maxUses: 500,
    usedCount: 128,
    categories: ["kave"],
    firstOrderOnly: false,
    expiresAt: new Date("2026-08-31"),
    active: true,
    createdAt: new Date("2026-06-01"),
  },
  {
    id: "3",
    code: "BUNDLE20",
    type: "percent",
    value: 20,
    minOrder: 10000,
    maxUses: 100,
    usedCount: 45,
    categories: ["csomag"],
    firstOrderOnly: false,
    expiresAt: new Date("2026-12-31"),
    active: true,
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "4",
    code: "KAVE500",
    type: "fixed",
    value: 500,
    minOrder: 3000,
    maxUses: 200,
    usedCount: 200,
    categories: ["kave"],
    firstOrderOnly: false,
    expiresAt: new Date("2026-02-28"),
    active: false,
    createdAt: new Date("2026-01-15"),
  },
]

const CATEGORIES = [
  { value: "kave", label: "Kávék" },
  { value: "eszkoz", label: "Eszközök" },
  { value: "merch", label: "Merch" },
  { value: "csomag", label: "Csomagok" },
  { value: "elofizetes", label: "Előfizetés" },
]

export default function CouponsPage() {
  const [coupons, setCoupons] = React.useState<Coupon[]>(INITIAL_COUPONS)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [couponToDelete, setCouponToDelete] = React.useState<Coupon | null>(null)

  // Editor form state
  const [formCode, setFormCode] = React.useState("")
  const [formType, setFormType] = React.useState<"percent" | "fixed">("percent")
  const [formValue, setFormValue] = React.useState("")
  const [formMinOrder, setFormMinOrder] = React.useState("")
  const [formMaxUses, setFormMaxUses] = React.useState("")
  const [formCategories, setFormCategories] = React.useState<string[]>([])
  const [formFirstOrderOnly, setFormFirstOrderOnly] = React.useState(false)
  const [formExpiresAt, setFormExpiresAt] = React.useState<Date | undefined>()
  const [formActive, setFormActive] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    if (search && !coupon.code.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (typeFilter !== "all" && coupon.type !== typeFilter) {
      return false
    }
    if (statusFilter === "active" && !coupon.active) return false
    if (statusFilter === "inactive" && coupon.active) return false
    if (statusFilter === "expired" && (!coupon.expiresAt || coupon.expiresAt > new Date())) return false
    return true
  })

  // Open editor for new coupon
  function handleNew() {
    setEditingCoupon(null)
    setFormCode("")
    setFormType("percent")
    setFormValue("")
    setFormMinOrder("")
    setFormMaxUses("")
    setFormCategories([])
    setFormFirstOrderOnly(false)
    setFormExpiresAt(undefined)
    setFormActive(true)
    setEditorOpen(true)
  }

  // Open editor for existing coupon
  function handleEdit(coupon: Coupon) {
    setEditingCoupon(coupon)
    setFormCode(coupon.code)
    setFormType(coupon.type)
    setFormValue(coupon.value.toString())
    setFormMinOrder(coupon.minOrder > 0 ? coupon.minOrder.toString() : "")
    setFormMaxUses(coupon.maxUses?.toString() || "")
    setFormCategories(coupon.categories)
    setFormFirstOrderOnly(coupon.firstOrderOnly)
    setFormExpiresAt(coupon.expiresAt || undefined)
    setFormActive(coupon.active)
    setEditorOpen(true)
  }

  // Save coupon
  async function handleSave() {
    if (!formCode.trim() || !formValue) {
      toast.error("Kód és érték megadása kötelező")
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    const couponData: Coupon = {
      id: editingCoupon?.id || Date.now().toString(),
      code: formCode.toUpperCase().trim(),
      type: formType,
      value: parseFloat(formValue),
      minOrder: formMinOrder ? parseFloat(formMinOrder) : 0,
      maxUses: formMaxUses ? parseInt(formMaxUses) : null,
      usedCount: editingCoupon?.usedCount || 0,
      categories: formCategories,
      firstOrderOnly: formFirstOrderOnly,
      expiresAt: formExpiresAt || null,
      active: formActive,
      createdAt: editingCoupon?.createdAt || new Date(),
    }

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === editingCoupon.id ? couponData : c))
      )
      toast.success("Kupon frissítve")
    } else {
      setCoupons((prev) => [couponData, ...prev])
      toast.success("Kupon létrehozva")
    }

    setSaving(false)
    setEditorOpen(false)
  }

  // Toggle coupon active state
  function handleToggleActive(coupon: Coupon) {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === coupon.id ? { ...c, active: !c.active } : c
      )
    )
    toast.success(coupon.active ? "Kupon inaktiválva" : "Kupon aktiválva")
  }

  // Duplicate coupon
  function handleDuplicate(coupon: Coupon) {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      code: coupon.code + "_COPY",
      usedCount: 0,
      createdAt: new Date(),
    }
    setCoupons((prev) => [newCoupon, ...prev])
    toast.success("Kupon másolva")
  }

  // Delete coupon
  function handleDelete() {
    if (!couponToDelete) return
    setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete.id))
    toast.success("Kupon törölve")
    setDeleteDialogOpen(false)
    setCouponToDelete(null)
  }

  // Toggle category in form
  function toggleCategory(cat: string) {
    setFormCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Kuponok
          </h1>
          <p className="text-sm text-muted-foreground">
            Kedvezménykódok és promóciók kezelése
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Új kupon
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Keresés kód alapján..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Típus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mind</SelectItem>
                <SelectItem value="percent">Százalék</SelectItem>
                <SelectItem value="fixed">Fix összeg</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mind</SelectItem>
                <SelectItem value="active">Aktív</SelectItem>
                <SelectItem value="inactive">Inaktív</SelectItem>
                <SelectItem value="expired">Lejárt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Kód</TableHead>
              <TableHead>Típus</TableHead>
              <TableHead>Érték</TableHead>
              <TableHead>Kategória</TableHead>
              <TableHead>Lejárat</TableHead>
              <TableHead>Felhasználás</TableHead>
              <TableHead className="text-center">Aktív</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Ticket className="size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nincs találat
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => {
                const isExpired =
                  coupon.expiresAt && coupon.expiresAt < new Date()
                const isMaxedOut =
                  coupon.maxUses && coupon.usedCount >= coupon.maxUses

                return (
                  <TableRow
                    key={coupon.id}
                    className={isExpired || isMaxedOut ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-medium">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          coupon.type === "percent" ? "default" : "secondary"
                        }
                      >
                        {coupon.type === "percent" ? "%" : "Ft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {coupon.type === "percent"
                        ? `${coupon.value}%`
                        : `${coupon.value.toLocaleString("hu-HU")} Ft`}
                    </TableCell>
                    <TableCell>
                      {coupon.categories.length === 0 ? (
                        <span className="text-muted-foreground">Mind</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {coupon.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {CATEGORIES.find((c) => c.value === cat)?.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.expiresAt ? (
                        <span
                          className={
                            isExpired ? "text-destructive" : ""
                          }
                        >
                          {format(coupon.expiresAt, "yyyy. MM. dd.", {
                            locale: hu,
                          })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {coupon.usedCount}
                        {coupon.maxUses && (
                          <span className="text-muted-foreground">
                            /{coupon.maxUses}
                          </span>
                        )}
                      </span>
                      {isMaxedOut && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Kimerült
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={() => handleToggleActive(coupon)}
                        disabled={isExpired || isMaxedOut}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                            <Pencil className="mr-2 size-4" />
                            Szerkesztés
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(coupon)}
                          >
                            <Copy className="mr-2 size-4" />
                            Másolás
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setCouponToDelete(coupon)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Törlés
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Kupon szerkesztése" : "Új kupon"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Módosítsd a kupon adatait"
                : "Hozz létre egy új kedvezménykódot"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Code */}
            <div className="grid gap-2">
              <Label htmlFor="code">Kód</Label>
              <Input
                id="code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="KUPON123"
                className="font-mono uppercase"
              />
            </div>

            {/* Type + Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Típus</Label>
                <Select
                  value={formType}
                  onValueChange={(v) => setFormType(v as "percent" | "fixed")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Százalék (%)</SelectItem>
                    <SelectItem value="fixed">Fix összeg (Ft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Érték</Label>
                <Input
                  id="value"
                  type="number"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder={formType === "percent" ? "10" : "500"}
                />
              </div>
            </div>

            {/* Min order + Max uses */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minOrder">Min. rendelés (Ft)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={formMinOrder}
                  onChange={(e) => setFormMinOrder(e.target.value)}
                  placeholder="5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxUses">Max. felhasználás</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formMaxUses}
                  onChange={(e) => setFormMaxUses(e.target.value)}
                  placeholder="Korlátlan"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid gap-2">
              <Label>Kategóriák</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={
                      formCategories.includes(cat.value)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleCategory(cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Ha nincs kiválasztva, minden kategóriára érvényes
              </p>
            </div>

            {/* Expiration */}
            <div className="grid gap-2">
              <Label>Lejárat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {formExpiresAt
                      ? format(formExpiresAt, "yyyy. MMMM d.", { locale: hu })
                      : "Nincs lejárat"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formExpiresAt}
                    onSelect={setFormExpiresAt}
                    disabled={(date) => date < new Date()}
                    locale={hu}
                  />
                  {formExpiresAt && (
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setFormExpiresAt(undefined)}
                      >
                        Lejárat törlése
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* First order only */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="firstOrder">Csak első rendelés</Label>
                <p className="text-xs text-muted-foreground">
                  Csak új vásárlók használhatják
                </p>
              </div>
              <Switch
                id="firstOrder"
                checked={formFirstOrderOnly}
                onCheckedChange={setFormFirstOrderOnly}
              />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active">Aktív</Label>
                <p className="text-xs text-muted-foreground">
                  A kupon használható-e
                </p>
              </div>
              <Switch
                id="active"
                checked={formActive}
                onCheckedChange={setFormActive}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Mégse
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Mentés..." : "Mentés"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kupon törlése</DialogTitle>
            <DialogDescription>
              Biztosan törölni szeretnéd a(z){" "}
              <code className="rounded bg-muted px-1 font-mono">
                {couponToDelete?.code}
              </code>{" "}
              kupont? Ez a művelet nem visszavonható.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Mégse
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Törlés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
