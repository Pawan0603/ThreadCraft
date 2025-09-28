'use client';
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/products/product-grid"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  // const featuredProducts = getFeaturedProducts()
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get("/api/products", {
          params: {
            featured: true,
          },
        });

        if(res.status === 200){
          setFeaturedProducts(res.data.products);
        }

        console.log("ress", res);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    }

    fetchFeaturedProducts();

  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="bg-slate-50 py-16 md:py-24 relative overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">ThreadCraft</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 md:text-xl">
            Premium quality T-shirts crafted for comfort and style
          </p>
          <Link href="/products">
            <Button size="lg" className="px-8 py-6 text-lg">
              Shop Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Featured T-shirts</h2>
          <ProductGrid products={featuredProducts} />
          <div className="mt-10 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
