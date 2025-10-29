import mongoose, { type Document, Schema } from "mongoose"

export interface ISettings extends Document {
  _id: string
  key: string
  value: Record<string, unknown> | string | number | boolean | unknown[];
  type: "string" | "number" | "boolean" | "object" | "array"
  category: "general" | "payment" | "shipping" | "email" | "sms" | "social" | "seo" | "analytics"
  description?: string
  isPublic: boolean
  updatedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ["string", "number", "boolean", "object", "array"], required: true },
    category: {
      type: String,
      enum: ["general", "payment", "shipping", "email", "sms", "social", "seo", "analytics"],
      required: true,
    },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

// Indexes
SettingsSchema.index({ key: 1 })
SettingsSchema.index({ category: 1 })
SettingsSchema.index({ isPublic: 1 })

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema)
