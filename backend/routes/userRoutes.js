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

// Route to import users from CSV
router.post('/import-users', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv(['email', 'phone', 'name']))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const user of results) {
          // Insert user if not exists
          await pool.query(
            'INSERT IGNORE INTO users (email, phone_number, name) VALUES (?, ?, ?)',
            [user.email, user.phone, user.name]
          );
        }
        fs.unlinkSync(req.file.path); // Remove file after processing
        res.status(200).json({ message: 'Users imported successfully', count: results.length });
      } catch (err) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to import users', error: err.message });
      }
    });
});

module.exports = router;