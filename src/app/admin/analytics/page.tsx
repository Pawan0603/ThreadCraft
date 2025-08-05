"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Download,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import { getAllOrders } from "@/lib/orders"
import { getAllProducts } from "@/lib/products"
import { getAllUsers } from "@/lib/users"
import type { Order } from "@/lib/types"

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [timeRange, setTimeRange] = useState("30")
  const [analytics, setAnalytics] = useState({
    revenue: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    orders: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    customers: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    avgOrderValue: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    topProducts: [] as Array<{ name: string; sales: number; revenue: number }>,
    salesByCategory: [] as Array<{ category: string; sales: number; percentage: number }>,
    revenueByMonth: [] as Array<{ month: string; revenue: number }>,
    customerRetention: 68,
    conversionRate: 3.2,
  })

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

  const fetchData = async () => {
    if (!accessToken) {
      alert("accessToken is requird!");
      return;
    }
    const allOrders = await getAllOrders(accessToken)
    const allProducts = await getAllProducts()
    const allUsers = await getAllUsers(accessToken)

    setOrders(allOrders)

    // Calculate analytics based on time range
    const now = new Date()
    const daysBack = Number.parseInt(timeRange)
    const currentPeriodStart = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const previousPeriodStart = new Date(currentPeriodStart.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Current period orders
    const currentOrders = allOrders.filter((order) => new Date(order.createdAt) >= currentPeriodStart)

    // Previous period orders
    const previousOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= previousPeriodStart && orderDate < currentPeriodStart
    })

    // Calculate metrics
    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const currentOrderCount = currentOrders.length
    const previousOrderCount = previousOrders.length
    const orderGrowth =
      previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0

    const currentAvgOrderValue = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0
    const previousAvgOrderValue = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0
    const avgOrderValueGrowth =
      previousAvgOrderValue > 0 ? ((currentAvgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100 : 0

    // Top products analysis
    const productSales = new Map<string, { sales: number; revenue: number }>()
    currentOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productSales.get(item.name) || { sales: 0, revenue: 0 }
        productSales.set(item.name, {
          sales: current.sales + item.quantity,
          revenue: current.revenue + item.price * item.quantity,
        })
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Sales by category
    const categorySales = new Map<string, number>()
    allProducts.forEach((product) => {
      const productOrders = currentOrders.filter((order) => order.items.some((item) => item.productId === product._id))
      const sales = productOrders.reduce(
        (sum, order) =>
          sum +
          order.items
            .filter((item) => item.productId === product._id)
            .reduce((itemSum, item) => itemSum + item.quantity, 0),
        0,
      )
      categorySales.set(product.category.name, (categorySales.get(product.category.name) || 0) + sales)
    })

    const totalSales = Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0)
    const salesByCategory = Array.from(categorySales.entries())
      .map(([category, sales]) => ({
        category,
        sales,
        percentage: totalSales > 0 ? (sales / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.sales - a.sales)

    // Revenue by month (last 6 months)
    const revenueByMonth = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)

      revenueByMonth.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: monthRevenue,
      })
    }

    setAnalytics({
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        growth: revenueGrowth,
      },
      orders: {
        current: currentOrderCount,
        previous: previousOrderCount,
        growth: orderGrowth,
      },
      customers: {
        current: allUsers.length,
        previous: Math.floor(allUsers.length * 0.85), // Mock previous data
        growth: 15,
      },
      avgOrderValue: {
        current: currentAvgOrderValue,
        previous: previousAvgOrderValue,
        growth: avgOrderValueGrowth,
      },
      topProducts,
      salesByCategory,
      revenueByMonth,
      customerRetention: 68,
      conversionRate: 3.2,
    })
  };

  useEffect(() => {
    if(!accessToken) return;
    fetchData();
  }, [timeRange, accessToken]);

  const handleExportReport = () => {
    // Simulate export
    console.log("Exporting analytics report...")
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.current)}</div>
            <p
              className={`text-xs flex items-center ${analytics.revenue.growth >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {analytics.revenue.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(analytics.revenue.growth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders.current}</div>
            <p
              className={`text-xs flex items-center ${analytics.orders.growth >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {analytics.orders.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(analytics.orders.growth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.avgOrderValue.current)}</div>
            <p
              className={`text-xs flex items-center ${analytics.avgOrderValue.growth >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {analytics.avgOrderValue.growth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(analytics.avgOrderValue.growth)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenueByMonth.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.max(10, (month.revenue / Math.max(...analytics.revenueByMonth.map((m) => m.revenue))) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-20 text-right">{formatCurrency(month.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sales by Category
                </CardTitle>
                <CardDescription>Product category performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <span className="text-sm">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.max(5, category.percentage)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">{category.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Percentage of returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{analytics.customerRetention}%</div>
                <p className="text-sm text-gray-500 mt-2">Above industry average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Customers</CardTitle>
                <CardDescription>Registered user base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.customers.current}</div>
                <p
                  className={`text-sm mt-2 flex items-center ${analytics.customers.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {analytics.customers.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(analytics.customers.growth)} growth
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Visitors to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{analytics.conversionRate}%</div>
                <p className="text-sm text-gray-500 mt-2">Industry benchmark: 2.8%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best sellers by revenue in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>New Customers</span>
                    <span className="font-bold">{Math.floor(analytics.customers.current * 0.35)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Returning Customers</span>
                    <span className="font-bold">{Math.floor(analytics.customers.current * 0.65)}</span>
                  </div>
                  <div className="pt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>35% New</span>
                      <span>65% Returning</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Average value per customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {formatCurrency(analytics.revenue.current / analytics.customers.current)}
                </div>
                <p className="text-sm text-gray-500">Based on current period data</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg. Orders per Customer</span>
                    <span>{(analytics.orders.current / analytics.customers.current).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Order Value</span>
                    <span>{formatCurrency(analytics.avgOrderValue.current)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key metrics comparison over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-4">Revenue Growth</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">This Period</span>
                        <span className="font-medium">{formatCurrency(analytics.revenue.current)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Previous Period</span>
                        <span className="font-medium">{formatCurrency(analytics.revenue.previous)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Growth</span>
                        <span
                          className={`font-bold ${analytics.revenue.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(analytics.revenue.growth)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Order Volume</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">This Period</span>
                        <span className="font-medium">{analytics.orders.current}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Previous Period</span>
                        <span className="font-medium">{analytics.orders.previous}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Growth</span>
                        <span
                          className={`font-bold ${analytics.orders.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(analytics.orders.growth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <CardDescription>Revenue patterns throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Seasonal trend analysis will be available with more historical data</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
