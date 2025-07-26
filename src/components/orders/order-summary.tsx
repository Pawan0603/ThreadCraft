import type { Order } from "@/lib/types"
import Image from "next/image"
import OrderStatusBadge from "./order-status-badge"
import { format, parseISO } from "date-fns"
import { CldImage } from "next-cloudinary"

interface OrderSummaryProps {
  order: Order
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">Placed on {format(parseISO(order.createdAt), "MMMM d, yyyy")}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h3 className="font-medium">Items</h3>
        </div>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded bg-slate-100">
                {!item.image ? (<Image
                  src={item.image || "/placeholder.svg?height=64&width=64"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />) : (<CldImage
                  width="600"
                  height="600"
                  src={item.image!}
                  sizes="100vw"
                  alt={item.name}
                />)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Size: {item.size} • Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="font-medium">Shipping Information</h3>
          </div>
          <div className="p-4">
            <p className="font-medium">{order.customer.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p className="mt-2">{order.customer.phone}</p>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="border-b p-4">
            <h3 className="font-medium">Order Summary</h3>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between border-t pt-2">
                <p className="font-medium">Total</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between pt-2 text-sm text-muted-foreground">
                <p>Payment Method</p>
                <p>{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
