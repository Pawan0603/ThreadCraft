import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import Cart from "@/lib/models/Cart"
import Product from "@/lib/models/Product"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"

// GET /api/cart - Get user's cart
async function getCart(req: AuthenticatedRequest) {
  try {
    await connectDB()

    let cart = await Cart.findOne({ user: req.user!.userId })
      .populate("items.product", "name price image variants")
      .lean()

    if (!cart) {
      cart = await Cart.create({ user: req.user!.userId, items: [] })
    }

    // Calculate totals
    let subtotal = 0
    const validItems = []

    for (const item of cart!.items) {
      if (item.product) {
        const itemTotal = item.product.price * item.quantity
        subtotal += itemTotal
        validItems.push({
          ...item,
          total: itemTotal,
        })
      }
    }

    const shipping = subtotal > 50 ? 0 : 5.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    return NextResponse.json({
      cart: {
        ...cart,
        items: validItems,
        subtotal,
        shipping,
        tax,
        total,
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart
async function addToCart(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { productId, quantity = 1, size, color } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check stock if size/color specified
    if (size || color) {
      const variant = product.variants.find((v: any) => (!size || v.size === size) && (!color || v.color === color))
      if (!variant || variant.stock < quantity) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
      }
    }

    let cart = await Cart.findOne({ user: req.user!.userId })
    if (!cart) {
      cart = new Cart({ user: req.user!.userId, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId && item.size === size && item.color === color,
    )

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
      })
    }

    cart.updatedAt = new Date()
    await cart.save()

    await cart.populate("items.product", "name price image")

    return NextResponse.json({ cart, message: "Item added to cart" })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/cart - Update cart item quantity
async function updateCart(req: AuthenticatedRequest) {
  try {
    await connectDB()

    const { itemId, quantity } = await req.json()

    if (!itemId || quantity < 0) {
      return NextResponse.json({ error: "Invalid item ID or quantity" }, { status: 400 })
    }

    const cart = await Cart.findOne({ user: req.user!.userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    if (quantity === 0) {
      // Remove item
      cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId)
    } else {
      // Update quantity
      const item = cart.items.find((item: any) => item._id.toString() === itemId)
      if (item) {
        item.quantity = quantity
      }
    }

    cart.updatedAt = new Date()
    await cart.save()
    await cart.populate("items.product", "name price image")

    return NextResponse.json({ cart, message: "Cart updated" })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/cart - Clear cart
async function clearCart(req: AuthenticatedRequest) {
  try {
    await connectDB()

    await Cart.findOneAndUpdate({ user: req.user!.userId }, { items: [], updatedAt: new Date() })

    return NextResponse.json({ message: "Cart cleared" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAuth(getCart)
export const POST = withAuth(addToCart)
export const PUT = withAuth(updateCart)
export const DELETE = withAuth(clearCart)
