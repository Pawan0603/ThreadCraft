import mongoose, { type Document, Schema } from "mongoose"

export interface ISearchHistory extends Document {
  _id: string
  user?: mongoose.Types.ObjectId
  sessionId: string
  query: string
  filters?: {
    category?: string
    priceRange?: { min: number; max: number }
    rating?: number
    inStock?: boolean
  }
  resultsCount: number
  clickedProducts?: mongoose.Types.ObjectId[]
  timestamp: Date
}

const SearchHistorySchema = new Schema<ISearchHistory>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String, required: true },
  query: { type: String, required: true },
  filters: {
    category: { type: String },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    rating: { type: Number },
    inStock: { type: Boolean },
  },
  resultsCount: { type: Number, required: true },
  clickedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  timestamp: { type: Date, default: Date.now },
})

// Indexes
SearchHistorySchema.index({ user: 1 })
SearchHistorySchema.index({ sessionId: 1 })
SearchHistorySchema.index({ query: 1 })
SearchHistorySchema.index({ timestamp: -1 })

export default mongoose.models.SearchHistory || mongoose.model<ISearchHistory>("SearchHistory", SearchHistorySchema)
