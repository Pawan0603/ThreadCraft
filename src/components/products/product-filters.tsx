"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SearchX } from "lucide-react"
import { Product } from "@/lib/types"

interface ProductFiltersProps {
  categories: Product["category"][]
  priceRange: [number, number]
  onCategoryChange: (categories: string[]) => void
  onPriceChange: (range: [number, number]) => void
  selectedCategories?: string[]
  selectedPriceRange?: [number, number]
  showEmptyState?: boolean
  searchQuery?: string
}

export default function ProductFilters({
  categories,
  priceRange,
  onCategoryChange,
  onPriceChange,
  selectedCategories: externalSelectedCategories,
  selectedPriceRange: externalPriceValue,
  showEmptyState = false,
  searchQuery = "",
}: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(externalSelectedCategories || [])
  const [priceValue, setPriceValue] = useState<[number, number]>(externalPriceValue || priceRange)

  // Update local state when external state changes
  useEffect(() => {
    if (externalSelectedCategories) {
      setSelectedCategories(externalSelectedCategories)
    }
  }, [externalSelectedCategories])

  useEffect(() => {
    if (externalPriceValue) {
      setPriceValue(externalPriceValue)
    }
  }, [externalPriceValue])

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories: string[]

    if (checked) {
      newCategories = [...selectedCategories, category]
    } else {
      newCategories = selectedCategories.filter((c) => c !== category)
    }

    setSelectedCategories(newCategories)
    onCategoryChange(newCategories)
  }

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setPriceValue(newRange)
    onPriceChange(newRange)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Categories</h3>

        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <SearchX className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500 font-medium">No categories found</p>
            <p className="text-sm text-gray-400">No categories match &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.name}`}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) => handleCategoryChange(category.name, checked === true)}
                  className="h-5 w-5"
                />
                <Label htmlFor={`category-${category.name}`} className="text-sm">
                  {category.name}
                </Label>  
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Price Range</h3>
        <div className="px-2">
          <Slider
            value={[priceValue[0], priceValue[1]]}
            min={priceRange[0]}
            max={priceRange[1]}
            step={1}
            onValueChange={handlePriceChange}
            className="py-4"
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="font-medium">${priceValue[0]}</span>
            <span className="font-medium">${priceValue[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
