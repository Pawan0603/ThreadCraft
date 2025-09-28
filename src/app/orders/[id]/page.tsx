"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
// import { useAuth } from "@/components/auth/auth-context"
// import { getOrderById } from "@/lib/orders"
import type { Order } from "@/lib/types"
import OrderSummary from "@/components/orders/order-summary"
import TrackingTimeline from "@/components/orders/tracking-timeline"
import Link from "next/link"
import axios from "axios"

export default function OrderDetailPage() {
  // const { user } = useAuth()
  // const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const params = useParams();
  const paramsId = params?.id as string;

  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      setAccessToken(token)
    }
  }, []);

  const fetchOrder = async () => {
    console.log("Fetching order with ID:", paramsId)
    setIsLoading(true);
    try {
      console.log("Path", `/api/orders/${paramsId}`)
      const res = await axios.get(`/api/orders/${paramsId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        })

      if (res.status === 200) {
        setOrder(res.data.order);
        console.log(res)
      }
    } catch (error) {
      console.log("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!accessToken) {
      console.log("Access token is required to fetch order details.")
      return
    }
    if (!paramsId) {
      console.log("Order ID is required to fetch order details.")
      return
    }
    fetchOrder();
  }, [paramsId, accessToken])

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
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
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
        <Link href={`/track-order?orderId=${order._id}&email=${order.customer.email}`}>
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
