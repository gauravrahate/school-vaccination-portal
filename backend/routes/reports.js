const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get student report by vaccine type (or all students)
router.get('/', async (req, res) => {
  try {
    const { vaccine } = req.query;
    const filter = vaccine ? { 'vaccinations.vaccine': vaccine } : {};
    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;
