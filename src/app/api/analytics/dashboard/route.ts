import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"
import User from "@/lib/models/User"
import { withAdminAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

async function getDashboardAnalytics(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "30" // days
    const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

    // Get basic stats
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments({ createdAt: { $gte: startDate } }),

      // Total revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $in: ["delivered", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Total customers
      User.countDocuments({ createdAt: { $gte: startDate }, role: "customer" }),

      // Total products
      Product.countDocuments({ isActive: true }),

      // Recent orders
      Order.find({ createdAt: { $gte: startDate } })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      // Top products
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $unwind: "$items" },
        {
          $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.total" } },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
      ]),

      // Orders by status
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Revenue by day
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $in: ["delivered", "completed"] } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    const stats = {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay,
    }

    return NextResponse.json({ analytics: stats })
  } catch (error) {
    console.error("Get dashboard analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAdminAuth(getDashboardAnalytics)
