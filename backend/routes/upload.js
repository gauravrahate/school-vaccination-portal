const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/Student');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/students', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Student.insertMany(results);
        fs.unlinkSync(req.file.path); // Remove the file after processing
        res.json({ message: 'Students imported successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to import students' });
      }
    });
});

module.exports = router;
