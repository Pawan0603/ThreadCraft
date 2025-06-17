"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  HelpCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const popularTopics = [
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Order Status",
    description: "Track your order and delivery updates",
    href: "/help/orders",
    badge: "Popular",
    keywords: ["order", "status", "track", "delivery", "shipping", "updates"],
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Shipping & Delivery",
    description: "Shipping options, costs, and delivery times",
    href: "/help/shipping",
    badge: null,
    keywords: ["shipping", "delivery", "cost", "time", "express", "standard", "free"],
  },
  {
    icon: <RotateCcw className="h-6 w-6" />,
    title: "Returns & Exchanges",
    description: "How to return or exchange your items",
    href: "/help/returns",
    badge: null,
    keywords: ["return", "exchange", "refund", "policy", "unworn", "defective"],
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Payment & Billing",
    description: "Payment methods and billing questions",
    href: "/help/payment",
    badge: null,
    keywords: ["payment", "billing", "credit card", "paypal", "cod", "cash on delivery"],
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Account & Security",
    description: "Manage your account and privacy settings",
    href: "/help/account",
    badge: null,
    keywords: ["account", "security", "privacy", "password", "login", "profile"],
  },
  {
    icon: <HelpCircle className="h-6 w-6" />,
    title: "Product Information",
    description: "Sizing, materials, and care instructions",
    href: "/help/products",
    badge: null,
    keywords: ["product", "size", "sizing", "material", "care", "instructions", "fabric"],
  },
]

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. Free shipping is available on orders over $50.",
    keywords: ["shipping", "delivery", "time", "standard", "express", "free", "days"],
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unworn items in original condition with tags attached. Returns are free for defective items.",
    keywords: ["return", "policy", "30 day", "unworn", "original", "tags", "defective", "free"],
  },
  {
    question: "How do I track my order?",
    answer:
      "You can track your order using the tracking number sent to your email, or by visiting our order tracking page with your order number and email.",
    keywords: ["track", "order", "tracking number", "email", "order number"],
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Cash on Delivery (COD) for eligible locations.",
    keywords: ["payment", "methods", "credit card", "visa", "mastercard", "paypal", "cod", "cash on delivery"],
  },
  {
    question: "How do I change or cancel my order?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our customer service team for assistance.",
    keywords: ["change", "cancel", "modify", "order", "1 hour", "customer service"],
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we ship within the United States. International shipping options are coming soon. Sign up for our newsletter to be notified.",
    keywords: ["international", "shipping", "united states", "newsletter", "coming soon"],
  },
  {
    question: "What sizes do you offer?",
    answer:
      "We offer sizes from XS to XXL for most of our t-shirts. Check the size guide on each product page for detailed measurements.",
    keywords: ["sizes", "xs", "xxl", "size guide", "measurements", "t-shirts"],
  },
  {
    question: "How do I care for my t-shirts?",
    answer:
      "Machine wash cold with like colors, tumble dry low, and avoid bleach. For best results, wash inside out and remove promptly from dryer.",
    keywords: ["care", "wash", "machine wash", "cold", "tumble dry", "bleach", "inside out"],
  },
  {
    question: "Do you offer bulk or wholesale pricing?",
    answer:
      "Yes, we offer wholesale pricing for orders of 50+ items. Contact our wholesale team at wholesale@threadcraft.com for more information.",
    keywords: ["bulk", "wholesale", "pricing", "50 items", "wholesale team", "email"],
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via live chat (24/7), phone at (123) 456-7890 (Mon-Fri 9AM-6PM EST), or email at support@threadcraft.com.",
    keywords: ["contact", "customer support", "live chat", "phone", "email", "24/7"],
  },
]

