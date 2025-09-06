import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserGroupIcon, 
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    fullName: '',
    specialization: 'General Veterinary',
    experience: '',
    qualifications: '',
    contactNumber: '',
    clinicAddress: {
      street: '',
      city: 'Battaramulla'
    },
    consultationFee: '',
    workingHours: {
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30
    }
  });

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Error fetching doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        ...doctorForm,
        qualifications: doctorForm.qualifications.split(',').map(q => q.trim()).filter(q => q)
      };

      if (editingDoctor) {
        await api.put(`/admin/doctors/${editingDoctor._id}`, formData);
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/admin/doctors', formData);
        toast.success('Doctor created successfully');
      }

      setShowDoctorModal(false);
      setEditingDoctor(null);
      resetDoctorForm();
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      email: doctor.email,
      password: '',
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      experience: doctor.experience.toString(),
      qualifications: doctor.qualifications.join(', '),
      contactNumber: doctor.contactNumber,
      clinicAddress: {
        street: doctor.clinicAddress.street || '',
        city: doctor.clinicAddress.city || 'Battaramulla'
      },
      consultationFee: doctor.consultationFee.toString(),
      workingHours: {
        startTime: doctor.workingHours?.startTime || '09:00',
        endTime: doctor.workingHours?.endTime || '17:00',
        slotDuration: doctor.workingHours?.slotDuration || 30
      }
    });
    setShowDoctorModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await api.delete(`/admin/doctors/${doctorId}`);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting doctor');
    }
  };

  const handleToggleStatus = async (doctorId, currentStatus) => {
    try {
      await api.patch(`/admin/doctors/${doctorId}/status`, {
        isActive: !currentStatus
      });
      toast.success(`Doctor ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchDoctors();
    } catch (error) {
      toast.error('Error updating doctor status');
    }
  };

  const resetDoctorForm = () => {
    setDoctorForm({
      email: '',
      password: '',
      fullName: '',
      specialization: 'General Veterinary',
      experience: '',
      qualifications: '',
      contactNumber: '',
      clinicAddress: {
        street: '',
        city: 'Battaramulla'
      },
      consultationFee: '',
      workingHours: {
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30
      }
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: CalendarDaysIcon },
    { id: 'doctors', name: 'Doctors', icon: UserGroupIcon },
    { id: 'appointments', name: 'Appointments', icon: CalendarDaysIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.fullName}! Manage your veterinary clinic.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDoctors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Doctor Management</h2>
                  <button
                    onClick={() => {
                      resetDoctorForm();
                      setShowDoctorModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Doctor
                  </button>
                </div>

                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 rounded-lg">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {doctors.map((doctor) => (
                          <tr key={doctor._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                                <div className="text-sm text-gray-500">{doctor.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {doctor.specialization}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {doctor.workingHours ? 
                                `${doctor.workingHours.startTime} - ${doctor.workingHours.endTime}` : 
                                'Not set'
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              LKR {doctor.consultationFee}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                doctor.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {doctor.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditDoctor(doctor)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(doctor._id, doctor.isActive)}
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doctor._id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('doctors')}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-blue-600 font-medium">Manage Doctors</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-blue-600 font-medium">View Appointments</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-purple-900 mb-4">Recent Activity</h3>
                    <p className="text-purple-700">System running smoothly</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">All Appointments</h2>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment._id} className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {appointment.user?.fullName} → Dr. {appointment.doctor?.fullName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                            </p>
                            <p className="text-sm text-gray-600">Pet: {appointment.pet?.name}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.fullName}
                    onChange={(e) => setDoctorForm({...doctorForm, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {!editingDoctor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required={!editingDoctor}
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <select
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General Veterinary">General Veterinary</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Emergency Care">Emergency Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={doctorForm.contactNumber}
                    onChange={(e) => setDoctorForm({...doctorForm, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (LKR)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({...doctorForm, consultationFee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                <input
                  type="text"
                  value={doctorForm.clinicAddress.street}
                  onChange={(e) => setDoctorForm({
                    ...doctorForm, 
                    clinicAddress: {...doctorForm.clinicAddress, street: e.target.value}
                  })}
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Location: Battaramulla (Fixed)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <textarea
                  value={doctorForm.qualifications}
                  onChange={(e) => setDoctorForm({...doctorForm, qualifications: e.target.value})}
                  placeholder="Enter qualifications separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Working Hours</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={doctorForm.workingHours.startTime}
                      onChange={(e) => setDoctorForm({
                        ...doctorForm,
                        workingHours: {...doctorForm.workingHours, startTime: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={doctorForm.workingHours.endTime}
                      onChange={(e) => setDoctorForm({
                        ...doctorForm,
                        workingHours: {...doctorForm.workingHours, endTime: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Slot Duration (min)</label>
                    <select
                      value={doctorForm.workingHours.slotDuration}
                      onChange={(e) => setDoctorForm({
                        ...doctorForm,
                        workingHours: {...doctorForm.workingHours, slotDuration: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingDoctor ? 'Update Doctor' : 'Add Doctor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;