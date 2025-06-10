import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Shield, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface LoginScreenProps {
  onLogin: (userData: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email && !phone) {
      toast({
        title: "Error",
        description: "Please enter either email or phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    // use env variable for api url
    const url = `${import.meta.env.VITE_API_URL}/send-otp`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, phone }),
    });
    const data = await response.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
    else {
      localStorage.setItem('isAuthenticated', 'false');
    }
    setLoading(false);
    setStep('otp');
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${email || phone}`,
    });

  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code",
        variant: "destructive"
      });
      return;
    }
    const url = `${import.meta.env.VITE_API_URL}/verify-otp`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
    else {
      localStorage.setItem('isAuthenticated', 'false');
    }

    onLogin({
      name: "John Doe",
      email: email || "user@lucent.com",
      phone: phone || "+1234567890"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lucent Innovation
          </h1>
          <p className="text-muted-foreground mt-2">Meeting Room Booking Portal</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {step === 'credentials' ? 'Welcome Back' : 'Verify Your Identity'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'credentials'
                ? 'Enter your credentials to access the portal'
                : 'Enter the verification code we sent you'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'credentials' ? (
              <>
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Phone number (optional)"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSendOTP}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    <>
                      Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Use 123456 for demo
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setStep('credentials')}>
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Verify
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleSendOTP}
                  className="w-full"
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
