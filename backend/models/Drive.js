const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  vaccineName: String,
  date: Date,
  dosesAvailable: Number,
  applicableClasses: [String],
});

module.exports = mongoose.model('Drive', driveSchema);
