"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import { useCart } from "@/components/cart/cart-context"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearWishlist = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearWishlist()
      setIsClearing(false)
    }, 500)
  }

  const handleAddToCart = (productId: string) => {
    const product = wishlistItems.find((item) => item._id === productId)
    if (product) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: "M", // Default size, can be changed later
        },
        1,
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">My Wishlist</h1>
        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleClearWishlist}
            disabled={isClearing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Heart className="mb-4 h-12 w-12 text-gray-300" />
          <h2 className="mb-2 text-xl font-medium">Your wishlist is empty</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Items added to your wishlist will be saved here. Start browsing to add your favorite items!
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-6 text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 font-medium">{product.name}</h3>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
                <div className="absolute right-2 top-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                </div>
                <div className="p-4 pt-0">
                  <Button variant="secondary" size="sm" className="w-full" onClick={() => handleAddToCart(product._id)}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
