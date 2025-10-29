import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import User from "@/lib/models/User"
import { withAuth } from "@/lib/auth/middleware"

// GET /api/users/profile - Get all users (admin only) 
async function getAllUsers() {
  try {
    await connectDB()

    const users = await User.find({})
      .select("-password -emailVerificationToken -passwordResetToken")
      .lean()

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error("Get all users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



export const GET = withAuth(getAllUsers)