const contactOptions = [
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Available 24/7",
    action: "Start Chat",
    href: "#",
    keywords: ["chat", "live chat", "support", "24/7"],
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Phone Support",
    description: "Call us for immediate assistance",
    availability: "Mon-Fri 9AM-6PM EST",
    action: "Call (123) 456-7890",
    href: "tel:+11234567890",
    keywords: ["phone", "call", "support", "assistance", "monday", "friday"],
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Support",
    description: "Send us a detailed message",
    availability: "Response within 24 hours",
    action: "Send Email",
    href: "mailto:support@threadcraft.com",
    keywords: ["email", "message", "support", "24 hours", "response"],
  },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Filter results based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        topics: [],
        faqs: [],
        contacts: [],
        hasResults: false,
      }
    }

    const query = searchQuery.toLowerCase().trim()

    const filteredTopics = popularTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    )

    const filteredFaqs = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    )

    const filteredContacts = contactOptions.filter(
      (contact) =>
        contact.title.toLowerCase().includes(query) ||
        contact.description.toLowerCase().includes(query) ||
        contact.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
    )

    return {
      topics: filteredTopics,
      faqs: filteredFaqs,
      contacts: filteredContacts,
      hasResults: filteredTopics.length > 0 || filteredFaqs.length > 0 || filteredContacts.length > 0,
    }
  }, [searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsSearching(value.trim().length > 0)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to your questions or get in touch with our support team
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                className="pl-10 pr-12 py-3 text-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Stats */}
            {isSearching && (
              <div className="mt-4 text-sm text-muted-foreground">
                {searchResults.hasResults ? (
                  <p>
                    Found {searchResults.topics.length + searchResults.faqs.length + searchResults.contacts.length}{" "}
                    results for "{searchQuery}"
                  </p>
                ) : (
                  <p>No results found for "{searchQuery}". Try different keywords or browse topics below.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {isSearching && searchResults.hasResults && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Search Results</h2>

            {/* Topics Results */}
            {searchResults.topics.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Help Topics ({searchResults.topics.length})</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.topics.map((topic, index) => (
                    <Link key={index} href={topic.href}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg text-primary">{topic.icon}</div>
                              <div>
                                <CardTitle className="text-lg">{highlightText(topic.title, searchQuery)}</CardTitle>
                              </div>
                            </div>
                            {topic.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {topic.badge}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            {highlightText(topic.description, searchQuery)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-primary">
                            Learn more
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Results */}
            {searchResults.faqs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions ({searchResults.faqs.length})</h3>
                <div className="space-y-4">
                  {searchResults.faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{highlightText(faq.question, searchQuery)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{highlightText(faq.answer, searchQuery)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Results */}
            {searchResults.contacts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Contact Options ({searchResults.contacts.length})</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {searchResults.contacts.map((option, index) => (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="mx-auto p-3 bg-primary/10 rounded-full text-primary w-fit">{option.icon}</div>
                        <CardTitle className="text-lg">{highlightText(option.title, searchQuery)}</CardTitle>
                        <CardDescription>{highlightText(option.description, searchQuery)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4" />
                          {option.availability}
                        </div>
                        <Button asChild className="w-full">
                          <Link href={option.href}>{option.action}</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Default Content (shown when not searching or no results) */}
        {!isSearching && (
          <>
            {/* Popular Topics */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Popular Topics</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {popularTopics.map((topic, index) => (
                  <Link key={index} href={topic.href}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">{topic.icon}</div>
                            <div>
                              <CardTitle className="text-lg">{topic.title}</CardTitle>
                            </div>
                          </div>
                          {topic.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {topic.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-2">{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-primary">
                          Learn more
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Quick answers to common questions about ThreadCraft</p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Options */}
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-muted-foreground">Our support team is here to assist you</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="mx-auto p-3 bg-primary/10 rounded-full text-primary w-fit">{option.icon}</div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4" />
                        {option.availability}
                      </div>
                      <Button asChild className="w-full">
                        <Link href={option.href}>{option.action}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Additional Resources */}
            <section>
              <div className="bg-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
                <p className="text-muted-foreground mb-6">Explore more ways to get the help you need</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/help/size-guide">Size Guide</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/help/care-instructions">Care Instructions</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/help/wholesale">Wholesale Inquiries</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/track-order">Track Your Order</Link>
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* No Results Message */}
        {isSearching && !searchResults.hasResults && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find anything matching "{searchQuery}". Try using different keywords or browse our help
                topics below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={clearSearch}>Browse All Topics</Button>
                <Button variant="outline" asChild>
                  <Link href="mailto:support@threadcraft.com">Contact Support</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
