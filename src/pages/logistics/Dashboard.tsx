import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import NetworkMap from "@/components/NetworkMap"
import AIChatbot from "@/components/AIChatbot"
import { 
  Truck, 
  Package, 
  MapPin, 
  Star, 
  Calendar, 
  Clock,
  TrendingUp,
  CheckCircle,
  Settings,
  Eye,
  UserPlus
} from "lucide-react"

const LogisticsDashboard = () => {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${action} feature is being developed. You'll be notified when it's ready!`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your logistics portal</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 border-purple-200">
          <Truck className="h-3 w-3 mr-1" />
          New Partner
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
              <p className="font-medium">8 Vehicles</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Rating</p>
              <p className="font-medium text-purple-600 flex items-center gap-1">
                <Star className="h-3 w-3" />
                4.7/5.0
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
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45K</div>
            <p className="text-xs text-muted-foreground">
              Early stage operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              100% on-time delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              Based on 8 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Route Optimization Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Route Network & Optimization
          </CardTitle>
          <CardDescription>
            AI-optimized delivery routes connecting farmers and buyers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkMap />
        </CardContent>
      </Card>

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
                { id: "TRK001", route: "Haryana → Delhi", cargo: "500kg Wheat", time: "4 hours", status: "In Transit" },
                { id: "TRK002", route: "Punjab → Local", cargo: "300kg Rice", time: "Tomorrow", status: "Scheduled" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.id}</p>
                    <p className="text-sm text-muted-foreground">{item.route}</p>
                    <p className="text-xs text-muted-foreground">{item.cargo} • {item.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "In Transit" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("Track shipment")}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">Limited bookings in beta phase</p>
                <Button variant="outline" className="mt-2" onClick={() => handleAction("Manage all bookings")}>
                  View All Bookings
                </Button>
              </div>
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
                { service: "Standard Transport", price: "₹10/km", vehicles: "3 available", rating: "4.7" },
                { service: "Express Delivery", price: "₹18/km", vehicles: "2 available", rating: "4.8" },
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
                    <Button size="sm" variant="outline" onClick={() => handleAction("Edit service rates")}>
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Expand your service offerings</p>
                <Button variant="outline" className="mt-2" onClick={() => handleAction("Add new service")}>
                  Add Service
                </Button>
              </div>
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
              { status: "Active", count: 2, color: "bg-green-100 text-green-800" },
              { status: "Available", count: 5, color: "bg-blue-100 text-blue-800" },
              { status: "Maintenance", count: 1, color: "bg-orange-100 text-orange-800" },
              { status: "Loading", count: 0, color: "bg-purple-100 text-purple-800" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                   onClick={() => handleAction(`View ${item.status.toLowerCase()} vehicles`)}>
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

      {/* Service Node Onboarding */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <UserPlus className="h-5 w-5" />
            Service Node Onboarding
          </CardTitle>
          <CardDescription>Complete your setup to unlock more features and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: "Vehicle Registration", status: "Completed", progress: 100 },
              { step: "Service Area Mapping", status: "Completed", progress: 100 },
              { step: "Insurance Verification", status: "In Progress", progress: 75 },
              { step: "Driver KYC Process", status: "Pending", progress: 45 },
              { step: "Rate Card Setup", status: "Not Started", progress: 0 },
            ].map((item, index) => (
              <div key={index} className="p-3 rounded-lg border bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{item.step}</p>
                  <Badge variant={
                    item.status === "Completed" ? "default" :
                    item.status === "In Progress" ? "secondary" : "outline"
                  }>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{width: `${item.progress}%`}}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.progress}%</span>
                  <Button size="sm" variant="outline" onClick={() => handleAction(`Complete ${item.step}`)}>
                    {item.status === "Completed" ? "View" : "Continue"}
                  </Button>
                </div>
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
              { customer: "Rajesh Kumar", rating: 5, comment: "Great first experience! Professional service.", date: "3 days ago" },
              { customer: "Fresh Foods Co.", rating: 5, comment: "Reliable partner for our pilot phase.", date: "1 week ago" },
              { customer: "Local Farmer Group", rating: 4, comment: "Good service, looking forward to more bookings.", date: "2 weeks ago" },
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
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">Build your reputation with more completed deliveries</p>
              <Button variant="outline" className="mt-2" onClick={() => handleAction("View rating analytics")}>
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex-1" onClick={() => handleAction("Update Service Rates")}>
          Update Service Rates
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("View All Bookings")}>
          View All Bookings
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("Fleet Management")}>
          Fleet Management
        </Button>
      </div>

      {/* AI Chatbot */}
      <AIChatbot userType="logistics" />
    </div>
  )
}

export default LogisticsDashboard
