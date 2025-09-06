import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HeartIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      
      if (result.success) {
        if (formData.userType === 'admin') {
          navigate('/admin-dashboard');
        } else if (formData.userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <HeartIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Login as
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={formData.userType === 'user'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pet Owner</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="doctor"
                    checked={formData.userType === 'doctor'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Veterinarian</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={formData.userType === 'admin'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            {/* Email/Username */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                {formData.userType === 'doctor' ? 'Email or Doctor ID' : 'Email or Username'}
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={formData.userType === 'doctor' ? 'Enter email or doctor ID' : 'Enter email or username'}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
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
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {formData.userType === 'user' ? (
                <>
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Sign up as Pet Owner
                  </Link>
                </>
              ) : formData.userType === 'doctor' ? (
                <span className="text-gray-500">
                  Doctor accounts are created by administrators
                </span>
              ) : null}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;