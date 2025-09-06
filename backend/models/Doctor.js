const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const workingHoursSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  slotDuration: {
    type: Number,
    default: 30
  }
});

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['General Veterinary', 'Surgery', 'Dentistry', 'Dermatology', 'Internal Medicine', 'Emergency Care']
  },
  experience: {
    type: Number,
    required: true
  },
  qualifications: [String],
  contactNumber: {
    type: String,
    required: true
  },
  clinicAddress: {
    street: String,
    city: String,
    location: {
      type: String,
      default: 'Battaramulla'
    }
  },
  workingHours: workingHoursSchema,
  consultationFee: {
    type: Number,
    required: true
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);