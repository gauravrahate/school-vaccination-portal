const mongoose = require('mongoose');

const vaccinationDriveSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  availableDoses: {
    type: Number,
    required: true
  },
  applicableClasses: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  vaccinatedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add index for efficient querying
vaccinationDriveSchema.index({ date: 1 });

module.exports = mongoose.model('VaccinationDrive', vaccinationDriveSchema); 