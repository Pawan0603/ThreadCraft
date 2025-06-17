import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import User from "@/lib/models/User"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { hashPassword, comparePassword } from "@/lib/auth/jwt"

// GET /api/users/profile - Get user profile
async function getProfile(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const user = await User.findById(req.user!.userId)
      .select("-password -emailVerificationToken -passwordResetToken")
      .lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/users/profile - Update user profile
async function updateProfile(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const updates = await req.json()
    const { currentPassword, newPassword, ...profileUpdates } = updates

    const user = await User.findById(req.user!.userId).select("+password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 })
      }

      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
      }

      profileUpdates.password = await hashPassword(newPassword)
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user!.userId,
      { ...profileUpdates, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).select("-password -emailVerificationToken -passwordResetToken")

    return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getProfile)
export const PUT = withAuth(updateProfile)
