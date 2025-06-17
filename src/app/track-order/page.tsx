"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getOrderByIdAndEmail } from "@/lib/orders"
import type { Order } from "@/lib/types"
import OrderSummary from "@/components/orders/order-summary"
import TrackingTimeline from "@/components/orders/tracking-timeline"

export default function TrackOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("orderId") || ""
  const initialEmail = searchParams.get("email") || ""

  const [orderId, setOrderId] = useState(initialOrderId)
  const [email, setEmail] = useState(initialEmail)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setError("")
    setIsLoading(true)

    if (!orderId || !email) {
      setError("Please enter both order ID and email")
      setIsLoading(false)
      return
    }

    // Update URL with search params
    const params = new URLSearchParams()
    params.set("orderId", orderId)
    params.set("email", email)
    router.push(`/track-order?${params.toString()}`)

    // Simulate API delay
    setTimeout(() => {
      const foundOrder = getOrderByIdAndEmail(orderId, email)

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setError("No order found with the provided details")
      }

      setIsLoading(false)
    }, 1000)
  }

  // Check if we have initial params and try to load the order
  useEffect(() => {
    if (initialOrderId && initialEmail) {
      handleTrackOrder()
    }
  }, [initialOrderId, initialEmail])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Track Your Order</h1>

      <div className="mb-8 rounded-lg border p-6">
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="e.g. ORD-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Track Order"}
          </Button>
        </form>
      </div>

      {order && (
        <div className="space-y-8">
          <OrderSummary order={order} />

          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-medium">Tracking Information</h3>
            </div>
            <div className="p-4">
              {order.trackingNumber && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{order.trackingNumber}</p>
                </div>
              )}

              {order.estimatedDelivery && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium">{order.estimatedDelivery}</p>
                </div>
              )}

              {order.trackingEvents && order.trackingEvents.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-4 font-medium">Tracking History</h4>
                  <TrackingTimeline events={order.trackingEvents} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
