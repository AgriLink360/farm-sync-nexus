import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Package, 
  MapPin, 
  Star, 
  Calendar, 
  Clock,
  TrendingUp,
  CheckCircle
} from "lucide-react"

const LogisticsDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, FastTrack Logistics</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 border-purple-200">
          <Truck className="h-3 w-3 mr-1" />
          Service Partner
        </Badge>
      </div>

      {/* Service Profile Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Service Node Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Service Area</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                North India
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fleet Size</p>
              <p className="font-medium">45 Vehicles</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Rating</p>
              <p className="font-medium text-purple-600 flex items-center gap-1">
                <Star className="h-3 w-3" />
                4.9/5.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              6 scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3.2L</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              98.5% on-time delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground">
              Based on 156 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Service Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
            <CardDescription>Current transportation requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "TRK001", route: "Haryana → Delhi", cargo: "2T Wheat", time: "2 hours", status: "In Transit" },
                { id: "TRK002", route: "Punjab → Mumbai", cargo: "1.5T Rice", time: "6 hours", status: "Loading" },
                { id: "TRK003", route: "Gujarat → Pune", cargo: "800kg Maize", time: "Tomorrow", status: "Scheduled" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.id}</p>
                    <p className="text-sm text-muted-foreground">{item.route}</p>
                    <p className="text-xs text-muted-foreground">{item.cargo} • {item.time}</p>
                  </div>
                  <Badge variant={item.status === "In Transit" ? "default" : 
                                item.status === "Loading" ? "secondary" : "outline"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Service Offers</CardTitle>
            <CardDescription>Your available logistics services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Cold Chain Transport", price: "₹15/km", vehicles: "5 available", rating: "4.9" },
                { service: "Bulk Cargo", price: "₹8/km", vehicles: "12 available", rating: "4.8" },
                { service: "Express Delivery", price: "₹25/km", vehicles: "8 available", rating: "4.9" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.service}</p>
                    <p className="text-sm text-muted-foreground">{item.vehicles}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {item.rating} rating
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{item.price}</p>
                    <Button size="sm" variant="outline">Edit Rates</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Status</CardTitle>
          <CardDescription>Real-time vehicle tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: "Active", count: 28, color: "bg-green-100 text-green-800" },
              { status: "Available", count: 15, color: "bg-blue-100 text-blue-800" },
              { status: "Maintenance", count: 2, color: "bg-orange-100 text-orange-800" },
              { status: "Loading", count: 6, color: "bg-purple-100 text-purple-800" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg border">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color} mb-2`}>
                  {item.status}
                </div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-muted-foreground">Vehicles</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Reviews</CardTitle>
          <CardDescription>Latest feedback from farmers and buyers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { customer: "Rajesh Kumar", rating: 5, comment: "Excellent service! On-time delivery and careful handling.", date: "2 days ago" },
              { customer: "Aditya Birla Group", rating: 5, comment: "Professional and reliable. Will book again.", date: "1 week ago" },
              { customer: "Priya Sharma", rating: 4, comment: "Good service, minor delay but kept us informed.", date: "2 weeks ago" },
            ].map((item, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{item.customer}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{item.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex-1">Update Service Rates</Button>
        <Button variant="outline" className="flex-1">View All Bookings</Button>
        <Button variant="outline" className="flex-1">Fleet Management</Button>
      </div>
    </div>
  )
}

export default LogisticsDashboard