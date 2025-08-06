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
import { Loader2, Truck, Building2, Phone, Mail, MapPin, Clock, FileText, Globe, CheckCircle, Plus, Minus } from 'lucide-react';

interface LogisticsProfileSetupProps {
  onClose?: () => void;
  mode?: 'create' | 'edit';
}

const LogisticsProfileSetup: React.FC<LogisticsProfileSetupProps> = ({ onClose, mode = 'create' }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');

  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone_primary: '',
    phone_secondary: '',
    email: user?.email || '',
    address: '',
    location: '',
    fleet_details: { vehicle_types: [], capacities: [] },
    operating_hours: '',
    business_registration_licence: '',
    website_url: ''
  });

  const [fleetEntries, setFleetEntries] = useState([{ vehicle_type: '', capacity: '' }]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const vehicleTypes = [
    'Mini Truck (1-2 tons)', 'Light Truck (3-5 tons)', 'Medium Truck (6-10 tons)',
    'Heavy Truck (10+ tons)', 'Refrigerated Truck', 'Container Truck', 'Pickup Van'
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
        .from('logistics_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching logistics profile:', error);
        return;
      }

      if (data) {
        const fleetData = (data.fleet_details as any) || { vehicle_types: [], capacities: [] };
        setFormData({
          company_name: data.company_name || '',
          contact_person: data.contact_person || '',
          phone_primary: data.phone_primary || '',
          phone_secondary: data.phone_secondary || '',
          email: data.email || '',
          address: data.address || '',
          location: data.location || '',
          fleet_details: fleetData,
          operating_hours: data.operating_hours || '',
          business_registration_licence: data.business_registration_licence || '',
          website_url: data.website_url || ''
        });

        // Reconstruct fleet entries
        if (fleetData.vehicle_types && fleetData.capacities && Array.isArray(fleetData.vehicle_types)) {
          const entries = fleetData.vehicle_types.map((type: string, index: number) => ({
            vehicle_type: type,
            capacity: fleetData.capacities[index] || ''
          }));
          setFleetEntries(entries.length > 0 ? entries : [{ vehicle_type: '', capacity: '' }]);
        }
      }
    } catch (error) {
      console.error('Error fetching logistics profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string | object) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFleetChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...fleetEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setFleetEntries(updatedEntries);

    // Update formData
    const fleetDetails = {
      vehicle_types: updatedEntries.map(entry => entry.vehicle_type).filter(Boolean),
      capacities: updatedEntries.map(entry => entry.capacity).filter(Boolean)
    };
    handleInputChange('fleet_details', fleetDetails);
  };

  const addFleetEntry = () => {
    setFleetEntries([...fleetEntries, { vehicle_type: '', capacity: '' }]);
  };

  const removeFleetEntry = (index: number) => {
    if (fleetEntries.length > 1) {
      const updatedEntries = fleetEntries.filter((_, i) => i !== index);
      setFleetEntries(updatedEntries);
      
      const fleetDetails = {
        vehicle_types: updatedEntries.map(entry => entry.vehicle_type).filter(Boolean),
        capacities: updatedEntries.map(entry => entry.capacity).filter(Boolean)
      };
      handleInputChange('fleet_details', fleetDetails);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.company_name && formData.contact_person);
      case 2:
        return !!(formData.phone_primary && formData.email && formData.address && formData.location);
      case 3:
        return fleetEntries.some(entry => entry.vehicle_type && entry.capacity) && !!formData.operating_hours;
      case 4:
        return !!formData.business_registration_licence;
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
      const logisticsProfileData = {
        user_id: user.id,
        profile_id: profile.id,
        ...formData
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('logistics_profiles')
          .update(logisticsProfileData)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Profile Updated Successfully!",
          description: "Your logistics profile has been updated.",
        });
      } else {
        const { error } = await supabase
          .from('logistics_profiles')
          .insert(logisticsProfileData);

        if (error) throw error;

        toast({
          title: "Profile Created Successfully!",
          description: "Welcome to ArgiLink360! Your logistics profile is now complete.",
        });
      }

      if (onClose) {
        onClose();
      } else {
        navigate('/logistics');
      }
    } catch (error) {
      console.error('Error saving logistics profile:', error);
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
              <Truck className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Company Information</h3>
              <p className="text-muted-foreground">Tell us about your logistics company</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company/Logistics Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="Enter contact person name"
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
              <p className="text-muted-foreground">How can clients reach you?</p>
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
              <Truck className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Fleet & Operations</h3>
              <p className="text-muted-foreground">Details about your vehicles and operating hours</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Fleet Details *</Label>
                <div className="space-y-3 mt-2">
                  {fleetEntries.map((entry, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select 
                          value={entry.vehicle_type} 
                          onValueChange={(value) => handleFleetChange(index, 'vehicle_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Input
                          value={entry.capacity}
                          onChange={(e) => handleFleetChange(index, 'capacity', e.target.value)}
                          placeholder="Capacity"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFleetEntry(index)}
                        disabled={fleetEntries.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFleetEntry}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="operating_hours">Operating Hours *</Label>
                <Input
                  id="operating_hours"
                  value={formData.operating_hours}
                  onChange={(e) => handleInputChange('operating_hours', e.target.value)}
                  placeholder="e.g., Mon-Fri 8AM-6PM, Sat 8AM-2PM"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Business Credentials</h3>
              <p className="text-muted-foreground">Legal information and certifications</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="business_registration_licence">Business Registration/License *</Label>
                <Input
                  id="business_registration_licence"
                  value={formData.business_registration_licence}
                  onChange={(e) => handleInputChange('business_registration_licence', e.target.value)}
                  placeholder="Enter business registration or license number"
                />
              </div>

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
              <Truck className="h-6 w-6" />
              {isEditMode ? 'Edit Logistics Profile' : 'Setup Logistics Profile'}
            </CardTitle>
            {isEditMode && (
              <Badge variant="secondary">Edit Mode</Badge>
            )}
          </div>
          <CardDescription>
            {isEditMode ? 'Update your logistics profile information' : 'Complete your logistics profile to start connecting with farmers and buyers'}
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

export default LogisticsProfileSetup;