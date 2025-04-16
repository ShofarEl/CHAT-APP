import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from "./components/Navbar";
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { ThemeProvider } from './components/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { authUser, authCheckCompleted, checkAuth } = useAuthStore();
  
  // Run auth check when component mounts
  useEffect(() => {
    if (!authCheckCompleted) {
      checkAuth();
    }
  }, [authCheckCompleted, checkAuth]);
  
  // Show loading spinner while checking authentication
  if (!authCheckCompleted) {
    return (
      <ThemeProvider>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ThemeProvider>
    );
  }
  
  // Simple wrapper to redirect authenticated users away from auth pages
  const AuthPage = ({ element }) => {
    return authUser ? <Navigate to="/" replace /> : element;
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-100 text-base-content">
        {/* Show navbar only when authenticated */}
        {authUser && <Navbar />}
        
        <Routes>
          <Route path="/signin" element={<AuthPage element={<LogInPage />} />} />
          <Route path="/signup" element={<AuthPage element={<SignUpPage />} />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback route - redirect to home if logged in, otherwise to signin */}
          <Route path="*" element={<Navigate to={authUser ? '/' : '/signin'} replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;