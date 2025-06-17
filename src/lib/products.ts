import type { Product } from "./types"

const products: Product[] = [
  {
    id: "1",
    name: "Classic White Tee",
    slug: "classic-white-tee",
    description:
      "A timeless white t-shirt made from 100% organic cotton. Perfect for everyday wear with a comfortable fit and soft feel.",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Basics",
    featured: true,
    averageRating: 4.7,
    reviewCount: 42,
  },
  {
    id: "2",
    name: "Vintage Black Tee",
    slug: "vintage-black-tee",
    description:
      "Our vintage-inspired black t-shirt features a slightly faded look and ultra-soft fabric for that perfectly worn-in feel.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Vintage",
    featured: true,
    averageRating: 4.5,
    reviewCount: 28,
  },
  {
    id: "3",
    name: "Urban Graphic Tee",
    slug: "urban-graphic-tee",
    description:
      "Express your style with our urban graphic tee featuring original artwork from local artists. Made with premium cotton blend.",
    price: 34.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Graphic",
    featured: true,
    averageRating: 4.8,
    reviewCount: 36,
  },
  {
    id: "4",
    name: "Striped Navy Tee",
    slug: "striped-navy-tee",
    description:
      "Classic horizontal stripes on a navy background. This nautical-inspired tee is perfect for casual outings.",
    price: 27.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Patterns",
    featured: false,
    averageRating: 4.2,
    reviewCount: 18,
  },
  {
    id: "5",
    name: "Minimalist Logo Tee",
    slug: "minimalist-logo-tee",
    description:
      "Simple, elegant, and understated. Our minimalist logo tee features a small embroidered logo on premium cotton fabric.",
    price: 32.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Logo",
    featured: true,
    averageRating: 4.6,
    reviewCount: 31,
  },
  {
    id: "6",
    name: "Eco-friendly Green Tee",
    slug: "eco-friendly-green-tee",
    description:
      "Made from recycled materials and organic cotton, this green tee is as good for the planet as it looks on you.",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Eco-friendly",
    featured: false,
    averageRating: 4.9,
    reviewCount: 24,
  },
  {
    id: "7",
    name: "Pocket Detail Tee",
    slug: "pocket-detail-tee",
    description: "A modern classic with a convenient chest pocket. Made from breathable cotton for all-day comfort.",
    price: 26.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Basics",
    featured: false,
    averageRating: 4.3,
    reviewCount: 15,
  },
  {
    id: "8",
    name: "Limited Edition Artist Tee",
    slug: "limited-edition-artist-tee",
    description:
      "Part of our limited edition artist collaboration series. Each tee features unique artwork and comes with a numbered certificate.",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Limited Edition",
    featured: true,
    averageRating: 4.9,
    reviewCount: 47,
  },
]

export function getAllProducts(): Product[] {
  return products
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
