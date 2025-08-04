import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sprout, 
  Building2, 
  Truck, 
  BarChart3, 
  Users, 
  MapPin,
  Cloud,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  portalType: 'farmer' | 'buyer' | 'logistics';
}

const OnboardingTutorial = ({ isOpen, onClose, portalType }: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = {
    farmer: [
      {
        title: "Welcome to Farmer Portal",
        icon: <Sprout className="h-8 w-8 text-green-600" />,
        description: "Your gateway to smart agricultural commerce",
        features: [
          "List your crops and produce for sale",
          "Connect with verified buyers nationwide",
          "Track market prices and trends",
          "Manage your farm operations digitally"
        ]
      },
      {
        title: "Dashboard Overview",
        icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
        description: "Monitor your farm's performance at a glance",
        features: [
          "View total revenue and active listings",
          "Track completed transactions",
          "Monitor crop performance metrics",
          "Access financial summaries"
        ]
      },
      {
        title: "Weather & Crop Insights",
        icon: <Cloud className="h-8 w-8 text-orange-600" />,
        description: "AI-powered predictions for better farming decisions",
        features: [
          "Real-time weather forecasts",
          "Crop production predictions",
          "Environmental analysis",
          "Optimized planting recommendations"
        ]
      },
      {
        title: "Network Connections",
        icon: <MapPin className="h-8 w-8 text-purple-600" />,
        description: "Visualize your agricultural network",
        features: [
          "Interactive map of partners",
          "Find nearby buyers and logistics",
          "Track delivery routes",
          "Expand your network reach"
        ]
      }
    ],
    buyer: [
      {
        title: "Welcome to Buyer Portal",
        icon: <Building2 className="h-8 w-8 text-blue-600" />,
        description: "Source quality produce directly from farmers",
        features: [
          "Browse verified crop listings",
          "Post demand requirements",
          "Connect with reliable suppliers",
          "Manage procurement efficiently"
        ]
      },
      {
        title: "Dashboard Overview",
        icon: <BarChart3 className="h-8 w-8 text-green-600" />,
        description: "Track your procurement activities",
        features: [
          "Monitor total spending and orders",
          "View active demand postings",
          "Track fulfillment rates",
          "Access supplier performance data"
        ]
      },
      {
        title: "Market Intelligence",
        icon: <Cloud className="h-8 w-8 text-orange-600" />,
        description: "Make informed purchasing decisions",
        features: [
          "Real-time market prices",
          "Quality predictions",
          "Supply availability forecasts",
          "Seasonal trend analysis"
        ]
      },
      {
        title: "Supplier Network",
        icon: <Users className="h-8 w-8 text-purple-600" />,
        description: "Build relationships with trusted farmers",
        features: [
          "Discover new suppliers",
          "Rate and review farmers",
          "Track supplier reliability",
          "Negotiate better terms"
        ]
      }
    ],
    logistics: [
      {
        title: "Welcome to Logistics Portal",
        icon: <Truck className="h-8 w-8 text-orange-600" />,
        description: "Streamline agricultural supply chain operations",
        features: [
          "Manage transportation bookings",
          "Offer storage solutions",
          "Connect farmers with buyers",
          "Optimize delivery routes"
        ]
      },
      {
        title: "Dashboard Overview",
        icon: <BarChart3 className="h-8 w-8 text-green-600" />,
        description: "Monitor your logistics operations",
        features: [
          "Track total revenue and bookings",
          "View active transport orders",
          "Monitor vehicle utilization",
          "Access performance metrics"
        ]
      },
      {
        title: "Route Optimization",
        icon: <MapPin className="h-8 w-8 text-blue-600" />,
        description: "Efficient delivery planning",
        features: [
          "Smart route suggestions",
          "Real-time tracking",
          "Fuel cost optimization",
          "Delivery time predictions"
        ]
      },
      {
        title: "Service Management",
        icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
        description: "Comprehensive service offerings",
        features: [
          "Cold storage solutions",
          "Packaging services",
          "Insurance options",
          "24/7 customer support"
        ]
      }
    ]
  };

  const steps = tutorialSteps[portalType];
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Getting Started with AgriLink360</span>
            <Badge variant="outline">
              {currentStep + 1} of {steps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {steps[currentStep].icon}
            </div>
            <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-base">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Key Features
              </h4>
              <div className="grid gap-3">
                {steps[currentStep].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {isLastStep ? (
            <Button onClick={handleFinish} className="flex items-center gap-2">
              Get Started
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;