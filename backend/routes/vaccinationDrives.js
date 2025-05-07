const express = require('express');
const router = express.Router();
const VaccinationDrive = require('../models/VaccinationDrive');

// Get all drives with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const drives = await VaccinationDrive.find(query).sort({ date: 1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new drive
router.post('/', async (req, res) => {
  try {
    const { date, vaccineName, availableDoses, applicableClasses } = req.body;
    
    // Validate date (must be at least 15 days in future)
    const driveDate = new Date(date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 15);
    
    if (driveDate < minDate) {
      return res.status(400).json({ 
        message: 'Drive must be scheduled at least 15 days in advance' 
      });
    }

    // Check for overlapping drives
    const overlappingDrive = await VaccinationDrive.findOne({
      date: driveDate,
      applicableClasses: { $in: applicableClasses },
      status: 'scheduled'
    });

    if (overlappingDrive) {
      return res.status(400).json({ 
        message: 'Overlapping drive exists for the same classes on this date' 
      });
    }

    const drive = new VaccinationDrive(req.body);
    await drive.save();
    res.status(201).json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update drive
router.put('/:id', async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Prevent editing past drives
    if (new Date(drive.date) < new Date()) {
      return res.status(400).json({ 
        message: 'Cannot edit past drives' 
      });
    }

    const updatedDrive = await VaccinationDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDrive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dashboard metrics
router.get('/dashboard', async (req, res) => {
  try {
    const totalDrives = await VaccinationDrive.countDocuments();
    const upcomingDrives = await VaccinationDrive.find({
      date: { $gte: new Date() },
      status: 'scheduled'
    }).sort({ date: 1 }).limit(5);

    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    
    const drivesNext30Days = await VaccinationDrive.find({
      date: { $gte: new Date(), $lte: next30Days },
      status: 'scheduled'
    });

    res.json({
      totalDrives,
      upcomingDrives,
      drivesNext30Days
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 