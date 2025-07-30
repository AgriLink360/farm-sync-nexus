import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Tractor, 
  Building2, 
  Truck, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  LogIn,
  UserPlus,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const features = [
    {
      icon: Shield,
      title: "Trust-First Ecosystem",
      description: "Verified profiles, smart contracts, and transparent ratings"
    },
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Smart algorithms connect the right buyers with farmers"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Pricing",
      description: "Dynamic pricing based on market data and demand"
    },
    {
      icon: Users,
      title: "Direct Trade",
      description: "No middlemen - farmers connect directly with buyers"
    }
  ];

  const personas = [
    {
      title: "Farmer Portal",
      description: "List crops, get AI price suggestions, connect with verified buyers",
      icon: Tractor,
      link: "/farmer",
      color: "from-green-50 to-green-100",
      badge: "Grow & Sell"
    },
    {
      title: "Buyer Portal", 
      description: "Post demand, find suppliers, manage smart contracts",
      icon: Building2,
      link: "/buyer",
      color: "from-blue-50 to-blue-100",
      badge: "Source & Buy"
    },
    {
      title: "Logistics Portal",
      description: "Offer services, manage bookings, track fleet performance",
      icon: Truck,
      link: "/logistics", 
      color: "from-purple-50 to-purple-100",
      badge: "Transport & Deliver"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 pt-20 pb-16 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-8 flex justify-center">
              <Badge variant="outline" className="bg-white/80 border-primary/20 px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                Smart Agricultural Commerce Network
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="text-primary">AgriLink360</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-4xl mx-auto">
              The first-of-its-kind global smart marketplace that transforms agricultural trade with 
              <span className="font-semibold text-primary"> trust, intelligence, and autonomy</span> at its core.
            </p>

            <div className="mt-8 text-sm text-muted-foreground mb-8">
              <p className="font-medium">"Where Crops Meet Code" • "AgriCommerce Reimagined" • "Trust, Trade, and Tech for Farmers"</p>
            </div>

            {/* Authentication Section */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-4">
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  Welcome back, {profile?.full_name || user.email}!
                </p>
                {profile?.portal_type && (
                  <Link to={`/${profile.portal_type}`}>
                    <Button size="lg" className="text-lg px-8 py-4">
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgriLink360?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Persona Selection - Show only for non-authenticated users */}
      {!user && (
        <div className="py-16 px-6 sm:px-12 lg:px-16 bg-gray-50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Portal</h2>
              <p className="text-lg text-muted-foreground">
                Select your role to access specialized features designed for your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {personas.map((persona, index) => (
                <Card key={index} className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${persona.color} hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <persona.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{persona.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{persona.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {persona.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/auth">
                      <Button className="w-full" size="lg">
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="py-16 px-6 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-12">Platform Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Verified Farmers", value: "10,000+", icon: CheckCircle },
              { label: "Active Buyers", value: "500+", icon: Building2 },
              { label: "Successful Trades", value: "₹50Cr+", icon: TrendingUp },
              { label: "Logistics Partners", value: "200+", icon: Truck }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl text-center">
          <h3 className="text-2xl font-bold mb-4">AgriLink360</h3>
          <p className="text-gray-400 mb-6">
            Transforming agricultural commerce through technology, trust, and transparency
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>🌱 Sustainable Agriculture</span>
            <span>🔒 Blockchain Security</span>
            <span>🤖 AI-Powered</span>
            <span>🌍 Global Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
