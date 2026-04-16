'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ProductEditorSheet,
  type Product,
} from '@/components/admin/product-editor-sheet'

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nameHu: 'Etióp Yirgacheffe',
    nameEn: 'Ethiopian Yirgacheffe',
    descriptionHu: 'Gyümölcsös, virágos ízjegyekkel',
    descriptionEn: 'Fruity with floral notes',
    category: 'coffee',
    basePrice: 3490,
    images: ['/placeholder.svg?height=80&width=80'],
    active: true,
    origin: 'Etiópia',
    roast: 'Világos',
    processing: 'Mosott',
    tastingNotes: ['Csokoládé', 'Citrus', 'Virágos'],
    variants: [
      { id: 'v1', options: '250g, Szemes', priceModifier: 0, stock: 45, active: true },
      { id: 'v2', options: '500g, Szemes', priceModifier: 1500, stock: 23, active: true },
      { id: 'v3', options: '250g, Őrölt', priceModifier: 200, stock: 0, active: true },
    ],
    slug: 'etiop-yirgacheffe',
    metaTitleHu: 'Etióp Yirgacheffe | CraftBrew',
    metaTitleEn: 'Ethiopian Yirgacheffe | CraftBrew',
    metaDescriptionHu: 'Prémium minőségű etióp kávé gyümölcsös ízjegyekkel.',
    metaDescriptionEn: 'Premium Ethiopian coffee with fruity notes.',
    ogImage: '',
    crossSellIds: ['2', '3'],
  },
  {
    id: '2',
    nameHu: 'Kolumbiai Huila',
    nameEn: 'Colombian Huila',
    descriptionHu: 'Karamellás, diós ízvilág',
    descriptionEn: 'Caramel and nutty flavors',
    category: 'coffee',
    basePrice: 2990,
    images: ['/placeholder.svg?height=80&width=80'],
    active: true,
    origin: 'Kolumbia',
    roast: 'Közepes',
    processing: 'Mosott',
    tastingNotes: ['Karamell', 'Dió', 'Alma'],
    variants: [
      { id: 'v4', options: '250g, Szemes', priceModifier: 0, stock: 67, active: true },
    ],
    slug: 'kolumbiai-huila',
    metaTitleHu: '',
    metaTitleEn: '',
    metaDescriptionHu: '',
    metaDescriptionEn: '',
    ogImage: '',
    crossSellIds: [],
  },
  {
    id: '3',
    nameHu: 'Hario V60 Dripper',
    nameEn: 'Hario V60 Dripper',
    descriptionHu: 'Kerámia pour-over kávéfőző',
    descriptionEn: 'Ceramic pour-over coffee maker',
    category: 'equipment',
    basePrice: 4990,
    images: ['/placeholder.svg?height=80&width=80'],
    active: true,
    variants: [
      { id: 'v5', options: '01 (1-2 csésze)', priceModifier: 0, stock: 12, active: true },
      { id: 'v6', options: '02 (2-4 csésze)', priceModifier: 500, stock: 8, active: true },
    ],
    slug: 'hario-v60-dripper',
    metaTitleHu: '',
    metaTitleEn: '',
    metaDescriptionHu: '',
    metaDescriptionEn: '',
    ogImage: '',
    crossSellIds: [],
  },
  {
    id: '4',
    nameHu: 'CraftBrew Póló',
    nameEn: 'CraftBrew T-Shirt',
    descriptionHu: '100% organikus pamut',
    descriptionEn: '100% organic cotton',
    category: 'merch',
    basePrice: 6990,
    images: ['/placeholder.svg?height=80&width=80'],
    active: false,
    variants: [
      { id: 'v7', options: 'S', priceModifier: 0, stock: 5, active: true },
      { id: 'v8', options: 'M', priceModifier: 0, stock: 0, active: true },
      { id: 'v9', options: 'L', priceModifier: 0, stock: 3, active: true },
    ],
    slug: 'craftbrew-polo',
    metaTitleHu: '',
    metaTitleEn: '',
    metaDescriptionHu: '',
    metaDescriptionEn: '',
    ogImage: '',
    crossSellIds: [],
  },
  {
    id: '5',
    nameHu: 'Kezdő csomag',
    nameEn: 'Starter Bundle',
    descriptionHu: 'Minden ami a kezdéshez kell',
    descriptionEn: 'Everything you need to start',
    category: 'bundle',
    basePrice: 12990,
    images: ['/placeholder.svg?height=80&width=80'],
    active: true,
    variants: [],
    slug: 'kezdo-csomag',
    metaTitleHu: '',
    metaTitleEn: '',
    metaDescriptionHu: '',
    metaDescriptionEn: '',
    ogImage: '',
    crossSellIds: [],
    bundleComponents: [
      { productId: '1', quantity: 2 },
      { productId: '3', quantity: 1 },
    ],
    bundlePrice: 10990,
  },
]

const CATEGORIES = [
  { value: 'all', label: 'Minden kategória' },
  { value: 'coffee', label: 'Kávé' },
  { value: 'equipment', label: 'Eszköz' },
  { value: 'merch', label: 'Merch' },
  { value: 'bundle', label: 'Csomag' },
]

