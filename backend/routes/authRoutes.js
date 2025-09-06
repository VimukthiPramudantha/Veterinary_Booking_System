const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const generateToken = (userId, role, userType) => {
  return jwt.sign(
    { userId, role, userType },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
  body('address.location').isIn(['Battaramulla']).withMessage('Invalid location')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, contactNumber, address, pets } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    const user = new User({
      username,
      email,
      password,
      fullName,
      contactNumber,
      address,
      pets: pets || []
    });

    await user.save();

    const token = generateToken(user._id, user.role, 'user');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', [
  body('email').trim().notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType').isIn(['user', 'doctor', 'admin']).withMessage('Invalid user type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    let user;
    if (userType === 'doctor') {
      user = await Doctor.findOne({
        $or: [{ email }, { doctorId: email }]
      });
    } else if (userType === 'admin') {
      user = await User.findOne({
        $or: [{ email }, { username: email }],
        role: 'admin'
      });
      if (user && user.role !== 'admin') {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    } else {
      user = await User.findOne({
        $or: [{ email }, { username: email }]
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(
      user._id,
      userType === 'doctor' ? 'doctor' : user.role,
      userType
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: userType === 'doctor' ? 'doctor' : user.role,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Doctor registration is disabled - doctors can only be created by admin
router.post('/doctor/register', async (req, res) => {
  return res.status(403).json({ 
    message: 'Doctor registration is disabled. Please contact an administrator to create a doctor account.' 
  });
});

// Old doctor registration endpoint - kept for reference but disabled
router.post('/doctor/register-disabled', [
  body('doctorId').trim().notEmpty().withMessage('Doctor ID is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('specialization').isIn(['General Veterinary', 'Surgery', 'Dentistry', 'Dermatology', 'Internal Medicine', 'Emergency Care']).withMessage('Invalid specialization'),
  body('experience').isNumeric().withMessage('Experience must be a number'),
  body('consultationFee').isNumeric().withMessage('Consultation fee must be a number'),
  body('clinicAddress.location').isIn(['Battaramulla', 'Colombo', 'Nugegoda', 'Dehiwala', 'Rajagiriya', 'Malabe']).withMessage('Invalid location')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingDoctor = await Doctor.findOne({
      $or: [{ email: req.body.email }, { doctorId: req.body.doctorId }]
    });

    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists with this email or ID' });
    }

    const doctor = new Doctor(req.body);
    await doctor.save();

    const token = generateToken(doctor._id, 'doctor', 'doctor');

    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      doctor: {
        id: doctor._id,
        doctorId: doctor.doctorId,
        email: doctor.email,
        fullName: doctor.fullName,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Error registering doctor' });
  }
});

module.exports = router;