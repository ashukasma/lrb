const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../db'); // Adjust path if needed
const authenticateToken = require('../middleware/auth');

const router = express.Router();
// Protect all room routes
router.use(authenticateToken);

const upload = multer({ dest: 'uploads/' }); // Temporary upload folder

// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const {
      limit = 2000,
      offset = 0,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build the base query
    let query = 'SELECT id, name, email, phone_number, employeeId FROM users';
    const queryParams = [];

    // Add search condition if search term is provided
    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR phone_number LIKE ? OR employeeId LIKE ?';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add sorting
    const allowedSortFields = ['name', 'email', 'phone_number', 'created_at', 'employeeId'];
    const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sanitizedSortBy} ${sanitizedSortOrder}`;

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let countParams = [];
    
    if (search) {
      countQuery += ' WHERE name LIKE ? OR email LIKE ? OR phone_number LIKE ? OR employeeId LIKE ?';
      const searchTerm = `%${search}%`;
      countParams = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    console.log('Executing queries:', {
      query,
      queryParams,
      countQuery,
      countParams
    });

    const [users, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, countParams)
    ]);

    console.log('Query results:', {
      usersCount: users[0].length,
      totalCount: countResult[0][0].total
    });

    const total = parseInt(countResult[0][0].total);

    res.json({
      users: users[0],
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > (parseInt(offset) + parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ 
      message: 'Failed to fetch users', 
      error: err.message,
      sqlMessage: err.sqlMessage,
      sql: err.sql
    });
  }
});

// Route to import users from CSV
router.post('/users/import-users', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv([ 'employeeId','name', 'email', 'phone']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        let updatedCount = 0;
        let insertedCount = 0;
        let errorCount = 0;

        for (const user of results) {
          try {
            // First check if user exists
            const [existingUsers] = await pool.query(
              'SELECT id FROM users WHERE email = ?',
              [user.email]
            );

            if (existingUsers.length > 0) {
              // Update existing user
              await pool.query(
                'UPDATE users SET name = ?, phone_number = ?, employeeId = ? WHERE email = ?',
                [user.name, user.phone, user.employeeId, user.email]
              );
              updatedCount++;
            } else {
              // Insert new user
              await pool.query(
                'INSERT INTO users (email, phone_number, name, employeeId) VALUES (?, ?, ?, ?)',
                [user.email, user.phone, user.name, user.employeeId]
              );
              insertedCount++;
            }
          } catch (err) {
            console.error('Error processing user:', user.email, err);
            errorCount++;
          }
        }

        fs.unlinkSync(req.file.path); // Remove file after processing
        res.status(200).json({ 
          message: 'Users processed successfully', 
          stats: {
            updated: updatedCount,
            inserted: insertedCount,
            errors: errorCount,
            total: results.length
          }
        });
      } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to import users', error: err.message });
      }
    });
});

module.exports = router;