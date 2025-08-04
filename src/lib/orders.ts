import axios from "axios"
import type { Order } from "./types"
import { addDays, format, subDays } from "date-fns"

// Helper function to generate tracking events based on order status
function generateTrackingEvents(order: Order): Order {
  const events: Order["trackingEvents"] = []
  const createdDate = new Date(order.createdAt)

  // Order placed
  events.push({
    status: "Order Placed",
    date: order.createdAt,
    description: "Your order has been received and is being processed.",
  })

  // Processing
  if (["Processing", "Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
    events.push({
      status: "Processing",
      date: format(addDays(createdDate, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      description: "Your order is being prepared for shipping.",
    })
  }

  // Shipped
  if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
    events.push({
      status: "Shipped",
      date: format(addDays(createdDate, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      location: "Distribution Center",
      description: "Your order has been shipped and is on its way.",
    })
  }

  // Out for delivery
  if (["Out for Delivery", "Delivered"].includes(order.status)) {
    events.push({
      status: "Out for Delivery",
      date: format(addDays(createdDate, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      location: order.customer.address.city,
      description: "Your order is out for delivery and will arrive soon.",
    })
  }

  // Delivered
  if (order.status === "Delivered") {
    events.push({
      status: "Delivered",
      date: format(addDays(createdDate, 4), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      location: order.customer.address.city,
      description: "Your order has been delivered successfully.",
    })
  }

  // Cancelled
  if (order.status === "Cancelled") {
    events.push({
      status: "Cancelled",
      date: format(addDays(createdDate, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      description: "Your order has been cancelled.",
    })
  }

  return {
    ...order,
    trackingEvents: events,
  }
}

// Mock orders data
const orders: Order[] = [
  {
    id: "ORD-123456",
    userId: "user1",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "(123) 456-7890",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
    },
    items: [
      {
        productId: "1",
        name: "Classic White Tee",
        price: 24.99,
        quantity: 2,
        size: "L",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        productId: "3",
        name: "Urban Graphic Tee",
        price: 34.99,
        quantity: 1,
        size: "M",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 84.97,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    estimatedDelivery: format(subDays(new Date(), 3), "yyyy-MM-dd"),
    trackingNumber: "TRK9876543210",
  },
  {
    id: "ORD-789012",
    userId: "user2",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(234) 567-8901",
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
      },
    },
    items: [
      {
        productId: "2",
        name: "Vintage Black Tee",
        price: 29.99,
        quantity: 1,
        size: "S",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 29.99,
    status: "Out for Delivery",
    paymentMethod: "Cash on Delivery",
    createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    estimatedDelivery: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    trackingNumber: "TRK1234567890",
  },
  {
    id: "ORD-345678",
    customer: {
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "(345) 678-9012",
      address: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60007",
      },
    },
    items: [
      {
        productId: "5",
        name: "Minimalist Logo Tee",
        price: 32.99,
        quantity: 3,
        size: "XL",
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        productId: "7",
        name: "Pocket Detail Tee",
        price: 26.99,
        quantity: 2,
        size: "L",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 152.95,
    status: "Shipped",
    paymentMethod: "Cash on Delivery",
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    estimatedDelivery: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    trackingNumber: "TRK5678901234",
  },
  {
    id: "ORD-901234",
    userId: "user1",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "(123) 456-7890",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
    },
    items: [
      {
        productId: "8",
        name: "Limited Edition Artist Tee",
        price: 49.99,
        quantity: 1,
        size: "M",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 49.99,
    status: "Processing",
    paymentMethod: "Cash on Delivery",
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    estimatedDelivery: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    trackingNumber: "TRK2345678901",
  },
  {
    id: "ORD-567890",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "(456) 789-0123",
      address: {
        street: "321 Maple Rd",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
      },
    },
    items: [
      {
        productId: "4",
        name: "Striped Navy Tee",
        price: 27.99,
        quantity: 2,
        size: "S",
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 55.98,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    estimatedDelivery: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    trackingNumber: "TRK3456789012",
  },
]

// Add tracking events to each order
const ordersWithTracking = orders.map((order) => generateTrackingEvents(order))

export function getOrderById(orderId: string): Order | undefined {
  return ordersWithTracking.find((order) => order.id === orderId)
}

export function getOrdersByUserId(userId: string): Order[] {
  return ordersWithTracking.filter((order) => order.userId === userId)
}

export function getOrderByIdAndEmail(orderId: string, email: string): Order | undefined {
  return ordersWithTracking.find((order) => order._id === orderId && order.customer.email === email)
}

export async function getAllOrders(accessToken: string): Promise<Order[]> {
  // return ordersWithTracking
  try {
    console.log("from orders asscesstod g: ", accessToken)
    let res = await axios.get("/api/orders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log("Fetched all orders:", res.data)
    return res.data.orders
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return []
  }
}
