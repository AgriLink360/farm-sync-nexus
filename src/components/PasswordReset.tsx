import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';

interface PasswordResetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordReset = ({ isOpen, onClose }: PasswordResetProps) => {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resetResult = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (resetResult.error) throw resetResult.error;

      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      });

      setStep('reset');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updateResult = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateResult.error) throw updateResult.error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });

      setStep('success');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'email' && (
              <>
                <Mail className="h-5 w-5" />
                Reset Password
              </>
            )}
            {step === 'reset' && (
              <>
                <Lock className="h-5 w-5" />
                Set New Password
              </>
            )}
            {step === 'success' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Password Updated
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && "Enter your email address to receive a password reset link."}
            {step === 'reset' && "Enter your new password below."}
            {step === 'success' && "Your password has been successfully updated."}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('email')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Button onClick={handleClose} className="w-full">
              Continue to Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordReset;