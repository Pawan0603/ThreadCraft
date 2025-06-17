import mongoose, { type Document, Schema } from "mongoose"

export interface IWishlistItem {
  product: mongoose.Types.ObjectId
  addedAt: Date
}

export interface IWishlist extends Document {
  _id: string
  user: mongoose.Types.ObjectId
  items: IWishlistItem[]
  createdAt: Date
  updatedAt: Date
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  addedAt: { type: Date, default: Date.now },
})

const WishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [WishlistItemSchema],
  },
  {
    timestamps: true,
  },
)

// Indexes
WishlistSchema.index({ user: 1 })
WishlistSchema.index({ "items.product": 1 })

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema)
