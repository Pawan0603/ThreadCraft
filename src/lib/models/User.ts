import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  avatar?: string
  phone?: string
  role: "customer" | "admin" | "super_admin"
  isActive: boolean
  isEmailVerified: boolean
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  lastLogin?: Date
  loginAttempts: number
  lockUntil?: Date
  addresses: IAddress[]
  preferences: {
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
      marketing: boolean
    }
    language: string
    currency: string
    theme: "light" | "dark" | "auto"
  }
  socialLogins: {
    google?: string
    facebook?: string
    twitter?: string
  }
  twoFactorAuth: {
    enabled: boolean
    secret?: string
    backupCodes?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface IAddress {
  _id?: string
  type: "home" | "work" | "other"
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

const AddressSchema = new Schema<IAddress>({
  type: { type: String, enum: ["home", "work", "other"], default: "home" },
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "US" },
  isDefault: { type: Boolean, default: false },
})

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["customer", "admin", "super_admin"], default: "customer" },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    addresses: [AddressSchema],
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      language: { type: String, default: "en" },
      currency: { type: String, default: "USD" },
      theme: { type: String, enum: ["light", "dark", "auto"], default: "light" },
    },
    socialLogins: {
      google: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      secret: { type: String },
      backupCodes: [{ type: String }],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
