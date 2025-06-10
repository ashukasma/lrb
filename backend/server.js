const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // Import the database connection pool
const axios = require('axios'); // Import axios
const otpRoutes = require('./routes/otpRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authenticateToken = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Use OTP routes
app.use('/api', otpRoutes);
// Use Room routes
app.use('/api', roomRoutes);
// Use Booking routes
app.use('/api', bookingRoutes);

// Protected endpoint example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint!', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});