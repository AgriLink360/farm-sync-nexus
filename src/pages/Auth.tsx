import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Sprout, Building2, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [portalType, setPortalType] = useState<'farmer' | 'buyer' | 'logistics'>('farmer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user profile to determine portal
        const { data: profile } = await supabase
          .from('profiles')
          .select('portal_type')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile?.portal_type) {
          navigate(`/${profile.portal_type}`);
        } else {
          navigate('/');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update profile with portal type
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            portal_type: portalType,
            full_name: fullName 
          })
          .eq('user_id', data.user.id);

        if (profileError) throw profileError;

        // Create sample orders for the user
        await createSampleOrders(data.user.id, portalType);

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });

        navigate(`/${portalType}`);
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile to determine portal
        const { data: profile } = await supabase
          .from('profiles')
          .select('portal_type')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.portal_type) {
          navigate(`/${profile.portal_type}`);
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleOrders = async (userId: string, portal: string) => {
    const sampleOrders = {
      farmer: [
        {
          user_id: userId,
          order_type: 'crop_listing',
          title: 'Premium Organic Wheat - 50 tons',
          description: 'High-quality organic wheat, freshly harvested',
          amount: 125000.00,
          status: 'active',
          metadata: { crop_type: 'wheat', quantity: '50 tons', organic: true }
        },
        {
          user_id: userId,
          order_type: 'crop_listing',
          title: 'Fresh Tomatoes - 200 kg',
          description: 'Farm-fresh tomatoes, perfect for processing',
          amount: 8000.00,
          status: 'completed',
          metadata: { crop_type: 'tomatoes', quantity: '200 kg', grade: 'A' }
        }
      ],
      buyer: [
        {
          user_id: userId,
          order_type: 'demand_posting',
          title: 'Bulk Rice Purchase - 100 tons',
          description: 'Looking for premium basmati rice for export',
          amount: 300000.00,
          status: 'pending',
          metadata: { crop_type: 'rice', quantity: '100 tons', grade: 'premium' }
        },
        {
          user_id: userId,
          order_type: 'demand_posting',
          title: 'Seasonal Vegetables - Mixed',
          description: 'Monthly supply contract for restaurant chain',
          amount: 75000.00,
          status: 'active',
          metadata: { crop_type: 'vegetables', quantity: 'mixed', contract_type: 'monthly' }
        }
      ],
      logistics: [
        {
          user_id: userId,
          order_type: 'logistics_booking',
          title: 'Cold Storage Transport - Mumbai to Delhi',
          description: 'Temperature-controlled transport for perishables',
          amount: 25000.00,
          status: 'completed',
          metadata: { service_type: 'cold_transport', route: 'Mumbai-Delhi', capacity: '10 tons' }
        },
        {
          user_id: userId,
          order_type: 'logistics_booking',
          title: 'Warehouse Storage - 3 months',
          description: 'Grain storage facility booking',
          amount: 45000.00,
          status: 'active',
          metadata: { service_type: 'storage', duration: '3 months', capacity: '500 tons' }
        }
      ]
    };

    const orders = sampleOrders[portal as keyof typeof sampleOrders] || [];
    
    for (const order of orders) {
      await supabase.from('orders').insert(order);
    }
  };

  const portalIcons = {
    farmer: Sprout,
    buyer: Building2,
    logistics: Truck
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">AgriLink360</h1>
          <p className="text-gray-600">Join the smart agricultural commerce network</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portal">Choose Your Portal</Label>
                    <Select value={portalType} onValueChange={(value: 'farmer' | 'buyer' | 'logistics') => setPortalType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">
                          <div className="flex items-center gap-2">
                            <Sprout className="h-4 w-4" />
                            Farmer Portal
                          </div>
                        </SelectItem>
                        <SelectItem value="buyer">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Buyer Portal
                          </div>
                        </SelectItem>
                        <SelectItem value="logistics">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Logistics Portal
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;