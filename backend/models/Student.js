const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  vaccinations: [{
    vaccineName: String,
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VaccinationDrive'
    },
    date: Date,
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
