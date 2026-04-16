'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  GripVertical,
  Plus,
  Trash2,
  X,
  AlertCircle,
  ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
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

// Types
export interface ProductVariant {
  id: string
  options: string
  priceModifier: number
  stock: number
  active: boolean
}

export interface Product {
  id: string
  nameHu: string
  nameEn: string
  descriptionHu: string
  descriptionEn: string
  category: 'coffee' | 'equipment' | 'merch' | 'bundle'
  basePrice: number
  images: string[]
  active: boolean
  // Coffee-specific
  origin?: string
  roast?: string
  processing?: string
  tastingNotes?: string[]
  // Variants
  variants: ProductVariant[]
  // SEO
  slug: string
  metaTitleHu: string
  metaTitleEn: string
  metaDescriptionHu: string
  metaDescriptionEn: string
  ogImage: string
  // Cross-sell
  crossSellIds: string[]
  // Bundle-specific
  bundleComponents?: { productId: string; quantity: number }[]
  bundlePrice?: number
}

const CATEGORIES = [
  { value: 'coffee', label: 'Kávé' },
  { value: 'equipment', label: 'Eszköz' },
  { value: 'merch', label: 'Merch' },
  { value: 'bundle', label: 'Csomag' },
]

const ORIGINS = [
  'Etiópia',
  'Kolumbia',
  'Brazília',
  'Guatemala',
  'Kenya',
  'Costa Rica',
]
const ROASTS = ['Világos', 'Közepes', 'Sötét']
const PROCESSING = ['Mosott', 'Természetes', 'Mézes']

const DEFAULT_PRODUCT: Omit<Product, 'id'> = {
  nameHu: '',
  nameEn: '',
  descriptionHu: '',
  descriptionEn: '',
  category: 'coffee',
  basePrice: 0,
  images: [],
  active: true,
  variants: [],
  slug: '',
  metaTitleHu: '',
  metaTitleEn: '',
  metaDescriptionHu: '',
  metaDescriptionEn: '',
  ogImage: '',
  crossSellIds: [],
}

interface ProductEditorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void
  allProducts: Product[]
}

