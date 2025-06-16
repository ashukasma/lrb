const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all rooms with search, filtering, and pagination
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      search = '',
      location = '',
      status = ''
    } = req.query;

    // Build the base query
    let query = 'SELECT * FROM rooms';
    const queryParams = [];
    const conditions = [];

    // Add search condition if search term is provided
    if (search) {
      conditions.push('(name LIKE ? OR location LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Add location filter
    if (location && location !== 'all') {
      conditions.push('location = ?');
      queryParams.push(location);
    }

    // Add status filter
    if (status && status !== 'all') {
      conditions.push('isWorking = ?');
      queryParams.push(status === 'working' ? 1 : 0);
    }

    // Add WHERE clause if there are any conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM rooms';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    // Execute both queries in parallel
    const [rooms, countResult] = await Promise.all([
      db.query(query, queryParams),
      db.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const total = countResult[0][0].total;

    res.json({
      rooms: rooms[0],
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > (parseInt(offset) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Add new room
router.post('/rooms', authenticateToken, async (req, res) => {
  const {
    name,
    capacity,
    location,
    phone,
    noOfChairs,
    hasTV,
    hasMonitor,
    hasBoard,
    isWorking
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO rooms (
        name, capacity, location, phone, noOfChairs,
        hasTV, hasMonitor, hasBoard, isWorking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, capacity, location, phone, noOfChairs, hasTV, hasMonitor, hasBoard, isWorking]
    );

    const [newRoom] = await db.query('SELECT * FROM rooms WHERE id = ?', [result.insertId]);
    res.status(201).json(newRoom[0]);
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ message: 'Error adding room' });
  }
});

// Edit room
router.put('/rooms/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    capacity,
    location,
    phone,
    noOfChairs,
    hasTV,
    hasMonitor,
    hasBoard,
    isWorking
  } = req.body;

  try {
    await db.query(
      `UPDATE rooms SET 
        name = ?, 
        capacity = ?, 
        location = ?, 
        phone = ?, 
        noOfChairs = ?,
        hasTV = ?, 
        hasMonitor = ?, 
        hasBoard = ?, 
        isWorking = ?
      WHERE id = ?`,
      [name, capacity, location, phone, noOfChairs, hasTV, hasMonitor, hasBoard, isWorking, id]
    );

    const [updatedRoom] = await db.query('SELECT * FROM rooms WHERE id = ?', [id]);
    
    if (updatedRoom.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updatedRoom[0]);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Error updating room' });
  }
});

// Delete room
router.delete('/rooms/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM rooms WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room' });
  }
});

module.exports = router;