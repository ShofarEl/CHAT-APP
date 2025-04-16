import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaSearch } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const Sidebar = ({ onSelectUser, selectedUser }) => {
  const { 
    users, 
    getUsers, 
    setSelectedUser, 
    loading, 
    unreadCounts 
  } = useChatStore();
  
  const { authUser, socket, onlineUsers } = useAuthStore();
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (onSelectUser) onSelectUser(user);
  };

  return (
    <div className="h-full w-full flex flex-col bg-base-100 overflow-hidden border-r border-base-300">
      {/* Header */}
      <div className="border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaComments className="text-2xl text-primary" />
            <span className="text-xl font-bold text-primary">Chats</span>
          </div>
          {isMobile && selectedUser && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => handleUserSelect(null)}
            >
              New Chat
            </button>
          )}
        </div>
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
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
                className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-lg cursor-pointer ${
                  selectedUser?._id === user._id ? 'bg-primary/10' : 'hover:bg-base-200'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="relative">
                  <img 
                    src={user.profilePic} 
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                    onlineUsers?.has(user._id.toString()) ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{user.fullName}</h3>
                    {unreadCounts[user._id] > 0 && (
                      <span className="badge badge-primary badge-sm">
                        {unreadCounts[user._id]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* User profile */}
      {authUser && (
        <div className="p-3 border-t border-base-300">
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