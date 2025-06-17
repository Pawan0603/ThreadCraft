import mongoose, { type Document, Schema } from "mongoose"

export interface IInventoryMovement {
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  reference?: string
  cost?: number
  updatedBy: mongoose.Types.ObjectId
  timestamp: Date
}

export interface IInventory extends Document {
  _id: string
  product: mongoose.Types.ObjectId
  variant?: {
    size: string
    color: string
    sku: string
  }
  quantity: number
  reserved: number
  available: number
  reorderPoint: number
  reorderQuantity: number
  cost: number
  location?: string
  movements: IInventoryMovement[]
  lastUpdated: Date
  updatedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const InventoryMovementSchema = new Schema<IInventoryMovement>({
  type: { type: String, enum: ["in", "out", "adjustment"], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  reference: { type: String },
  cost: { type: Number },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
})

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
      size: { type: String },
      color: { type: String },
      sku: { type: String },
    },
    quantity: { type: Number, required: true, min: 0 },
    reserved: { type: Number, default: 0, min: 0 },
    available: { type: Number, required: true, min: 0 },
    reorderPoint: { type: Number, default: 5 },
    reorderQuantity: { type: Number, default: 50 },
    cost: { type: Number, required: true, min: 0 },
    location: { type: String },
    movements: [InventoryMovementSchema],
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

// Indexes
InventorySchema.index({ product: 1 })
InventorySchema.index({ "variant.sku": 1 })
InventorySchema.index({ quantity: 1 })
InventorySchema.index({ available: 1 })

export default mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", InventorySchema)
