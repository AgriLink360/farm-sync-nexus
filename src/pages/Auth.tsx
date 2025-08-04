
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Sprout, Building2, Truck, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import ForgotPassword from '@/components/ForgotPassword';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [portalType, setPortalType] = useState<'farmer' | 'buyer' | 'logistics'>('farmer');
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [newUserPortal, setNewUserPortal] = useState<'farmer' | 'buyer' | 'logistics'>('farmer');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
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
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            portal_type: portalType,
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        // Store portalType in localStorage for later profile update
        localStorage.setItem('pending_portal_type', portalType);
        // Switch to sign-in tab
        setActiveTab('signin');
      } else if (data.user && data.session) {
        // User is automatically signed in, update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            user_id: data.user.id,
            email: data.user.email!,
            portal_type: portalType,
            full_name: fullName 
          });

        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Profile setup failed",
            description: "There was an issue setting up your profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account created successfully!",
          description: "Welcome to AgriLink360!",
        });

        // Show tutorial for new users
        setNewUserPortal(portalType);
        setShowTutorial(true);
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

      if (data.user && data.session) {
        // Get user profile to determine portal
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('portal_type, full_name')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          toast({
            title: "Profile error",
            description: "Unable to fetch your profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // If portal_type is missing, try to update from localStorage
        if (!profile?.portal_type) {
          const pendingPortalType = localStorage.getItem('pending_portal_type');
          if (pendingPortalType) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ portal_type: pendingPortalType })
              .eq('user_id', data.user.id);
            if (!updateError) {
              localStorage.removeItem('pending_portal_type');
              // Re-fetch profile after update
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('portal_type, full_name')
                .eq('user_id', data.user.id)
                .single();
              profile = updatedProfile;
            }
          }
        }

        if (profile?.portal_type) {
          toast({
            title: "Welcome back!",
            description: `Signed in successfully as ${profile.full_name || data.user.email}`,
          });
          // Redirect to appropriate portal and force reload to ensure context is refreshed
          navigate(`/${profile.portal_type}`);
          window.location.replace(`/${profile.portal_type}`);
        } else {
          toast({
            title: "Profile incomplete",
            description: "Your portal type is not set. Please contact support.",
            variant: "destructive",
          });
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

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    navigate(`/${newUserPortal}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

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
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
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
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
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

        <OnboardingTutorial
          isOpen={showTutorial}
          onClose={handleTutorialComplete}
          portalType={newUserPortal}
        />

        <ForgotPassword
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
};

export default Auth;
