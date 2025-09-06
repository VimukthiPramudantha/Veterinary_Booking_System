import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppointment } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CalendarPicker from '../components/common/CalendarPicker';
import TimeSlotPicker from '../components/common/TimeSlotPicker';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedDoctor, 
    availableSlots, 
    fetchDoctorDetails, 
    fetchAvailableSlots,
    loading 
  } = useAppointment();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [petInfo, setPetInfo] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: ''
  });
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1); // 1: Select Time, 2: Pet Info, 3: Confirmation

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchAvailableSlots(doctorId, selectedDate);
    }
  }, [selectedDate, doctorId]);

  const handleDateChange = (dateString) => {
    setSelectedDate(dateString);
    setSelectedTime(''); // Reset selected time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePetInfoChange = (e) => {
    const { name, value } = e.target;
    setPetInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    } else if (step === 2 && petInfo.name && reason) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBooking = () => {
    // Navigate to diagnosis questionnaire
    const bookingData = {
      doctorId,
      appointmentDate: selectedDate,
      timeSlot: selectedTime,
      pet: petInfo,
      reason
    };
    
    // Store booking data in session storage temporarily
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/diagnosis-questionnaire');
  };

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  if (loading || !selectedDoctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-slideIn">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-3 rounded-full shadow-lg">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                Book Appointment
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Schedule your consultation with our expert veterinarians</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 glass animate-scaleIn">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Dr. {selectedDoctor.fullName}
                </h2>
                <p className="text-primary-600 font-semibold text-lg">{selectedDoctor.specialization}</p>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <span className="flex items-center">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {selectedDoctor.clinicAddress?.location}
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    LKR {selectedDoctor.consultationFee}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Working Hours Display */}
            {selectedDoctor.workingHours && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-indigo-700 font-semibold">
                    Available: {selectedDoctor.workingHours.startTime} - {selectedDoctor.workingHours.endTime}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg transform scale-110' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {stepNum}
                  {step >= stepNum && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full opacity-30 animate-ping"></div>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <span className={`block text-sm font-bold ${
                    step >= stepNum ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {stepNum === 1 && 'Select Time'}
                    {stepNum === 2 && 'Pet Info'}
                    {stepNum === 3 && 'Confirm'}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {stepNum === 1 && 'Choose date & time'}
                    {stepNum === 2 && 'Pet details'}
                    {stepNum === 3 && 'Review booking'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 md:w-16 h-1 ml-4 rounded-full transition-all duration-500 ${
                    step > stepNum 
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 shadow-sm' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="transition-all duration-500 animate-scaleIn">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent mb-2">
                  Select Date and Time
                </h3>
                <p className="text-gray-600">Choose your preferred appointment date and available time slot</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <CalendarPicker
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    workingHours={selectedDoctor.workingHours}
                  />
                </div>

                <div className="space-y-4">
                  <TimeSlotPicker
                    slots={availableSlots}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                    loading={loading}
                    workingHours={selectedDoctor.workingHours}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-scaleIn">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent mb-2">
                  Pet Information
                </h3>
                <p className="text-gray-600">Tell us about your beloved companion</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                  <label htmlFor="petName" className="block text-sm font-bold text-gray-700 mb-2">
                    Pet Name *
                  </label>
                  <input
                    id="petName"
                    name="name"
                    type="text"
                    required
                    value={petInfo.name}
                    onChange={handlePetInfoChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300"
                    placeholder="What's your pet's name?"
                  />
                </div>

                <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <label htmlFor="petType" className="block text-sm font-bold text-gray-700 mb-2">
                    Pet Type *
                  </label>
                  <select
                    id="petType"
                    name="type"
                    value={petInfo.type}
                    onChange={handlePetInfoChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300"
                  >
                    <option value="Dog">🐕 Dog</option>
                    <option value="Cat">🐱 Cat</option>
                    <option value="Bird">🐦 Bird</option>
                    <option value="Other">🐾 Other</option>
                  </select>
                </div>

                <div className="animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                  <label htmlFor="petBreed" className="block text-sm font-bold text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    id="petBreed"
                    name="breed"
                    type="text"
                    value={petInfo.breed}
                    onChange={handlePetInfoChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300"
                    placeholder="Breed (optional)"
                  />
                </div>

                <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <label htmlFor="petAge" className="block text-sm font-bold text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    id="petAge"
                    name="age"
                    type="number"
                    min="0"
                    value={petInfo.age}
                    onChange={handlePetInfoChange}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300"
                    placeholder="Age in years"
                  />
                </div>
              </div>

              <div className="mt-8 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-300 resize-none"
                  placeholder="Please describe your pet's symptoms or the reason for this visit..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-scaleIn">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent mb-2">
                  Confirm Appointment Details
                </h3>
                <p className="text-gray-600">Please review your appointment information</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                        Doctor
                      </h4>
                      <p className="text-xl font-semibold text-gray-900">Dr. {selectedDoctor.fullName}</p>
                      <p className="text-primary-600 font-medium">{selectedDoctor.specialization}</p>
                      <p className="text-gray-500 flex items-center mt-2">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {selectedDoctor.clinicAddress?.location}
                      </p>
                    </div>
                  </div>

                  <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 mr-2 text-green-600" />
                        Date & Time
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <CalendarDaysIcon className="h-5 w-5 mr-3 text-blue-500" />
                          <span className="text-lg font-semibold">
                            {new Date(selectedDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <ClockIcon className="h-5 w-5 mr-3 text-green-500" />
                          <span className="text-lg font-semibold">{selectedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">🐾 Pet Information</h4>
                      <p className="text-xl font-semibold text-gray-900">{petInfo.name}</p>
                      <p className="text-gray-600 mt-1">
                        {petInfo.type}
                        {petInfo.breed && ` • ${petInfo.breed}`}
                        {petInfo.age && ` • ${petInfo.age} years old`}
                      </p>
                    </div>
                  </div>

                  <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
                      <h4 className="font-bold mb-2">💰 Consultation Fee</h4>
                      <p className="text-3xl font-bold">LKR {selectedDoctor.consultationFee}</p>
                      <p className="text-green-100 text-sm mt-1">Payment on appointment</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      📝 Reason for Visit
                    </h4>
                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg">{reason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center animate-fadeInUp">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="group px-8 py-4 border-2 border-gray-300 rounded-xl text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <span>← Back</span>
            </span>
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!selectedDate || !selectedTime)) ||
                (step === 2 && (!petInfo.name || !reason))
              }
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center space-x-2">
                <span>Next</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          ) : (
            <button
              onClick={handleBooking}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Continue to Health Assessment</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;