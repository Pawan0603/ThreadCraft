import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import User from "@/lib/models/User"
import { comparePassword, generateTokens } from "@/lib/auth/jwt"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return NextResponse.json({ error: "Account is temporarily locked. Please try again later." }, { status: 423 })
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated. Please contact support." }, { status: 403 })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
      }
      await user.save()

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0
    user.lockUntil = undefined
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Return user data and tokens
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    }

    // Set cookies for tokens
    const cookieStore = await cookies()
    cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: '/',
    })
    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: '/',
    })

    return NextResponse.json({
      user: userData,
      tokens,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
