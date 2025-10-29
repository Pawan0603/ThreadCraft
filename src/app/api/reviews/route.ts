import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Review from "@/lib/models/Review"
import Product from "@/lib/models/Product"
import Order from "@/lib/models/Order"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/reviews - Get reviews with filtering
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: { product?: string } = {}
    if (productId) {
      query.product = productId
    }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("user", "name avatar")
        .populate("product", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/reviews - Create new review
async function createReview(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { productId, rating, comment, title } = await req.json()

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user!.userId,
      "items.product": productId,
      status: { $in: ["delivered", "completed"] },
    })

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user!.userId,
      product: productId,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
    }

    const review = new Review({
      user: req.user!.userId,
      product: productId,
      rating,
      comment,
      title,
      verified: !!hasPurchased,
    })

    await review.save()

    // Update product rating
    const reviews = await Review.find({ product: productId })
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    })

    await review.populate("user", "name avatar")

    return NextResponse.json({ review, message: "Review created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(createReview)
