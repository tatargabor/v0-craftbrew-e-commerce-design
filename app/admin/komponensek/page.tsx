"use client"

import * as React from "react"
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  Bell,
  Loader2,
  Upload,
  X,
  ShoppingCart,
  Heart,
  Search,
  Package,
  RefreshCw,
  Coffee,
  Trash2,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ============================================================================
// A) TOASTER SHOWCASE
// ============================================================================

function ToasterShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">A) Toaster (Sonner)</CardTitle>
        <CardDescription>
          Pozíció: jobb felső sarokban (desktop), felül középen (mobil). 
          Automatikus eltűnés progress bar-ral.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button
            variant="outline"
            className="border-l-4 border-l-success"
            onClick={() =>
              toast.success("Sikeres művelet!", {
                description: "A termék hozzáadva a kosárhoz.",
                action: {
                  label: "Megnézés",
                  onClick: () => {},
                },
              })
            }
          >
            <CheckCircle2 className="size-4 mr-2 text-success" />
            Success
          </Button>

          <Button
            variant="outline"
            className="border-l-4 border-l-destructive"
            onClick={() =>
              toast.error("Hiba történt!", {
                description: "Nem sikerült menteni a változtatásokat.",
              })
            }
          >
            <XCircle className="size-4 mr-2 text-destructive" />
            Error
          </Button>

          <Button
            variant="outline"
            className="border-l-4 border-l-blue-500"
            onClick={() =>
              toast.info("Tudtad?", {
                description: "Az előfizetéssel 15% kedvezményt kapsz minden rendelésnél.",
              })
            }
          >
            <Info className="size-4 mr-2 text-blue-500" />
            Info
          </Button>

          <Button
            variant="outline"
            className="border-l-4 border-l-amber-500"
            onClick={() =>
              toast.warning("Figyelem!", {
                description: "A termék hamarosan elfogy. Már csak 3 db van raktáron.",
              })
            }
          >
            <AlertTriangle className="size-4 mr-2 text-amber-500" />
            Warning
          </Button>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              toast("Termék eltávolítva", {
                description: "Ethiopia Yirgacheffe törölve a kosárból.",
                action: {
                  label: "Visszavonás",
                  onClick: () => toast.success("Visszaállítva!"),
                },
              })
            }
          >
            Toast + Visszavonás
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              const promise = new Promise((resolve) => setTimeout(resolve, 2000))
              toast.promise(promise, {
                loading: "Mentés folyamatban...",
                success: "Sikeresen mentve!",
                error: "Hiba történt a mentés során.",
              })
            }}
          >
            Promise Toast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// B) RESTOCK NOTIFY DIALOG
// ============================================================================

