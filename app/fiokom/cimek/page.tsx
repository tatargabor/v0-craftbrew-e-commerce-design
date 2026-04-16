"use client"

import { useState, useEffect } from "react"
import { Plus, MapPin, MoreHorizontal, Pencil, Trash2, Check, Star, Home, Building, Briefcase } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Address = {
  id: string
  label: string
  name: string
  postalCode: string
  city: string
  street: string
  phone: string
  isDefault: boolean
  zone: "Budapest" | "+20km" | "+40km"
}

const labelIcons: Record<string, React.ReactNode> = {
  Otthon: <Home className="h-4 w-4" />,
  Munkahely: <Briefcase className="h-4 w-4" />,
  Iroda: <Building className="h-4 w-4" />,
  Egyéb: <MapPin className="h-4 w-4" />,
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Otthon",
    name: "Kovács Anna",
    postalCode: "1075",
    city: "Budapest",
    street: "Kazinczy utca 28.",
    phone: "+36 30 123 4567",
    isDefault: true,
    zone: "Budapest",
  },
  {
    id: "2",
    label: "Munkahely",
    name: "Kovács Anna",
    postalCode: "2030",
    city: "Érd",
    street: "Petőfi Sándor utca 12.",
    phone: "+36 30 123 4567",
    isDefault: false,
    zone: "+20km",
  },
]

// Simulate zone detection based on postal code
function detectZone(postalCode: string): "Budapest" | "+20km" | "+40km" | null {
  if (!postalCode || postalCode.length < 4) return null
  const code = parseInt(postalCode)
  if (code >= 1000 && code <= 1239) return "Budapest"
  if (code >= 2000 && code <= 2100) return "+20km"
  if (code >= 2100 && code <= 2500) return "+40km"
  // Default to +40km for other codes
  return "+40km"
}

const zoneColors: Record<string, string> = {
  Budapest: "bg-green-100 text-green-800 border-green-200",
  "+20km": "bg-amber-100 text-amber-800 border-amber-200",
  "+40km": "bg-orange-100 text-orange-800 border-orange-200",
}

