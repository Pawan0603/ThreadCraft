import mongoose, { type Document, Schema } from "mongoose"

export interface IAnalytics extends Document {
  _id: string
  type: "page_view" | "product_view" | "add_to_cart" | "purchase" | "search" | "user_signup" | "user_login"
  userId?: mongoose.Types.ObjectId
  sessionId: string
  productId?: mongoose.Types.ObjectId
  orderId?: mongoose.Types.ObjectId
  searchQuery?: string
  page?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  country?: string
  city?: string
  device: {
    type: "desktop" | "mobile" | "tablet"
    os?: string
    browser?: string
  }
  metadata?: Record<string, any>
  timestamp: Date
}

const AnalyticsSchema = new Schema<IAnalytics>({
  type: {
    type: String,
    enum: ["page_view", "product_view", "add_to_cart", "purchase", "search", "user_signup", "user_login"],
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  searchQuery: { type: String },
  page: { type: String },
  referrer: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String },
  country: { type: String },
  city: { type: String },
  device: {
    type: { type: String, enum: ["desktop", "mobile", "tablet"], required: true },
    os: { type: String },
    browser: { type: String },
  },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
})

// Indexes
AnalyticsSchema.index({ type: 1 })
AnalyticsSchema.index({ userId: 1 })
AnalyticsSchema.index({ sessionId: 1 })
AnalyticsSchema.index({ timestamp: -1 })
AnalyticsSchema.index({ productId: 1 })

export default mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema)
