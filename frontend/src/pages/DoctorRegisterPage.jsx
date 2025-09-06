import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HeartIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorRegisterPage = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialization: 'General Veterinary',
    experience: '',
    qualifications: '',
    contactNumber: '',
    consultationFee: '',
    clinicAddress: {
      street: '',
      city: '',
      location: 'Battaramulla'
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { registerDoctor } = useAuth();
  const navigate = useNavigate();

  const locations = [
    'Battaramulla', 'Colombo', 'Nugegoda', 
    'Dehiwala', 'Rajagiriya', 'Malabe'
  ];

  const specializations = [
    'General Veterinary', 'Surgery', 'Dentistry', 
    'Dermatology', 'Internal Medicine', 'Emergency Care'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorId.trim()) {
      newErrors.doctorId = 'Doctor ID is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.experience || formData.experience < 0) {
      newErrors.experience = 'Experience is required';
    }

    if (!formData.consultationFee || formData.consultationFee < 0) {
      newErrors.consultationFee = 'Consultation fee is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const doctorData = {
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q)
      };

      const result = await registerDoctor(doctorData);
      
      if (result.success) {
        navigate('/doctor-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <HeartIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Register as Veterinarian
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our network of qualified veterinarians
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor ID */}
            <div>
              <label htmlFor="doctorId" className="text-sm font-medium text-gray-700">
                Doctor ID *
              </label>
              <input
                id="doctorId"
                name="doctorId"
                type="text"
                required
                value={formData.doctorId}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.doctorId ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Enter your doctor ID"
              />
              {errors.doctorId && (
                <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.contactNumber ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                Specialization *
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="text-sm font-medium text-gray-700">
                Years of Experience *
              </label>
              <input
                id="experience"
                name="experience"
                type="number"
                min="0"
                required
                value={formData.experience}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.experience ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Years of experience"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>

            {/* Consultation Fee */}
            <div>
              <label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">
                Consultation Fee (LKR) *
              </label>
              <input
                id="consultationFee"
                name="consultationFee"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.consultationFee}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${errors.consultationFee ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Consultation fee"
              />
              {errors.consultationFee && (
                <p className="mt-1 text-sm text-red-600">{errors.consultationFee}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="clinicAddress.location" className="text-sm font-medium text-gray-700">
                Clinic Location *
              </label>
              <select
                id="clinicAddress.location"
                name="clinicAddress.location"
                value={formData.clinicAddress.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label htmlFor="qualifications" className="text-sm font-medium text-gray-700">
              Qualifications (comma separated)
            </label>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={3}
              value={formData.qualifications}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., DVM, MSc Veterinary Medicine, MRCVS"
            />
          </div>

          {/* Clinic Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clinicAddress.street" className="text-sm font-medium text-gray-700">
                Clinic Street Address
              </label>
              <input
                id="clinicAddress.street"
                name="clinicAddress.street"
                type="text"
                value={formData.clinicAddress.street}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Street address"
              />
            </div>
            <div>
              <label htmlFor="clinicAddress.city" className="text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="clinicAddress.city"
                name="clinicAddress.city"
                type="text"
                value={formData.clinicAddress.city}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="City"
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                'Register as Doctor'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;