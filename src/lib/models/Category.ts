import mongoose, { type Document, Schema } from "mongoose"

export interface ICategory extends Document {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: mongoose.Types.ObjectId
  level: number
  isActive: boolean
  sortOrder: number
  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
  },
  {
    timestamps: true,
  },
)

CategorySchema.index({ slug: 1 })
CategorySchema.index({ parent: 1 })
CategorySchema.index({ isActive: 1 })
CategorySchema.index({ sortOrder: 1 })

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
