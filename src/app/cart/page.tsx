"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import CartItemCard from "@/components/cart/cart-item-card"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-slate-600">Looks like you haven't added any items to your cart yet.</p>
        <Link href="/products">
          <Button className="flex items-center gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <h1 className="mb-6 text-xl font-bold md:mb-8 md:text-3xl">Your Cart</h1>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <CartItemCard key={`${item._id}-${item.size}`} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <div className="sticky top-20 rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="mb-3 flex justify-between">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="mb-3 flex justify-between">
              <span className="text-sm text-slate-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>

            <div className="mb-4 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={() => router.push("/checkout")} className="w-full" size="lg">
              Proceed to Checkout
            </Button>

            <Button variant="outline" onClick={() => router.push("/products")} className="mt-3 w-full">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
