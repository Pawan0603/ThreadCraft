import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Product from "@/lib/models/Product"
import { withAdminAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/products/[id] - Get single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id)
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar")
      .lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (Admin only)
async function updateProduct(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const updates = await req.json()

    const product = await Product.findByIdAndUpdate(
      params.id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate("category", "name slug")

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product, message: "Product updated successfully" })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
async function deleteProduct(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const PUT = withAdminAuth(updateProduct)
export const DELETE = withAdminAuth(deleteProduct)
