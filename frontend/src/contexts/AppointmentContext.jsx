import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/doctors?${params}`);
      setDoctors(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    setLoading(true);
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      setSelectedDoctor(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch doctor details');
      console.error('Error fetching doctor:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    setLoading(true);
    try {
      const params = date ? `?date=${date}` : '';
      const response = await api.get(`/doctors/${doctorId}/slots${params}`);
      setAvailableSlots(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch available slots');
      console.error('Error fetching slots:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/appointments');
      setAppointments(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors/dashboard/appointments');
      setAppointments(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      const response = await api.post('/appointments/book', appointmentData);
      setCurrentAppointment(response.data.appointment);
      toast.success('Appointment booked successfully!');
      return { success: true, appointment: response.data.appointment };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setLoading(true);
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      toast.success('Appointment cancelled successfully');
      await fetchUserAppointments();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel appointment';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (appointmentId, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/appointments/${appointmentId}/complete`, data);
      toast.success('Appointment marked as completed');
      await fetchDoctorAppointments();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete appointment';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const submitDiagnosisQuestionnaire = async (questionnaireData) => {
    setLoading(true);
    try {
      const response = await api.post('/diagnosis/submit', questionnaireData);
      toast.success('Diagnosis questionnaire submitted');
      return { success: true, questionnaire: response.data.questionnaire };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit questionnaire';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    appointments,
    currentAppointment,
    doctors,
    selectedDoctor,
    availableSlots,
    loading,
    fetchDoctors,
    fetchDoctorDetails,
    fetchAvailableSlots,
    fetchUserAppointments,
    fetchDoctorAppointments,
    bookAppointment,
    cancelAppointment,
    completeAppointment,
    submitDiagnosisQuestionnaire,
    setSelectedDoctor,
    setCurrentAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};