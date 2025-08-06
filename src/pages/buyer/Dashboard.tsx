import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import NetworkMap from "@/components/NetworkMap"
import AIChatbot from "@/components/AIChatbot"
import BuyerProfileSetup from "@/components/BuyerProfileSetup"
import { useState } from "react"
import { 
  Building2, 
  ShoppingCart, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  MapPin
} from "lucide-react"

const BuyerDashboard = () => {
  const { toast } = useToast()
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  const handleAction = (action: string) => {
    if (action === "Complete Profile Setup") {
      setShowProfileSetup(true)
      return
    }
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
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your procurement portal</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 border-blue-200">
          <Building2 className="h-3 w-3 mr-1" />
          New Buyer
        </Badge>
      </div>

      {/* Company Profile Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">Food Processing</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Volume</p>
              <p className="font-medium">500+ Tons</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <p className="font-medium text-blue-600">4.9/5.0</p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => handleAction("Complete Profile Setup")}>
              Complete Profile Setup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Demands</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Early stage testing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹25K</div>
            <p className="text-xs text-muted-foreground">
              Initial pilot savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Growing partner network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Pilot phase contracts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Supply Chain Network
          </CardTitle>
          <CardDescription>
            Visualize your supplier network and logistics connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkMap />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Demand Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Demand Posts</CardTitle>
            <CardDescription>Your current procurement requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { product: "Premium Wheat", quantity: "500 kg", price: "₹22/kg", responses: 3, status: "Active" },
                { product: "Quality Rice", quantity: "300 kg", price: "₹28/kg", responses: 2, status: "New" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} at max {item.price}</p>
                    <p className="text-xs text-muted-foreground">{item.responses} farmer responses</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleAction("View demand details")}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Limited demand posts in beta phase</p>
                <Button variant="outline" className="mt-2" onClick={() => handleAction("Post new demand")}>
                  Post Your First Demand
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matched Farmer Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Matched Farmer Leads</CardTitle>
            <CardDescription>AI-powered supplier recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { farmer: "Rajesh Kumar", location: "Haryana", match: "95%", product: "Wheat", trust: "4.8" },
                { farmer: "Priya Sharma", location: "Punjab", match: "88%", product: "Rice", trust: "4.6" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.farmer}</p>
                    <p className="text-sm text-muted-foreground">{item.location} • {item.product}</p>
                    <p className="text-xs text-green-600">Trust Score: {item.trust}/5.0</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="mb-1">{item.match} Match</Badge>
                    <Button size="sm" variant="outline" className="block" onClick={() => handleAction("View farmer profile")}>
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">More farmers joining daily!</p>
                <Button variant="outline" className="mt-2" onClick={() => handleAction("Find more suppliers")}>
                  Discover Suppliers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Status</CardTitle>
          <CardDescription>Real-time contract execution tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Draft Contracts", count: 1, icon: Clock, color: "text-orange-600" },
              { title: "Active Contracts", count: 2, icon: CheckCircle, color: "text-green-600" },
              { title: "Need Review", count: 0, icon: AlertTriangle, color: "text-red-600" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50" 
                   onClick={() => handleAction(`View ${item.title.toLowerCase()}`)}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Contract Review Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Smart Contract Review
          </CardTitle>
          <CardDescription>AI-powered contract analysis and risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                contract: "Wheat Supply Contract - Rajesh Kumar", 
                status: "Pending Review", 
                risk: "Low", 
                terms: "500kg @ ₹22/kg, 7-day delivery",
                aiScore: "96%"
              },
              { 
                contract: "Rice Supply Agreement - Priya Sharma", 
                status: "AI Approved", 
                risk: "Very Low", 
                terms: "300kg @ ₹28/kg, 5-day delivery",
                aiScore: "98%"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{item.contract}</p>
                    <p className="text-sm text-muted-foreground">{item.terms}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === "AI Approved" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">AI Score: {item.aiScore}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.risk === "Low" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
                    Risk: {item.risk}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAction("Review contract details")}>
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction("Chat with farmer")}>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex-1" onClick={() => handleAction("Post New Demand")}>
          Post New Demand
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("Review Contracts")}>
          Review Contracts
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleAction("Find Suppliers")}>
          Find Suppliers
        </Button>
      </div>

      {/* AI Chatbot */}
      <AIChatbot userType="buyer" />

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <BuyerProfileSetup mode="edit" onClose={() => setShowProfileSetup(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BuyerDashboard
