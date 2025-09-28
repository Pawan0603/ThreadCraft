"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Eye, Trash2, Upload, Plus, X, CheckCircle } from "lucide-react"
import { getProductById } from "@/lib/products"
import type { Product } from "@/lib/types"
import Link from "next/link"

interface ProductFormData extends Omit<Product, "id" | "slug" | "createdAt" | "updatedAt"> {
  seoTitle?: string
  seoDescription?: string
  tags: string[]
  variants: Array<{
    size: string
    color: string
    stock: number
    sku: string
  }>
  images: string[]
  featured?: boolean
  status: "active" | "draft" | "archived"
  slug?: string
  comparePrice?: number
}

export default function EditProductPage({ params }: { params: { _id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")
  const [newImage, setNewImage] = useState("")

  useEffect(() => {
    const fetchProduct = () => {
      try {
        const productData = getProductById(params._id)
        if (productData) {
          // Convert to form data format
          const formData: ProductFormData = {
            ...productData,
            seoTitle: productData.name,
            seoDescription: productData.description,
            tags: ["t-shirt", "cotton", "casual"], // Default tags
            variants: [
              {
                size: "M",
                color: "Black",
                stock: 50,
                sku: `${productData.name.toUpperCase().slice(0, 3)}-001`,
              },
            ], // Default variant
            images: [productData.images[0]], // Use the main product image
            featured: productData.featured,
            status: "active" as const,
          }
          setProduct(formData)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params._id])

  const handleSave = async () => {
    if (!product) return

    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setNotification("Product updated successfully!")
    setTimeout(() => setNotification(null), 3000)
    setSaving(false)
  }

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    if (!product) return
    setProduct({ ...product, [field]: value })
  }

  const handleAddTag = () => {
    if (!product || !newTag.trim()) return
    if (!product.tags.includes(newTag.trim())) {
      setProduct({ ...product, tags: [...product.tags, newTag.trim()] })
    }
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (!product) return
    setProduct({ ...product, tags: product.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleAddImage = () => {
    if (!product || !newImage.trim()) return
    if (!product.images.includes(newImage.trim())) {
      setProduct({ ...product, images: [...product.images, newImage.trim()] })
    }
    setNewImage("")
  }

  const handleRemoveImage = (imageToRemove: string) => {
    if (!product) return
    setProduct({ ...product, images: product.images.filter((img) => img !== imageToRemove) })
  }

  const handleAddVariant = () => {
    if (!product) return
    const newVariant = {
      size: "M",
      color: "Black",
      stock: 0,
      sku: `${product.name.toUpperCase().slice(0, 3)}-${Date.now()}`,
    }
    setProduct({ ...product, variants: [...product.variants, newVariant] })
  }

  const handleVariantChange = (index: number, field: string, value: any) => {
    if (!product) return
    const updatedVariants = [...product.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setProduct({ ...product, variants: updatedVariants })
  }

  const handleRemoveVariant = (index: number) => {
    if (!product) return
    setProduct({ ...product, variants: product.variants.filter((_, i) => i !== index) })
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setNotification("Product deleted successfully!")
    setTimeout(() => {
      router.push("/admin/products")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Product not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-600">Update product information and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug || "preview"}`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={product.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare Price ($)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={product.comparePrice || ""}
                    onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={product.category.name} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      <SelectItem value="Hoodies">Hoodies</SelectItem>
                      <SelectItem value="Tank Tops">Tank Tops</SelectItem>
                      <SelectItem value="Long Sleeve">Long Sleeve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload and manage product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative overflow-hidden rounded-lg border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && <Badge className="absolute bottom-2 left-2">Primary</Badge>}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input placeholder="Image URL" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
                <Button onClick={handleAddImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg">
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Drag and drop images here, or click to browse</span>
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Manage different sizes, colors, and inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.variants.map((variant, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Variant {index + 1}</h4>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveVariant(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <Label>Size</Label>
                      <Select value={variant.size} onValueChange={(value) => handleVariantChange(index, "size", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Color</Label>
                      <Input
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label>SKU</Label>
                      <Input value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={handleAddVariant} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Button>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={product.seoTitle || ""}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={product.seoDescription || ""}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={product.status}
                  onValueChange={(value: "active" | "draft" | "archived") => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Product</Label>
                <Switch
                  id="featured"
                  checked={product.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Product ID</p>
                <p className="text-sm text-gray-500">{params._id}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Stock</span>
                  <span className="font-medium">
                    {product.variants.reduce((sum, variant) => sum + variant.stock, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Variants</span>
                  <span className="font-medium">{product.variants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Low Stock</span>
                  <span className="font-medium text-orange-600">
                    {product.variants.filter((v) => v.stock < 10).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                View in Store
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Duplicate Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Save className="mr-2 h-4 w-4" />
                Save as Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
