const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

// Get all students with optional filters
router.get('/', async (req, res) => {
  try {
    const { name, class: studentClass, studentId, vaccinationStatus } = req.query;
    let query = {};

    if (name) query.name = new RegExp(name, 'i');
    if (studentClass) query.class = studentClass;
    if (studentId) query.studentId = studentId;
    if (vaccinationStatus) {
      query['vaccinations.status'] = vaccinationStatus;
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk import students via CSV
router.post('/bulk-import', upload.single('file'), async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const students = results.map(row => ({
          studentId: row.studentId,
          name: row.name,
          class: row.class,
          dateOfBirth: new Date(row.dateOfBirth)
        }));

        await Student.insertMany(students);
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: 'Students imported successfully' });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update vaccination status
router.put('/:id/vaccination', async (req, res) => {
  try {
    const { driveId, status } = req.body;
    const student = await Student.findById(req.params.id);
    
    const vaccination = student.vaccinations.find(v => v.driveId.toString() === driveId);
    if (vaccination) {
      vaccination.status = status;
      vaccination.date = status === 'completed' ? new Date() : null;
    }
    
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete student with ID:', req.params.id);
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      console.log('Student not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student has any completed vaccinations
    const hasCompletedVaccinations = student.vaccinations.some(
      v => v.status === 'completed'
    );

    if (hasCompletedVaccinations) {
      console.log('Cannot delete student with completed vaccinations:', req.params.id);
      return res.status(400).json({ 
        message: 'Cannot delete student with completed vaccinations' 
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    console.log('Successfully deleted student:', deletedStudent);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete error details:', {
      error: error.message,
      stack: error.stack,
      studentId: req.params.id
    });
    res.status(500).json({ 
      message: 'Failed to delete student',
      details: error.message 
    });
  }
});

module.exports = router;
