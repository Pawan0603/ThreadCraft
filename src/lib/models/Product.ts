import mongoose, { type Document, Schema } from "mongoose"

export interface IProductVariant {
  _id?: string
  size: string
  color: string
  sku: string
  stock: number
  price?: number
  images?: string[] | null;
}

export interface IProduct extends Document {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  cost?: number
  images: string[]
  category: mongoose.Types.ObjectId
  subcategory?: mongoose.Types.ObjectId
  brand?: string
  tags: string[]
  variants: IProductVariant[]
  featured: boolean
  status: "active" | "draft" | "archived"
  visibility: "public" | "private"
  inventory: {
    trackQuantity: boolean
    quantity: number
    lowStockThreshold: number
    allowBackorder: boolean
  }
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    shippingClass?: string
  }
  seo: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  ratings: {
    average: number
    count: number
    distribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  sales: {
    totalSold: number
    revenue: number
  }
  createdBy: mongoose.Types.ObjectId
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ProductVariantSchema = new Schema<IProductVariant>({
  size: { type: String, required: true },
  color: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, min: 0 },
  images: [{ type: String }],
})

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    tags: [{ type: String }],
    variants: [ProductVariantSchema],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft", "archived"], default: "draft" },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    inventory: {
      trackQuantity: { type: Boolean, default: true },
      quantity: { type: Number, default: 0, min: 0 },
      lowStockThreshold: { type: Number, default: 5 },
      allowBackorder: { type: Boolean, default: false },
    },
    shipping: {
      weight: { type: Number, default: 0 },
      dimensions: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
      },
      shippingClass: { type: String },
    },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
      canonicalUrl: { type: String },
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
    sales: {
      totalSold: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
)

// Indexes
ProductSchema.index({ slug: 1 })
ProductSchema.index({ category: 1 })
ProductSchema.index({ status: 1 })
ProductSchema.index({ featured: 1 })
ProductSchema.index({ "ratings.average": -1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ name: "text", description: "text", tags: "text" })

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
