import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import User from "@/lib/models/User"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const user = await User.findById(req.user!.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
