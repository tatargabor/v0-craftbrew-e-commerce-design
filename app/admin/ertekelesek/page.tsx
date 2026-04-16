"use client"

import * as React from "react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import Link from "next/link"
import {
  Search,
  Star,
  MessageSquare,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
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
interface Review {
  id: string
  productId: string
  productName: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  body: string
  status: "new" | "approved" | "rejected"
  createdAt: Date
  reply?: {
    body: string
    createdAt: Date
  }
}

// Seeded data
const INITIAL_REVIEWS: Review[] = [
  {
    id: "1",
    productId: "ethiopia-yirgacheffe",
    productName: "Ethiopia Yirgacheffe",
    userId: "u1",
    userName: "Nagy Anna",
    userEmail: "anna@example.com",
    rating: 5,
    title: "Csodálatos ízvilág!",
    body: "Régóta kerestem egy ilyen kifinomult, gyümölcsös kávét. A Yirgacheffe tökéletes választás volt. A citrusos jegyek és a virágos illat minden reggelemet feldobja. Mindenképpen újrarendelem!",
    status: "approved",
    createdAt: new Date("2026-04-10"),
    reply: {
      body: "Köszönjük a szép szavakat, Anna! Örülünk, hogy megtaláltad a kedvencedet. Az etióp kávéink mindig frissen pörköltek, szóval minden csomag garantáltan a legjobb élményt nyújtja.",
      createdAt: new Date("2026-04-11"),
    },
  },
  {
    id: "2",
    productId: "colombia-supremo",
    productName: "Colombia Supremo",
    userId: "u2",
    userName: "Kiss Péter",
    userEmail: "peter@example.com",
    rating: 4,
    title: "Kiváló minőség",
    body: "Nagyon finom kávé, kellemes karamellás utóízzel. Talán egy kicsit erősebb pörkölést preferálnék, de így is kitűnő.",
    status: "new",
    createdAt: new Date("2026-04-14"),
  },
  {
    id: "3",
    productId: "brazil-santos",
    productName: "Brazil Santos",
    userId: "u3",
    userName: "Szabó Éva",
    userEmail: "eva@example.com",
    rating: 2,
    title: "Nem az igazi",
    body: "Csalódtam egy kicsit. Túl savas volt az ízvilág, nem az én stílusom.",
    status: "new",
    createdAt: new Date("2026-04-13"),
  },
  {
    id: "4",
    productId: "guatemala-antigua",
    productName: "Guatemala Antigua",
    userId: "u4",
    userName: "Tóth Gábor",
    userEmail: "gabor@example.com",
    rating: 5,
    title: "A legjobb kávé amit eddig ittam!",
    body: "Fantasztikus! A csokoládés jegyek és a füstös utóíz egyszerűen lenyűgöző. A friss pörkölés rögtön érződik. Köszönöm, CraftBrew!",
    status: "approved",
    createdAt: new Date("2026-04-08"),
  },
  {
    id: "5",
    productId: "ethiopia-yirgacheffe",
    productName: "Ethiopia Yirgacheffe",
    userId: "u5",
    userName: "spam_user",
    userEmail: "spam@spam.com",
    rating: 1,
    title: "asdfjkl",
    body: "sdfkjsdjf sdjf kjsd fkjsd fjksd fjks dfj",
    status: "rejected",
    createdAt: new Date("2026-04-12"),
  },
]

const PRODUCTS = [
  { value: "all", label: "Minden termék" },
  { value: "ethiopia-yirgacheffe", label: "Ethiopia Yirgacheffe" },
  { value: "colombia-supremo", label: "Colombia Supremo" },
  { value: "brazil-santos", label: "Brazil Santos" },
  { value: "guatemala-antigua", label: "Guatemala Antigua" },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>(INITIAL_REVIEWS)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [productFilter, setProductFilter] = React.useState("all")
  const [minRating, setMinRating] = React.useState([1])
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState("")
  const [replying, setReplying] = React.useState(false)

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (
      search &&
      !review.title.toLowerCase().includes(search.toLowerCase()) &&
      !review.userName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (statusFilter !== "all" && review.status !== statusFilter) {
      return false
    }
    if (productFilter !== "all" && review.productId !== productFilter) {
      return false
    }
    if (review.rating < minRating[0]) {
      return false
    }
    return true
  })

  // Sort by date (newest first), but new status first
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (a.status === "new" && b.status !== "new") return -1
    if (a.status !== "new" && b.status === "new") return 1
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  // Counts
  const counts = {
    new: reviews.filter((r) => r.status === "new").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  }

  // Approve review
  function handleApprove(review: Review) {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "approved" } : r))
    )
    toast.success("Értékelés elfogadva")
  }

  // Reject review
  function handleReject(review: Review) {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "rejected" } : r))
    )
    toast.success("Értékelés elutasítva")
  }

  // Send reply
  async function handleReply(review: Review) {
    if (!replyText.trim()) {
      toast.error("A válasz nem lehet üres")
      return
    }

    setReplying(true)
    await new Promise((r) => setTimeout(r, 1000))

    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? {
              ...r,
              reply: {
                body: replyText.trim(),
                createdAt: new Date(),
              },
            }
          : r
      )
    )

    setReplyText("")
    setReplying(false)
    toast.success("Válasz elküldve")
  }

  // Star display
  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    )
  }

  // Status badge
  function getStatusBadge(status: Review["status"]) {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            Új
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Elfogadva
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-400 text-red-500">
            Elutasítva
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
            Értékelések
          </h1>
          <p className="text-sm text-muted-foreground">
            Vásárlói értékelések moderálása és megválaszolása
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            {counts.new} új
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Keresés cím vagy felhasználó alapján..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[140px]">
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mind</SelectItem>
                <SelectItem value="new">Új</SelectItem>
                <SelectItem value="approved">Elfogadva</SelectItem>
                <SelectItem value="rejected">Elutasítva</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Termék" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3">
              <Label className="whitespace-nowrap text-sm">
                Min. {minRating[0]} csillag
              </Label>
              <Slider
                value={minRating}
                onValueChange={setMinRating}
                min={1}
                max={5}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Csillagok</TableHead>
              <TableHead>Termék</TableHead>
              <TableHead>Felhasználó</TableHead>
              <TableHead>Cím</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead>Dátum</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="size-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nincs találat
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <TableRow
                    className={expandedId === review.id ? "border-b-0" : ""}
                  >
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/kavek/${review.productId}`}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        {review.productName}
                        <ExternalLink className="size-3" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.userEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate text-sm">
                        {review.title}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(review.createdAt, "MM. dd.", { locale: hu })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setExpandedId(
                            expandedId === review.id ? null : review.id
                          )
                        }
                      >
                        {expandedId === review.id ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Detail */}
                  {expandedId === review.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="space-y-4">
                          {/* Full Review */}
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="mb-2 font-medium">
                                {review.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {review.body}
                              </p>
                            </CardContent>
                          </Card>

                          {/* Reply Display */}
                          {review.reply && (
                            <Card className="ml-8 border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                  <Badge variant="secondary">
                                    CraftBrew válaszolt
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(
                                      review.reply.createdAt,
                                      "yyyy. MM. dd.",
                                      { locale: hu }
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm">{review.reply.body}</p>
                              </CardContent>
                            </Card>
                          )}

                          {/* Actions */}
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            {/* Status Actions */}
                            {review.status === "new" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(review)}
                                >
                                  <Check className="mr-1 size-4" />
                                  Elfogadás
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(review)}
                                >
                                  <X className="mr-1 size-4" />
                                  Elutasítás
                                </Button>
                              </div>
                            )}

                            {/* Reply Form */}
                            {review.status === "approved" && !review.reply && (
                              <div className="flex-1 space-y-2 lg:max-w-xl">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor={`reply-${review.id}`}>
                                    Válasz
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {replyText.length}/500
                                  </span>
                                </div>
                                <Textarea
                                  id={`reply-${review.id}`}
                                  value={replyText}
                                  onChange={(e) =>
                                    setReplyText(e.target.value.slice(0, 500))
                                  }
                                  placeholder="Írd meg a válaszodat..."
                                  rows={3}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleReply(review)}
                                  disabled={replying || !replyText.trim()}
                                >
                                  {replying ? (
                                    "Küldés..."
                                  ) : (
                                    <>
                                      <Send className="mr-1 size-4" />
                                      Válasz küldése
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Customer-Facing Preview */}
      <Separator />

      <div>
        <h2 className="mb-4 font-serif text-lg font-bold">
          Vásárlói oldal előnézet
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Így jelenik meg egy megválaszolt értékelés a termék oldalon:
        </p>

        <Card className="max-w-2xl">
          <CardContent className="space-y-4 p-6">
            {/* Review */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarRating rating={5} />
                  <span className="font-medium">Nagy Anna</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  2026. ápr. 10.
                </span>
              </div>
              <h4 className="font-medium">Csodálatos ízvilág!</h4>
              <p className="text-sm text-muted-foreground">
                Régóta kerestem egy ilyen kifinomult, gyümölcsös kávét. A
                Yirgacheffe tökéletes választás volt. A citrusos jegyek és a
                virágos illat minden reggelemet feldobja. Mindenképpen
                újrarendelem!
              </p>
            </div>

            {/* Reply */}
            <Card className="border-l-4 border-l-primary bg-muted/30">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-medium text-primary">
                    CraftBrew válaszolt:
                  </span>
                  <span className="text-xs text-muted-foreground">
                    2026. ápr. 11.
                  </span>
                </div>
                <p className="text-sm">
                  Köszönjük a szép szavakat, Anna! Örülünk, hogy megtaláltad a
                  kedvencedet. Az etióp kávéink mindig frissen pörköltek, szóval
                  minden csomag garantáltan a legjobb élményt nyújtja.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
