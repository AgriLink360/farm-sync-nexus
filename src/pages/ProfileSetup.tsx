import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import FarmerProfileSetup from '@/components/FarmerProfileSetup';
import BuyerProfileSetup from '@/components/BuyerProfileSetup';
import LogisticsProfileSetup from '@/components/LogisticsProfileSetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Building2, 
  Truck, 
  MapPin, 
  Phone, 
  Mail,
  FileText,
  Loader2
} from 'lucide-react';

const ProfileSetup = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    portal_type: '',
    phone: '',
    location: '',
    bio: '',
    // Portal-specific fields
    farm_size: '',
    crops_grown: '',
    company_name: '',
    industry: '',
    annual_volume: '',
    fleet_size: '',
    service_area: '',
    vehicle_types: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.portal_type) {
      toast({
        title: "Portal Type Required",
        description: "Please select your portal type to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update the profile with the form data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          portal_type: formData.portal_type as 'farmer' | 'buyer' | 'logistics',
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          // Store portal-specific data as JSON
          metadata: {
            ...(formData.portal_type === 'farmer' && {
              farm_size: formData.farm_size,
              crops_grown: formData.crops_grown
            }),
            ...(formData.portal_type === 'buyer' && {
              company_name: formData.company_name,
              industry: formData.industry,
              annual_volume: formData.annual_volume
            }),
            ...(formData.portal_type === 'logistics' && {
              fleet_size: formData.fleet_size,
              service_area: formData.service_area,
              vehicle_types: formData.vehicle_types
            })
          }
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile Setup Complete!",
        description: "Welcome to AgriLink360. Let's show you around with a quick tutorial.",
      });

      // Show the tutorial
      setShowTutorial(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to set up profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    // Navigate to the appropriate dashboard
    navigate(`/${formData.portal_type}`);
  };

  const renderPortalSpecificFields = () => {
    switch (formData.portal_type) {
      case 'farmer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="farm_size">Farm Size (acres)</Label>
              <Input
                id="farm_size"
                placeholder="e.g., 25"
                value={formData.farm_size}
                onChange={(e) => handleInputChange('farm_size', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crops_grown">Primary Crops</Label>
              <Input
                id="crops_grown"
                placeholder="e.g., Wheat, Rice, Maize"
                value={formData.crops_grown}
                onChange={(e) => handleInputChange('crops_grown', e.target.value)}
              />
            </div>
          </>
        );
      case 'buyer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="e.g., Fresh Foods Co."
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food-processing">Food Processing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual_volume">Annual Volume (tons)</Label>
              <Input
                id="annual_volume"
                placeholder="e.g., 500"
                value={formData.annual_volume}
                onChange={(e) => handleInputChange('annual_volume', e.target.value)}
              />
            </div>
          </>
        );
      case 'logistics':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="fleet_size">Fleet Size</Label>
              <Input
                id="fleet_size"
                placeholder="e.g., 8 vehicles"
                value={formData.fleet_size}
                onChange={(e) => handleInputChange('fleet_size', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_area">Service Area</Label>
              <Input
                id="service_area"
                placeholder="e.g., North India"
                value={formData.service_area}
                onChange={(e) => handleInputChange('service_area', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_types">Vehicle Types</Label>
              <Input
                id="vehicle_types"
                placeholder="e.g., Trucks, Tempo, Refrigerated"
                value={formData.vehicle_types}
                onChange={(e) => handleInputChange('vehicle_types', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getPortalIcon = () => {
    switch (formData.portal_type) {
      case 'farmer': return <User className="h-8 w-8 text-green-600" />;
      case 'buyer': return <Building2 className="h-8 w-8 text-blue-600" />;
      case 'logistics': return <Truck className="h-8 w-8 text-purple-600" />;
      default: return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  // If profile is already complete, redirect to dashboard
  if (profile?.portal_type) {
    navigate(`/${profile.portal_type}`);
    return null;
  }

  // If specific portal type is selected, show the detailed profile setup
  if (formData.portal_type === 'farmer') {
    return <FarmerProfileSetup />;
  }
  
  if (formData.portal_type === 'buyer') {
    return <BuyerProfileSetup />;
  }
  
  if (formData.portal_type === 'logistics') {
    return <LogisticsProfileSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">A</span>
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome to AgriLink360</CardTitle>
          <CardDescription className="text-lg">
            Let's set up your profile to get you connected to the agricultural network
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Portal Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">What type of user are you?</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'farmer', label: 'Farmer', icon: User, color: 'green' },
                  { type: 'buyer', label: 'Buyer', icon: Building2, color: 'blue' },
                  { type: 'logistics', label: 'Logistics', icon: Truck, color: 'purple' }
                ].map(({ type, label, icon: Icon, color }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('portal_type', type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.portal_type === type
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      formData.portal_type === type ? `text-${color}-600` : 'text-gray-400'
                    }`} />
                    <p className="font-medium">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Haryana, India"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            {/* Portal-specific fields */}
            {formData.portal_type && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getPortalIcon()}
                  <h3 className="text-lg font-semibold capitalize">
                    {formData.portal_type} Specific Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderPortalSpecificFields()}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Description (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself and your business..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.portal_type || !formData.full_name}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up profile...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Onboarding Tutorial */}
      {showTutorial && (
        <OnboardingTutorial
          isOpen={showTutorial}
          onClose={handleTutorialComplete}
          portalType={formData.portal_type as 'farmer' | 'buyer' | 'logistics'}
        />
      )}
    </div>
  );
};

export default ProfileSetup;