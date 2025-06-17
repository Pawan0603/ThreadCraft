export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
  featured?: boolean
  averageRating?: number
  reviewCount?: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  verified?: boolean
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  image?: string
}

export interface TrackingEvent {
  status: string
  date: string
  location?: string
  description: string
}

export interface Order {
  id: string
  userId?: string
  customer: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }
  items: OrderItem[]
  total: number
  status: "Pending" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled"
  paymentMethod: "Cash on Delivery" | "Credit Card" | "PayPal"
  createdAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  trackingEvents?: TrackingEvent[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}