export function ProductEditorSheet({
  open,
  onOpenChange,
  product,
  onSave,
  allProducts,
}: ProductEditorSheetProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: string }>(
    product || DEFAULT_PRODUCT
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [newTastingNote, setNewTastingNote] = useState('')

  const isEditing = !!product

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({ ...product })
    } else {
      setFormData({ ...DEFAULT_PRODUCT })
    }
    setHasUnsavedChanges(false)
    setImageErrors({})
  }, [product, open])

  const updateField = useCallback(
    <K extends keyof Product>(key: K, value: Product[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }))
      setHasUnsavedChanges(true)
    },
    []
  )

  // Auto-generate slug from Hungarian name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }, [])

  useEffect(() => {
    if (!formData.slug || formData.slug === generateSlug(product?.nameHu || '')) {
      const newSlug = generateSlug(formData.nameHu)
      if (newSlug !== formData.slug) {
        setFormData((prev) => ({ ...prev, slug: newSlug }))
      }
    }
  }, [formData.nameHu, formData.slug, generateSlug, product?.nameHu])

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      onOpenChange(false)
    }
  }, [hasUnsavedChanges, onOpenChange])

  const handleSave = useCallback(() => {
    if (!formData.nameHu.trim()) {
      toast.error('A magyar név megadása kötelező')
      return
    }
    if (formData.basePrice <= 0) {
      toast.error('Az alapár megadása kötelező')
      return
    }
    onSave(formData)
    setHasUnsavedChanges(false)
    onOpenChange(false)
    toast.success(isEditing ? 'Termék frissítve' : 'Termék létrehozva')
  }, [formData, isEditing, onSave, onOpenChange])

  // Image management
  const addImage = useCallback(() => {
    if (!newImageUrl.trim()) return
    try {
      new URL(newImageUrl)
      updateField('images', [...formData.images, newImageUrl])
      setNewImageUrl('')
    } catch {
      toast.error('Érvénytelen URL')
    }
  }, [newImageUrl, formData.images, updateField])

  const removeImage = useCallback(
    (index: number) => {
      const newImages = formData.images.filter((_, i) => i !== index)
      updateField('images', newImages)
      setImageErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    },
    [formData.images, updateField]
  )

  // Variant management
  const addVariant = useCallback(() => {
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      options: '',
      priceModifier: 0,
      stock: 0,
      active: true,
    }
    updateField('variants', [...formData.variants, newVariant])
  }, [formData.variants, updateField])

  const updateVariant = useCallback(
    (id: string, key: keyof ProductVariant, value: unknown) => {
      const newVariants = formData.variants.map((v) =>
        v.id === id ? { ...v, [key]: value } : v
      )
      updateField('variants', newVariants)
    },
    [formData.variants, updateField]
  )

  const removeVariant = useCallback(
    (id: string) => {
      updateField(
        'variants',
        formData.variants.filter((v) => v.id !== id)
      )
    },
    [formData.variants, updateField]
  )

  // Bundle savings calculation
  const bundleSavings = React.useMemo(() => {
    if (formData.category !== 'bundle' || !formData.bundleComponents?.length)
      return null
    const componentsTotal = formData.bundleComponents.reduce((sum, comp) => {
      const product = allProducts.find((p) => p.id === comp.productId)
      return sum + (product?.basePrice || 0) * comp.quantity
    }, 0)
    if (componentsTotal === 0 || !formData.bundlePrice) return null
    const savings = Math.round(
      ((componentsTotal - formData.bundlePrice) / componentsTotal) * 100
    )
    return savings > 0 ? savings : null
  }, [formData.category, formData.bundleComponents, formData.bundlePrice, allProducts])

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {isEditing ? 'Termék szerkesztése' : 'Új termék'}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? `Szerkesztés: ${product.nameHu}`
                : 'Töltsd ki az adatokat az új termék létrehozásához.'}
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="basic">Alap</TabsTrigger>
              {formData.category === 'coffee' && (
                <TabsTrigger value="coffee">Kávé</TabsTrigger>
              )}
              {formData.category === 'bundle' && (
                <TabsTrigger value="bundle">Csomag</TabsTrigger>
              )}
              <TabsTrigger value="variants">Variánsok</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="cross-sell">Kereszt</TabsTrigger>
            </TabsList>

            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameHu">Név (HU) *</Label>
                  <Input
                    id="nameHu"
                    value={formData.nameHu}
                    onChange={(e) => updateField('nameHu', e.target.value)}
                    placeholder="Etióp Yirgacheffe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Név (EN)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => updateField('nameEn', e.target.value)}
                    placeholder="Ethiopian Yirgacheffe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descHu">Leírás (HU)</Label>
                  <Textarea
                    id="descHu"
                    value={formData.descriptionHu}
                    onChange={(e) =>
                      updateField('descriptionHu', e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descEn">Leírás (EN)</Label>
                  <Textarea
                    id="descEn"
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      updateField('descriptionEn', e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategória *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      updateField('category', v as Product['category'])
                    }
                  >
                    <SelectTrigger>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Alapár (Ft) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.basePrice || ''}
                    onChange={(e) =>
                      updateField('basePrice', parseInt(e.target.value) || 0)
                    }
                    placeholder="2490"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Képek</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        className={`relative group rounded-md overflow-hidden border ${
                          imageErrors[index] ? 'border-destructive' : 'border-border'
                        }`}
                      >
                        <div className="w-20 h-20 bg-muted flex items-center justify-center">
                          {imageErrors[index] ? (
                            <AlertCircle className="size-6 text-destructive" />
                          ) : (
                            <Image
                              src={url}
                              alt={`Image ${index + 1}`}
                              width={80}
                              height={80}
                              className="object-cover"
                              onError={() =>
                                setImageErrors((prev) => ({
                                  ...prev,
                                  [index]: true,
                                }))
                              }
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="size-3 mx-auto text-muted-foreground" />
                        </div>
                        {imageErrors[index] && (
                          <div className="absolute inset-x-0 bottom-0 bg-destructive text-destructive-foreground text-[10px] text-center py-0.5">
                            Érvénytelen
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(v) => updateField('active', v)}
                />
                <Label htmlFor="active">Aktív</Label>
              </div>
            </TabsContent>

            {/* Coffee Tab */}
            {formData.category === 'coffee' && (
              <TabsContent value="coffee" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Eredet</Label>
                    <Select
                      value={formData.origin || ''}
                      onValueChange={(v) => updateField('origin', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ORIGINS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pörkölés</Label>
                    <Select
                      value={formData.roast || ''}
                      onValueChange={(v) => updateField('roast', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ROASTS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Feldolgozás</Label>
                    <Select
                      value={formData.processing || ''}
                      onValueChange={(v) => updateField('processing', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válassz..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCESSING.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ízjegyek</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTastingNote}
                      onChange={(e) => setNewTastingNote(e.target.value)}
                      placeholder="Csokoládé, citrus..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTastingNote.trim()) {
                          updateField('tastingNotes', [
                            ...(formData.tastingNotes || []),
                            newTastingNote.trim(),
                          ])
                          setNewTastingNote('')
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newTastingNote.trim()) {
                          updateField('tastingNotes', [
                            ...(formData.tastingNotes || []),
                            newTastingNote.trim(),
                          ])
                          setNewTastingNote('')
                        }
                      }}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  {formData.tastingNotes && formData.tastingNotes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tastingNotes.map((note, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          {note}
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                'tastingNotes',
                                formData.tastingNotes?.filter(
                                  (_, idx) => idx !== i
                                )
                              )
                            }
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Bundle Tab */}
            {formData.category === 'bundle' && (
              <TabsContent value="bundle" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Csomag tartalma</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateField('bundleComponents', [
                          ...(formData.bundleComponents || []),
                          { productId: '', quantity: 1 },
                        ])
                      }
                    >
                      <Plus className="size-4 mr-1" />
                      Termék
                    </Button>
                  </div>

                  {formData.bundleComponents?.map((comp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select
                        value={comp.productId}
                        onValueChange={(v) => {
                          const newComps = [...(formData.bundleComponents || [])]
                          newComps[index] = { ...comp, productId: v }
                          updateField('bundleComponents', newComps)
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Válassz terméket..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allProducts
                            .filter((p) => p.category !== 'bundle')
                            .map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nameHu}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={comp.quantity}
                        onChange={(e) => {
                          const newComps = [...(formData.bundleComponents || [])]
                          newComps[index] = {
                            ...comp,
                            quantity: parseInt(e.target.value) || 1,
                          }
                          updateField('bundleComponents', newComps)
                        }}
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateField(
                            'bundleComponents',
                            formData.bundleComponents?.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bundlePrice">Csomag ár (Ft)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bundlePrice"
                      type="number"
                      value={formData.bundlePrice || ''}
                      onChange={(e) =>
                        updateField(
                          'bundlePrice',
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Külön ár a csomagnak"
                    />
                    {bundleSavings && (
                      <Badge variant="default" className="shrink-0">
                        Megtakarítás: {bundleSavings}%
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>SKU Variánsok</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <Plus className="size-4 mr-1" />
                  Variáns
                </Button>
              </div>

              {formData.variants.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opciók</TableHead>
                      <TableHead>Ár +/-</TableHead>
                      <TableHead>Készlet</TableHead>
                      <TableHead>Aktív</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <Input
                            value={variant.options}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                'options',
                                e.target.value
                              )
                            }
                            placeholder="250g, Őrölt"
                            className="min-w-[120px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={variant.priceModifier}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                'priceModifier',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              value={variant.stock}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  'stock',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20"
                            />
                            {variant.stock === 0 && (
                              <Badge variant="destructive" className="text-[10px]">
                                ELFOGYOTT
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={variant.active}
                            onCheckedChange={(v) =>
                              updateVariant(variant.id, 'active', v)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariant(variant.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  <ImageIcon className="size-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nincs variáns</p>
                  <p className="text-xs">
                    Adj hozzá variánsokat (pl. méret, őrlés)
                  </p>
                </div>
              )}
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="etiop-yirgacheffe"
                />
                <p className="text-xs text-muted-foreground">
                  Automatikusan generálva a névből
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitleHu">Meta cím (HU)</Label>
                  <Input
                    id="metaTitleHu"
                    value={formData.metaTitleHu}
                    onChange={(e) => updateField('metaTitleHu', e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaTitleHu.length}/60
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitleEn">Meta cím (EN)</Label>
                  <Input
                    id="metaTitleEn"
                    value={formData.metaTitleEn}
                    onChange={(e) => updateField('metaTitleEn', e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaTitleEn.length}/60
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescHu">Meta leírás (HU)</Label>
                  <Textarea
                    id="metaDescHu"
                    value={formData.metaDescriptionHu}
                    onChange={(e) =>
                      updateField('metaDescriptionHu', e.target.value)
                    }
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescriptionHu.length}/160
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescEn">Meta leírás (EN)</Label>
                  <Textarea
                    id="metaDescEn"
                    value={formData.metaDescriptionEn}
                    onChange={(e) =>
                      updateField('metaDescriptionEn', e.target.value)
                    }
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescriptionEn.length}/160
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>

            {/* Cross-sell Tab */}
            <TabsContent value="cross-sell" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Kapcsolódó termékek (max 3)</Label>
                <p className="text-xs text-muted-foreground">
                  Ezek a termékek jelennek meg a termékoldal alján
                </p>
              </div>

              <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                  <Select
                    key={index}
                    value={formData.crossSellIds[index] || ''}
                    onValueChange={(v) => {
                      const newIds = [...formData.crossSellIds]
                      if (v) {
                        newIds[index] = v
                      } else {
                        newIds.splice(index, 1)
                      }
                      updateField('crossSellIds', newIds.filter(Boolean))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Termék ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nincs</SelectItem>
                      {allProducts
                        .filter(
                          (p) =>
                            p.id !== formData.id &&
                            !formData.crossSellIds.includes(p.id)
                        )
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nameHu}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={handleClose}>
              Mégse
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Mentés' : 'Létrehozás'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mentetlen változtatások</AlertDialogTitle>
            <AlertDialogDescription>
              Vannak mentetlen változtatásaid. Biztosan el akarod hagyni?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vissza</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowUnsavedDialog(false)
                setHasUnsavedChanges(false)
                onOpenChange(false)
              }}
            >
              Elvetés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
