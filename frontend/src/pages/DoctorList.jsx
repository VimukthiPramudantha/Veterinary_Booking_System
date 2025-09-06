import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppointment } from '../contexts/AppointmentContext';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorList = () => {
  const { doctors, fetchDoctors, loading } = useAppointment();
  const [filters, setFilters] = useState({
    location: '',
    specialization: '',
    availableTime: '',
    date: ''
  });

  const locations = [
    'Battaramulla', 'Colombo', 'Nugegoda', 
    'Dehiwala', 'Rajagiriya', 'Malabe'
  ];

  const specializations = [
    'General Veterinary', 'Surgery', 'Dentistry', 
    'Dermatology', 'Internal Medicine', 'Emergency Care'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  useEffect(() => {
    fetchDoctors(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      specialization: '',
      availableTime: '',
      date: ''
    });
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Veterinarians</h1>
          <p className="mt-2 text-gray-600">
            Book appointments with qualified veterinarians near you
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-gradient-to-r from-white to-blue-50 p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Doctors
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="transform transition-all duration-200 hover:scale-105">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="transform transition-all duration-200 hover:scale-105">
              <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                🏥 Specialization
              </label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="transform transition-all duration-200 hover:scale-105">
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                min={today}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
              />
            </div>

            <div className="transform transition-all duration-200 hover:scale-105">
              <label htmlFor="availableTime" className="block text-sm font-semibold text-gray-700 mb-2">
                ⏰ Available Time
              </label>
              <select
                id="availableTime"
                name="availableTime"
                value={filters.availableTime}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300"
              >
                <option value="">Any Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🔄 Clear All
              </button>
            </div>
          </div>

          {/* Filter Status Indicator */}
          {(filters.location || filters.specialization || filters.availableTime || filters.date) && (
            <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
              <p className="text-sm text-primary-800 font-medium">
                🔍 Active filters: 
                {filters.location && ` Location: ${filters.location}`}
                {filters.specialization && ` | Specialization: ${filters.specialization}`}
                {filters.date && ` | Date: ${new Date(filters.date).toLocaleDateString()}`}
                {filters.availableTime && ` | Time: ${filters.availableTime}`}
              </p>
            </div>
          )}
        </div>

        {/* Doctor Cards */}
        {doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
              <UserGroupIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {(filters.location || filters.specialization || filters.availableTime || filters.date) 
                ? "Try adjusting your filters to find more veterinarians that match your criteria."
                : "No veterinarians are currently available. Please try again later."}
            </p>
            {(filters.location || filters.specialization || filters.availableTime || filters.date) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters & Show All
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Found <span className="font-semibold text-primary-600">{doctors.length}</span> veterinarian{doctors.length !== 1 ? 's' : ''}
                {(filters.location || filters.specialization || filters.availableTime || filters.date) && " matching your criteria"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  {/* Doctor Header */}
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-full shadow-lg">
                        <UserGroupIcon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          Dr. {doctor.fullName}
                        </h3>
                        <p className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full inline-block mt-1">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg mr-3">
                          <MapPinIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{doctor.clinicAddress?.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-2 rounded-lg mr-3">
                          <CurrencyDollarIcon className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="font-medium">LKR {doctor.consultationFee?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-2 rounded-lg mr-3">
                          <StarIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{doctor.experience} years experience</span>
                      </div>

                      {doctor.workingHours && (
                        <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="font-medium">
                            {doctor.workingHours.startTime} - {doctor.workingHours.endTime}
                          </span>
                        </div>
                      )}
                    </div>

                    {doctor.qualifications && doctor.qualifications.length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Qualifications</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {doctor.qualifications.slice(0, 2).join(', ')}
                          {doctor.qualifications.length > 2 && (
                            <span className="text-primary-600 ml-1">+{doctor.qualifications.length - 2} more</span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/book-appointment/${doctor._id}`}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        📅 Book Appointment
                      </Link>
                      <button className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 transform hover:scale-105 active:scale-95">
                        👁️ View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;