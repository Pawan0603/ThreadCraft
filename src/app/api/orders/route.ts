import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/orders - Get orders (user's own orders or all for admin)
async function getOrders(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const isAdmin = ["admin", "super_admin"].includes(req.user!.role)

    // Build query
    const query: any = {}

    if (!isAdmin) {
      query.user = req.user!.userId
    }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .populate("items.product", "name image price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
async function createOrder(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const orderData = await req.json()
    const { items, shippingAddress, paymentMethod } = orderData

    if (!items || !items.length) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    // Validate products and calculate total
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.product} not found` }, { status: 404 })
      }

      // Check stock
      const variant = product.variants.find((v: any) => v.size === item.size && v.color === item.color)
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0],
        total: itemTotal,
      })

      // Update stock
      variant.stock -= item.quantity
      await product.save()
    }

    // Calculate totals
    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = new Order({
      orderNumber,
      user: req.user!.userId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "pending",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })

    await order.save()
    await order.populate("items.product", "name image")

    return NextResponse.json({ order, message: "Order created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getOrders)
export const POST = withAuth(createOrder)
