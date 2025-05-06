const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const dayjs = require('dayjs');

// Create a new drive
router.post('/', async (req, res) => {
  const { vaccineName, date, dosesAvailable, applicableClasses } = req.body;
  const driveDate = new Date(date);
  const now = new Date();

  // Validate if drive is at least 15 days in advance
  if (dayjs(driveDate).diff(now, 'day') < 15) {
    return res.status(400).json({ error: 'Drive must be scheduled at least 15 days in advance' });
  }

  // Validate if there is already a drive scheduled on the same date
  const existingDrive = await Drive.findOne({ date: driveDate });
  if (existingDrive) {
    return res.status(400).json({ error: 'Another drive is already scheduled on this date' });
  }

  try {
    const drive = new Drive({ vaccineName, date: driveDate, dosesAvailable, applicableClasses });
    await drive.save();
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create drive' });
  }
});

// Get upcoming drives within 30 days
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const future = dayjs().add(30, 'day').toDate();
    const drives = await Drive.find({ date: { $gte: today, $lte: future } });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming drives' });
  }
});

module.exports = router;
