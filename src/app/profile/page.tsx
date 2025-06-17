"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { getReviewsByUserId } from "@/lib/reviews"
import { getOrdersByUserId } from "@/lib/orders"
import type { Review, Order } from "@/lib/types"
import StarRating from "@/components/products/star-rating"
import OrderStatusBadge from "@/components/orders/order-status-badge"
import Link from "next/link"
import { User, MapPin, Bell, Shield, Trash2, Eye, EyeOff, CheckCircle, Edit } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Account settings state
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false,
    },
  ])

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsNotifications: false,
    emailMarketing: false,
    pushNotifications: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    dataSharing: false,
    analytics: true,
    cookiePreferences: true,
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const userReviews = getReviewsByUserId(user.id)
      setReviews(userReviews)

      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)

      setPersonalInfo({
        name: user.name,
        email: user.email,
        phone: "",
        dateOfBirth: "",
        gender: "",
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handlePersonalInfoSave = () => {
    // In a real app, this would make an API call
    setSaveStatus("Personal information updated successfully!")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveStatus("Passwords don't match!")
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setSaveStatus("Password must be at least 8 characters long!")
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    // In a real app, this would make an API call
    setSaveStatus("Password changed successfully!")
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleNotificationSave = () => {
    // In a real app, this would make an API call
    setSaveStatus("Notification preferences updated!")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handlePrivacySave = () => {
    // In a real app, this would make an API call
    setSaveStatus("Privacy settings updated!")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleAddressDelete = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
    setSaveStatus("Address deleted successfully!")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
    setSaveStatus("Default address updated!")
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would make an API call
      setSaveStatus("Account deletion initiated. You will receive a confirmation email.")
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src={user?.avatar || "/placeholder.svg?height=80&width=80"}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
              <Button size="sm" className="absolute bottom-0 right-0 h-6 w-6 rounded-full p-0" variant="secondary">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt || "").getFullYear()}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {saveStatus && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{saveStatus}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="rounded-lg border">
              <div className="border-b p-4">
                <h2 className="text-lg font-medium">Your Orders</h2>
              </div>

              {orders.length > 0 ? (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="mt-1 text-sm">
                            {order.items.length} {order.items.length === 1 ? "item" : "items"} • $
                            {order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/track-order?orderId=${order.id}&email=${user?.email}`}>
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          </Link>
                          <Link href={`/orders/${order.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                  <Link href="/products">
                    <Button className="mt-4">Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="rounded-lg border">
              <div className="border-b p-4">
                <h2 className="text-lg font-medium">Your Reviews</h2>
              </div>

              {reviews.length > 0 ? (
                <div className="divide-y">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Link href={`/products/${review.productId}`} className="font-medium hover:underline">
                          Product #{review.productId}
                        </Link>
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">You haven't written any reviews yet.</p>
                  <Link href="/products">
                    <Button className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handlePersonalInfoSave}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Password & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Password & Security
                </CardTitle>
                <CardDescription>Change your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    >
                      {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                </div>
                <Button onClick={handlePasswordChange}>Change Password</Button>
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
                <CardDescription>Manage your shipping and billing addresses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{address.type}</h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                          Set Default
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAddressDelete(address.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline">Add New Address</Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive updates and notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about your order status changes</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions">Promotions & Offers</Label>
                    <p className="text-sm text-gray-500">Receive special offers and discounts</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-gray-500">Stay updated with our latest news and products</p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>
                <Button onClick={handleNotificationSave}>Save Preferences</Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSharing">Data Sharing</Label>
                    <p className="text-sm text-gray-500">Allow sharing data with partners for better experience</p>
                  </div>
                  <Switch
                    id="dataSharing"
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-gray-500">Help us improve by sharing usage analytics</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, analytics: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cookiePreferences">Cookie Preferences</Label>
                    <p className="text-sm text-gray-500">Allow cookies for personalized experience</p>
                  </div>
                  <Switch
                    id="cookiePreferences"
                    checked={privacy.cookiePreferences}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, cookiePreferences: checked })}
                  />
                </div>
                <Button onClick={handlePrivacySave}>Save Privacy Settings</Button>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Download your data or delete your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline">Download My Data</Button>
                  <Button variant="outline">Export Order History</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount} className="w-full md:w-auto">
                  Delete Account
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