export default function CimekPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formLabel, setFormLabel] = useState("")
  const [formName, setFormName] = useState("")
  const [formPostalCode, setFormPostalCode] = useState("")
  const [formCity, setFormCity] = useState("")
  const [formStreet, setFormStreet] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [detectedZone, setDetectedZone] = useState<"Budapest" | "+20km" | "+40km" | null>(null)

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Live zone detection
  useEffect(() => {
    const zone = detectZone(formPostalCode)
    setDetectedZone(zone)
  }, [formPostalCode])

  const resetForm = () => {
    setFormLabel("")
    setFormName("")
    setFormPostalCode("")
    setFormCity("")
    setFormStreet("")
    setFormPhone("")
    setDetectedZone(null)
    setErrors({})
    setEditingAddress(null)
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormLabel(address.label)
    setFormName(address.name)
    setFormPostalCode(address.postalCode)
    setFormCity(address.city)
    setFormStreet(address.street)
    setFormPhone(address.phone)
    setDetectedZone(address.zone)
    setErrors({})
    setDialogOpen(true)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formLabel) newErrors.label = "Válassz egy címkét"
    if (!formName.trim()) newErrors.name = "Add meg a nevet"
    if (!formPostalCode.trim()) newErrors.postalCode = "Add meg az irányítószámot"
    else if (formPostalCode.length !== 4) newErrors.postalCode = "Érvénytelen irányítószám"
    if (!formCity.trim()) newErrors.city = "Add meg a várost"
    if (!formStreet.trim()) newErrors.street = "Add meg az utcát és házszámot"
    if (!formPhone.trim()) newErrors.phone = "Add meg a telefonszámot"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const zone = detectedZone || "+40km"

    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                label: formLabel,
                name: formName,
                postalCode: formPostalCode,
                city: formCity,
                street: formStreet,
                phone: formPhone,
                zone,
              }
            : addr
        )
      )
      toast.success("Cím módosítva")
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        label: formLabel,
        name: formName,
        postalCode: formPostalCode,
        city: formCity,
        street: formStreet,
        phone: formPhone,
        isDefault: addresses.length === 0,
        zone,
      }
      setAddresses((prev) => [...prev, newAddress])
      toast.success("Új cím hozzáadva")
    }

    setSaving(false)
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (address: Address) => {
    // Optimistic delete
    setAddresses((prev) => prev.filter((a) => a.id !== address.id))

    toast.success("Cím törölve", {
      action: {
        label: "Visszavonás",
        onClick: () => {
          setAddresses((prev) => {
            // Re-insert at original position
            const newList = [...prev]
            const originalIndex = initialAddresses.findIndex((a) => a.id === address.id)
            newList.splice(originalIndex, 0, address)
            return newList
          })
          toast.success("Törlés visszavonva")
        },
      },
    })
  }

  const handleSetDefault = (address: Address) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === address.id,
      }))
    )
    toast.success("Alapértelmezett cím beállítva")
  }

  const isEmpty = addresses.length === 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Címeim
          </h1>
          <p className="text-muted-foreground">
            Mentett szállítási címeid kezelése
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Új cím
        </Button>
      </div>

      <Separator />

      {/* Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            Még nincs mentett cím
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Add hozzá az első szállítási címed, hogy gyorsabban tudj rendelni
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Új cím hozzáadása
          </Button>
        </div>
      ) : (
        /* Addresses Grid */
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="relative group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      {labelIcons[address.label] || <MapPin className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{address.label}</p>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Alapértelmezett
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.postalCode} {address.city}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <Badge
                        variant="outline"
                        className={cn("mt-2 text-xs", zoneColors[address.zone])}
                      >
                        {address.zone}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(address)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Szerkesztés
                      </DropdownMenuItem>
                      {!address.isDefault && (
                        <DropdownMenuItem onClick={() => handleSetDefault(address)}>
                          <Star className="mr-2 h-4 w-4" />
                          Alapértelmezettnek
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(address)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Törlés
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingAddress ? "Cím szerkesztése" : "Új cím hozzáadása"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Módosítsd a cím adatait"
                : "Add meg a szállítási cím részleteit"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Label */}
            <div className="space-y-2">
              <Label>Címke</Label>
              <Select value={formLabel} onValueChange={setFormLabel}>
                <SelectTrigger className={cn(errors.label && "border-destructive")}>
                  <SelectValue placeholder="Válassz címkét" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Otthon">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Otthon
                    </div>
                  </SelectItem>
                  <SelectItem value="Munkahely">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Munkahely
                    </div>
                  </SelectItem>
                  <SelectItem value="Iroda">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Iroda
                    </div>
                  </SelectItem>
                  <SelectItem value="Egyéb">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Egyéb
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.label && (
                <p className="text-sm text-destructive">{errors.label}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Teljes név</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: "" }))
                }}
                placeholder="Pl. Kovács Anna"
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Postal Code + City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Irányítószám</Label>
                <div className="relative">
                  <Input
                    id="postalCode"
                    value={formPostalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                      setFormPostalCode(value)
                      setErrors((prev) => ({ ...prev, postalCode: "" }))
                    }}
                    placeholder="1075"
                    className={cn(errors.postalCode && "border-destructive")}
                  />
                  {/* Live zone badge */}
                  {detectedZone && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 text-xs",
                        zoneColors[detectedZone]
                      )}
                    >
                      {detectedZone}
                    </Badge>
                  )}
                </div>
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Város</Label>
                <Input
                  id="city"
                  value={formCity}
                  onChange={(e) => {
                    setFormCity(e.target.value)
                    setErrors((prev) => ({ ...prev, city: "" }))
                  }}
                  placeholder="Budapest"
                  className={cn(errors.city && "border-destructive")}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="street">Utca és házszám</Label>
              <Input
                id="street"
                value={formStreet}
                onChange={(e) => {
                  setFormStreet(e.target.value)
                  setErrors((prev) => ({ ...prev, street: "" }))
                }}
                placeholder="Pl. Kazinczy utca 28."
                className={cn(errors.street && "border-destructive")}
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonszám</Label>
              <Input
                id="phone"
                value={formPhone}
                onChange={(e) => {
                  setFormPhone(e.target.value)
                  setErrors((prev) => ({ ...prev, phone: "" }))
                }}
                placeholder="+36 30 123 4567"
                className={cn(errors.phone && "border-destructive")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Mégse
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Mentés...
                </>
              ) : editingAddress ? (
                "Módosítás"
              ) : (
                "Hozzáadás"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
