import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Product from "@/lib/models/Product"
import SearchHistory from "@/lib/models/SearchHistory"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/search - Search products
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "relevance"

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Build search query
    const searchQuery: any = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    }

    if (category) {
      searchQuery.category = category
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {}
      if (minPrice) searchQuery.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) searchQuery.price.$lte = Number.parseFloat(maxPrice)
    }

    // Sorting
    let sortOptions: any = {}
    switch (sortBy) {
      case "price_low":
        sortOptions = { price: 1 }
        break
      case "price_high":
        sortOptions = { price: -1 }
        break
      case "rating":
        sortOptions = { averageRating: -1 }
        break
      case "newest":
        sortOptions = { createdAt: -1 }
        break
      default:
        sortOptions = { featured: -1, averageRating: -1 }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(searchQuery).populate("category", "name slug").sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(searchQuery),
    ])

    return NextResponse.json({
      products,
      query,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/search - Save search history (authenticated users)
async function saveSearchHistory(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { query, filters, resultsCount } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Save search history
    await SearchHistory.create({
      user: req.user!.userId,
      query,
      filters,
      resultsCount,
    })

    return NextResponse.json({ message: "Search history saved" })
  } catch (error) {
    console.error("Save search history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAuth(saveSearchHistory)
