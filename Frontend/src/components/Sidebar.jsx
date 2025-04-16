import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaBars, FaTimes } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const Sidebar = ({ isMobileOpen, onMobileToggle }) => {
  const { 
    users, 
    getUsers, 
    selectedUser, 
    setSelectedUser, 
    loading, 
    unreadCounts 
  } = useChatStore();
  
  const { authUser, socket } = useAuthStore();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    getUsers();

    const refreshInterval = setInterval(() => {
      if (socket?.connected) {
        getUsers();
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [getUsers, socket]);

  // Close sidebar when a user is selected on mobile
  useEffect(() => {
    if (isMobile && selectedUser) {
      onMobileToggle();
    }
  }, [selectedUser, isMobile, onMobileToggle]);

  return (
    <div className={`
      h-full flex flex-col bg-base-100 overflow-hidden border-r border-base-300
      ${isMobile ? 'fixed inset-y-0 z-50 w-64 transform' : ''}
      ${isMobile && !isMobileOpen ? '-translate-x-full' : ''}
      ${isMobile ? 'transition-transform duration-300 ease-in-out' : ''}
    `}>
      {/* Header with mobile toggle */}
      <div className="border-b border-base-300 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaComments className="text-2xl text-primary" />
          <span className="text-xl font-bold text-primary">ChatSpace</span>
        </div>
        {isMobile && (
          <button 
            onClick={onMobileToggle}
            className="btn btn-ghost btn-sm p-1"
          >
            {isMobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500">
            No users found
          </div>
        ) : (
          <AnimatePresence>
            {users.filter(user => user._id !== authUser?._id).map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  selectedUser?._id === user._id ? 'bg-base-200' : 'hover:bg-base-200'
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <img 
                    src={user.profilePic} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {user.status === 'online' && (
                      <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{user.fullName}</h3>
                    {unreadCounts[user._id] > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                        {unreadCounts[user._id]}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${
                    user.status === 'online' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {user.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* User profile */}
      {authUser && (
        <div className="p-4 border-t border-base-300">
          <div className="flex items-center gap-3">
            <img 
              src={authUser.profilePic} 
              alt={authUser.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{authUser.fullName}</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
            <button 
              onClick={() => useAuthStore.getState().signout()}
              className="btn btn-ghost btn-xs"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;