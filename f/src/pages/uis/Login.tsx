import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpRetryEnabled, setOtpRetryEnabled] = useState(false);

    const handleSendOTP = async () => {
        if (email && phoneNumber) {
            setOtpSent(true);
            const url = `${import.meta.env.NEXT_PUBLIC_API_URL}/send-otp`;
            // lets send request to backend to send otp
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ email, phoneNumber }),
            });
            const data = await response.json();
            console.log(data);

            setTimeout(() => setOtpRetryEnabled(true), 30000);
        }
    };

    const handleVerifyOTP = async () => {
        // otp 
        const url = `${import.meta.env.NEXT_PUBLIC_API_URL}/verify-otp`
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, otp }),
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

    };

    const handleRetryOTP = () => {
        setOtpRetryEnabled(false);
        setTimeout(() => setOtpRetryEnabled(true), 30000);
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-violet-50">
                    <div className="w-full h-full overflow-hidden">
                        <img
                            src="https://readdy.ai/api/search-image?query=A%20modern%20and%20professional%20office%20building%20interior%20with%20a%20sleek%20reception%20area%2C%20featuring%20minimalist%20furniture%2C%20soft%20lighting%2C%20and%20a%20clean%20design%20aesthetic.%20The%20space%20has%20glass%20walls%2C%20indoor%20plants%2C%20and%20a%20subtle%20color%20palette%20of%20blues%20and%20whites%2C%20creating%20a%20welcoming%20yet%20professional%20atmosphere&width=600&height=600&seq=1&orientation=squarish"
                            alt="Office Building Interior"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-3xl font-bold text-center text-violet-900 mb-8">Login to Book a Room</h1>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="123-456-7890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            {!otpSent ? (
                                <Button
                                    onClick={handleSendOTP}
                                    className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                                    disabled={!email || !phoneNumber}
                                >
                                    Send OTP
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="otp">Enter OTP</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={handleVerifyOTP}
                                            className="flex-1 !rounded-button whitespace-nowrap cursor-pointer"
                                            disabled={!otp}
                                        >
                                            Verify OTP
                                        </Button>
                                        <Button
                                            onClick={handleRetryOTP}
                                            variant="outline"
                                            className="flex-1 !rounded-button whitespace-nowrap cursor-pointer"
                                            disabled={!otpRetryEnabled}
                                        >
                                            Retry OTP
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 