import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Order from "@/lib/models/Order"
import { withAuth, withAdminAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/orders/[id] - Get single order
async function getOrder(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const query: any = { _id: params.id }
    const isAdmin = ["admin", "super_admin"].includes(req.user!.role)

    if (!isAdmin) {
      query.user = req.user!.userId
    }

    const order = await Order.findOne(query)
      .populate("user", "name email")
      .populate("items.product", "name image")
      .lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Update order status (Admin only)
async function updateOrder(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { status, trackingNumber, notes } = await req.json()

    const updateData: any = { updatedAt: new Date() }

    if (status) {
      updateData.status = status
      updateData.$push = {
        statusHistory: {
          status,
          timestamp: new Date(),
          notes,
        },
      }
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    const order = await Order.findByIdAndUpdate(params.id, updateData, { new: true })
      .populate("user", "name email")
      .populate("items.product", "name image")

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order, message: "Order updated successfully" })
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getOrder)
export const PUT = withAdminAuth(updateOrder)
