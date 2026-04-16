"use client"

import * as React from "react"
import { X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export interface FilterState {
  origins: string[]
  roasts: string[]
  processes: string[]
  priceRange: [number, number]
}

export interface SortOption {
  value: string
  label: string
}

const ORIGINS = [
  { value: "ethiopia", label: "Etiópia" },
  { value: "colombia", label: "Kolumbia" },
  { value: "kenya", label: "Kenya" },
  { value: "brazil", label: "Brazília" },
  { value: "guatemala", label: "Guatemala" },
]

const ROASTS = [
  { value: "light", label: "Világos" },
  { value: "medium", label: "Közepes" },
  { value: "dark", label: "Sötét" },
]

const PROCESSES = [
  { value: "washed", label: "Mosott" },
  { value: "natural", label: "Természetes" },
  { value: "honey", label: "Honey" },
]

const SORT_OPTIONS: SortOption[] = [
  { value: "popularity", label: "Népszerűség" },
  { value: "price-asc", label: "Ár növekvő" },
  { value: "price-desc", label: "Ár csökkenő" },
  { value: "newest", label: "Újdonságok" },
]

const PRICE_MIN = 0
const PRICE_MAX = 15000

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  sort: string
  onSortChange: (sort: string) => void
  resultCount: number
}

function formatPrice(price: number): string {
  return price.toLocaleString("hu-HU").replace(/,/g, " ") + " Ft"
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item" : undefined}>
      <AccordionItem value="item" className="border-none">
        <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2.5">
          <Checkbox
            id={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...selected, option.value])
              } else {
                onChange(selected.filter((v) => v !== option.value))
              }
            }}
          />
          <Label
            htmlFor={option.value}
            className="text-sm font-normal cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
}

