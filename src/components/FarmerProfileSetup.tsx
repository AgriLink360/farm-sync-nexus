import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Sprout, 
  MapPin, 
  Award,
  Tractor,
  Droplets,
  Mountain,
  Package,
  TrendingUp,
  Loader2,
  Sparkles
} from 'lucide-react';

interface FarmerProfileSetupProps {
  onComplete?: () => void;
}

const FarmerProfileSetup = ({ onComplete }: FarmerProfileSetupProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    full_name: '',
    phone: '',
    bio: '',
    
    // Location
    region: '',
    district: '',
    state: '',
    
    // Farm details
    experience_years: '',
    farm_size_acres: '',
    primary_crops: [] as string[],
    secondary_crops: [] as string[],
    farming_methods: [] as string[],
    irrigation_type: '',
    soil_type: '',
    
    // Equipment & Capacity
    equipment_owned: [] as string[],
    storage_capacity_tons: '',
    annual_production_tons: '',
    
    // Certifications & Market
    certifications: [] as string[],
    preferred_market_channels: [] as string[]
  });

  const cropOptions = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Groundnut', 
    'Mustard', 'Sunflower', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Tea', 'Coffee'
  ];

  const farmingMethodOptions = [
    'Organic Farming', 'Traditional Farming', 'Precision Agriculture', 'Hydroponic', 
    'Greenhouse Farming', 'Integrated Pest Management', 'Crop Rotation', 'Intercropping'
  ];

  const equipmentOptions = [
    'Tractor', 'Harvester', 'Plough', 'Seed Drill', 'Sprayer', 'Thresher', 
    'Cultivator', 'Irrigation System', 'Storage Facilities', 'Processing Equipment'
  ];

  const certificationOptions = [
    'Organic Certification', 'Fair Trade', 'Good Agricultural Practices (GAP)', 
    'GLOBALGAP', 'Rainforest Alliance', 'ISO 22000', 'HACCP'
  ];

  const marketChannelOptions = [
    'Direct to Consumer', 'Local Markets', 'Wholesalers', 'Retailers', 
    'Food Processing Companies', 'Export Markets', 'Online Platforms', 'Cooperatives'
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  useEffect(() => {
    loadExistingProfile();
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.log('Error loading farmer profile:', error);
        return;
      }

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          region: profile.region || '',
          district: profile.district || '',
          state: profile.state || '',
          experience_years: profile.experience_years?.toString() || '',
          farm_size_acres: profile.farm_size_acres?.toString() || '',
          primary_crops: profile.primary_crops || [],
          secondary_crops: profile.secondary_crops || [],
          farming_methods: profile.farming_methods || [],
          irrigation_type: profile.irrigation_type || '',
          soil_type: profile.soil_type || '',
          equipment_owned: profile.equipment_owned || [],
          storage_capacity_tons: profile.storage_capacity_tons?.toString() || '',
          annual_production_tons: profile.annual_production_tons?.toString() || '',
          certifications: profile.certifications || [],
          preferred_market_channels: profile.preferred_market_channels || []
        });
        setIsEditMode(true);
      }
    } catch (error) {
      console.log('No existing profile found or error loading profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.region) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name and region to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get or create the main profile first
      let { data: mainProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!mainProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user?.id,
            full_name: formData.full_name,
            phone: formData.phone,
            bio: formData.bio,
            location: formData.region,
            portal_type: 'farmer'
          })
          .select()
          .single();

        if (createError) throw createError;
        mainProfile = newProfile;
      } else {
        // Update existing main profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            bio: formData.bio,
            location: formData.region,
            portal_type: 'farmer'
          })
          .eq('id', mainProfile.id);

        if (updateError) throw updateError;
      }

      // Now handle the farmer-specific profile
      const farmerProfileData = {
        user_id: user?.id,
        profile_id: mainProfile.id,
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        region: formData.region,
        district: formData.district,
        state: formData.state,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        farm_size_acres: formData.farm_size_acres ? parseFloat(formData.farm_size_acres) : null,
        primary_crops: formData.primary_crops,
        secondary_crops: formData.secondary_crops,
        farming_methods: formData.farming_methods,
        irrigation_type: formData.irrigation_type,
        soil_type: formData.soil_type,
        equipment_owned: formData.equipment_owned,
        storage_capacity_tons: formData.storage_capacity_tons ? parseFloat(formData.storage_capacity_tons) : null,
        annual_production_tons: formData.annual_production_tons ? parseFloat(formData.annual_production_tons) : null,
        certifications: formData.certifications,
        preferred_market_channels: formData.preferred_market_channels
      };

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('farmer_profiles')
          .update(farmerProfileData)
          .eq('user_id', user?.id);

        if (updateError) throw updateError;

        toast({
          title: "Profile Updated! 🌾",
          description: "Your farmer profile has been successfully updated.",
        });
      } else {
        const { error: insertError } = await supabase
          .from('farmer_profiles')
          .insert(farmerProfileData);

        if (insertError) throw insertError;

        toast({
          title: "Welcome to AgriLink360! 🌾",
          description: "Your farmer profile has been successfully created.",
        });
      }

      // Call onComplete callback if provided (for modal usage)
      if (onComplete) {
        onComplete();
      } else {
        // Navigate only if not in modal mode
        navigate('/farmer/dashboard');
      }
    } catch (error) {
      console.error('Error creating farmer profile:', error);
      toast({
        title: "Error",
        description: "Failed to set up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                <Sprout className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8" />
              Welcome to AgriLink360!
              <Sparkles className="h-8 w-8" />
            </CardTitle>
            <CardDescription className="text-xl text-green-100">
              🌾 Empowering Farmers, Growing Together 🌾
            </CardDescription>
            <p className="text-lg text-green-50 max-w-2xl mx-auto">
              Join thousands of successful farmers who are transforming their agricultural journey. 
              Connect with buyers, access modern farming techniques, and grow your business with us!
            </p>
          </CardHeader>
        </Card>

        {/* Profile Setup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-green-600" />
              Complete Your Farmer Profile
            </CardTitle>
            <CardDescription>
              Help us understand your farming background to provide you with personalized recommendations and connections.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Basic Information
                </h3>
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
                  <Label htmlFor="bio">Profile Overview</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your farming philosophy, and what makes your farm special..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Input
                      id="region"
                      placeholder="e.g., North India"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="e.g., Karnal"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Haryana"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-orange-600" />
                  Farm Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Experience (Years)</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farm_size_acres">Farm Size (Acres)</Label>
                    <Input
                      id="farm_size_acres"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 25.5"
                      value={formData.farm_size_acres}
                      onChange={(e) => handleInputChange('farm_size_acres', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="irrigation_type">Irrigation Type</Label>
                    <Select value={formData.irrigation_type} onValueChange={(value) => handleInputChange('irrigation_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select irrigation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="flood">Flood Irrigation</SelectItem>
                        <SelectItem value="rain-fed">Rain-fed</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soil_type">Soil Type</Label>
                    <Select value={formData.soil_type} onValueChange={(value) => handleInputChange('soil_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Crops */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  Type of Crops Cultivated
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Primary Crops</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {cropOptions.map((crop) => (
                        <div key={crop} className="flex items-center space-x-2">
                          <Checkbox
                            id={`primary-${crop}`}
                            checked={formData.primary_crops.includes(crop)}
                            onCheckedChange={() => handleArrayFieldToggle('primary_crops', crop)}
                          />
                          <Label htmlFor={`primary-${crop}`} className="text-sm">{crop}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Production & Storage */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Production & Storage
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annual_production_tons">Annual Production (Tons)</Label>
                    <Input
                      id="annual_production_tons"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 150.5"
                      value={formData.annual_production_tons}
                      onChange={(e) => handleInputChange('annual_production_tons', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storage_capacity_tons">Storage Capacity (Tons)</Label>
                    <Input
                      id="storage_capacity_tons"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 50.0"
                      value={formData.storage_capacity_tons}
                      onChange={(e) => handleInputChange('storage_capacity_tons', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-orange-600" />
                  Equipment Owned
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {equipmentOptions.map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipment-${equipment}`}
                        checked={formData.equipment_owned.includes(equipment)}
                        onCheckedChange={() => handleArrayFieldToggle('equipment_owned', equipment)}
                      />
                      <Label htmlFor={`equipment-${equipment}`} className="text-sm">{equipment}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                disabled={loading || !formData.full_name || !formData.region}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Complete Profile Setup
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerProfileSetup;