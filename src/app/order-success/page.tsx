"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-context"

export default function OrderSuccessPage() {
  const { user } = useAuth()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Generate a random order ID
    setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`)

    // Use user's email if logged in, otherwise use a placeholder
    setEmail(user?.email || "guest@example.com")
  }, [user])

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-3">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Order Placed Successfully!</h1>

      <p className="mb-2 text-lg">Thank you for your order</p>
      <p className="mb-8 text-slate-600">
        Your order ID is <span className="font-semibold">{orderId}</span>
      </p>

      <div className="mb-8 w-full max-w-md rounded-lg border bg-slate-50 p-6 text-left">
        <h2 className="mb-4 text-center text-lg font-semibold">Order Summary</h2>
        <p className="mb-2">We&apos;ve sent an order confirmation to your email with all the details.</p>
        <p className="mb-4">You&apos;ll receive another notification when your order is ready for delivery.</p>
        <p className="font-medium">
          Payment Method: <span className="font-normal">Cash on Delivery</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href={`/track-order?orderId=${orderId}&email=${email}`}>
          <Button variant="outline" size="lg">
            Track Your Order
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
