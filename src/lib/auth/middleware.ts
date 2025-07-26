import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, type JWTPayload } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export function withAuth(handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest, context: any): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get("authorization")
      console.log("Authorization Header:", authHeader);
      const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

      if (!token) {
        return NextResponse.json({ error: "Access token required" }, { status: 401 })
      }

      const payload = verifyToken(token)
      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      req.user = payload
      return handler(req, context)
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function withAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
    if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    return handler(req)
  })
}
