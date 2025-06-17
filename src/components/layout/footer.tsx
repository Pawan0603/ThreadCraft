import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">ThreadCraft</h3>
            <p className="text-sm text-slate-600">Premium quality T-shirts crafted for comfort and style.</p>

            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-slate-600 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-slate-600 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-slate-600 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-slate-600 hover:text-slate-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="text-slate-600 hover:text-slate-900">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=sale" className="text-slate-600 hover:text-slate-900">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-slate-600 hover:text-slate-900">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-slate-600 hover:text-slate-900">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <address className="not-italic">
              <p className="text-sm text-slate-600">
                123 Fashion Street
                <br />
                Style City, SC 12345
                <br />
                contact@threadcraft.com
                <br />
                (123) 456-7890
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} ThreadCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
