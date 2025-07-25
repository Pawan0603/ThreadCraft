"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/cart/cart-context"
import axios from "axios"
import { useAuth } from "@/components/auth/auth-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 1) Read token once
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    if (token) setAccessToken(token)
  }, [])

  // 2) Redirect in an effect (NOT during render)
  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/cart")
    }
  }, [])

  // 3) After hooks, you can early return
  if (cartItems.length === 0) return null

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare customer info (assuming shippingAddress fields)
      const customer = {
        name: shippingAddress.fullName,
        email: user?.email || "",
        phone: shippingAddress.phone,
      };

      // Prepare shipping address for API
      const shippingAddressApi = {
        name: shippingAddress.fullName,
        street: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: "US", // You may want to collect/select country in your form
        phone: shippingAddress.phone,
      };

      // Prepare shipping info (static for now)
      const shipping = {
        method: "Standard Shipping",
        cost: 0,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const items = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        slug: item.slug,
        image: item.images?.[0] || "",
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        // color: item.color,
        // sku: item.sku,
        total: item.price * item.quantity,
      }));

      const paymentMethod = "cash_on_delivery";

      const res = await axios.post(
        "/api/orders",
        {
          items,
          customer,
          shippingAddress: shippingAddressApi,
          billingAddress: shippingAddressApi,
          shipping,
          paymentMethod,
          paymentDetails: {},
          notes: "",
          couponCode: "",
          discount: 0,
          currency: "USD",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log("Order response:", res.data, "status:", res.status);

      if (res.status === 201) {
        // console.log("Order created successfully:", res.data);
        clearCart();
        router.push(`/orders/${res.data.order.orderNumber}`);
      } else {
        console.error("Order creation failed:", res.data);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" onChange={handleAddressChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="(123) 456-7890" onChange={handleAddressChange} required />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" name="address" placeholder="123 Main St" onChange={handleAddressChange} required />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="New York" onChange={handleAddressChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" placeholder="NY" onChange={handleAddressChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Pin Code</Label>
                  <Input id="zipCode" name="zipCode" placeholder="10001" onChange={handleAddressChange} required />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order (Cash on Delivery)"}
            </Button>
          </form>
        </div>

        <div>
          <div className="rounded-lg border bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex justify-between">
                  <span>
                    {item.name} ({item.size}) x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
