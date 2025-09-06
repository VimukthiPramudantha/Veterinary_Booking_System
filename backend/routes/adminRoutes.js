const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { adminMiddleware } = require('../middleware/auth');

// Admin login handled by existing auth routes with role check

// Get all doctors
router.get('/doctors', adminMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('-password')
      .sort('-createdAt');

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Create new doctor (admin only)
router.post('/doctors', adminMiddleware, async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      specialization,
      experience,
      qualifications,
      contactNumber,
      clinicAddress,
      consultationFee,
      workingHours
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Generate doctor ID
    const doctorCount = await Doctor.countDocuments();
    const doctorId = `DOC${String(doctorCount + 1).padStart(4, '0')}`;

    // Create doctor
    const doctor = new Doctor({
      doctorId,
      email,
      password,
      fullName,
      specialization,
      experience: Number(experience),
      qualifications: qualifications || [],
      contactNumber,
      clinicAddress: {
        ...clinicAddress,
        location: 'Battaramulla' // Fixed location
      },
      consultationFee: Number(consultationFee),
      workingHours: {
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
        slotDuration: workingHours.slotDuration || 30
      }
    });

    await doctor.save();

    const savedDoctor = await Doctor.findById(doctor._id).select('-password');
    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: savedDoctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ 
      message: 'Error creating doctor',
      details: error.message 
    });
  }
});

// Update doctor
router.put('/doctors/:doctorId', adminMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updateData = { ...req.body };
    
    // Remove password from update if not provided
    if (!updateData.password) {
      delete updateData.password;
    }

    // Ensure location is Battaramulla
    if (updateData.clinicAddress) {
      updateData.clinicAddress.location = 'Battaramulla';
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ 
      message: 'Error updating doctor',
      details: error.message 
    });
  }
});

// Delete doctor
router.delete('/doctors/:doctorId', adminMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check for active appointments
    const activeAppointments = await Appointment.find({
      doctor: doctorId,
      status: 'scheduled',
      appointmentDate: { $gte: new Date() }
    });

    if (activeAppointments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete doctor with active appointments',
        activeAppointments: activeAppointments.length
      });
    }

    const doctor = await Doctor.findByIdAndDelete(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

// Toggle doctor active status
router.patch('/doctors/:doctorId/status', adminMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { isActive } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: `Doctor ${isActive ? 'activated' : 'deactivated'} successfully`,
      doctor
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Error updating doctor status' });
  }
});

// Get admin dashboard stats
router.get('/dashboard/stats', adminMiddleware, async (req, res) => {
  try {
    const [
      totalDoctors,
      activeDoctors,
      totalAppointments,
      todayAppointments,
      totalUsers
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }),
      User.countDocuments({ role: 'user' })
    ]);

    res.json({
      totalDoctors,
      activeDoctors,
      totalAppointments,
      todayAppointments,
      totalUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get all appointments (admin view)
router.get('/appointments', adminMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'fullName email contactNumber')
      .populate('doctor', 'fullName specialization contactNumber')
      .populate('diagnosisQuestionnaire')
      .sort('-appointmentDate')
      .limit(100);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

module.exports = router;