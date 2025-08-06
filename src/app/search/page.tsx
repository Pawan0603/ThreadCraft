"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getAllProducts } from "@/lib/products"
import ProductGrid from "@/components/products/product-grid"
import type { Product } from "@/lib/types"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      if (query) {
        const allProducts = await getAllProducts()
        const filteredProducts = allProducts.filter((product) => {
          const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
          return searchableText.includes(query.toLowerCase())
        })
        setResults(filteredProducts)
      } else {
        setResults([])
      }
    }

    fetchProducts();
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Search Results</h1>
      <p className="mb-8 text-slate-600">
        {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
      </p>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="rounded-lg border bg-slate-50 p-8 text-center">
          <h2 className="mb-2 text-lg font-medium">No products found</h2>
          <p className="text-slate-600">
            Try adjusting your search or browse our products to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}
