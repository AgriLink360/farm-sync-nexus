import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingCart, Building2, User, Phone, Mail, MapPin, Target, FileText, Globe, CheckCircle } from 'lucide-react';

interface BuyerProfileSetupProps {
  onClose?: () => void;
  mode?: 'create' | 'edit';
}

const BuyerProfileSetup: React.FC<BuyerProfileSetupProps> = ({ onClose, mode = 'create' }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');

  const [formData, setFormData] = useState({
    buyer_type: '',
    contact_person_name: '',
    phone_primary: '',
    phone_secondary: '',
    email: user?.email || '',
    address: '',
    location: '',
    buying_interests: [] as string[],
    gst_number: '',
    business_registration_no: '',
    company_type: '',
    website_url: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const buyingInterestOptions = [
    'Grains & Cereals', 'Fruits', 'Vegetables', 'Spices', 'Pulses',
    'Organic Produce', 'Processed Foods', 'Dairy Products', 'Meat & Poultry'
  ];

  useEffect(() => {
    if (isEditMode && user) {
      fetchExistingProfile();
    }
  }, [isEditMode, user]);

  const fetchExistingProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching buyer profile:', error);
        return;
      }

      if (data) {
        setFormData({
          buyer_type: data.buyer_type || '',
          contact_person_name: data.contact_person_name || '',
          phone_primary: data.phone_primary || '',
          phone_secondary: data.phone_secondary || '',
          email: data.email || '',
          address: data.address || '',
          location: data.location || '',
          buying_interests: data.buying_interests || [],
          gst_number: data.gst_number || '',
          business_registration_no: data.business_registration_no || '',
          company_type: data.company_type || '',
          website_url: data.website_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching buyer profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      buying_interests: prev.buying_interests.includes(interest)
        ? prev.buying_interests.filter(i => i !== interest)
        : [...prev.buying_interests, interest]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.buyer_type && formData.contact_person_name);
      case 2:
        return !!(formData.phone_primary && formData.email && formData.address && formData.location);
      case 3:
        return formData.buying_interests.length > 0;
      case 4:
        if (formData.buyer_type === 'company') {
          return !!(formData.gst_number && formData.business_registration_no && formData.company_type);
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !profile) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!validateStep(currentStep)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const buyerProfileData = {
        user_id: user.id,
        profile_id: profile.id,
        ...formData
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('buyer_profiles')
          .update(buyerProfileData)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Profile Updated Successfully!",
          description: "Your buyer profile has been updated.",
        });
      } else {
        const { error } = await supabase
          .from('buyer_profiles')
          .insert(buyerProfileData);

        if (error) throw error;

        toast({
          title: "Profile Created Successfully!",
          description: "Welcome to ArgiLink360! Your buyer profile is now complete.",
        });
      }

      if (onClose) {
        onClose();
      } else {
        navigate('/buyer');
      }
    } catch (error) {
      console.error('Error saving buyer profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <ShoppingCart className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Buyer Information</h3>
              <p className="text-muted-foreground">Tell us about your buying needs</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="buyer_type">Are you an Individual or Company? *</Label>
                <Select value={formData.buyer_type} onValueChange={(value) => handleInputChange('buyer_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_person_name">Contact Person Name *</Label>
                <Input
                  id="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Phone className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Contact Details</h3>
              <p className="text-muted-foreground">How can sellers reach you?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_primary">Primary Phone *</Label>
                  <Input
                    id="phone_primary"
                    value={formData.phone_primary}
                    onChange={(e) => handleInputChange('phone_primary', e.target.value)}
                    placeholder="Enter primary phone"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_secondary">Secondary Phone</Label>
                  <Input
                    id="phone_secondary"
                    value={formData.phone_secondary}
                    onChange={(e) => handleInputChange('phone_secondary', e.target.value)}
                    placeholder="Enter secondary phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">Location/City *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter city/location"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Buying Interests</h3>
              <p className="text-muted-foreground">What products are you looking to buy?</p>
            </div>

            <div>
              <Label>Select your buying interests *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {buyingInterestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.buying_interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer justify-center p-2 h-auto"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Business Details</h3>
              <p className="text-muted-foreground">
                {formData.buyer_type === 'company' ? 'Additional company information' : 'Optional information'}
              </p>
            </div>

            <div className="space-y-4">
              {formData.buyer_type === 'company' && (
                <>
                  <div>
                    <Label htmlFor="gst_number">GST Number *</Label>
                    <Input
                      id="gst_number"
                      value={formData.gst_number}
                      onChange={(e) => handleInputChange('gst_number', e.target.value)}
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="business_registration_no">Business Registration Number *</Label>
                    <Input
                      id="business_registration_no"
                      value={formData.business_registration_no}
                      onChange={(e) => handleInputChange('business_registration_no', e.target.value)}
                      placeholder="Enter business registration number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_type">Company Size *</Label>
                    <Select value={formData.company_type} onValueChange={(value) => handleInputChange('company_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1-50 employees)</SelectItem>
                        <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                        <SelectItem value="large">Large (250+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              {isEditMode ? 'Edit Buyer Profile' : 'Setup Buyer Profile'}
            </CardTitle>
            {isEditMode && (
              <Badge variant="secondary">Edit Mode</Badge>
            )}
          </div>
          <CardDescription>
            {isEditMode ? 'Update your buyer profile information' : 'Complete your buyer profile to start connecting with farmers'}
          </CardDescription>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <Separator />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(currentStep)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating Profile...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isEditMode ? 'Update Profile' : 'Complete Setup'}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerProfileSetup;