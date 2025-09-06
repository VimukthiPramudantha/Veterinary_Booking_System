const express = require('express');
const router = express.Router();
const DiagnosisQuestionnaire = require('../models/DiagnosisQuestionnaire');
const { authMiddleware } = require('../middleware/auth');

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, responses, petInfo } = req.body;

    const questionnaire = new DiagnosisQuestionnaire({
      appointment: appointmentId,
      user: req.userId,
      doctor: req.body.doctorId,
      petInfo,
      responses,
      summary: ''
    });

    questionnaire.generateSummary();
    await questionnaire.save();

    res.status(201).json({
      message: 'Diagnosis questionnaire submitted successfully',
      questionnaire
    });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ message: 'Error submitting questionnaire' });
  }
});

router.get('/:questionnaireId', authMiddleware, async (req, res) => {
  try {
    const questionnaire = await DiagnosisQuestionnaire.findById(req.params.questionnaireId)
      .populate('appointment')
      .populate('doctor', 'fullName specialization')
      .populate('user', 'fullName email');

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    if (questionnaire.user._id.toString() !== req.userId && 
        questionnaire.doctor._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to view this questionnaire' });
    }

    res.json(questionnaire);
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    res.status(500).json({ message: 'Error fetching questionnaire' });
  }
});

router.get('/appointment/:appointmentId', authMiddleware, async (req, res) => {
  try {
    const questionnaire = await DiagnosisQuestionnaire.findOne({ 
      appointment: req.params.appointmentId 
    });

    if (!questionnaire) {
      return res.status(404).json({ message: 'No questionnaire found for this appointment' });
    }

    res.json(questionnaire);
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    res.status(500).json({ message: 'Error fetching questionnaire' });
  }
});

module.exports = router;