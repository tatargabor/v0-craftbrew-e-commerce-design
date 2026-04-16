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
  CalendarIcon,
  Sparkles,
  X,
  Eye,
  Mail,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Types
interface PromoDay {
  id: string
  nameHu: string
  nameEn: string
  date: Date
  discount: number
  bannerTextHu: string
  bannerTextEn: string
  emailSent: boolean
  active: boolean
}

// Seeded data
const INITIAL_PROMO_DAYS: PromoDay[] = [
  {
    id: "1",
    nameHu: "Bolt születésnap",
    nameEn: "Store Birthday",
    date: new Date("2026-03-15"),
    discount: 20,
    bannerTextHu: "Ma ünnepelünk! 20% kedvezmény minden termékre a születésnapunk alkalmából.",
    bannerTextEn: "We're celebrating! 20% off everything for our birthday.",
    emailSent: true,
    active: true,
  },
  {
    id: "2",
    nameHu: "Kávé Világnapja",
    nameEn: "International Coffee Day",
    date: new Date("2026-10-01"),
    discount: 15,
    bannerTextHu: "Kávé Világnapja! 15% kedvezmény minden kávénkra – csak ma!",
    bannerTextEn: "International Coffee Day! 15% off all coffees – today only!",
    emailSent: false,
    active: true,
  },
  {
    id: "3",
    nameHu: "Black Friday",
    nameEn: "Black Friday",
    date: new Date("2026-11-27"),
    discount: 30,
    bannerTextHu: "Black Friday őrület! 30% kedvezmény az egész boltban.",
    bannerTextEn: "Black Friday madness! 30% off everything.",
    emailSent: false,
    active: false,
  },
]

