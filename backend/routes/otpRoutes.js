const express = require('express');
const axios = require('axios');
const pool = require('../db'); // Assuming db.js is in the parent directory
const jwt = require('jsonwebtoken');
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();


// API to send OTP
router.post('/send-otp', async (req, res) => {
  // we wil get email as well as phone number in the request body

  const { email, phone } = req.body;
  console.log(req.body);
  
  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone number are required' });
  }

  try {
    // Check if user exists with both email and phone number
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND phone_number = ?',
      [email, phone]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'You are not our user' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const url = `https://control.msg91.com/api/v5/otp?otp_expiry=10&template_id=${MSG91_TEMPLATE_ID}&mobile=+91${phone}&authkey=${MSG91_AUTH_KEY}&realTimeResponse=`;
    console.log(url);
    
    // Send OTP via MSG91 API
    const msg91Response = await axios.post(
      url,
      {
        Param1: "value1",
        Param2: "value2",
        Param3: "value3"
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('MSG91 API Response:', msg91Response.data);

    // Update OTP in DB
    await pool.query(
      'UPDATE users SET otp = ?, otp_expiry = NOW() + INTERVAL 5 MINUTE WHERE email = ? AND phone_number = ?',
      [otp, email, phone]
    );

    res.status(200).json({ message: 'OTP sent successfully', msg91Response: msg91Response.data });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// API to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  console.log("", `Verifying OTP for phone: ${phone}, OTP: ${otp}`);
  
  

  const options = {
    method: 'GET',
    url: 'https://control.msg91.com/api/v5/otp/verify',
    params: { otp: otp, mobile: `+91${phone}` },
    headers: { authkey: MSG91_AUTH_KEY }
  };

  try {
    const { data } = await axios.request(options);
    if (data && data.type === 'success') {
      // Get user data after successful OTP verification
      const [users] = await pool.query(
        'SELECT * FROM users WHERE phone_number = ?',
        [phone]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = users[0];

      // Update user verification status
      await pool.query(
        'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE phone_number = ?',
        [phone]
      );

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, phone: user.phone_number, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Return user data and token
      res.status(200).json({
        message: 'OTP verified successfully',
        verified: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone_number,
          role: user.role,
          department: user.department,
          position: user.position,
          employeeId: user.employeeId
        }
      });
    } else {
      res.status(401).json({ message: data.message || 'Invalid or expired OTP', verified: false });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
});

// API to retry OTP
router.post('/retry-otp', async (req, res) => {
  const { phone, retryType } = req.body;
  if (!phone || !retryType) {
    return res.status(400).json({ message: 'Phone number and retry type are required' });
  }
  const options = {
    method: 'GET',
    url: 'https://control.msg91.com/api/v5/otp/retry',
    params: {
      authkey: process.env.MSG91_API_KEY,
      retrytype: retryType, // e.g., 'text' or 'voice'
      mobile: `+91${phone}`
    }
  };
  try {
    const { data } = await axios.request(options);
    console.log(data);
    if (data && data.type === 'success') {
      res.status(200).json({ message: 'OTP retry successful', data });
    } else {
      res.status(400).json({ message: data.message || 'OTP retry failed', data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retry OTP', error: error.message });
  }
});

module.exports = router;