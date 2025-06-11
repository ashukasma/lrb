const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Protect all booking routes
router.use(authenticateToken);

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'startTime';
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const startDate = req.query.startDate;
    const roomId = req.query.roomId;
    const employeeId = req.query.employeeId;

    // Build WHERE clause based on filters
    let whereClause = 'WHERE b.isCancelled = 0';
    const queryParams = [];

    if (startDate) {
      whereClause += ' AND DATE(b.startTime) = ?';
      queryParams.push(startDate);
    }

    if (roomId) {
      whereClause += ' AND b.roomId = ?';
      queryParams.push(roomId);
    }

    if (employeeId) {
      whereClause += ' AND b.employeeId = ?';
      queryParams.push(employeeId);
    }

    // Get total count for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total
       FROM bookings b
       ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['startTime', 'endTime', 'createdAt', 'roomName', 'employeeName'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'startTime';

    // Get paginated bookings with filters and sorting
    const [bookings] = await pool.query(
      `SELECT b.*, r.name as roomName, r.location, r.capacity, u.name as employeeName
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       JOIN users u ON b.employeeId = u.id
       ${whereClause}
       ORDER BY ${finalSortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.json({
      bookings,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total
      },
      filters: {
        startDate,
        roomId,
        employeeId,
        sortBy: finalSortBy,
        sortOrder
      }
    });
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
      `SELECT b.*, r.name as roomName, r.location, r.capacity, u.name as employeeName
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       JOIN users u ON b.employeeId = u.id
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

// Create booking
router.post('/bookings', async (req, res) => {
  const { roomId, employeeId, startTime, endTime, title } = req.body;

  try {
    // Format datetime for MySQL (YYYY-MM-DD HH:mm:ss)
    const formatDateTime = (dateString) => {
      return new Date(dateString);
    };

    const formattedStartTime = formatDateTime(startTime);
    const formattedEndTime = formatDateTime(endTime);

    // Check for overlapping bookings
    const [overlapping] = await pool.query(
      `SELECT * FROM bookings 
       WHERE roomId = ? 
       AND isCancelled = 0
       AND (
         (startTime <= ? AND endTime > ?) OR
         (startTime < ? AND endTime >= ?) OR
         (startTime >= ? AND endTime <= ?)
       )`,
      [roomId, formattedEndTime, formattedStartTime, formattedEndTime, formattedStartTime, formattedStartTime, formattedEndTime]
    );

    if (overlapping.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for this time slot' });
    }

    // Create booking
    const [result] = await pool.query(
      'INSERT INTO bookings (roomId, employeeId, startTime, endTime, title) VALUES (?, ?, ?, ?, ?)',
      [roomId, employeeId, formattedStartTime, formattedEndTime, title]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Error creating booking', error: err.message });
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
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    // Get total count for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total
       FROM bookings b
       WHERE b.employeeId = ?
       AND b.isCancelled = 0`,
      [employeeId]
    );
    const total = countResult[0].total;

    // Get paginated bookings
    const [bookings] = await pool.query(
      `SELECT b.*, r.name as roomName, r.location, r.capacity, u.name as employeeName
       FROM bookings b
       JOIN rooms r ON b.roomId = r.id
       JOIN users u ON b.employeeId = u.id
       WHERE b.employeeId = ?
       AND b.isCancelled = 0
       ORDER BY b.startTime DESC
       LIMIT ? OFFSET ?`,
      [employeeId, limit, offset]
    );

    res.json({
      bookings,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total
      }
    });
  } catch (err) {
    console.error('Error fetching employee bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;