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
import { useAuthStore } from './store/authStore';

const App = () => {
  const location = useLocation();
  const { authUser, isCheckingAuth, authCheckCompleted, checkAuth } = useAuthStore();
  
  // Run initial auth check on mount
  useEffect(() => {
    if (!authCheckCompleted) {
      checkAuth();
    }
  }, [authCheckCompleted, checkAuth]);

  const showNavbar = !['/signin', '/signup'].includes(location.pathname);

  // Show loading spinner only during initial check
  if (!authCheckCompleted && isCheckingAuth) {
    return (
      <ThemeProvider>
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </ThemeProvider>
    );
  }

  // Auth redirect component
  const AuthRedirect = ({ children }) => {
    if (authUser) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }
    return children;
  };

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
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
              <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
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