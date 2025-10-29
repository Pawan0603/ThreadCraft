import mongoose, { type Document, Schema } from "mongoose"

export interface INotification extends Document {
  _id: string
  user: mongoose.Types.ObjectId
  type: "order_update" | "product_back_in_stock" | "price_drop" | "review_reminder" | "marketing" | "system"
  title: string
  message: string
  data?: Record<string, unknown>
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
  status: {
    email?: "pending" | "sent" | "failed"
    sms?: "pending" | "sent" | "failed"
    push?: "pending" | "sent" | "failed"
    inApp?: "unread" | "read"
  }
  scheduledFor?: Date
  sentAt?: Date
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["order_update", "product_back_in_stock", "price_drop", "review_reminder", "marketing", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    channels: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    status: {
      email: { type: String, enum: ["pending", "sent", "failed"] },
      sms: { type: String, enum: ["pending", "sent", "failed"] },
      push: { type: String, enum: ["pending", "sent", "failed"] },
      inApp: { type: String, enum: ["unread", "read"], default: "unread" },
    },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    readAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

// Indexes
NotificationSchema.index({ user: 1 })
NotificationSchema.index({ type: 1 })
NotificationSchema.index({ "status.inApp": 1 })
NotificationSchema.index({ scheduledFor: 1 })
NotificationSchema.index({ createdAt: -1 })

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