function RestockNotifyShowcase() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("teszt@craftbrew.hu")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setTimeout(() => setIsSuccess(false), 300)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">B) Restock Notify Dialog</CardTitle>
        <CardDescription>
          Elfogyott termékekhez. Pre-fill email bejelentkezett felhasználóknak.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-2 border-primary text-primary">
              <Bell className="size-4" />
              Értesíts ha újra elérhető
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Értesítés újra elérhetőségről
              </DialogTitle>
              <DialogDescription>
                Értesítünk, amint az{" "}
                <span className="font-medium text-foreground">Ethiopia Yirgacheffe</span>{" "}
                <span className="font-medium text-foreground">(250g, szemes)</span> újra elérhető lesz.
              </DialogDescription>
            </DialogHeader>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-success/10 p-3 mb-4">
                  <CheckCircle2 className="size-8 text-success" />
                </div>
                <p className="text-lg font-medium text-foreground">Feliratkoztál!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Szólunk, amint újra raktáron lesz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="restock-email">Email cím</Label>
                  <Input
                    id="restock-email"
                    type="email"
                    placeholder="pelda@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-surface"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Mégsem
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !email}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Feliratkozás...
                      </>
                    ) : (
                      "Feliratkozás"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// C) RETURN REQUEST DIALOG
// ============================================================================

function ReturnRequestShowcase() {
  const [open, setOpen] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])
  const [reason, setReason] = React.useState("")
  const [comment, setComment] = React.useState("")
  const [images, setImages] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const orderItems = [
    { id: "1", name: "Ethiopia Yirgacheffe", variant: "250g, szemes", price: "2 490 Ft" },
    { id: "2", name: "Colombia Supremo", variant: "500g, őrölt", price: "3 990 Ft" },
    { id: "3", name: "Hario V60 Dripper", variant: "02, fehér", price: "4 990 Ft" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false)
    setOpen(false)
    toast.success("Visszaküldési kérelem elküldve!", {
      description: "2 munkanapon belül feldolgozzuk és emailben értesítünk.",
    })
    // Reset
    setSelectedItems([])
    setReason("")
    setComment("")
    setImages([])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (images.length >= 3) return
    // Simulate file upload
    const newImages = [...images]
    if (newImages.length < 3) {
      newImages.push(`/placeholder.svg?text=Kep${newImages.length + 1}`)
    }
    setImages(newImages)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">C) Return Request Dialog</CardTitle>
        <CardDescription>
          Korábbi rendelésekből visszaküldés kérése. Termékválasztás, ok, megjegyzés, fotó feltöltés.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Visszaküldés kérése</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Visszaküldés kérése</DialogTitle>
              <DialogDescription>
                Válaszd ki a visszaküldeni kívánt termékeket és add meg az okot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Order number */}
              <div className="space-y-2">
                <Label>Rendelés azonosító</Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <Package className="size-4 text-muted-foreground" />
                  <span className="font-mono text-sm">#CB-20260415-001</span>
                </div>
              </div>

              {/* Items selection */}
              <div className="space-y-3">
                <Label>Visszaküldeni kívánt termékek</Label>
                {orderItems.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedItems.includes(item.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, item.id])
                        } else {
                          setSelectedItems(selectedItems.filter((id) => id !== item.id))
                        }
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.variant}</p>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{item.price}</span>
                  </label>
                ))}
              </div>

              {/* Reason select */}
              <div className="space-y-2">
                <Label htmlFor="return-reason">Visszaküldés oka</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="return-reason">
                    <SelectValue placeholder="Válassz okot..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defective">Hibás termék</SelectItem>
                    <SelectItem value="not-as-described">Nem felel meg a leírásnak</SelectItem>
                    <SelectItem value="wrong-order">Téves rendelés</SelectItem>
                    <SelectItem value="other">Egyéb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="return-comment">Megjegyzés (opcionális)</Label>
                <Textarea
                  id="return-comment"
                  placeholder="Írd le részletesebben a problémát..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Photo upload */}
              <div className="space-y-2">
                <Label>Fotók (max. 3 db)</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "border-border",
                    images.length >= 3 && "opacity-50 pointer-events-none"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Húzd ide a képeket vagy{" "}
                    <button
                      type="button"
                      className="text-primary underline"
                      onClick={() => {
                        if (images.length < 3) {
                          setImages([...images, `/placeholder.svg?text=Kep${images.length + 1}`])
                        }
                      }}
                    >
                      tallózz
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG (max. 5MB/kép)
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative size-16 rounded-md overflow-hidden bg-muted">
                        <ImageIcon className="size-6 absolute inset-0 m-auto text-muted-foreground" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 size-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Mégsem
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0 || !reason}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Küldés...
                    </>
                  ) : (
                    "Kérelem küldése"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// D) CONFIRMATION DIALOGS
// ============================================================================

function ConfirmationDialogsShowcase() {
  const [typeToConfirmOpen, setTypeToConfirmOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">D) Confirmation Dialogs</CardTitle>
        <CardDescription>
          Destructive AlertDialog minta: normál és gépelős megerősítés.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {/* Standard confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Normál megerősítés</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztosan törlöd a terméket?</AlertDialogTitle>
              <AlertDialogDescription>
                Ez a művelet nem vonható vissza. A termék véglegesen törlődik
                az adatbázisból.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mégsem</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => toast.success("Termék törölve!")}
              >
                Törlés
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Type-to-confirm */}
        <Dialog open={typeToConfirmOpen} onOpenChange={setTypeToConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-destructive border-destructive/50">
              Gépelős megerősítés
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-destructive">
                Fiók végleges törlése
              </DialogTitle>
              <DialogDescription>
                Ez a művelet visszavonhatatlanul törli a fiókodat és minden hozzá
                kapcsolódó adatot. Az előfizetéseid megszűnnek.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">
                  A megerősítéshez írd be: <strong>TÖRLÉS</strong>
                </p>
              </div>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Írd be: TÖRLÉS"
                className="font-mono"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setTypeToConfirmOpen(false)}>
                Mégsem
              </Button>
              <Button
                variant="destructive"
                disabled={confirmText !== "TÖRLÉS"}
                onClick={() => {
                  setTypeToConfirmOpen(false)
                  setConfirmText("")
                  toast.success("Fiók törölve!")
                }}
              >
                <Trash2 className="size-4 mr-2" />
                Fiók törlése
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// E) EMPTY STATES
// ============================================================================

function EmptyStatesShowcase() {
  const emptyStates = [
    {
      title: "Üres kosár",
      description: "A kosarad még üres. Fedezd fel kávéinkat!",
      icon: ShoppingCart,
      cta: "Vásárlás indítása",
      accent: "primary",
    },
    {
      title: "Üres kedvencek",
      description: "Nincs még semmi a kedvenceid között. Mentsd el a kedvenc kávéidat!",
      icon: Heart,
      cta: "Kávék böngészése",
      accent: "secondary",
    },
    {
      title: "Nincs találat",
      description: "Nem találtunk terméket a keresésedre. Próbálj más kulcsszavakat!",
      icon: Search,
      cta: "Szűrők törlése",
      accent: "muted",
    },
    {
      title: "Nincsenek rendeléseid",
      description: "Még nem adtál le rendelést. Itt az idő az első kávédnak!",
      icon: Package,
      cta: "Első rendelés",
      accent: "primary",
    },
    {
      title: "Nincs aktív előfizetésed",
      description: "Iratkozz fel friss kávéra és élvezd a rendszeres szállítást!",
      icon: RefreshCw,
      cta: "Előfizetés indítása",
      accent: "secondary",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">E) Empty States</CardTitle>
        <CardDescription>
          Üres állapotok szerkesztőségi stílusban — meghívó, nem hibás érzetet kelt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emptyStates.map((state, idx) => {
            const Icon = state.icon
            return (
              <div
                key={idx}
                className="border rounded-xl p-6 flex flex-col items-center text-center bg-surface"
              >
                {/* Illustration */}
                <div className="relative mb-4">
                  <div
                    className={cn(
                      "size-16 rounded-full flex items-center justify-center",
                      state.accent === "primary" && "bg-primary/10",
                      state.accent === "secondary" && "bg-secondary/10",
                      state.accent === "muted" && "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-7",
                        state.accent === "primary" && "text-primary",
                        state.accent === "secondary" && "text-secondary",
                        state.accent === "muted" && "text-muted-foreground"
                      )}
                    />
                  </div>
                  {/* Decorative floating element */}
                  <div className="absolute -top-1 -right-1 size-6 rounded-full bg-background border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <Coffee className="size-3 text-muted-foreground/40" />
                  </div>
                </div>

                {/* Text */}
                <h4 className="font-serif text-lg font-medium text-foreground mb-1">
                  {state.title}
                </h4>
                <p className="text-sm text-muted-foreground text-balance mb-4">
                  {state.description}
                </p>

                {/* CTA */}
                <Button
                  size="sm"
                  variant={state.accent === "muted" ? "outline" : "default"}
                  className={cn(
                    state.accent === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  )}
                >
                  {state.cta}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function ComponentShowcasePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold font-serif tracking-tight">
          Komponens könyvtár
        </h1>
        <p className="text-muted-foreground">
          Újrahasználható interaktív komponensek a CraftBrew oldalakhoz.
        </p>
      </div>

      <div className="space-y-6">
        <ToasterShowcase />
        <RestockNotifyShowcase />
        <ReturnRequestShowcase />
        <ConfirmationDialogsShowcase />
        <EmptyStatesShowcase />
      </div>
    </div>
  )
}
