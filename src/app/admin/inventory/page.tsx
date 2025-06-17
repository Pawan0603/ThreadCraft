"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Download,
  Edit,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react"
import { getAllProducts } from "@/lib/products"
import type { Product } from "@/lib/types"

interface InventoryItem extends Product {
  stock: number
  lowStockThreshold: number
  sku: string
  lastRestocked?: string
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [notification, setNotification] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalItems: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  })

  useEffect(() => {
    const products = getAllProducts()

    // Mock inventory data - in real app this would come from inventory API
    const inventoryItems: InventoryItem[] = products.map((product, index) => {
      const stock = Math.floor(Math.random() * 100) + 1
      const lowStockThreshold = 10
      let status: "In Stock" | "Low Stock" | "Out of Stock"

      if (stock === 0) status = "Out of Stock"
      else if (stock <= lowStockThreshold) status = "Low Stock"
      else status = "In Stock"

      return {
        ...product,
        stock,
        lowStockThreshold,
        sku: `SKU-${String(index + 1).padStart(3, "0")}`,
        lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status,
      }
    })

    setInventory(inventoryItems)
    setFilteredInventory(inventoryItems)

    // Calculate stats
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.stock * item.price, 0)
    setStats({
      totalItems: inventoryItems.length,
      inStock: inventoryItems.filter((item) => item.status === "In Stock").length,
      lowStock: inventoryItems.filter((item) => item.status === "Low Stock").length,
      outOfStock: inventoryItems.filter((item) => item.status === "Out of Stock").length,
      totalValue,
    })
  }, [])

  useEffect(() => {
    let filtered = inventory

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredInventory(filtered)
  }, [inventory, searchQuery, statusFilter, categoryFilter])

  const categories = Array.from(new Set(inventory.map((item) => item.category)))

  const handleStockUpdate = (itemId: string, newStock: number) => {
    if (newStock < 0) return

    setInventory(
      inventory.map((item) => {
        if (item.id === itemId) {
          let status: "In Stock" | "Low Stock" | "Out of Stock"
          if (newStock === 0) status = "Out of Stock"
          else if (newStock <= item.lowStockThreshold) status = "Low Stock"
          else status = "In Stock"

          return { ...item, stock: newStock, status }
        }
        return item
      }),
    )

    setNotification("Stock updated successfully!")
    setTimeout(() => setNotification(null), 3000)
  }

  const handleBulkRestock = () => {
    const lowStockItems = inventory.filter((item) => item.status === "Low Stock" || item.status === "Out of Stock")

    setInventory(
      inventory.map((item) => {
        if (item.status === "Low Stock" || item.status === "Out of Stock") {
          return {
            ...item,
            stock: 50, // Restock to 50 units
            status: "In Stock" as const,
            lastRestocked: new Date().toISOString(),
          }
        }
        return item
      }),
    )

    setNotification(`${lowStockItems.length} items restocked successfully!`)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleExportInventory = () => {
    setNotification("Exporting inventory data...")
    setTimeout(() => {
      setNotification("Inventory data exported successfully!")
      setTimeout(() => setNotification(null), 3000)
    }, 2000)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default"
      case "Low Stock":
        return "secondary"
      case "Out of Stock":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
        return <CheckCircle className="h-4 w-4" />
      case "Low Stock":
        return <AlertTriangle className="h-4 w-4" />
      case "Out of Stock":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportInventory}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleBulkRestock}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Bulk Restock
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

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Products tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            <p className="text-xs text-muted-foreground">Available items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {stats.lowStock} items are running low on stock. Consider restocking soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({filteredInventory.length})</CardTitle>
          <CardDescription>Manage your product stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                          <Image
                            src={item.image || "/placeholder.svg?height=48&width=48"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStockUpdate(item.id, item.stock - 1)}
                          disabled={item.stock === 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.stock}</span>
                        <Button variant="outline" size="sm" onClick={() => handleStockUpdate(item.id, item.stock + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.stock * item.price).toFixed(2)}</TableCell>
                    <TableCell>
                      {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No inventory items found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
