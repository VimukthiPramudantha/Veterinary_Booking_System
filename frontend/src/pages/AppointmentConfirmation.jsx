import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CalendarDaysIcon, PrinterIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AppointmentConfirmation = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the confirmed appointment from sessionStorage
    const confirmedAppointment = sessionStorage.getItem('confirmedAppointment');
    
    if (confirmedAppointment) {
      setAppointment(JSON.parse(confirmedAppointment));
    } else {
      // If no appointment data, redirect to dashboard
      navigate('/dashboard');
    }
    
    setLoading(false);
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentStatusText = (paymentMethod, paymentStatus) => {
    if (paymentMethod === 'cash') {
      return 'Pay at Clinic';
    }
    return paymentStatus === 'completed' ? 'Paid' : 'Pending Payment';
  };

  const getPaymentStatusColor = (paymentMethod, paymentStatus) => {
    if (paymentMethod === 'cash') {
      return 'text-blue-600';
    }
    return paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Appointment Confirmed!
          </h1>
          <p className="mt-2 text-gray-600">
            Your appointment has been successfully booked.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Appointment ID: {appointment.appointmentId}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Appointment Details
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                <dd className="text-base text-gray-900">
                  Dr. {appointment.doctor?.fullName || 'Unknown'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                <dd className="text-base text-gray-900">
                  {appointment.doctor?.specialization || 'General Veterinary'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="text-base text-gray-900">
                  {formatDate(appointment.appointmentDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Time</dt>
                <dd className="text-base text-gray-900">
                  {appointment.timeSlot}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Pet</dt>
                <dd className="text-base text-gray-900">
                  {appointment.pet?.name} ({appointment.pet?.type})
                  {appointment.pet?.breed && ` • ${appointment.pet.breed}`}
                  {appointment.pet?.age && ` • ${appointment.pet.age} years`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd className={`text-base ${getPaymentStatusColor(appointment.paymentMethod, appointment.paymentStatus)}`}>
                  {getPaymentStatusText(appointment.paymentMethod, appointment.paymentStatus)}
                </dd>
              </div>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Reason for Visit</dt>
              <dd className="text-base text-gray-900">
                {appointment.reason || 'General consultation'}
              </dd>
            </div>

            {appointment.doctor?.clinicAddress && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Clinic Address</dt>
                <dd className="text-base text-gray-900">
                  {appointment.doctor.clinicAddress.street && (
                    <>
                      {appointment.doctor.clinicAddress.street}<br />
                    </>
                  )}
                  {appointment.doctor.clinicAddress.city && (
                    <>
                      {appointment.doctor.clinicAddress.city}, 
                    </>
                  )}
                  {appointment.doctor.clinicAddress.location}
                  <br />
                  Sri Lanka
                </dd>
              </div>
            )}

            {appointment.doctor?.contactNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Clinic Contact</dt>
                <dd className="text-base text-gray-900">
                  {appointment.doctor.contactNumber}
                </dd>
              </div>
            )}

            {appointment.doctor?.consultationFee && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Consultation Fee</dt>
                <dd className="text-base text-gray-900">
                  LKR {appointment.doctor.consultationFee}
                </dd>
              </div>
            )}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please arrive 10 minutes before your appointment time</li>
              <li>• Bring any previous medical records or medications</li>
              <li>• Contact the clinic if you need to reschedule</li>
              {appointment.paymentMethod === 'cash' && (
                <li>• Remember to bring cash for payment at the clinic</li>
              )}
              {appointment.diagnosisQuestionnaire && (
                <li>• Your pre-visit health assessment has been shared with the doctor</li>
              )}
            </ul>
          </div>

          <div className="mt-8 flex space-x-4">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Details
            </button>
            <Link
              to="/dashboard"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 flex items-center justify-center transition-colors duration-200"
            >
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              View All Appointments
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/doctors"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Book Another Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;