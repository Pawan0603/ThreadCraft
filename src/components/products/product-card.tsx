import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import StarRating from "./star-rating"
import { WishlistButton } from "@/components/wishlist/wishlist-button"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
    >
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton product={product} variant="icon" />
      </div>

      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          priority={product.featured}
        />
        {product.isNew && (
          <div className="absolute left-0 top-0 bg-primary px-2 py-1 text-xs font-medium text-white">New</div>
        )}
        {product.discountPercentage > 0 && (
          <div className="absolute right-0 top-0 bg-red-500 px-2 py-1 text-xs font-medium text-white">
            -{product.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-1 md:text-base">{product.name}</h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{product.category.name}</p>

        {product.averageRating && (
          <div className="mt-1 flex items-center gap-1">
            <StarRating rating={product.averageRating} size="sm" />
            <span className="text-xs text-slate-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">${product.price.toFixed(2)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-slate-500 line-through">${product.originalPrice.toFixed(2)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
