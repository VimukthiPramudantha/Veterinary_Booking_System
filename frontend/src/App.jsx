import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';

import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import DiagnosisQuestionnaire from './pages/DiagnosisQuestionnaire';
import PaymentPage from './pages/PaymentPage';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import AppointmentsPage from './pages/AppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

const ProtectedRoute = ({ children, requireAuth = true, doctorOnly = false, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (doctorOnly && user?.userType !== 'doctor') {
    return <Navigate to="/" />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (!requireAuth && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" />; 
    }
    return <Navigate to={user.userType === 'doctor' ? '/doctor-dashboard' : '/dashboard'} />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute doctorOnly>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute>
            <DoctorList />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment/:doctorId" element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/diagnosis-questionnaire" element={
          <ProtectedRoute>
            <DiagnosisQuestionnaire />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/confirmation" element={
          <ProtectedRoute>
            <AppointmentConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
            <Toaster position="top-right" />
          </div>
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;