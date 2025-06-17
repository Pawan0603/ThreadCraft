import mongoose, { type Document, Schema } from "mongoose"

export interface ICoupon extends Document {
  _id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed_amount" | "free_shipping"
  value: number
  minimumAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  applicableProducts?: mongoose.Types.ObjectId[]
  applicableCategories?: mongoose.Types.ObjectId[]
  excludeProducts?: mongoose.Types.ObjectId[]
  excludeCategories?: mongoose.Types.ObjectId[]
  isActive: boolean
  startsAt?: Date
  expiresAt?: Date
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["percentage", "fixed_amount", "free_shipping"], required: true },
    value: { type: Number, required: true, min: 0 },
    minimumAmount: { type: Number, min: 0 },
    maximumDiscount: { type: Number, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usageCount: { type: Number, default: 0 },
    userUsageLimit: { type: Number, min: 1 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    excludeProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    excludeCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

// Indexes
CouponSchema.index({ code: 1 })
CouponSchema.index({ isActive: 1 })
CouponSchema.index({ expiresAt: 1 })

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema)
