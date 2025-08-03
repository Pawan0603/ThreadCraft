import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // In a stateless JWT system, logout is handled client-side
  // by removing the tokens from storage

  const cookieStore = await cookies()
  cookieStore.delete("accessToken", { path: "/" })
  cookieStore.delete("refreshToken", { path: "/" })

  return NextResponse.json({
    message: "Logout successful",
  })
}
