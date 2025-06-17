import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Wishlist from "@/lib/models/Wishlist"
import Product from "@/lib/models/Product"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/wishlist - Get user's wishlist
async function getWishlist(req: AuthenticatedRequest) {
  try {
    await connectDB()

    let wishlist = await Wishlist.findOne({ user: req.user!.userId })
      .populate("items", "name price image averageRating reviewCount")
      .lean()

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user!.userId, items: [] })
    }

    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error("Get wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/wishlist - Add item to wishlist
async function addToWishlist(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    let wishlist = await Wishlist.findOne({ user: req.user!.userId })
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user!.userId, items: [] })
    }

    // Check if item already exists
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId)
      wishlist.updatedAt = new Date()
      await wishlist.save()
    }

    await wishlist.populate("items", "name price image averageRating reviewCount")

    return NextResponse.json({ wishlist, message: "Item added to wishlist" })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/wishlist - Remove item from wishlist
async function removeFromWishlist(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const wishlist = await Wishlist.findOne({ user: req.user!.userId })
    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    wishlist.items = wishlist.items.filter((item: any) => item.toString() !== productId)
    wishlist.updatedAt = new Date()
    await wishlist.save()

    await wishlist.populate("items", "name price image averageRating reviewCount")

    return NextResponse.json({ wishlist, message: "Item removed from wishlist" })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getWishlist)
export const POST = withAuth(addToWishlist)
export const DELETE = withAuth(removeFromWishlist)
