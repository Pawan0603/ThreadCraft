"use client"

import type React from "react"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "./wishlist-context"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: Product
  variant?: "default" | "icon"
  className?: string
}

export function WishlistButton({ product, variant = "default", className }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggleWishlist}
        className={cn(
          "absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-md transition-all hover:scale-110",
          inWishlist ? "text-red-500" : "text-gray-400 hover:text-gray-600",
          isAnimating && "animate-pulse",
          className,
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-5 w-5", inWishlist ? "fill-current" : "")} />
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2",
        inWishlist ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" : "",
        isAnimating && "animate-pulse",
        className,
      )}
      onClick={handleToggleWishlist}
    >
      <Heart className={cn("h-4 w-4", inWishlist ? "fill-current" : "")} />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
