"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { getOrderById } from "@/lib/orders"
import type { Order } from "@/lib/types"
import OrderSummary from "@/components/orders/order-summary"
import TrackingTimeline from "@/components/orders/tracking-timeline"
import Link from "next/link"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const foundOrder = getOrderById(params.id)

      if (foundOrder) {
        // Check if the order belongs to the logged-in user
        if (foundOrder.userId && user && foundOrder.userId !== user.id) {
          router.push("/profile")
          return
        }
        setOrder(foundOrder)
      } else {
        router.push("/profile")
      }

      setIsLoading(false)
    }

    fetchOrder()
  }, [params.id, router, user])

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[300px] items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-6 text-gray-600">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link href="/profile">
          <Button>Back to Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Order Details</h1>
        <Link href={`/track-order?orderId=${order.id}&email=${order.customer.email}`}>
          <Button variant="outline">Track Order</Button>
        </Link>
      </div>

      <div className="space-y-8">
        <OrderSummary order={order} />

        {order.trackingEvents && order.trackingEvents.length > 0 && (
          <div className="rounded-lg border">
            <div className="border-b p-4">
              <h3 className="font-medium">Tracking History</h3>
            </div>
            <div className="p-4">
              <TrackingTimeline events={order.trackingEvents} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
