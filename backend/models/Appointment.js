const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  pet: {
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: String,
    age: String
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  diagnosisQuestionnaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiagnosisQuestionnaire'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    amount: Number,
    paidAt: Date
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.pre('save', function(next) {
  if (!this.appointmentId) {
    this.appointmentId = 'APT' + Date.now() + Math.random().toString(36).substr(2, 9);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);