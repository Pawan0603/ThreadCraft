import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Category from "@/lib/models/Category"
import { withAdminAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find({ isActive: true })
      .populate("parent", "name slug")
      .sort({ order: 1, name: 1 })
      .lean()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/categories - Create new category (Admin only)
async function createCategory(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { name, description, parent } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 })
    }

    const category = new Category({
      name,
      slug,
      description,
      parent: parent || null,
    })

    await category.save()
    await category.populate("parent", "name slug")

    return NextResponse.json({ category, message: "Category created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAdminAuth(createCategory)
