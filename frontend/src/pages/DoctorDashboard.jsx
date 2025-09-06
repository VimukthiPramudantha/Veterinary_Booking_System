import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppointment } from '../contexts/AppointmentContext';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  HeartIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  UserCircleIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, fetchDoctorAppointments, loading } = useAppointment();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });

  useEffect(() => {
    if (user) {
      fetchDoctorAppointments();
    }
  }, [user]);

  useEffect(() => {
    if (appointments.length > 0) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const todayApts = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate < tomorrow && apt.status === 'scheduled';
      }).length;

      const upcoming = appointments.filter(apt => 
        new Date(apt.appointmentDate) > now && apt.status === 'scheduled'
      ).length;
      
      const completed = appointments.filter(apt => apt.status === 'completed').length;

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayApts,
        upcomingAppointments: upcoming,
        completedAppointments: completed
      });
    }
  }, [appointments]);

  const todayAppointments = appointments.filter(apt => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= today && aptDate < tomorrow;
  }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const upcomingAppointments = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.appointmentDate);
    return aptDate > now && apt.status === 'scheduled';
  }).slice(0, 5);

  const allAppointments = appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const tabs = [
    { id: 'overview', name: 'Overview', icon: CalendarDaysIcon },
    { id: 'appointments', name: 'All Appointments', icon: ClipboardDocumentCheckIcon },
    { id: 'profile', name: 'My Profile', icon: UserCircleIcon }
  ];

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 rounded-full shadow-lg">
              <HeartIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Welcome, Dr. {user?.fullName}!
              </h1>
              <p className="text-lg text-gray-600 flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {user?.specialization}
                </span>
                <span>•</span>
                <span>{user?.clinicAddress?.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-yellow-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full">
                <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 bg-primary-50 rounded-t-lg'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Appointments */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Today's Schedule
                  </h3>

                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h4 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h4>
                      <p className="mt-1 text-sm text-gray-500">Enjoy your free day!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-primary-100 to-primary-200 p-2 rounded-full">
                                <HeartIcon className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {appointment.user?.fullName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  🐾 {appointment.pet?.name} ({appointment.pet?.type})
                                </p>
                                <p className="text-xs text-gray-500">
                                  📋 {appointment.reason}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                ⏰ {appointment.timeSlot}
                              </p>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === 'scheduled' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-2 text-purple-600" />
                    Upcoming Appointments
                  </h3>

                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h4 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h4>
                      <p className="mt-1 text-sm text-gray-500">Your schedule is clear for the coming days.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-2 rounded-full">
                                <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {appointment.user?.fullName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  🐾 {appointment.pet?.name} ({appointment.pet?.type})
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                📅 {new Date(appointment.appointmentDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                ⏰ {appointment.timeSlot}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Appointments Tab with Diagnosis Summaries */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
                    Appointments & Diagnosis Summaries
                  </h3>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {allAppointments.length} total appointment{allAppointments.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {allAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                      <ClipboardDocumentCheckIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h4>
                    <p className="text-gray-500">Your appointment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {allAppointments.map((appointment) => (
                      <div key={appointment._id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-primary-200 transition-all duration-300">
                        {/* Appointment Header */}
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-full">
                                <UserCircleIcon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{appointment.user?.fullName}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    🐾 {appointment.pet?.name} ({appointment.pet?.type})
                                  </span>
                                  <span className="flex items-center">
                                    📅 {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span className="flex items-center">
                                    ⏰ {appointment.timeSlot}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === 'scheduled' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status === 'scheduled' && '⏳ '}
                                {appointment.status === 'completed' && '✅ '}
                                {appointment.status === 'cancelled' && '❌ '}
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                💰 LKR {user?.consultationFee}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Patient Information */}
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
                              <h5 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                <HeartIcon className="h-4 w-4 mr-2 text-primary-600" />
                                Patient Information
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Pet Name:</span>
                                  <span className="font-medium text-gray-900">{appointment.pet?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Type & Breed:</span>
                                  <span className="font-medium text-gray-900">{appointment.pet?.type} • {appointment.pet?.breed}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Age:</span>
                                  <span className="font-medium text-gray-900">{appointment.pet?.age} years</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Owner:</span>
                                  <span className="font-medium text-gray-900">{appointment.user?.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Contact:</span>
                                  <span className="font-medium text-gray-900">{appointment.user?.contactNumber}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reason for Visit</p>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                                  {appointment.reason}
                                </p>
                              </div>
                            </div>

                            {/* Diagnosis Summary */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                              <h5 className="flex items-center text-sm font-semibold text-blue-700 mb-3 uppercase tracking-wide">
                                <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                                Diagnosis Summary
                              </h5>
                              
                              {appointment.diagnosisQuestionnaire ? (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                    {appointment.diagnosisQuestionnaire.summary || 'No diagnosis summary available'}
                                  </div>
                                  
                                  {appointment.diagnosisQuestionnaire.urgencyLevel && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        appointment.diagnosisQuestionnaire.urgencyLevel === 'high' ? 'bg-red-100 text-red-800' :
                                        appointment.diagnosisQuestionnaire.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {appointment.diagnosisQuestionnaire.urgencyLevel === 'high' && '🚨 '}
                                        {appointment.diagnosisQuestionnaire.urgencyLevel === 'medium' && '⚠️ '}
                                        {appointment.diagnosisQuestionnaire.urgencyLevel === 'low' && '✅ '}
                                        {appointment.diagnosisQuestionnaire.urgencyLevel.charAt(0).toUpperCase() + 
                                         appointment.diagnosisQuestionnaire.urgencyLevel.slice(1)} Priority
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                  <DocumentTextIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500">No diagnosis questionnaire submitted</p>
                                  <p className="text-xs text-gray-400 mt-1">Patient didn't fill out pre-visit form</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {appointment.status === 'scheduled' && (
                            <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                              <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105">
                                ✅ Mark as Completed
                              </button>
                              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
                                📝 Add Notes
                              </button>
                              <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200">
                                👁️ View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
                    <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  Doctor Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Specialization</dt>
                    <dd className="mt-2 text-lg font-semibold text-primary-600">{user?.specialization}</dd>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Experience</dt>
                    <dd className="mt-2 text-lg font-semibold text-green-600">{user?.experience} years</dd>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Consultation Fee</dt>
                    <dd className="mt-2 text-lg font-semibold text-amber-600">LKR {user?.consultationFee?.toLocaleString()}</dd>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contact</dt>
                    <dd className="mt-2 text-lg font-semibold text-blue-600">{user?.contactNumber}</dd>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</dt>
                    <dd className="mt-2 text-lg font-semibold text-purple-600">{user?.email}</dd>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Clinic Location</dt>
                    <dd className="mt-2 text-lg font-semibold text-pink-600">{user?.clinicAddress?.location}</dd>
                  </div>
                </div>
                
                {user?.qualifications && user.qualifications.length > 0 && (
                  <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Qualifications</dt>
                    <dd className="text-sm text-gray-700 leading-relaxed">
                      {user.qualifications.join(' • ')}
                    </dd>
                  </div>
                )}

                {user?.workingHours && (
                  <div className="mt-6 bg-white p-6 rounded-xl border border-gray-100">
                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Working Hours</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      🕐 {user.workingHours.startTime} - {user.workingHours.endTime}
                      <span className="text-sm text-gray-600 ml-2">
                        ({user.workingHours.slotDuration} min slots)
                      </span>
                    </dd>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;