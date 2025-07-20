"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart/cart-context"
import { getProductBySlug } from "@/lib/products"
import { getReviewsByProductId } from "@/lib/reviews"
import { MinusIcon, PlusIcon } from "lucide-react"
import StarRating from "@/components/products/star-rating"
import ReviewsSection from "@/components/products/reviews-section"
import { Product } from "@/lib/types"
import axios from "axios"
import { CldImage } from "next-cloudinary"

export default function ProductPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const params = useParams();
  const slug = params?.slug as string; 

  const [product, setProduct] = useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${slug}`)
      setProduct(res.data.product)
    } catch (error) {
      console.error("Error fetching product:", error)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [slug])

  useEffect(() => {
    // if (product) {
    //   const productReviews = getReviewsByProductId(product.id)
    //   setReviews(productReviews)
    // }
  }, [product])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => router.push("/products")} className="mt-4">
          Back to Products
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      size: selectedSize,
      quantity,
    })
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
          {/* <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          /> */}
          <CldImage
            width="640"
            height="768"
            src={product.images[0] || "placeholder.svg"}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={product.name}
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

          {product.averageRating && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={product.averageRating} size="md" />
              <span className="text-sm text-slate-600">
                {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <p className="mt-2 text-xl font-semibold text-slate-900">${product.price.toFixed(2)}</p>

          <div className="mt-6">
            <h3 className="mb-3 font-medium">Description</h3>
            <p className="text-slate-600">{product.description}</p>
          </div>

          {/* Size Selector */}
          <div className="mt-6">
            <h3 className="mb-3 font-medium">Size</h3>
            <RadioGroup defaultValue="M" onValueChange={setSelectedSize} className="flex gap-4">
              {["S", "M", "L", "XL"].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`size-${size}`} />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="mb-3 font-medium">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button onClick={handleAddToCart} className="mt-8" size="lg">
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection productId={product.id} initialReviews={reviews} />
    </div>
  )
}
