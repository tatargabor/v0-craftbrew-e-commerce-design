"use client"

import * as React from "react"
import { Plus, MapPin, Check, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"

export interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  zone: "budapest" | "+20km" | "+40km"
  isDefault?: boolean
}

interface AddressSelectorProps {
  addresses: Address[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (address: Omit<Address, "id">) => void
  onEdit?: (id: string, address: Partial<Address>) => void
  onDelete?: (id: string) => void
  className?: string
}

const zoneLabels: Record<Address["zone"], string> = {
  budapest: "Budapest",
  "+20km": "+20 km",
  "+40km": "+40 km",
}

const zoneCosts: Record<Address["zone"], number> = {
  budapest: 990,
  "+20km": 1490,
  "+40km": 1990,
}

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  className,
}: AddressSelectorProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null)

  const handleSave = (formData: FormData) => {
    const addressData = {
      name: formData.get("name") as string,
      line1: formData.get("line1") as string,
      line2: formData.get("line2") as string || undefined,
      city: formData.get("city") as string,
      postalCode: formData.get("postalCode") as string,
      zone: detectZone(formData.get("postalCode") as string),
    }

    if (editingAddress) {
      onEdit?.(editingAddress.id, addressData)
    } else {
      onAdd(addressData)
    }
    
    setDialogOpen(false)
    setEditingAddress(null)
  }

  const detectZone = (postalCode: string): Address["zone"] => {
    const code = parseInt(postalCode, 10)
    if (code >= 1000 && code <= 1239) return "budapest"
    if (code >= 2000 && code <= 2199) return "+20km"
    return "+40km"
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("hu-HU").format(amount) + " Ft"
  }

  return (
    <div className={cn("space-y-3", className)}>
      <RadioGroup value={selectedId || ""} onValueChange={onSelect}>
        <AnimatePresence mode="popLayout">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <label
                htmlFor={address.id}
                className={cn(
                  "relative flex cursor-pointer rounded-lg border p-4 transition-all",
                  selectedId === address.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="sr-only"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{address.name}</span>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs">Alapértelmezett</Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs ml-auto",
                        address.zone === "budapest" && "border-green-500 text-green-600",
                        address.zone === "+20km" && "border-amber-500 text-amber-600",
                        address.zone === "+40km" && "border-red-500 text-red-600",
                      )}
                    >
                      {zoneLabels[address.zone]} · {formatPrice(zoneCosts[address.zone])}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.postalCode} {address.city}
                  </p>
                </div>

                {/* Selection indicator */}
                <div className="flex items-center ml-4">
                  <div
                    className={cn(
                      "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedId === address.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedId === address.id && (
                      <Check className="size-3 text-primary-foreground" />
                    )}
                  </div>
                </div>

                {/* Edit/Delete buttons - show on hover */}
                {(onEdit || onDelete) && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={(e) => {
                          e.preventDefault()
                          setEditingAddress(address)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    )}
                    {onDelete && !address.isDefault && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          onDelete(address.id)
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </label>
            </motion.div>
          ))}
        </AnimatePresence>
      </RadioGroup>

      {/* Add new address button */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) setEditingAddress(null)
      }}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="size-4" />
            Új cím hozzáadása
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Cím szerkesztése" : "Új szállítási cím"}
            </DialogTitle>
            <DialogDescription>
              Add meg a szállítási címed. A zóna automatikusan kerül meghatározásra.
            </DialogDescription>
          </DialogHeader>

          <form action={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Név</Label>
              <Input
                id="name"
                name="name"
                placeholder="pl. Otthon, Iroda"
                defaultValue={editingAddress?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line1">Utca, házszám</Label>
              <Input
                id="line1"
                name="line1"
                placeholder="Kossuth Lajos utca 1."
                defaultValue={editingAddress?.line1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line2">Emelet, ajtó (opcionális)</Label>
              <Input
                id="line2"
                name="line2"
                placeholder="2. emelet, 5. ajtó"
                defaultValue={editingAddress?.line2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Irányítószám</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="1051"
                  defaultValue={editingAddress?.postalCode}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Város</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Budapest"
                  defaultValue={editingAddress?.city}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Mégse
              </Button>
              <Button type="submit">
                {editingAddress ? "Mentés" : "Hozzáadás"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
