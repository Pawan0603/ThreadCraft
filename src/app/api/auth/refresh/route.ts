import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import User from "@/lib/models/User"
import { verifyToken, generateTokens } from "@/lib/auth/jwt"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { refreshToken } = await req.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Check if user still exists and is active
    const user = await User.findById(payload.userId)
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User not found or inactive" }, { status: 401 })
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Set new tokens in cookies
    const cookieStore = await cookies()
    cookieStore.set("accessToken", tokens.accessToken, { httpOnly: true, secure: true, sameSite: "strict" })
    cookieStore.set("refreshToken", tokens.refreshToken, { httpOnly: true, secure: true, sameSite: "strict" })

    return NextResponse.json({
      tokens,
      message: "Tokens refreshed successfully",
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
