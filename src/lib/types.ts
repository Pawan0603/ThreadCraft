import { IProductVariant } from "./models"

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: {
    _id: string
    name: string
    slug: string
  }
  featured?: boolean
  averageRating?: number
  reviewCount?: number
  variants?: IProductVariant[]
}

export interface Review {
  _id: string
  productId: string
  userId: string
  // userName: string
  user: {
    _id: string
    name: string
  }
  userAvatar?: string
  rating: number
  comment: string
  date: string
  verified?: boolean
  createdAt: Date
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
  _id: string
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
  orderNumber: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  user?:{
    email: string
    name: string
    _id: string
  }
}

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Categories {
    _id: string;
    name: string;
    slug: string;
}[]
