import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  Tractor, 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  AlertCircle,
  HandCoins,
  Eye
} from "lucide-react"

const FarmerDashboard = () => {
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Early stage startup - growing!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹85,000</div>
            <p className="text-xs text-muted-foreground">
              First transactions on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers Connected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Growing network steadily
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
                { crop: "Rice", quantity: "300 kg", price: "₹25/kg", status: "Pledged" },
                { crop: "Maize", quantity: "200 kg", price: "₹18/kg", status: "Sold" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} at {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "Active" ? "default" : 
                                  item.status === "Pledged" ? "secondary" : "outline"}>
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("View crop details")}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => handleAction("View all crops")}>
              View All Listings
            </Button>
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
                    <Button size="sm" variant="outline" className="mt-1" onClick={() => handleAction("Apply suggested price")}>
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Demands - Pledging Feature */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <HandCoins className="h-5 w-5" />
            Available Group Demands
          </CardTitle>
          <CardDescription>Join group orders for better pricing and guaranteed sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { crop: "Premium Wheat", quantity: "50 tons", target: "100 tons", price: "₹22/kg", deadline: "5 days left", pledged: "50%" },
              { crop: "Organic Rice", quantity: "30 tons", target: "75 tons", price: "₹28/kg", deadline: "12 days left", pledged: "40%" },
              { crop: "Quality Maize", quantity: "25 tons", target: "60 tons", price: "₹20/kg", deadline: "8 days left", pledged: "42%" },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">Target: {item.target} • {item.deadline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{item.price}</p>
                    <p className="text-xs text-muted-foreground">{item.pledged} pledged</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-green-500`} style={{width: item.pledged}}></div>
                  </div>
                  <Button size="sm" onClick={() => handleAction(`Pledge to ${item.crop} group demand`)}>
                    Pledge Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => handleAction("View all group demands")}>
            View All Group Demands
          </Button>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5" />
            Market Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded border-l-4 border-l-orange-500 bg-orange-50">
              <p className="text-sm">🌾 Limited users: Connect with early buyers for exclusive deals</p>
              <Button size="sm" variant="outline" onClick={() => handleAction("View early buyer connections")}>
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded border-l-4 border-l-blue-500 bg-blue-50">
              <p className="text-sm">🚚 Beta logistics partners available - special rates for early adopters</p>
              <Button size="sm" variant="outline" onClick={() => handleAction("Connect with logistics partners")}>
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded border-l-4 border-l-green-500 bg-green-50">
              <p className="text-sm">💰 Join our pilot program for guaranteed pricing</p>
              <Button size="sm" variant="outline" onClick={() => handleAction("Join pilot program")}>
                Join
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex-1" onClick={() => handleAction("List New Crop")}>
          List New Crop
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("View All Demands")}>
          View All Demands
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("Update Profile")}>
          Update Profile
        </Button>
      </div>
    </div>
  )
}

export default FarmerDashboard