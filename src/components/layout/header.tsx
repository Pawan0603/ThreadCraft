"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import { useAuth } from "@/components/auth/auth-context"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import {
  Menu,
  ShoppingBag,
  X,
  User,
  Heart,
  Search,
  Home,
  ShoppingBasket,
  Tag,
  Percent,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import SearchBar from "./search-bar"

export default function Header() {
  const pathname = usePathname()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const wishlistItemsCount = wishlistItems.length

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Shop", href: "/products", icon: <ShoppingBasket className="h-5 w-5" /> },
    { name: "New Arrivals", href: "/products?category=new", icon: <Tag className="h-5 w-5" /> },
    { name: "Sale", href: "/products?category=sale", icon: <Percent className="h-5 w-5" /> },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-background",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 md:hidden"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">ThreadCraft</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden flex-1 px-6 md:block lg:px-10">
          <SearchBar />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearchBar(!showSearchBar)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Link href="/wishlist" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {wishlistItemsCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          {/* User Account */}
          {user ? (
            <Link href="/profile" className="flex items-center">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border">
                <Image
                  src={user.avatar || "/placeholder.svg?height=32&width=32"}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {cartItemsCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="border-t p-2 md:hidden">
          <SearchBar onSearch={() => setShowSearchBar(false)} />
        </div>
      )}

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="text-xl font-bold">ThreadCraft</div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          {/* User Section */}
          <div className="border-b p-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border">
                  <Image
                    src={user.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  New customer?{" "}
                  <Link
                    href="/signup"
                    className="text-primary underline underline-offset-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shop</div>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-4 h-px bg-border" />

            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Account
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </div>
                  {wishlistItemsCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {wishlistItemsCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5" />
                    Cart
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingBasket className="h-5 w-5" />
                      Orders
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Footer Links */}
          <div className="border-t p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-5 w-5" />
                  Help Center
                </Link>
              </li>
              {user && (
                <li>
                  <button
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    onClick={() => {
                      // Handle logout
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
