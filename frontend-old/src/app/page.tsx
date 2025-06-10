"use client";

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/send-otp`, { phoneNumber, email });
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      setMessage(axiosError.response?.data?.message || 'Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/verify-otp`, { phoneNumber, otp });
      setMessage(response.data.message);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      setMessage(axiosError.response?.data?.message || 'Error verifying OTP');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f3f4f6">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
          Room Booking Portal Login
        </Typography>
        {!otpSent ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., user@example.com"
              fullWidth
              size="small"
            />
            <TextField
              label="Phone Number"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +919876543210"
              fullWidth
              size="small"
            />
            <Button
              onClick={sendOtp}
              variant="contained"
              color="primary"
              fullWidth
            >
              Send OTP
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              fullWidth
              size="small"
            />
            <Button
              onClick={verifyOtp}
              variant="contained"
              color="success"
              fullWidth
            >
              Verify OTP
            </Button>
            <Button
              onClick={() => setOtpSent(false)}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Resend OTP
            </Button>
          </Box>
        )}
        {message && (
          <Typography mt={2} align="center" variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}