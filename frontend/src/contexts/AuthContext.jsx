import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userType = localStorage.getItem('userType');
      let response;
      
      if (userType === 'doctor') {
        response = await api.get('/doctors/dashboard/profile');
      } else if (userType === 'admin') {
        response = await api.get('/users/profile');
      } else {
        response = await api.get('/users/profile');
      }
      
      setUser({ ...response.data, userType });
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        userType
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      setToken(token);
      setUser({ ...user, userType });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'user');
      setToken(token);
      setUser({ ...user, userType: 'user' });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const registerDoctor = async (doctorData) => {
    try {
      const response = await api.post('/auth/doctor/register', doctorData);
      
      const { token, doctor } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'doctor');
      setToken(token);
      setUser({ ...doctor, userType: 'doctor' });
      
      toast.success('Doctor registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      const userType = localStorage.getItem('userType');
      let response;
      
      if (userType === 'doctor') {
        response = await api.put('/doctors/dashboard/profile', updates);
      } else {
        response = await api.put('/users/profile', updates);
      }
      
      setUser({ ...response.data.user || response.data.doctor, userType });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    registerDoctor,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isDoctor: user?.userType === 'doctor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};