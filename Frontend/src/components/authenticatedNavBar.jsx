import { Link } from 'react-router-dom';
import { Settings, LogOut, User, MessageSquare, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const AuthenticatedNavbar = () => {
  const { authUser, signout } = useAuthStore();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-base-100 text-base-content border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-indigo-400 h-6 w-6" />
            <span className="text-base-content font-bold text-xl">ChatSpace</span>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/settings" 
                className="text-base-content hover:text-base-100 p-2 rounded-full hover:bg-base-content"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center text-base-content hover:text-base-content px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="h-5 w-5 mr-1" />
                  {authUser?.fullName || 'Profile'}
                </Link>
                
                <button
                  onClick={signout}
                  className="flex items-center cursor-pointer text-base-content hover:text-base-content px-3 py-2 rounded-md text-sm font-medium"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-base-content hover:text-base-content focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="pb-4 pt-2 space-y-2">
            <Link
              to="/profile"
              className="flex items-center text-base-content hover:bg-base-200 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 mr-2" />
              {authUser?.fullName || 'Profile'}
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center text-base-content hover:bg-base-200 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Link>
            
            <button
              onClick={() => {
                signout();
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full text-left text-base-content hover:bg-base-200 px-3 py-2 rounded-md text-base font-medium"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;