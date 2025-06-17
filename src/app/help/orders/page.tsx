import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Order Help | ThreadCraft Help Center",
  description: "Get help with your ThreadCraft orders, tracking, and delivery",
}

const orderStatuses = [
  {
    status: "Order Confirmed",
    icon: <CheckCircle className="h-5 w-5" />,
    description: "Your order has been received and is being processed",
    color: "text-green-600",
  },
  {
    status: "Processing",
    icon: <Clock className="h-5 w-5" />,
    description: "We're preparing your items for shipment",
    color: "text-yellow-600",
  },
  {
    status: "Shipped",
    icon: <Truck className="h-5 w-5" />,
    description: "Your order is on its way to you",
    color: "text-blue-600",
  },
  {
    status: "Delivered",
    icon: <Package className="h-5 w-5" />,
    description: "Your order has been delivered",
    color: "text-green-600",
  },
]

const orderFaqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order in several ways: 1) Use the tracking link in your confirmation email, 2) Visit our order tracking page and enter your order number and email, 3) Log into your account and view your order history.",
  },
  {
    question: "Why hasn't my order shipped yet?",
    answer:
      "Orders typically ship within 1-2 business days. Delays can occur due to high demand, custom items, or payment verification. Check your email for any updates or contact our support team.",
  },
  {
    question: "Can I change my shipping address?",
    answer:
      "Shipping addresses can only be changed before your order ships. Contact our support team immediately if you need to update your address. Once shipped, we cannot redirect packages.",
  },
  {
    question: "What if my order is damaged or incorrect?",
    answer:
      "We're sorry for any issues! Contact us within 48 hours of delivery with photos of the problem. We'll arrange a replacement or refund at no cost to you.",
  },
  {
    question: "How do I cancel my order?",
    answer:
      "Orders can be cancelled within 1 hour of placement through your account or by contacting support. After processing begins, cancellation may not be possible.",
  },
]

export default function OrderHelpPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/help" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order Status & Tracking</h1>
          <p className="text-muted-foreground mt-2">Everything you need to know about your ThreadCraft orders</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild className="h-auto p-4 justify-start">
              <Link href="/track-order" className="flex flex-col items-start gap-2">
                <Package className="h-6 w-6" />
                <div>
                  <div className="font-medium">Track Your Order</div>
                  <div className="text-sm opacity-90">Get real-time updates</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/profile" className="flex flex-col items-start gap-2">
                <Clock className="h-6 w-6" />
                <div>
                  <div className="font-medium">Order History</div>
                  <div className="text-sm opacity-70">View past orders</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto p-4 justify-start">
              <Link href="/help" className="flex flex-col items-start gap-2">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <div className="font-medium">Report an Issue</div>
                  <div className="text-sm opacity-70">Get help with problems</div>
                </div>
              </Link>
            </Button>
          </div>
        </section>

        {/* Order Status Guide */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Understanding Order Status</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {orderStatuses.map((status, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`${status.color}`}>{status.icon}</div>
                    <CardTitle className="text-lg">{status.status}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{status.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Order FAQs</h2>
          <div className="space-y-4">
            {orderFaqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mt-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle>Still need help with your order?</CardTitle>
              <CardDescription>
                Our support team is ready to assist you with any order-related questions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="mailto:support@threadcraft.com">Email Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:+11234567890">Call (123) 456-7890</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
