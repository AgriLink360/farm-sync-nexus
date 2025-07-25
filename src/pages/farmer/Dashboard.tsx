import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Tractor, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  AlertCircle
} from "lucide-react"

const FarmerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Rajesh Kumar</p>
        </div>
        <Badge variant="outline" className="bg-green-50 border-green-200">
          <Star className="h-3 w-3 mr-1" />
          Verified Farmer
        </Badge>
      </div>

      {/* Agri-ID Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5" />
            Agri-ID Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Farm Location</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Haryana, India
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Farm Size</p>
              <p className="font-medium">25 Acres</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <p className="font-medium text-green-600">4.8/5.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last season
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,25,000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers Connected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹18/kg</div>
            <p className="text-xs text-muted-foreground">
              +₹2 above market
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Crop Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Crop Listings</CardTitle>
            <CardDescription>Your latest produce listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { crop: "Wheat", quantity: "500 kg", price: "₹20/kg", status: "Active" },
                { crop: "Rice", quantity: "750 kg", price: "₹25/kg", status: "Pledged" },
                { crop: "Maize", quantity: "300 kg", price: "₹18/kg", status: "Sold" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} at {item.price}</p>
                  </div>
                  <Badge variant={item.status === "Active" ? "default" : 
                                item.status === "Pledged" ? "secondary" : "outline"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Price Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>AI Price Suggestions</CardTitle>
            <CardDescription>Smart pricing based on market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { crop: "Wheat", current: "₹20/kg", suggested: "₹22/kg", trend: "up" },
                { crop: "Rice", current: "₹25/kg", suggested: "₹24/kg", trend: "down" },
                { crop: "Maize", current: "₹18/kg", suggested: "₹19/kg", trend: "up" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">Current: {item.current}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.suggested}
                    </p>
                    <p className="text-xs text-muted-foreground">AI Suggested</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            Market Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">🌾 High demand for wheat in nearby markets - consider increasing price by 10%</p>
            <p className="text-sm">🚚 New logistics partner available for faster delivery in your area</p>
            <p className="text-sm">💰 Price surge expected for rice next week - good time to sell</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex-1">List New Crop</Button>
        <Button variant="outline" className="flex-1">View All Demands</Button>
        <Button variant="outline" className="flex-1">Update Profile</Button>
      </div>
    </div>
  )
}

export default FarmerDashboard