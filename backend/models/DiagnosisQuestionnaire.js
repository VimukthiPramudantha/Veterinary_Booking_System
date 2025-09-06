const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
  question: String,
  answer: String,
  category: {
    type: String,
    enum: ['general_health', 'behavioral', 'eating_drinking', 'physical_symptoms', 'duration', 'medical_history']
  }
});

// Explicitly define pet info schema
const petInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: String,
  age: String,
  weight: Number
}, { _id: false });

const diagnosisQuestionnaireSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
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
  petInfo: petInfoSchema,
  responses: {
    generalHealth: {
      appetite: String,
      energy: String,
      behavior: String,
      temperature: String
    },
    symptoms: {
      vomiting: Boolean,
      diarrhea: Boolean,
      coughing: Boolean,
      sneezing: Boolean,
      limping: Boolean,
      scratching: Boolean,
      other: String
    },
    behavioralChanges: {
      aggression: Boolean,
      lethargy: Boolean,
      hiding: Boolean,
      excessiveBarking: Boolean,
      other: String
    },
    eatingDrinking: {
      appetiteChange: String,
      waterIntake: String,
      lastMeal: String,
      dietType: String
    },
    physicalSymptoms: {
      swelling: String,
      discharge: String,
      wounds: String,
      parasites: String
    },
    duration: {
      symptomsStarted: String,
      frequency: String,
      gettingWorse: Boolean
    },
    medicalHistory: {
      previousConditions: String,
      currentMedications: String,
      allergies: String,
      lastVetVisit: String,
      vaccinated: Boolean,
      vaccinationDate: Date
    }
  },
  summary: {
    type: String,
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

diagnosisQuestionnaireSchema.methods.generateSummary = function() {
  const { responses } = this;
  
  if (!this.petInfo) {
    this.summary = 'Pet information not available';
    return;
  }
  
  let summary = `Pet: ${this.petInfo.name || 'Unknown'} (${this.petInfo.type || 'Unknown'}, ${this.petInfo.breed || 'Unknown'}, ${this.petInfo.age || 'Unknown'} years old)\n\n`;
  
  summary += 'CHIEF COMPLAINTS:\n';
  
  if (!responses) {
    this.summary = summary + 'No diagnosis responses available';
    return;
  }
  
  const symptoms = [];
  if (responses.symptoms && responses.symptoms.vomiting) symptoms.push('vomiting');
  if (responses.symptoms && responses.symptoms.diarrhea) symptoms.push('diarrhea');
  if (responses.symptoms && responses.symptoms.coughing) symptoms.push('coughing');
  if (responses.symptoms && responses.symptoms.sneezing) symptoms.push('sneezing');
  if (responses.symptoms && responses.symptoms.limping) symptoms.push('limping');
  if (responses.symptoms && responses.symptoms.scratching) symptoms.push('excessive scratching');
  if (responses.symptoms && responses.symptoms.other) symptoms.push(responses.symptoms.other);
  
  if (symptoms.length > 0) {
    summary += `- Active symptoms: ${symptoms.join(', ')}\n`;
  }
  
  summary += `- Appetite: ${responses.generalHealth?.appetite || 'Unknown'}\n`;
  summary += `- Energy level: ${responses.generalHealth?.energy || 'Unknown'}\n`;
  summary += `- Duration: ${responses.duration?.symptomsStarted || 'Unknown'}\n`;
  
  if (responses.duration && responses.duration.gettingWorse) {
    summary += '- Condition is worsening\n';
  }
  
  summary += '\nMEDICAL HISTORY:\n';
  if (responses.medicalHistory && responses.medicalHistory.currentMedications) {
    summary += `- Current medications: ${responses.medicalHistory.currentMedications}\n`;
  }
  if (responses.medicalHistory && responses.medicalHistory.allergies) {
    summary += `- Known allergies: ${responses.medicalHistory.allergies}\n`;
  }
  summary += `- Vaccination status: ${responses.medicalHistory?.vaccinated ? 'Up to date' : 'Not up to date'}\n`;
  
  let urgency = 'medium';
  if (responses.symptoms?.vomiting && responses.symptoms?.diarrhea && responses.duration?.gettingWorse) {
    urgency = 'high';
  }
  if (responses.generalHealth?.energy === 'Very Low' && responses.generalHealth?.appetite === 'No appetite') {
    urgency = 'high';
  }
  
  this.urgencyLevel = urgency;
  this.summary = summary;
  
  return summary;
};

module.exports = mongoose.model('DiagnosisQuestionnaire', diagnosisQuestionnaireSchema);