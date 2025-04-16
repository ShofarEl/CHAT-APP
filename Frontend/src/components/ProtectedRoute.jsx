// ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, authCheckCompleted, checkAuth } = useAuthStore();

  useEffect(() => {
    // If auth check hasn't completed, run it
    if (!authCheckCompleted) {
      checkAuth().then(isAuthenticated => {
        if (!isAuthenticated) {
          navigate('/signin', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      });
    } 
    // If auth check completed but no user, redirect
    else if (!authUser) {
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [authCheckCompleted, authUser, checkAuth, location.pathname, navigate]);

  // Show loading spinner while authentication is being checked
  if (!authCheckCompleted || !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;