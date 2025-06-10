const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Protect all booking routes
router.use(authenticateToken);

// API to book a room
router.post('/bookings', async (req, res) => {
  const { room_id, employee_id, start_time, end_time, title } = req.body;

  if (!room_id || !employee_id || !start_time || !end_time) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  try {
    // Check for overlapping bookings before inserting
    const [overlappingBookings] = await pool.query(
      `SELECT * FROM bookings
       WHERE room_id = ?
       AND (
         (start_time < ? AND end_time > ?)
       )`,
      [room_id, end_time, start_time]
    );

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected time' });
    }

    const [result] = await pool.query(
      'INSERT INTO bookings (room_id, employee_id, start_time, end_time, title) VALUES (?, ?, ?, ?, ?)',
      [room_id, employee_id, start_time, end_time, title]
    );
    res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// API to get bookings for a specific employee
router.get('/bookings/employee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT b.*, r.name as room_name, r.location
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.employee_id = ?
       ORDER BY b.start_time DESC`,
      [employeeId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employee bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// API to cancel a booking
router.delete('/bookings/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;