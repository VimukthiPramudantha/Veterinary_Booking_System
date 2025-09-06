import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCircleIcon, 
  CreditCardIcon, 
  TrashIcon, 
  PlusIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../utils/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [diagnosisSummaries, setDiagnosisSummaries] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    contactNumber: user?.contactNumber || '',
    address: user?.address || { street: '', city: '', location: 'Battaramulla' }
  });

  useEffect(() => {
    if (activeTab === 'cards') {
      loadSavedCards();
    } else if (activeTab === 'appointments') {
      loadAppointments();
    } else if (activeTab === 'diagnosis') {
      loadDiagnosisSummaries();
    }
  }, [activeTab]);

  const loadSavedCards = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments/saved-cards');
      console.log('Saved cards response:', response.data);
      setSavedCards(response.data || []);
    } catch (error) {
      console.error('Error loading saved cards:', error);
      setSavedCards([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/user/all');
      console.log('Appointments response:', response.data);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDiagnosisSummaries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/diagnosis-summaries');
      console.log('Diagnosis summaries response:', response.data);
      setDiagnosisSummaries(response.data || []);
    } catch (error) {
      console.error('Error loading diagnosis summaries:', error);
      setDiagnosisSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await api.delete(`/payments/saved-cards/${cardId}`);
      loadSavedCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await api.put('/users/profile', profileData);
      setEditingProfile(false);
      // Show success message or reload user data
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'cards', name: 'Payment Methods', icon: CreditCardIcon },
    { id: 'appointments', name: 'Appointments', icon: CalendarDaysIcon },
    { id: 'diagnosis', name: 'Health Records', icon: DocumentTextIcon },
  ];

  const getCardIcon = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const formatAppointmentStatus = (status) => {
    const statusColors = {
      confirmed: 'text-green-600 bg-green-50 border-green-200',
      completed: 'text-blue-600 bg-blue-50 border-blue-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200',
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    };
    
    return statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slideIn">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-3 rounded-full shadow-lg">
              <UserCircleIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
          <p className="text-lg text-gray-600">Manage your account settings and view your health records</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 animate-fadeInUp">
          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 rounded-full">
              <UserCircleIcon className="h-16 w-16 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{user?.fullName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <PhoneIcon className="h-5 w-5" />
                  <span>{user?.contactNumber}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{user?.address?.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span className="font-semibold">Verified Account</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Member since 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeInUp">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>{editingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="text"
                      value={profileData.contactNumber}
                      onChange={(e) => setProfileData({...profileData, contactNumber: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={profileData.address.street}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          address: {...profileData.address, street: e.target.value}
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          address: {...profileData.address, city: e.target.value}
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                  >
                    {loading ? <LoadingSpinner size="small" /> : 'Update Profile'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600">Email Address</label>
                      <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600">Full Name</label>
                      <p className="text-lg font-medium text-gray-900">{user?.fullName}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600">Contact Number</label>
                      <p className="text-lg font-medium text-gray-900">{user?.contactNumber}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600">Location</label>
                      <p className="text-lg font-medium text-gray-900">{user?.address?.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Cards Tab */}
          {activeTab === 'cards' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Saved Payment Methods</h3>
                <div className="flex items-center space-x-2 text-green-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Secure & Encrypted</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="large" />
                  <p className="text-gray-600 mt-4">Loading saved cards...</p>
                </div>
              ) : savedCards.length > 0 ? (
                <div className="space-y-4">
                  {savedCards.map((card) => (
                    <div key={card.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{getCardIcon(card.cardType)}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">**** **** **** {card.lastFour}</h4>
                            <p className="text-gray-600">{card.cardholderName}</p>
                            <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No Saved Cards</h4>
                  <p className="text-gray-500">Save a card during your next appointment booking for faster checkout</p>
                </div>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="large" />
                  <p className="text-gray-600 mt-4">Loading appointments...</p>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Dr. {appointment.doctor?.fullName}
                            </h4>
                            <p className="text-gray-600">{appointment.doctor?.specialization}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${formatAppointmentStatus(appointment.status)}`}>
                          {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HeartIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.pet?.name} ({appointment.pet?.type})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">LKR {appointment.doctor?.consultationFee || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No Appointments</h4>
                  <p className="text-gray-500 mb-6">You haven't booked any appointments yet</p>
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Book Your First Appointment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'diagnosis' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-lg mr-3">
                    <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  </div>
                  Health Records & Diagnosis
                </h3>
                {diagnosisSummaries.length > 0 && (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {diagnosisSummaries.length} record{diagnosisSummaries.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="large" />
                  <p className="text-gray-600 mt-4">Loading health records...</p>
                </div>
              ) : diagnosisSummaries.length > 0 ? (
                <div className="space-y-6">
                  {diagnosisSummaries.map((record, index) => (
                    <div key={record._id || index} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-full">
                              <HeartIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{record.petName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <UserCircleIcon className="h-4 w-4 mr-1" />
                                  Dr. {record.doctor?.fullName}
                                </span>
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {new Date(record.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Complete
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {record.doctor?.specialization}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
                          <h5 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                            <DocumentTextIcon className="h-4 w-4 mr-2 text-primary-600" />
                            Diagnosis Summary
                          </h5>
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                            {record.summary}
                          </div>
                        </div>

                        {/* Recommendations Section */}
                        {record.recommendations && record.recommendations.length > 0 && (
                          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <h6 className="flex items-center text-sm font-semibold text-blue-700 mb-3 uppercase tracking-wide">
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recommendations
                            </h6>
                            <ul className="space-y-2">
                              {record.recommendations.map((recommendation, idx) => (
                                <li key={idx} className="flex items-start text-sm text-blue-800">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2"></span>
                                  {recommendation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Symptoms Overview */}
                        {record.symptoms && Object.keys(record.symptoms).length > 0 && (
                          <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                            <h6 className="flex items-center text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Recorded Symptoms
                            </h6>
                            <div className="grid grid-cols-2 gap-3 text-xs text-amber-800">
                              {record.symptoms.generalHealth && (
                                <>
                                  <div>
                                    <span className="font-medium">Appetite:</span> {record.symptoms.generalHealth.appetite}
                                  </div>
                                  <div>
                                    <span className="font-medium">Energy:</span> {record.symptoms.generalHealth.energy}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No Health Records Yet</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Your pet's health records and diagnosis summaries from veterinary visits will appear here
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 transform hover:scale-105">
                      📅 Book First Visit
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
                      📞 Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;