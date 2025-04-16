import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
// ... other imports

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
          
          {/* Other protected routes */}
          
          <Route path="*" element={
            <Navigate to={authUser ? '/' : '/signin'} replace />
          } />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;