const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const DiagnosisQuestionnaire = require('../models/DiagnosisQuestionnaire');
const { authMiddleware, doctorAuthMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { location, specialization, availableTime, date } = req.query;
    
    let query = { isActive: true };
    
    if (location) {
      query['clinicAddress.location'] = location;
    }
    
    if (specialization) {
      query.specialization = specialization;
    }

    let doctors = await Doctor.find(query)
      .select('-password -appointments')
      .sort('fullName');

    // Filter by available time if specified
    if (availableTime && date) {
      const filteredDoctors = [];
      
      for (const doctor of doctors) {
        // Check if doctor works at the requested time
        if (doctor.workingHours && doctor.workingHours.startTime && doctor.workingHours.endTime) {
          const timeSlots = generateTimeSlots(
            doctor.workingHours.startTime,
            doctor.workingHours.endTime,
            doctor.workingHours.slotDuration || 30
          );
          
          // Check if the requested time is in doctor's working hours
          if (timeSlots.includes(availableTime)) {
            // Check if this time slot is not booked for the given date
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const existingAppointment = await Appointment.findOne({
              doctor: doctor._id,
              appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
              },
              timeSlot: availableTime,
              status: { $ne: 'cancelled' }
            });

            // If no appointment exists for this time slot, include the doctor
            if (!existingAppointment) {
              filteredDoctors.push(doctor);
            }
          }
        }
      }
      
      doctors = filteredDoctors;
    } else if (availableTime) {
      // Filter by working hours only (no specific date)
      const filteredDoctors = doctors.filter(doctor => {
        if (doctor.workingHours && doctor.workingHours.startTime && doctor.workingHours.endTime) {
          const timeSlots = generateTimeSlots(
            doctor.workingHours.startTime,
            doctor.workingHours.endTime,
            doctor.workingHours.slotDuration || 30
          );
          return timeSlots.includes(availableTime);
        }
        return false;
      });
      
      doctors = filteredDoctors;
    }

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

router.get('/:doctorId', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId)
      .select('-password -appointments');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor details' });
  }
});

// Helper function to generate time slots based on working hours
const generateTimeSlots = (startTime, endTime, slotDuration = 30) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    // Format time to 12-hour format
    const hour12 = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
    const ampm = currentHour < 12 ? 'AM' : 'PM';
    const formattedTime = `${String(hour12).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')} ${ampm}`;
    
    slots.push(formattedTime);
    
    // Add slot duration
    currentMinute += slotDuration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

router.get('/:doctorId/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Generate time slots based on doctor's working hours
    let timeSlots = [];
    if (doctor.workingHours && doctor.workingHours.startTime && doctor.workingHours.endTime) {
      timeSlots = generateTimeSlots(
        doctor.workingHours.startTime,
        doctor.workingHours.endTime,
        doctor.workingHours.slotDuration || 30
      );
    } else {
      // Fallback to default slots if working hours not set
      timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ];
    }

    // If date is provided, check for existing appointments
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Find appointments for this doctor on this date
      const appointments = await Appointment.find({
        doctor: req.params.doctorId,
        appointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: { $ne: 'cancelled' }
      });

      // Create availability map
      const bookedSlots = appointments.map(apt => apt.timeSlot);
      
      const availableSlots = timeSlots.map(time => ({
        time,
        isBooked: bookedSlots.includes(time)
      }));

      res.json(availableSlots);
    } else {
      // Return all slots as available if no date specified
      const availableSlots = timeSlots.map(time => ({
        time,
        isBooked: false
      }));
      
      res.json(availableSlots);
    }
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Error fetching available slots' });
  }
});

router.post('/:doctorId/slots', doctorAuthMiddleware, async (req, res) => {
  try {
    if (req.doctorId !== req.params.doctorId) {
      return res.status(403).json({ message: 'Unauthorized to modify these slots' });
    }

    const { date, slots } = req.body;
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const existingSlotIndex = doctor.availableSlots.findIndex(s => {
      const slotDate = new Date(s.date);
      const newDate = new Date(date);
      return slotDate.toDateString() === newDate.toDateString();
    });

    if (existingSlotIndex !== -1) {
      doctor.availableSlots[existingSlotIndex].slots = slots;
    } else {
      doctor.availableSlots.push({ date, slots });
    }

    await doctor.save();

    res.json({
      message: 'Slots updated successfully',
      availableSlots: doctor.availableSlots
    });
  } catch (error) {
    console.error('Error updating slots:', error);
    res.status(500).json({ message: 'Error updating slots' });
  }
});

router.get('/dashboard/appointments', doctorAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.doctorId })
      .populate('user', 'fullName contactNumber email')
      .populate('diagnosisQuestionnaire')
      .sort('appointmentDate');

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

router.get('/dashboard/profile', doctorAuthMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId)
      .select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.put('/dashboard/profile', doctorAuthMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.doctorId;

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctorId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;