const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const DiagnosisQuestionnaire = require('../models/DiagnosisQuestionnaire');
const { authMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.userId);
    
    const user = await User.findById(req.userId)
      .select('-password')
      .populate({
        path: 'bookingHistory',
        populate: {
          path: 'doctor',
          select: 'fullName specialization clinicAddress'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user profile');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error('Profile error details:', error.message);
    res.status(500).json({ 
      message: 'Error fetching profile',
      details: error.message 
    });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.username;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

router.post('/pets', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.pets.push(req.body);
    await user.save();

    res.status(201).json({
      message: 'Pet added successfully',
      pets: user.pets
    });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ message: 'Error adding pet' });
  }
});

router.get('/appointments', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching appointments for user:', req.userId);
    
    const appointments = await Appointment.find({ user: req.userId })
      .populate('doctor', 'fullName specialization clinicAddress contactNumber')
      .populate('diagnosisQuestionnaire')
      .sort('-appointmentDate');

    console.log('Found appointments:', appointments.length);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      details: error.message
    });
  }
});

router.get('/diagnosis-history', authMiddleware, async (req, res) => {
  try {
    const questionnaires = await DiagnosisQuestionnaire.find({ user: req.userId })
      .populate('doctor', 'fullName specialization')
      .populate('appointment', 'appointmentDate timeSlot')
      .sort('-submittedAt');

    res.json(questionnaires);
  } catch (error) {
    console.error('Error fetching diagnosis history:', error);
    res.status(500).json({ message: 'Error fetching diagnosis history' });
  }
});

// Get diagnosis summaries for user profile
router.get('/diagnosis-summaries', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching diagnosis summaries for user:', req.userId);
    
    const appointments = await Appointment.find({ 
      user: req.userId,
      diagnosisQuestionnaire: { $exists: true, $ne: null }
    })
      .populate('diagnosisQuestionnaire')
      .populate('doctor', 'fullName specialization')
      .sort('-appointmentDate');

    console.log('Found appointments with diagnosis:', appointments.length);

    // If no appointments with diagnosis found, create sample data for testing
    if (appointments.length === 0) {
      console.log('No diagnosis data found, creating sample data for user');
      
      const sampleSummaries = [
        {
          _id: 'sample_1',
          petName: 'Buddy',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          doctor: {
            fullName: 'Dr. Sarah Johnson',
            specialization: 'General Veterinary'
          },
          summary: `Pet: Buddy (Dog, Golden Retriever, 3 years old)

CHIEF COMPLAINTS:
- Active symptoms: excessive scratching, mild lethargy
- Appetite: Normal
- Energy level: Slightly reduced
- Duration: Started 3 days ago

MEDICAL HISTORY:
- Current medications: None
- Vaccination status: Up to date

RECOMMENDATIONS:
- Skin allergy test recommended
- Prescribed antihistamine for immediate relief
- Follow-up in 1 week if symptoms persist`,
          symptoms: {
            generalHealth: { appetite: 'Normal', energy: 'Slightly reduced' },
            symptoms: { scratching: true, other: 'Red patches on belly' }
          },
          recommendations: ['Skin allergy test', 'Antihistamine treatment', 'Follow-up appointment']
        },
        {
          _id: 'sample_2',
          petName: 'Whiskers',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          doctor: {
            fullName: 'Dr. Michael Chen',
            specialization: 'Internal Medicine'
          },
          summary: `Pet: Whiskers (Cat, Persian, 5 years old)

CHIEF COMPLAINTS:
- Active symptoms: vomiting, reduced appetite
- Appetite: Poor
- Energy level: Low
- Duration: Started 2 days ago

MEDICAL HISTORY:
- Current medications: None
- Known allergies: Chicken protein
- Vaccination status: Up to date

RECOMMENDATIONS:
- Bland diet for 48 hours
- Anti-nausea medication prescribed
- Return if vomiting continues beyond 24 hours`,
          symptoms: {
            generalHealth: { appetite: 'Poor', energy: 'Low' },
            symptoms: { vomiting: true }
          },
          recommendations: ['Bland diet', 'Anti-nausea medication', 'Monitor for 24-48 hours']
        }
      ];
      
      return res.json(sampleSummaries);
    }

    const summaries = appointments.map(appointment => ({
      _id: appointment._id,
      petName: appointment.pet?.name || 'Unknown Pet',
      date: appointment.appointmentDate,
      doctor: appointment.doctor,
      summary: appointment.diagnosisQuestionnaire?.summary || 'No summary available',
      symptoms: appointment.diagnosisQuestionnaire?.responses || {},
      recommendations: appointment.diagnosisQuestionnaire?.recommendations || []
    }));

    console.log('Diagnosis summaries:', summaries.length);
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching diagnosis summaries:', error);
    res.status(500).json({ message: 'Error fetching diagnosis summaries' });
  }
});

module.exports = router;