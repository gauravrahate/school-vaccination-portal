const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add a new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Get all students or search
router.get('/', async (req, res) => {
  try {
    const { name, class: studentClass } = req.query;
    let filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (studentClass) filter.class = studentClass;

    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Update vaccination status
router.put('/:id/vaccinate', async (req, res) => {
  const { vaccine, date } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const alreadyVaccinated = student.vaccinations.find(v => v.vaccine === vaccine);
    if (alreadyVaccinated) {
      return res.status(400).json({ error: 'Already vaccinated for this vaccine' });
    }

    student.vaccinations.push({ vaccine, date });
    student.vaccinated = true;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vaccination status' });
  }
});

module.exports = router;
