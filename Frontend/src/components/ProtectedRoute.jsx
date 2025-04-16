import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth, error, checkAuth } = useAuthStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 This triggers the auth check once on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !authUser && !initialCheckDone) {
      setInitialCheckDone(true);
      navigate('/signin', {
        replace: true,
        state: { from: location }
      });
    }
  }, [authUser, isCheckingAuth, initialCheckDone, navigate, location]);

  useEffect(() => {
    if (error) {
      toast.error("Session expired. Please login again.");
      navigate('/signin', { replace: true });
    }
  }, [error, navigate]);

  if (isCheckingAuth || (!authUser && !initialCheckDone)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return authUser ? children : null;
};

export default ProtectedRoute;
