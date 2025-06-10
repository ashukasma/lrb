const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Protect all room routes
router.use(authenticateToken);

// API to get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// API to get room availability for a specific time range
router.get('/rooms/:roomId/availability', async (req, res) => {
  const { roomId } = req.params;
  const { startTime, endTime } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'startTime and endTime are required' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM bookings
       WHERE room_id = ?
       AND (
         (start_time < ? AND end_time > ?)
       )`,
      [roomId, endTime, startTime]
    );
    // If no overlapping bookings, the room is available
    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;