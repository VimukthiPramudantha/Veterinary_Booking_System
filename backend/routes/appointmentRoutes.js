const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const DiagnosisQuestionnaire = require('../models/DiagnosisQuestionnaire');
const { authMiddleware } = require('../middleware/auth');

router.post('/book', authMiddleware, async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      pet,
      reason,
      paymentMethod,
      diagnosisData
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the requested date and time slot is available
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find existing appointments for this doctor, date, and time slot
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      timeSlot: timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is not available' });
    }

    const appointment = new Appointment({
      user: req.userId,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      pet,
      reason,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending'
    });

    await appointment.save();

    if (diagnosisData) {
      const questionnaire = new DiagnosisQuestionnaire({
        appointment: appointment._id,
        user: req.userId,
        doctor: doctorId,
        petInfo: pet,
        responses: diagnosisData,
        summary: ''
      });

      questionnaire.generateSummary();
      await questionnaire.save();

      appointment.diagnosisQuestionnaire = questionnaire._id;
      await appointment.save();
    }

    // Add appointment to doctor's appointments array
    if (!doctor.appointments) {
      doctor.appointments = [];
    }
    doctor.appointments.push(appointment._id);
    await doctor.save();

    const user = await User.findById(req.userId);
    user.bookingHistory.push(appointment._id);
    await user.save();

    await appointment.populate('doctor', 'fullName specialization clinicAddress');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      message: 'Error booking appointment',
      details: error.message 
    });
  }
});

router.get('/:appointmentId', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('doctor', 'fullName specialization clinicAddress contactNumber consultationFee')
      .populate('user', 'fullName email contactNumber')
      .populate('diagnosisQuestionnaire');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user._id.toString() !== req.userId && 
        appointment.doctor._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

router.put('/:appointmentId/cancel', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this appointment' });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Cannot cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Remove appointment from doctor's appointments array
    const doctor = await Doctor.findById(appointment.doctor);
    if (doctor.appointments) {
      doctor.appointments = doctor.appointments.filter(
        apptId => apptId.toString() !== appointment._id.toString()
      );
      await doctor.save();
    }

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

router.put('/:appointmentId/complete', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.userType !== 'doctor' || appointment.doctor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the assigned doctor can complete this appointment' });
    }

    appointment.status = 'completed';
    appointment.notes = req.body.notes;
    
    if (appointment.paymentMethod === 'cash' && req.body.paymentReceived) {
      appointment.paymentStatus = 'completed';
      appointment.paymentDetails = {
        amount: req.body.amount,
        paidAt: new Date()
      };
    }

    await appointment.save();

    res.json({
      message: 'Appointment completed successfully',
      appointment
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ message: 'Error completing appointment' });
  }
});

// Get all appointments for a user
router.get('/user/all', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching appointments for user:', req.userId);
    
    const appointments = await Appointment.find({ user: req.userId })
      .populate('doctor', 'fullName specialization clinicAddress contactNumber consultationFee')
      .populate('diagnosisQuestionnaire')
      .sort({ appointmentDate: -1 });

    console.log('Found appointments:', appointments.length);
    console.log('Appointments data:', appointments.map(apt => ({
      id: apt._id,
      date: apt.appointmentDate,
      doctor: apt.doctor?.fullName,
      pet: apt.pet?.name,
      status: apt.status
    })));
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      details: error.message
    });
  }
});

module.exports = router;