export default function PromoDaysPage() {
  const [promoDays, setPromoDays] = React.useState<PromoDay[]>(INITIAL_PROMO_DAYS)
  const [search, setSearch] = React.useState("")

  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editingPromo, setEditingPromo] = React.useState<PromoDay | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [promoToDelete, setPromoToDelete] = React.useState<PromoDay | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [previewPromo, setPreviewPromo] = React.useState<PromoDay | null>(null)

  // Editor form state
  const [formNameHu, setFormNameHu] = React.useState("")
  const [formNameEn, setFormNameEn] = React.useState("")
  const [formDate, setFormDate] = React.useState<Date | undefined>()
  const [formDiscount, setFormDiscount] = React.useState("")
  const [formBannerHu, setFormBannerHu] = React.useState("")
  const [formBannerEn, setFormBannerEn] = React.useState("")
  const [formActive, setFormActive] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Filter
  const filteredPromoDays = promoDays.filter((promo) => {
    if (search && !promo.nameHu.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  // Sort by date
  const sortedPromoDays = [...filteredPromoDays].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  // Open editor for new promo
  function handleNew() {
    setEditingPromo(null)
    setFormNameHu("")
    setFormNameEn("")
    setFormDate(undefined)
    setFormDiscount("")
    setFormBannerHu("")
    setFormBannerEn("")
    setFormActive(true)
    setEditorOpen(true)
  }

  // Open editor for existing promo
  function handleEdit(promo: PromoDay) {
    setEditingPromo(promo)
    setFormNameHu(promo.nameHu)
    setFormNameEn(promo.nameEn)
    setFormDate(promo.date)
    setFormDiscount(promo.discount.toString())
    setFormBannerHu(promo.bannerTextHu)
    setFormBannerEn(promo.bannerTextEn)
    setFormActive(promo.active)
    setEditorOpen(true)
  }

  // Save promo
  async function handleSave() {
    if (!formNameHu.trim() || !formDate || !formDiscount) {
      toast.error("Név, dátum és kedvezmény megadása kötelező")
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    const promoData: PromoDay = {
      id: editingPromo?.id || Date.now().toString(),
      nameHu: formNameHu.trim(),
      nameEn: formNameEn.trim() || formNameHu.trim(),
      date: formDate,
      discount: parseInt(formDiscount),
      bannerTextHu: formBannerHu.trim(),
      bannerTextEn: formBannerEn.trim() || formBannerHu.trim(),
      emailSent: editingPromo?.emailSent || false,
      active: formActive,
    }

    if (editingPromo) {
      setPromoDays((prev) =>
        prev.map((p) => (p.id === editingPromo.id ? promoData : p))
      )
      toast.success("Akció nap frissítve")
    } else {
      setPromoDays((prev) => [promoData, ...prev])
      toast.success("Akció nap létrehozva")
    }

    setSaving(false)
    setEditorOpen(false)
  }

  // Toggle active state
  function handleToggleActive(promo: PromoDay) {
    setPromoDays((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p))
    )
    toast.success(promo.active ? "Akció nap inaktiválva" : "Akció nap aktiválva")
  }

  // Send email
  async function handleSendEmail(promo: PromoDay) {
    toast.promise(new Promise((r) => setTimeout(r, 1500)), {
      loading: "Email küldése...",
      success: () => {
        setPromoDays((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, emailSent: true } : p))
        )
        return "Email sikeresen kiküldve"
      },
      error: "Hiba az email küldésekor",
    })
  }

  // Delete promo
  function handleDelete() {
    if (!promoToDelete) return
    setPromoDays((prev) => prev.filter((p) => p.id !== promoToDelete.id))
    toast.success("Akció nap törölve")
    setDeleteDialogOpen(false)
    setPromoToDelete(null)
  }

  // Check if date is past
  function isPast(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Akció napok
          </h1>
          <p className="text-sm text-muted-foreground">
            Különleges promóciós napok kezelése
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 size-4" />
          Új akció nap
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Keresés név alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Dátum</TableHead>
              <TableHead>Kedvezmény</TableHead>
              <TableHead>Email küldve</TableHead>
              <TableHead className="text-center">Aktív</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPromoDays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nincs akció nap
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedPromoDays.map((promo) => {
                const past = isPast(promo.date)
                return (
                  <TableRow
                    key={promo.id}
                    className={past ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{promo.nameHu}</p>
                        {promo.nameEn !== promo.nameHu && (
                          <p className="text-xs text-muted-foreground">
                            {promo.nameEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={past ? "text-muted-foreground" : ""}>
                        {format(promo.date, "yyyy. MMMM d.", { locale: hu })}
                      </span>
                      {past && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Elmúlt
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 text-white">
                        {promo.discount}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {promo.emailSent ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          Kiküldve
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendEmail(promo)}
                          disabled={past}
                        >
                          <Mail className="mr-1 size-3" />
                          Küldés
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={promo.active}
                        onCheckedChange={() => handleToggleActive(promo)}
                        disabled={past}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setPreviewPromo(promo)
                              setPreviewOpen(true)
                            }}
                          >
                            <Eye className="mr-2 size-4" />
                            Banner előnézet
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(promo)}>
                            <Pencil className="mr-2 size-4" />
                            Szerkesztés
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setPromoToDelete(promo)
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
              {editingPromo ? "Akció nap szerkesztése" : "Új akció nap"}
            </DialogTitle>
            <DialogDescription>
              {editingPromo
                ? "Módosítsd az akció nap adatait"
                : "Hozz létre egy új promóciós napot"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name HU */}
            <div className="grid gap-2">
              <Label htmlFor="nameHu">Név (HU)</Label>
              <Input
                id="nameHu"
                value={formNameHu}
                onChange={(e) => setFormNameHu(e.target.value)}
                placeholder="Bolt születésnap"
              />
            </div>

            {/* Name EN */}
            <div className="grid gap-2">
              <Label htmlFor="nameEn">Név (EN)</Label>
              <Input
                id="nameEn"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="Store Birthday"
              />
            </div>

            {/* Date + Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Dátum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {formDate
                        ? format(formDate, "yyyy. MM. dd.", { locale: hu })
                        : "Válassz dátumot"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={setFormDate}
                      locale={hu}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount">Kedvezmény (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  placeholder="20"
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <Separator />

            {/* Banner Text HU */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bannerHu">Banner szöveg (HU)</Label>
                <span className="text-xs text-muted-foreground">
                  {formBannerHu.length}/200
                </span>
              </div>
              <Textarea
                id="bannerHu"
                value={formBannerHu}
                onChange={(e) =>
                  setFormBannerHu(e.target.value.slice(0, 200))
                }
                placeholder="Ma ünnepelünk! 20% kedvezmény..."
                rows={2}
              />
            </div>

            {/* Banner Text EN */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bannerEn">Banner szöveg (EN)</Label>
                <span className="text-xs text-muted-foreground">
                  {formBannerEn.length}/200
                </span>
              </div>
              <Textarea
                id="bannerEn"
                value={formBannerEn}
                onChange={(e) =>
                  setFormBannerEn(e.target.value.slice(0, 200))
                }
                placeholder="We're celebrating! 20% off..."
                rows={2}
              />
            </div>

            <Separator />

            {/* Active */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active">Aktív</Label>
                <p className="text-xs text-muted-foreground">
                  A banner megjelenik-e az adott napon
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

      {/* Banner Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Banner előnézet</DialogTitle>
            <DialogDescription>
              Így fog kinézni a banner az oldalon
            </DialogDescription>
          </DialogHeader>

          {previewPromo && (
            <div className="space-y-4 py-4">
              {/* HU Banner */}
              <div>
                <Label className="text-xs text-muted-foreground">Magyar</Label>
                <div className="mt-1 flex items-center justify-between rounded-lg bg-amber-500 px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    <p className="text-sm font-medium">
                      {previewPromo.bannerTextHu}
                    </p>
                  </div>
                  <button className="rounded p-1 transition-colors hover:bg-amber-600">
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* EN Banner */}
              <div>
                <Label className="text-xs text-muted-foreground">Angol</Label>
                <div className="mt-1 flex items-center justify-between rounded-lg bg-amber-500 px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5" />
                    <p className="text-sm font-medium">
                      {previewPromo.bannerTextEn}
                    </p>
                  </div>
                  <button className="rounded p-1 transition-colors hover:bg-amber-600">
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setPreviewOpen(false)}>Bezárás</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Akció nap törlése</DialogTitle>
            <DialogDescription>
              Biztosan törölni szeretnéd a(z) &quot;{promoToDelete?.nameHu}
              &quot; akció napot? Ez a művelet nem visszavonható.
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