function PriceRangeFilter({
  value,
  onChange,
}: {
  value: [number, number]
  onChange: (value: [number, number]) => void
}) {
  const [localMin, setLocalMin] = React.useState(value[0].toString())
  const [localMax, setLocalMax] = React.useState(value[1].toString())

  React.useEffect(() => {
    setLocalMin(value[0].toString())
    setLocalMax(value[1].toString())
  }, [value])

  const handleMinBlur = () => {
    const num = parseInt(localMin) || PRICE_MIN
    const clamped = Math.max(PRICE_MIN, Math.min(num, value[1] - 100))
    onChange([clamped, value[1]])
  }

  const handleMaxBlur = () => {
    const num = parseInt(localMax) || PRICE_MAX
    const clamped = Math.min(PRICE_MAX, Math.max(num, value[0] + 100))
    onChange([value[0], clamped])
  }

  return (
    <div className="space-y-4">
      <Slider
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        className="py-2"
      />
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label htmlFor="price-min" className="text-xs text-muted-foreground mb-1 block">
            Min
          </Label>
          <div className="relative">
            <Input
              id="price-min"
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              onBlur={handleMinBlur}
              className="pr-8 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Ft
            </span>
          </div>
        </div>
        <span className="text-muted-foreground mt-5">—</span>
        <div className="flex-1">
          <Label htmlFor="price-max" className="text-xs text-muted-foreground mb-1 block">
            Max
          </Label>
          <div className="relative">
            <Input
              id="price-max"
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              onBlur={handleMaxBlur}
              className="pr-8 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Ft
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterContent({
  filters,
  onFiltersChange,
}: {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}) {
  return (
    <div className="space-y-1">
      <FilterSection title="Eredet">
        <CheckboxGroup
          options={ORIGINS}
          selected={filters.origins}
          onChange={(origins) => onFiltersChange({ ...filters, origins })}
        />
      </FilterSection>

      <Separator />

      <FilterSection title="Pörkölés">
        <CheckboxGroup
          options={ROASTS}
          selected={filters.roasts}
          onChange={(roasts) => onFiltersChange({ ...filters, roasts })}
        />
      </FilterSection>

      <Separator />

      <FilterSection title="Feldolgozás">
        <CheckboxGroup
          options={PROCESSES}
          selected={filters.processes}
          onChange={(processes) => onFiltersChange({ ...filters, processes })}
        />
      </FilterSection>

      <Separator />

      <FilterSection title="Ár">
        <PriceRangeFilter
          value={filters.priceRange}
          onChange={(priceRange) => onFiltersChange({ ...filters, priceRange })}
        />
      </FilterSection>
    </div>
  )
}

export function ProductFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  resultCount,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const activeFilterCount =
    filters.origins.length +
    filters.roasts.length +
    filters.processes.length +
    (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX ? 1 : 0)

  const clearAllFilters = () => {
    onFiltersChange({
      origins: [],
      roasts: [],
      processes: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
    })
  }

  const getFilterLabels = (): { type: string; value: string; label: string }[] => {
    const labels: { type: string; value: string; label: string }[] = []

    filters.origins.forEach((v) => {
      const origin = ORIGINS.find((o) => o.value === v)
      if (origin) labels.push({ type: "origins", value: v, label: origin.label })
    })

    filters.roasts.forEach((v) => {
      const roast = ROASTS.find((r) => r.value === v)
      if (roast) labels.push({ type: "roasts", value: v, label: roast.label })
    })

    filters.processes.forEach((v) => {
      const process = PROCESSES.find((p) => p.value === v)
      if (process) labels.push({ type: "processes", value: v, label: process.label })
    })

    if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) {
      labels.push({
        type: "priceRange",
        value: "price",
        label: `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`,
      })
    }

    return labels
  }

  const removeFilter = (type: string, value: string) => {
    if (type === "priceRange") {
      onFiltersChange({ ...filters, priceRange: [PRICE_MIN, PRICE_MAX] })
    } else {
      onFiltersChange({
        ...filters,
        [type]: (filters[type as keyof FilterState] as string[]).filter((v) => v !== value),
      })
    }
  }

  const filterLabels = getFilterLabels()

  return (
    <div className="space-y-4">
      {/* Top Bar: Sort + Filter Button (Mobile) + Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resultCount}</span> termék
        </p>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[160px] bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Desktop Filter Toggle */}
          <Button
            variant="outline"
            className="hidden lg:flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SlidersHorizontal className="size-4" />
            Szűrők
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Szűrők
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
              <SheetHeader className="text-left">
                <SheetTitle className="font-serif text-xl">Szűrők</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto flex-1 py-4 -mx-6 px-6">
                <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
              </div>
              <SheetFooter className="flex-row gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearAllFilters}
                  disabled={activeFilterCount === 0}
                >
                  Szűrők törlése
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">
                    {resultCount} termék mutatása
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden lg:block overflow-hidden"
          >
            <div className="bg-surface border rounded-xl p-6">
              <div className="grid grid-cols-4 gap-8">
                {/* Origin */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Eredet</h4>
                  <CheckboxGroup
                    options={ORIGINS}
                    selected={filters.origins}
                    onChange={(origins) => onFiltersChange({ ...filters, origins })}
                  />
                </div>

                {/* Roast */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Pörkölés</h4>
                  <CheckboxGroup
                    options={ROASTS}
                    selected={filters.roasts}
                    onChange={(roasts) => onFiltersChange({ ...filters, roasts })}
                  />
                </div>

                {/* Process */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Feldolgozás</h4>
                  <CheckboxGroup
                    options={PROCESSES}
                    selected={filters.processes}
                    onChange={(processes) => onFiltersChange({ ...filters, processes })}
                  />
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Ár</h4>
                  <PriceRangeFilter
                    value={filters.priceRange}
                    onChange={(priceRange) => onFiltersChange({ ...filters, priceRange })}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-4 border-t flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    <X className="size-4 mr-1.5" />
                    Szűrők törlése
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {filterLabels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {filterLabels.map((filter) => (
              <Badge
                key={`${filter.type}-${filter.value}`}
                variant="secondary"
                className="pl-3 pr-1.5 py-1.5 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.type, filter.value)}
                  className="size-4 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <X className="size-2.5" />
                  <span className="sr-only">Eltávolítás</span>
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 px-2"
              onClick={clearAllFilters}
            >
              Mind törlése
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
