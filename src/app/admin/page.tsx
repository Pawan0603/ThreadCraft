"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { getAllProducts } from "@/lib/products"
import { getAllOrders } from "@/lib/orders"
import { getAllUsers } from "@/lib/users"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product, Order } from "@/lib/types"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    monthlyGrowth: 12,
    orderGrowth: 8,
    customerGrowth: 15,
  })

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true)
    // Simulate API loading
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    if(!accessToken) {
      console.error("No access token found")
      setIsLoading(false)
      return
    }

    const allProducts = await getAllProducts()
    const allOrders = await getAllOrders(accessToken)
    const allUsers = await getAllUsers(accessToken)

    setProducts(allProducts)
    setOrders(allOrders)
    // setUsers(allUsers)

    // Calculate stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = allOrders.filter((order) => order.status === "Pending").length
    const lowStockItems = 3 // Mock data - in real app would check inventory

    setStats({
      totalRevenue,
      totalOrders: allOrders.length,
      totalProducts: allProducts.length,
      totalUsers: allUsers.length,
      pendingOrders,
      lowStockItems,
      monthlyGrowth: 12,
      orderGrowth: 8,
      customerGrowth: 15,
    })
    setIsLoading(false)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      setAccessToken(token)
    }
  }, [])

  useEffect(() => {
    if (accessToken) {
      loadData()
    }
  }, [accessToken]);

  const handleRefresh = () => {
    loadData()
    setNotification("Dashboard data refreshed!")
    setTimeout(() => setNotification(null), 3000)
  }

  const handleExportData = () => {
    // Simulate export
    setNotification("Exporting dashboard data...")
    setTimeout(() => {
      setNotification("Dashboard data exported successfully!")
      setTimeout(() => setNotification(null), 3000)
    }, 2000)
  }

  const recentOrders = orders.slice(0, 5)
  const recentProducts = products.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your ThreadCraft store</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{notification}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />+{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />+{stats.orderGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
                -2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />+{stats.customerGrowth}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.pendingOrders}</div>
              <p className="text-sm text-orange-700">Orders waiting for processing</p>
              <Link href="/admin/orders?status=pending">
                <Button variant="outline" size="sm" className="mt-2">
                  View Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Package className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.lowStockItems}</div>
              <p className="text-sm text-red-700">Items running low on inventory</p>
              <Link href="/admin/inventory">
                <Button variant="outline" size="sm" className="mt-2">
                  Manage Inventory
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Link href="/admin/orders">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.customer.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <Badge variant={order.status === "Pending" ? "outline" : "default"}>{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling items</CardDescription>
                  </div>
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{product.reviewCount || 0} reviews</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Link href="/admin/products/new">
                    <Button className="w-full h-20 flex flex-col gap-2">
                      <Plus className="h-6 w-6" />
                      Add Product
                    </Button>
                  </Link>
                  <Link href="/admin/orders">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <ShoppingBag className="h-6 w-6" />
                      View Orders
                    </Button>
                  </Link>
                  <Link href="/admin/customers">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Customers
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {product.category.name} • ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this product?")) {
                              setNotification(`Product "${product.name}" deleted successfully!`)
                              setTimeout(() => setNotification(null), 3000)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/admin/products">
                    <Button variant="outline" className="w-full">
                      View All Products ({products.length})
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <Link href="/admin/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 8).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{order._id}</h3>
                        <p className="text-sm text-gray-500">
                          {order.customer.name} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <Badge variant={order.status === "Pending" ? "outline" : "default"}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Revenue and order trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-medium">${(stats.totalRevenue * 0.3).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Month</span>
                      <span className="font-medium">${(stats.totalRevenue * 0.25).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-medium">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</span>
                    </div>
                    <div className="pt-4">
                      <Link href="/admin/analytics">
                        <Button className="w-full">View Detailed Analytics</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                  <CardDescription>User engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>New Customers</span>
                      <span className="font-medium">+{Math.floor(stats.totalUsers * 0.15)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Returning Customers</span>
                      <span className="font-medium">{Math.floor(stats.totalUsers * 0.65)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Retention</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="pt-4">
                      <Link href="/admin/customers">
                        <Button variant="outline" className="w-full">
                          Manage Customers
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
