import mongoose, { type Document, Schema } from "mongoose"

export interface IReview extends Document {
  _id: string
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  order?: mongoose.Types.ObjectId
  rating: number
  title?: string
  comment: string
  images?: string[]
  verified: boolean
  helpful: {
    count: number
    users: mongoose.Types.ObjectId[]
  }
  reported: {
    count: number
    users: mongoose.Types.ObjectId[]
    reasons: string[]
  }
  status: "pending" | "approved" | "rejected"
  moderatedBy?: mongoose.Types.ObjectId
  moderationNote?: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    verified: { type: Boolean, default: false },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    reported: {
      count: { type: Number, default: 0 },
      users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      reasons: [{ type: String }],
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    moderatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    moderationNote: { type: String },
  },
  {
    timestamps: true,
  },
)

// Indexes
ReviewSchema.index({ product: 1 })
ReviewSchema.index({ user: 1 })
ReviewSchema.index({ rating: 1 })
ReviewSchema.index({ status: 1 })
ReviewSchema.index({ createdAt: -1 })
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
