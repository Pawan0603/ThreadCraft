import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // In a stateless JWT system, logout is handled client-side
  // by removing the tokens from storage

  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  return NextResponse.json({
    message: "Logout successful",
  })
}
