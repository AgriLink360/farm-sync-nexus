import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  ShoppingCart, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

const BuyerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Aditya Birla Group</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 border-blue-200">
          <Building2 className="h-3 w-3 mr-1" />
          Verified Company
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
              <p className="font-medium">10,000+ Tons</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <p className="font-medium text-blue-600">4.9/5.0</p>
            </div>
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 urgent requirements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2.1L</div>
            <p className="text-xs text-muted-foreground">
              Vs. traditional sourcing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier Network</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 verified this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Active agreements
            </p>
          </CardContent>
        </Card>
      </div>

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
                { product: "Premium Wheat", quantity: "2,000 kg", price: "₹22/kg", responses: 15, status: "Active" },
                { product: "Basmati Rice", quantity: "1,500 kg", price: "₹45/kg", responses: 8, status: "Urgent" },
                { product: "Organic Maize", quantity: "800 kg", price: "₹25/kg", responses: 12, status: "Closing Soon" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} at max {item.price}</p>
                    <p className="text-xs text-muted-foreground">{item.responses} farmer responses</p>
                  </div>
                  <Badge variant={item.status === "Active" ? "default" : 
                                item.status === "Urgent" ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
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
                { farmer: "Rajesh Kumar", location: "Haryana", match: "98%", product: "Wheat", trust: "4.8" },
                { farmer: "Priya Sharma", location: "Punjab", match: "95%", product: "Rice", trust: "4.9" },
                { farmer: "Suresh Patel", location: "Gujarat", match: "92%", product: "Maize", trust: "4.7" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{item.farmer}</p>
                    <p className="text-sm text-muted-foreground">{item.location} • {item.product}</p>
                    <p className="text-xs text-green-600">Trust Score: {item.trust}/5.0</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="mb-1">{item.match} Match</Badge>
                    <Button size="sm" variant="outline" className="block">View Profile</Button>
                  </div>
                </div>
              ))}
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
              { title: "Pending Approval", count: 3, icon: Clock, color: "text-orange-600" },
              { title: "Active Contracts", count: 18, icon: CheckCircle, color: "text-green-600" },
              { title: "Need Attention", count: 2, icon: AlertTriangle, color: "text-red-600" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg border">
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

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex-1">Post New Demand</Button>
        <Button variant="outline" className="flex-1">Review Contracts</Button>
        <Button variant="outline" className="flex-1">Find Suppliers</Button>
      </div>
    </div>
  )
}

export default BuyerDashboard