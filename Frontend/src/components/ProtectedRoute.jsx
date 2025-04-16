import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { authUser, authCheckCompleted } = useAuthStore();
  
  if (!authCheckCompleted) {
    return null; // Let App.jsx handle the loading state
  }

  if (!authUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;