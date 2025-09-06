import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../contexts/AppointmentContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCardIcon, 
  BanknotesIcon,
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CardPaymentForm from '../components/common/CardPaymentForm';
import api from '../utils/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookAppointment, fetchDoctorDetails } = useAppointment();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Get data from sessionStorage
      const booking = sessionStorage.getItem('bookingData');
      const diagnosis = sessionStorage.getItem('diagnosisResponses');
      
      if (booking) {
        const parsedBooking = JSON.parse(booking);
        setBookingData(parsedBooking);
        
        // Fetch doctor details to get consultation fee
        if (parsedBooking.doctorId) {
          try {
            const doctor = await fetchDoctorDetails(parsedBooking.doctorId);
            setDoctorData(doctor);
          } catch (error) {
            console.error('Error fetching doctor details:', error);
          }
        }
      } else {
        navigate('/doctors');
      }
      
      if (diagnosis) {
        setDiagnosisData(JSON.parse(diagnosis));
      }
      
      // Load saved cards
      loadSavedCards();
    };

    loadData();
  }, [navigate]);
  
  const loadSavedCards = async () => {
    try {
      const response = await api.get('/payments/saved-cards');
      setSavedCards(response.data || []);
    } catch (error) {
      console.error('Error loading saved cards:', error);
      setSavedCards([]);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'card') {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const handleCardPaymentComplete = async (paymentData) => {
    setLoading(true);
    
    try {
      // Prepare appointment data
      const appointmentData = {
        ...bookingData,
        paymentMethod: 'card',
        paymentData,
        diagnosisData
      };

      // Book the appointment
      const result = await bookAppointment(appointmentData);
      
      if (result.success) {
        // Store the appointment for confirmation page
        sessionStorage.setItem('confirmedAppointment', JSON.stringify(result.appointment));
        
        // Clear temporary data
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('diagnosisResponses');
        
        navigate('/confirmation');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveCard = async (cardData) => {
    try {
      const response = await api.post('/payments/save-card', {
        ...cardData,
        lastFour: cardData.cardNumber.slice(-4)
      });
      
      if (response.data.success) {
        loadSavedCards(); // Reload saved cards
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleCashPayment = async () => {
    if (!bookingData) return;
    
    setLoading(true);
    
    try {
      // Prepare appointment data
      const appointmentData = {
        ...bookingData,
        paymentMethod: 'cash',
        diagnosisData
      };

      // Book the appointment
      const result = await bookAppointment(appointmentData);
      
      if (result.success) {
        // Store the appointment for confirmation page
        sessionStorage.setItem('confirmedAppointment', JSON.stringify(result.appointment));
        
        // Clear temporary data
        sessionStorage.removeItem('bookingData');
        sessionStorage.removeItem('diagnosisResponses');
        
        navigate('/confirmation');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slideIn">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-full shadow-lg">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Complete Payment
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure your appointment with our trusted payment system. Your pet's health journey starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods & Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method Selection */}
            {!showCardForm && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-scaleIn">
                <div className="flex items-center space-x-3 mb-8">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* Card Payment Option */}
                  <div
                    onClick={() => handlePaymentMethodSelect('card')}
                    className={`group relative overflow-hidden border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === 'card' 
                        ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-lg bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          paymentMethod === 'card' 
                            ? 'bg-primary-600' 
                            : 'bg-gray-100 group-hover:bg-primary-100'
                        }`}>
                          <CreditCardIcon className={`h-6 w-6 ${
                            paymentMethod === 'card' ? 'text-white' : 'text-gray-600 group-hover:text-primary-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Pay with Card</h3>
                          <p className="text-gray-600">
                            Secure online payment • Save for future use
                          </p>
                          {savedCards.length > 0 && (
                            <p className="text-sm text-primary-600 font-medium">
                              {savedCards.length} saved card{savedCards.length > 1 ? 's' : ''} available
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-2xl">💳</div>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Cash Payment Option */}
                  <div
                    onClick={() => handlePaymentMethodSelect('cash')}
                    className={`group relative overflow-hidden border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === 'cash' 
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg' 
                        : 'border-gray-200 hover:border-green-300 hover:shadow-lg bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          paymentMethod === 'cash' 
                            ? 'bg-green-600' 
                            : 'bg-gray-100 group-hover:bg-green-100'
                        }`}>
                          <BanknotesIcon className={`h-6 w-6 ${
                            paymentMethod === 'cash' ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Pay at Clinic</h3>
                          <p className="text-gray-600">
                            Pay with cash during your visit • No processing fees
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl">💵</div>
                    </div>
                    {paymentMethod === 'cash' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cash Payment Confirmation */}
                {paymentMethod === 'cash' && (
                  <div className="mt-8 animate-fadeInUp">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-2xl">ℹ️</div>
                        <h4 className="text-lg font-bold text-gray-900">Payment Instructions</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>Bring the exact amount: <strong>LKR {doctorData?.consultationFee}</strong></span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>Payment due upon arrival at the clinic</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>Please arrive 15 minutes early for check-in</span>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={handleCashPayment}
                      disabled={loading}
                      className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <LoadingSpinner size="small" />
                          <span>Confirming Appointment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <HeartIcon className="h-5 w-5" />
                          <span>Confirm Appointment</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Card Payment Form */}
            {showCardForm && paymentMethod === 'card' && (
              <div className="animate-scaleIn">
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setShowCardForm(false);
                      setPaymentMethod('');
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
                  >
                    <span>← Back to Payment Methods</span>
                  </button>
                </div>
                <CardPaymentForm
                  amount={doctorData?.consultationFee || 0}
                  onPaymentComplete={handleCardPaymentComplete}
                  onSaveCard={handleSaveCard}
                  existingCards={savedCards}
                />
              </div>
            )}
          </div>

          {/* Right Column - Appointment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8 animate-fadeInUp">
              <div className="flex items-center space-x-3 mb-6">
                <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Appointment Summary</h3>
              </div>

              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="bg-primary-600 p-2 rounded-full">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. {doctorData?.fullName}</p>
                    <p className="text-sm text-gray-600">{doctorData?.specialization}</p>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pet:</span>
                    <span className="font-semibold text-gray-900">
                      {bookingData?.pet?.name} ({bookingData?.pet?.type})
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-900">
                      {bookingData?.appointmentDate && new Date(bookingData.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-900 flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{bookingData?.timeSlot}</span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      LKR {doctorData?.consultationFee || '0'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">
                      LKR {doctorData?.consultationFee || '0'}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span className="font-semibold text-sm">Secure & Protected</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    SSL encrypted payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;