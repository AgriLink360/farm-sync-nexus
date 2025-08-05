import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import NetworkMap from "@/components/NetworkMap"
import AIChatbot from "@/components/AIChatbot"
import WeatherForecast from "@/components/WeatherForecast"
import FarmerProfileSetup from "@/components/FarmerProfileSetup"
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
  Eye,
  CheckCircle
} from "lucide-react"

const FarmerDashboard = () => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFarmerProfile()
  }, [user])

  const checkFarmerProfile = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      if (data && !error) {
        setHasCompletedProfile(true)
      }
    } catch (error) {
      console.log('No farmer profile found')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${action} feature is being developed. You'll be notified when it's ready!`,
    })
  }

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false)
    setHasCompletedProfile(true)
    toast({
      title: "Profile Setup Complete! 🌾",
      description: "Your farmer profile has been successfully created.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your agricultural portal</p>
        </div>
        <Badge variant="outline" className="bg-green-50 border-green-200">
          <Star className="h-3 w-3 mr-1" />
          New Farmer
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading profile status...</p>
            </div>
          ) : hasCompletedProfile ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 font-medium mb-2">Agri-ID Profile Completed! 🌾</p>
              <p className="text-muted-foreground mb-4">Your farmer profile is verified and active</p>
              <Button variant="outline" onClick={() => setShowProfileSetup(true)}>
                View/Edit Profile
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Complete your profile to build your Agri-ID</p>
              <Button onClick={() => setShowProfileSetup(true)}>
                Complete Profile Setup
              </Button>
            </div>
          )}
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Ready to list your first crop
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0</div>
            <p className="text-xs text-muted-foreground">
              Start earning by listing crops
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyers Connected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Connect with verified buyers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Price data after first listing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Network Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Smart Network Connections
          </CardTitle>
          <CardDescription>
            AI-powered visualization of buyer connections and logistics routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkMap />
        </CardContent>
      </Card>

      {/* Weather Forecast & Crop Predictions */}
      <WeatherForecast />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Crop Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Crop Listings</CardTitle>
            <CardDescription>Your latest produce listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Crop Listings Yet</h3>
              <p className="text-muted-foreground mb-4">Start by listing your first crop to connect with buyers</p>
              <Button onClick={() => handleAction("List New Crop")}>
                List Your First Crop
              </Button>
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
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Price Suggestions</h3>
              <p className="text-muted-foreground mb-4">Get intelligent pricing recommendations after listing your crops</p>
              <Button variant="outline" onClick={() => handleAction("Learn about AI pricing")}>
                Learn More
              </Button>
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

      {/* AI Chatbot */}
      <AIChatbot userType="farmer" />

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <FarmerProfileSetup onComplete={handleProfileSetupComplete} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FarmerDashboard
