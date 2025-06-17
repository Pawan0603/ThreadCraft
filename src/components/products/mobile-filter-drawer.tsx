"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, SlidersHorizontal, Check, Search } from "lucide-react"
import ProductFilters from "./product-filters"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface MobileFilterDrawerProps {
  categories: string[]
  priceRange: [number, number]
  onCategoryChange: (categories: string[]) => void
  onPriceChange: (range: [number, number]) => void
  selectedCategories: string[]
  selectedPriceRange: [number, number]
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  activeFiltersCount: number
}

export default function MobileFilterDrawer({
  categories,
  priceRange,
  onCategoryChange,
  onPriceChange,
  selectedCategories,
  selectedPriceRange,
  isOpen,
  onClose,
  onApply,
  activeFiltersCount,
}: MobileFilterDrawerProps) {
  const [localCategories, setLocalCategories] = useState<string[]>(selectedCategories)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(selectedPriceRange)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredCategories, setFilteredCategories] = useState<string[]>(categories)

  // Reset local state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategories(selectedCategories)
      setLocalPriceRange(selectedPriceRange)
      setSearchQuery("")
      setFilteredCategories(categories)
    }
  }, [isOpen, selectedCategories, selectedPriceRange, categories])

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredCategories(filtered)
    }
  }, [searchQuery, categories])

  const handleLocalCategoryChange = (categories: string[]) => {
    setLocalCategories(categories)
  }

  const handleLocalPriceChange = (range: [number, number]) => {
    setLocalPriceRange(range)
  }

  const handleApply = () => {
    onCategoryChange(localCategories)
    onPriceChange(localPriceRange)
    onApply()
  }

  const handleReset = () => {
    setLocalCategories([])
    setLocalPriceRange(priceRange)
    setSearchQuery("")
    setFilteredCategories(categories)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilteredCategories(categories)
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] rounded-t-xl bg-white shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Drawer header */}
        <div className="sticky top-0 flex items-center justify-between border-b p-4 bg-white z-10">
          <div className="flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Filters</h2>
            {activeFiltersCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Drawer content - scrollable */}
        <div className="custom-scrollbar overflow-y-auto p-4">
          {/* Search field for categories */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <ProductFilters
            categories={filteredCategories}
            priceRange={priceRange}
            onCategoryChange={handleLocalCategoryChange}
            onPriceChange={handleLocalPriceChange}
            selectedCategories={localCategories}
            selectedPriceRange={localPriceRange}
            showEmptyState={filteredCategories.length === 0}
            searchQuery={searchQuery}
          />
        </div>

        {/* Drawer footer */}
        <div className="sticky bottom-0 border-t bg-white p-4">
          <Button className="w-full" onClick={handleApply}>
            <Check className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
