import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
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

export interface ICart extends Document {
  _id: string
  user?: mongoose.Types.ObjectId
  sessionId?: string
  items: ICartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  couponCode?: string
  discount: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
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

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    couponCode: { type: String },
    discount: { type: Number, default: 0, min: 0 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
CartSchema.index({ user: 1 })
CartSchema.index({ sessionId: 1 })
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
