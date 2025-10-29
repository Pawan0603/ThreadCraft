import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Product from "@/lib/models/Product"
import Category from "@/lib/models/Category"
import { withAdminAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/products - Get all products with filtering, sorting, pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const featured = searchParams.get("featured")
    const inStock = searchParams.get("inStock")

    // Build query
    const query: { 
      status: string; 
      visibility: string; 
      category?: string;
      $or?: { name?: { $regex: string; $options: string }; description?: { $regex: string; $options: string }; tags?: { $in: RegExp[] } }[];
      price?: { $gte?: number; $lte?: number };
      featured?: boolean;
      "variants.stock"?: { $gt: number };
     } = { status: "active", visibility: "public" }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    if (featured === "true") {
      query.featured = true
    }

    if (inStock === "true") {
      query["variants.stock"] = { $gt: 0 }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const sortOptions: { [key: string]: 1 | -1 } = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1


    const [products, total] = await Promise.all([
      Product.find(query).populate("category", "name slug").sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])


    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create new product (Admin only)
async function createProduct(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const productData = await req.json()

    // Validate required fields
    const { name, description, price, category } = productData
    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if category exists
    const categoryExists = await Category.find({ name: category });
    if (!categoryExists) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }


    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 409 })
    }

    const product = new Product({
      ...productData,
      slug,
      createdBy: req.user!.userId,
    })

    await product.save()
    await product.populate("category", "name slug")

    return NextResponse.json({ product, message: "Product created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAdminAuth(createProduct)