const STATUSES = [
  { value: 'all', label: 'Minden státusz' },
  { value: 'active', label: 'Aktív' },
  { value: 'inactive', label: 'Inaktív' },
]

const PAGE_SIZE = 10

function formatPrice(price: number) {
  return new Intl.NumberFormat('hu-HU').format(price) + ' Ft'
}

function getCategoryLabel(category: string) {
  const cat = CATEGORIES.find((c) => c.value === category)
  return cat?.label || category
}

function getTotalStock(variants: Product['variants']) {
  return variants.reduce((sum, v) => sum + v.stock, 0)
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination
  const [page, setPage] = useState(1)

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Editor
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    productIds: string[]
  }>({ open: false, productIds: [] })

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.nameHu.toLowerCase().includes(search.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.active) ||
        (statusFilter === 'inactive' && !p.active)
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedProducts.map((p) => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  // CRUD handlers
  const handleSave = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (productData.id) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id ? { ...p, ...productData } : p
        )
      )
    } else {
      // Create
      const newProduct: Product = {
        ...productData,
        id: `new-${Date.now()}`,
      } as Product
      setProducts((prev) => [newProduct, ...prev])
    }
  }

  const handleDuplicate = (product: Product) => {
    const duplicate: Product = {
      ...product,
      id: `dup-${Date.now()}`,
      nameHu: `${product.nameHu} (másolat)`,
      slug: `${product.slug}-masolat`,
      active: false,
    }
    setProducts((prev) => [duplicate, ...prev])
    toast.success('Termék duplikálva')
  }

  const handleDelete = (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)))
    setSelectedIds(new Set())
    setDeleteDialog({ open: false, productIds: [] })
    toast.success(
      productIds.length === 1
        ? 'Termék törölve'
        : `${productIds.length} termék törölve`
    )
  }

  const handleBulkActivate = (active: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, active } : p))
    )
    setSelectedIds(new Set())
    toast.success(
      active
        ? `${selectedIds.size} termék aktiválva`
        : `${selectedIds.size} termék inaktiválva`
    )
  }

  const openEditor = (product: Product | null = null) => {
    setEditingProduct(product)
    setEditorOpen(true)
  }

  // Demo controls
  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const simulateError = () => {
    setError('Nem sikerült betölteni a termékeket. Kérjük, próbáld újra.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Termékek</h1>
          <p className="text-muted-foreground text-sm">
            {filteredProducts.length} termék
          </p>
        </div>
        <Button onClick={() => openEditor()}>
          <Plus className="size-4 mr-2" />
          Új termék
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Keresés..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Demo controls */}
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={simulateLoading}>
            Loading
          </Button>
          <Button variant="outline" size="sm" onClick={simulateError}>
            Error
          </Button>
          {error && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} kijelölve
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkActivate(true)}
            >
              Aktiválás
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkActivate(false)}
            >
              Inaktiválás
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setDeleteDialog({
                  open: true,
                  productIds: Array.from(selectedIds),
                })
              }
            >
              Törlés
            </Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setError(null)}
          >
            Újrapróbálás
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedProducts.length > 0 &&
                    selectedIds.size === paginatedProducts.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16"></TableHead>
              <TableHead>Név</TableHead>
              <TableHead>Kategória</TableHead>
              <TableHead className="text-right">Alapár</TableHead>
              <TableHead className="text-right">Készlet</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-14" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedProducts.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} className="h-48">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Package className="size-12 text-muted-foreground/50 mb-3" />
                    <p className="font-medium">Nincs találat</p>
                    <p className="text-sm text-muted-foreground">
                      Próbálj más keresési feltételeket
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                const totalStock = getTotalStock(product.variants)
                const isOutOfStock = product.variants.length > 0 && totalStock === 0

                return (
                  <TableRow
                    key={product.id}
                    data-state={selectedIds.has(product.id) ? 'selected' : undefined}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.nameHu}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openEditor(product)}
                        className="font-medium hover:underline text-left"
                      >
                        {product.nameHu}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryLabel(product.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(product.basePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.variants.length > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono">{totalStock}</span>
                          {isOutOfStock && (
                            <Badge variant="destructive" className="text-[10px]">
                              ELFOGYOTT
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.active ? 'default' : 'secondary'}
                      >
                        {product.active ? 'Aktív' : 'Inaktív'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditor(product)}>
                            <Pencil className="size-4 mr-2" />
                            Szerkesztés
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(product)}
                          >
                            <Copy className="size-4 mr-2" />
                            Másolás
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                productIds: [product.id],
                              })
                            }
                          >
                            <Trash2 className="size-4 mr-2" />
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filteredProducts.length)} /{' '}
            {filteredProducts.length}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor Sheet */}
      <ProductEditorSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        product={editingProduct}
        onSave={handleSave}
        allProducts={products}
      />

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Termék törlése</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.productIds.length === 1
                ? 'Biztosan törölni akarod ezt a terméket? Ez a művelet nem vonható vissza.'
                : `Biztosan törölni akarsz ${deleteDialog.productIds.length} terméket? Ez a művelet nem vonható vissza.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégse</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDelete(deleteDialog.productIds)}
            >
              Törlés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
