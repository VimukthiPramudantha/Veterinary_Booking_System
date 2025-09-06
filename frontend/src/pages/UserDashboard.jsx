import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointment } from '../contexts/AppointmentContext';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const { appointments, fetchUserAppointments, loading } = useAppointment();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
    }
  }, [user]);

  useEffect(() => {
    if (appointments.length > 0) {
      const now = new Date();
      const upcoming = appointments.filter(apt => 
        new Date(apt.appointmentDate) > now && apt.status === 'scheduled'
      ).length;
      const completed = appointments.filter(apt => apt.status === 'completed').length;

      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming,
        completedAppointments: completed
      });
    }
  }, [appointments]);

  const quickActions = [
    {
      name: 'Book Appointment',
      description: 'Find and book with a veterinarian',
      href: '/doctors',
      icon: CalendarDaysIcon,
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      name: 'View Doctors',
      description: 'Browse available veterinarians',
      href: '/doctors',
      icon: UserGroupIcon,
      color: 'bg-secondary-600 hover:bg-secondary-700'
    }
  ];

  const recentAppointments = appointments.slice(0, 3);

  if (loading && appointments.length === 0) {
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
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-full">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-gray-600">
                Manage your pet's healthcare appointments
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Appointments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalAppointments}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.upcomingAppointments}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.completedAppointments}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`${action.color} text-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-center">
                  <action.icon className="h-8 w-8 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{action.name}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Appointments
              </h3>
              <Link
                to="/appointments"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                View all
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by booking your first appointment.
                </p>
                <div className="mt-6">
                  <Link
                    to="/doctors"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Book Appointment
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <li key={appointment._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <HeartIcon className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.doctor?.fullName || 'Dr. Unknown'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {appointment.doctor?.specialization}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm text-gray-900">
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.timeSlot}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Pet Information Section */}
        {user?.pets && user.pets.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Your Pets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.pets.map((pet, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-secondary-100 p-2 rounded-full">
                        <HeartIcon className="h-5 w-5 text-secondary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {pet.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {pet.type} • {pet.breed} • {pet.age} years
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;