const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Protect all booking routes
router.use(authenticateToken);

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, r.name as roomName, r.location, r.capacity
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       WHERE b.isCancelled = 0
       ORDER BY b.startTime DESC`
    );
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, r.name as roomName, r.location, r.capacity
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       WHERE b.id = ?`,
      [id]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(bookings[0]);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/bookings', async (req, res) => {
  const { roomId, employeeId, startTime, endTime, title } = req.body;

  if (!roomId || !employeeId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  try {
    // Check for overlapping bookings before inserting
    const [overlappingBookings] = await pool.query(
      `SELECT * FROM bookings
       WHERE roomId = ?
       AND isCancelled = 0
       AND (
         (startTime < ? AND endTime > ?)
         OR (startTime < ? AND endTime > ?)
         OR (startTime >= ? AND endTime <= ?)
       )`,
      [roomId, endTime, startTime, endTime, startTime, startTime, endTime]
    );

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected time' });
    }

    const [result] = await pool.query(
      'INSERT INTO bookings (roomId, employeeId, startTime, endTime, title) VALUES (?, ?, ?, ?, ?)',
      [roomId, employeeId, startTime, endTime, title]
    );
    res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
router.put('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, title } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  try {
    // Check if booking exists and is not cancelled
    const [existingBooking] = await pool.query(
      'SELECT * FROM bookings WHERE id = ? AND isCancelled = 0',
      [id]
    );

    if (existingBooking.length === 0) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }

    // Check for overlapping bookings excluding current booking
    const [overlappingBookings] = await pool.query(
      `SELECT * FROM bookings
       WHERE roomId = ?
       AND id != ?
       AND isCancelled = 0
       AND (
         (startTime < ? AND endTime > ?)
         OR (startTime < ? AND endTime > ?)
         OR (startTime >= ? AND endTime <= ?)
       )`,
      [existingBooking[0].roomId, id, endTime, startTime, endTime, startTime, startTime, endTime]
    );

    if (overlappingBookings.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected time' });
    }

    const [result] = await pool.query(
      'UPDATE bookings SET startTime = ?, endTime = ?, title = ? WHERE id = ?',
      [startTime, endTime, title, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated successfully' });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking (soft delete)
router.patch('/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'UPDATE bookings SET isCancelled = 1 WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking (hard delete)
router.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for a specific employee
router.get('/bookings/employee/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, r.name as roomName, r.location, r.capacity
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       WHERE b.employeeId = ?
       AND b.isCancelled = 0
       ORDER BY b.startTime DESC`,
      [employeeId]
    );
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching employee bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;