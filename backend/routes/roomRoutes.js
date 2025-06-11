const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all rooms
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const [rooms] = await db.query('SELECT * FROM rooms');
    res.json(rooms);
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