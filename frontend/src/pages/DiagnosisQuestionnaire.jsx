import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DiagnosisQuestionnaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    generalHealth: {
      appetite: '',
      energy: '',
      behavior: '',
      temperature: ''
    },
    symptoms: {
      vomiting: false,
      diarrhea: false,
      coughing: false,
      sneezing: false,
      limping: false,
      scratching: false,
      other: ''
    },
    behavioralChanges: {
      aggression: false,
      lethargy: false,
      hiding: false,
      excessiveBarking: false,
      other: ''
    },
    eatingDrinking: {
      appetiteChange: '',
      waterIntake: '',
      lastMeal: '',
      dietType: ''
    },
    physicalSymptoms: {
      swelling: '',
      discharge: '',
      wounds: '',
      parasites: ''
    },
    duration: {
      symptomsStarted: '',
      frequency: '',
      gettingWorse: false
    },
    medicalHistory: {
      previousConditions: '',
      currentMedications: '',
      allergies: '',
      lastVetVisit: '',
      vaccinated: false,
      vaccinationDate: ''
    }
  });

  useEffect(() => {
    const booking = sessionStorage.getItem('bookingData');
    if (booking) {
      setBookingData(JSON.parse(booking));
    } else {
      navigate('/doctors');
    }
  }, [navigate]);

  const steps = [
    { title: 'General Health', key: 'generalHealth' },
    { title: 'Symptoms', key: 'symptoms' },
    { title: 'Behavioral Changes', key: 'behavioralChanges' },
    { title: 'Eating & Drinking', key: 'eatingDrinking' },
    { title: 'Physical Symptoms', key: 'physicalSymptoms' },
    { title: 'Duration', key: 'duration' },
    { title: 'Medical History', key: 'medicalHistory' }
  ];

  const handleInputChange = (section, field, value) => {
    setResponses(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Store diagnosis responses
    sessionStorage.setItem('diagnosisResponses', JSON.stringify(responses));
    
    // Navigate to payment
    navigate('/payment');
  };

  const renderGeneralHealth = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How is your pet's appetite?
        </label>
        <select
          value={responses.generalHealth.appetite}
          onChange={(e) => handleInputChange('generalHealth', 'appetite', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Normal">Normal</option>
          <option value="Increased">Increased</option>
          <option value="Decreased">Decreased</option>
          <option value="No appetite">No appetite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How is your pet's energy level?
        </label>
        <select
          value={responses.generalHealth.energy}
          onChange={(e) => handleInputChange('generalHealth', 'energy', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Very High">Very High</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
          <option value="Very Low">Very Low</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How is your pet's behavior?
        </label>
        <select
          value={responses.generalHealth.behavior}
          onChange={(e) => handleInputChange('generalHealth', 'behavior', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Normal">Normal</option>
          <option value="More playful">More playful</option>
          <option value="Less active">Less active</option>
          <option value="Aggressive">Aggressive</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
      </div>
    </div>
  );

  const renderSymptoms = () => (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Select any symptoms your pet is experiencing:</p>
      
      {Object.keys(responses.symptoms).filter(key => key !== 'other').map(symptom => (
        <label key={symptom} className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={responses.symptoms[symptom]}
            onChange={(e) => handleInputChange('symptoms', symptom, e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700 capitalize">
            {symptom === 'vomiting' ? 'Vomiting' :
             symptom === 'diarrhea' ? 'Diarrhea' :
             symptom === 'coughing' ? 'Coughing' :
             symptom === 'sneezing' ? 'Sneezing' :
             symptom === 'limping' ? 'Limping' :
             symptom === 'scratching' ? 'Excessive scratching' : symptom}
          </span>
        </label>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other symptoms (please describe):
        </label>
        <textarea
          value={responses.symptoms.other}
          onChange={(e) => handleInputChange('symptoms', 'other', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe any other symptoms..."
        />
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Any previous health conditions?
        </label>
        <textarea
          value={responses.medicalHistory.previousConditions}
          onChange={(e) => handleInputChange('medicalHistory', 'previousConditions', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="List any previous conditions or surgeries..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current medications or supplements:
        </label>
        <textarea
          value={responses.medicalHistory.currentMedications}
          onChange={(e) => handleInputChange('medicalHistory', 'currentMedications', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="List current medications..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known allergies:
        </label>
        <input
          type="text"
          value={responses.medicalHistory.allergies}
          onChange={(e) => handleInputChange('medicalHistory', 'allergies', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Food, medication, or environmental allergies..."
        />
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={responses.medicalHistory.vaccinated}
            onChange={(e) => handleInputChange('medicalHistory', 'vaccinated', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Up to date with vaccinations</span>
        </label>
      </div>

      {responses.medicalHistory.vaccinated && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last vaccination date:
          </label>
          <input
            type="date"
            value={responses.medicalHistory.vaccinationDate}
            onChange={(e) => handleInputChange('medicalHistory', 'vaccinationDate', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      )}
    </div>
  );

  const renderBehavioralChanges = () => (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Has your pet shown any behavioral changes?</p>
      {Object.keys(responses.behavioralChanges).filter(key => key !== 'other').map(behavior => (
        <label key={behavior} className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={responses.behavioralChanges[behavior]}
            onChange={(e) => handleInputChange('behavioralChanges', behavior, e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700 capitalize">
            {behavior === 'excessiveBarking' ? 'Excessive barking/vocalization' : behavior}
          </span>
        </label>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Other behavioral changes:
        </label>
        <textarea
          value={responses.behavioralChanges.other}
          onChange={(e) => handleInputChange('behavioralChanges', 'other', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe any other behavioral changes..."
        />
      </div>
    </div>
  );

  const renderEatingDrinking = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How has your pet's appetite changed?
        </label>
        <select
          value={responses.eatingDrinking.appetiteChange}
          onChange={(e) => handleInputChange('eatingDrinking', 'appetiteChange', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="No change">No change</option>
          <option value="Eating more than usual">Eating more than usual</option>
          <option value="Eating less than usual">Eating less than usual</option>
          <option value="Not eating at all">Not eating at all</option>
          <option value="Only eating certain foods">Only eating certain foods</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How is your pet's water intake?
        </label>
        <select
          value={responses.eatingDrinking.waterIntake}
          onChange={(e) => handleInputChange('eatingDrinking', 'waterIntake', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Normal">Normal</option>
          <option value="Drinking more than usual">Drinking more than usual</option>
          <option value="Drinking less than usual">Drinking less than usual</option>
          <option value="Not drinking at all">Not drinking at all</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When was your pet's last meal?
        </label>
        <select
          value={responses.eatingDrinking.lastMeal}
          onChange={(e) => handleInputChange('eatingDrinking', 'lastMeal', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="2 days ago">2 days ago</option>
          <option value="3+ days ago">3+ days ago</option>
          <option value="Not sure">Not sure</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What type of diet does your pet usually have?
        </label>
        <select
          value={responses.eatingDrinking.dietType}
          onChange={(e) => handleInputChange('eatingDrinking', 'dietType', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Dry food only">Dry food only</option>
          <option value="Wet food only">Wet food only</option>
          <option value="Mixed (dry and wet)">Mixed (dry and wet)</option>
          <option value="Home-cooked meals">Home-cooked meals</option>
          <option value="Raw diet">Raw diet</option>
          <option value="Combination">Combination of above</option>
        </select>
      </div>
    </div>
  );

  const renderPhysicalSymptoms = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Have you noticed any swelling on your pet's body?
        </label>
        <textarea
          value={responses.physicalSymptoms.swelling}
          onChange={(e) => handleInputChange('physicalSymptoms', 'swelling', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe location and size of any swelling..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Any unusual discharge (eyes, ears, nose)?
        </label>
        <textarea
          value={responses.physicalSymptoms.discharge}
          onChange={(e) => handleInputChange('physicalSymptoms', 'discharge', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe any discharge and its color/consistency..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Any visible wounds or injuries?
        </label>
        <textarea
          value={responses.physicalSymptoms.wounds}
          onChange={(e) => handleInputChange('physicalSymptoms', 'wounds', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe location and appearance of wounds..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Have you noticed any parasites (fleas, ticks, worms)?
        </label>
        <textarea
          value={responses.physicalSymptoms.parasites}
          onChange={(e) => handleInputChange('physicalSymptoms', 'parasites', e.target.value)}
          rows={2}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe any parasites you've noticed..."
        />
      </div>
    </div>
  );

  const renderDuration = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When did the symptoms first start?
        </label>
        <select
          value={responses.duration.symptomsStarted}
          onChange={(e) => handleInputChange('duration', 'symptomsStarted', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="2-3 days ago">2-3 days ago</option>
          <option value="4-7 days ago">4-7 days ago</option>
          <option value="1-2 weeks ago">1-2 weeks ago</option>
          <option value="2-4 weeks ago">2-4 weeks ago</option>
          <option value="Over a month ago">Over a month ago</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How often do the symptoms occur?
        </label>
        <select
          value={responses.duration.frequency}
          onChange={(e) => handleInputChange('duration', 'frequency', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select option</option>
          <option value="Constantly">Constantly</option>
          <option value="Several times a day">Several times a day</option>
          <option value="Once a day">Once a day</option>
          <option value="Few times a week">Few times a week</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Only once">Only once</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={responses.duration.gettingWorse}
            onChange={(e) => handleInputChange('duration', 'gettingWorse', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">The symptoms are getting worse</span>
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderGeneralHealth();
      case 1: return renderSymptoms();
      case 2: return renderBehavioralChanges();
      case 3: return renderEatingDrinking();
      case 4: return renderPhysicalSymptoms();
      case 5: return renderDuration();
      case 6: return renderMedicalHistory();
      default: 
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">This section is coming soon...</p>
          </div>
        );
    }
  };

  if (!bookingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Pet Health Assessment</h1>
          <p className="mt-2 text-gray-600">
            Help us understand {bookingData.pet?.name}'s current health condition
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {steps[currentStep].title}
            </h2>
          </div>

          {renderCurrentStep()}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>Continue to Payment</>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiagnosisQuestionnaire;