"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/products/product-grid"
import ProductFilters from "@/components/products/product-filters"
import MobileFilterDrawer from "@/components/products/mobile-filter-drawer"
import { getAllProducts } from "@/lib/products"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import axios from "axios"

export default function ProductsPage() {
  // const allProducts = getAllProducts()
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 0])
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await axios.get('/api/products'); // Adjust the endpoint as needed
        console.log(response.data.products);
        setAllProducts(response.data.products);
        setFilteredProducts(response.data.products);
        // Initialize price range based on fetched products
        const prices = response.data.products.map((product: Product) => product.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setSelectedPriceRange([minPrice, maxPrice]);
      } catch (error) {
        
      }
    }
    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = Array.from(new Set(allProducts.map((product) => product.category)))

  // Find min and max prices
  const prices = allProducts.map((product) => product.price)
  const minPrice = Math.floor(Math.min(...prices))
  const maxPrice = Math.ceil(Math.max(...prices))

  // Initialize price range
  useEffect(() => {
    setSelectedPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
    filterProducts(categories, selectedPriceRange)
  }

  const handlePriceChange = (priceRange: [number, number]) => {
    setSelectedPriceRange(priceRange)
    filterProducts(selectedCategories, priceRange)
  }

  const filterProducts = (categories: string[], priceRange: [number, number]) => {
    let filtered = allProducts

    // Filter by category if any are selected
    if (categories.length > 0) {
      filtered = filtered.filter((product) => categories.includes(product.category.name))
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    setFilteredProducts(filtered)
  }

  // Calculate active filters count
  const activeFiltersCount =
    selectedCategories.length + (selectedPriceRange[0] !== minPrice || selectedPriceRange[1] !== maxPrice ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">All T-shirts</h1>

        {/* Mobile filter button */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Desktop filters - hidden on mobile */}
        <div className="hidden md:col-span-1 md:block">
          <div className="sticky top-24 rounded-lg border p-4">
            <ProductFilters
              categories={categories}
              priceRange={[minPrice, maxPrice]}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              selectedCategories={selectedCategories}
              selectedPriceRange={selectedPriceRange}
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {/* Active filters summary for mobile */}
          {activeFiltersCount > 0 && isMobile && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <div key={category} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {category}
                </div>
              ))}
              {(selectedPriceRange[0] !== minPrice || selectedPriceRange[1] !== maxPrice) && (
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
                </div>
              )}
            </div>
          )}

          <ProductGrid products={filteredProducts} />

          {filteredProducts.length === 0 && (
            <div className="mt-8 rounded-lg border bg-slate-50 p-8 text-center">
              <h2 className="mb-2 text-lg font-medium">No products found</h2>
              <p className="text-slate-600">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        categories={categories}
        priceRange={[minPrice, maxPrice]}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
        selectedCategories={selectedCategories}
        selectedPriceRange={selectedPriceRange}
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={() => setIsFilterDrawerOpen(false)}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  )
}
