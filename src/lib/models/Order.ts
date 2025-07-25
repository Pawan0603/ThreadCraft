import mongoose, { type Document, Schema } from "mongoose"

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  slug: string
  image: string
  price: number
  quantity: number
  size: string
  color?: string
  sku?: string
  total: number
}

export interface ITrackingEvent {
  status: string
  date: Date
  location?: string
  description: string
  updatedBy?: mongoose.Types.ObjectId
}

export interface IOrder extends Document {
  _id: string
  orderNumber: string
  user?: mongoose.Types.ObjectId
  customer: {
    name: string
    email: string
    phone: string
  }
  items: IOrderItem[]
  subtotal: number
  tax: number
  Shipping: number
  discount: number
  total: number
  currency: string
  status: "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
  paymentMethod: "cash_on_delivery" | "credit_card" | "paypal" | "stripe" | "bank_transfer"
  paymentDetails?: {
    transactionId?: string
    paymentIntentId?: string
    refundId?: string
  }
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  billingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  shipping: {
    method: string
    cost: number
    estimatedDelivery?: Date
    trackingNumber?: string
    carrier?: string
  }
  trackingEvents: ITrackingEvent[]
  notes?: string
  adminNotes?: string
  couponCode?: string
  refunds: {
    amount: number
    reason: string
    date: Date
    processedBy: mongoose.Types.ObjectId
  }[]
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: { type: String },
  sku: { type: String },
  total: { type: Number, required: true, min: 0 },
})

const TrackingEventSchema = new Schema<ITrackingEvent>({
  status: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  description: { type: String, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    Shipping: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card", "paypal", "stripe", "bank_transfer"],
      required: true,
    },
    paymentDetails: {
      transactionId: { type: String },
      paymentIntentId: { type: String },
      refundId: { type: String },
    },
    shippingAddress: {
      name: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
    billingAddress: {
      name: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
      phone: { type: String },
    },
    shipping: {
      method: { type: String, required: true },
      cost: { type: Number, required: true, min: 0 },
      estimatedDelivery: { type: Date },
      trackingNumber: { type: String },
      carrier: { type: String },
    },
    trackingEvents: [TrackingEventSchema],
    notes: { type: String },
    adminNotes: { type: String },
    couponCode: { type: String },
    refunds: [
      {
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        processedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Indexes
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ user: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ paymentStatus: 1 })
OrderSchema.index({ "customer.email": 1 })
OrderSchema.index({ createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
