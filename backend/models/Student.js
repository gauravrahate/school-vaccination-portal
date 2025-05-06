const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  class: String,
  vaccinated: { type: Boolean, default: false },
  vaccinations: [
    {
      vaccine: String,
      date: Date
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
