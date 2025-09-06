import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointment } from '../contexts/AppointmentContext';
import { 
  CalendarDaysIcon, 
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const { appointments, fetchUserAppointments, cancelAppointment, loading } = useAppointment();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
    }
  }, [user]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointmentId);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return new Date(appointment.appointmentDate) > new Date() && appointment.status === 'scheduled';
    }
    if (filter === 'past') {
      return new Date(appointment.appointmentDate) < new Date() || appointment.status === 'completed';
    }
    return appointment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">
            View and manage your veterinary appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Appointments</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'past', label: 'Past' },
                { key: 'scheduled', label: 'Scheduled' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't booked any appointments yet."
                : `No ${filter} appointments found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Dr. {appointment.doctor?.fullName || 'Unknown Doctor'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.doctor?.specialization || 'Veterinarian'}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {appointment.timeSlot}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {appointment.doctor?.clinicAddress?.location || 'Clinic address not available'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {appointment.doctor?.contactNumber || 'Contact not available'}
                    </div>
                  </div>

                  {/* Pet Information */}
                  {appointment.pet && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Pet Information</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{appointment.pet.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium">{appointment.pet.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Breed:</span>
                          <span className="ml-2 font-medium">{appointment.pet.breed || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Age:</span>
                          <span className="ml-2 font-medium">{appointment.pet.age} years</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  {appointment.reason && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Reason for visit:</h4>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Appointment ID: {appointment.appointmentId || appointment._id.slice(-8)}
                    </div>
                    <div className="flex space-x-3">
                      {appointment.status === 'scheduled' && new Date(appointment.appointmentDate) > new Date() && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                      )}
                      {appointment.diagnosisQuestionnaire && (
                        <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-green-700 bg-green-50">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Pre-consultation completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;