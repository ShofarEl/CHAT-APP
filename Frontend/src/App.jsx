import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { ThemeProvider } from './components/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

const App = () => {
  const location = useLocation();
  const { authUser, isCheckingAuth } = useAuthStore();
  const showNavbar = !['/signin', '/signup'].includes(location.pathname);

  // Redirect authenticated users away from auth pages
  const AuthRedirect = ({ children }) => {
    if (authUser) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }
    return children;
  };

  if (isCheckingAuth) {
    return (
      <ThemeProvider>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-100 text-base-content">
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/signin" element={
            <AuthRedirect>
              <LogInPage />
            </AuthRedirect>
          } />
          <Route path="/signup" element={
            <AuthRedirect>
              <SignUpPage />
            </AuthRedirect>
          } />
          
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
          
          <Route path="*" element={
            <Navigate to={authUser ? '/' : '/signin'} replace />
          } />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;