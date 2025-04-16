import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaSearch } from 'react-icons/fa';

const Sidebar = ({ onSelectUser, selectedUser }) => {
  const { 
    users, 
    getUsers, 
    loading, 
    unreadCounts 
  } = useChatStore();
  
  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="h-full w-full flex flex-col bg-base-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-base-300 p-4">
        <div className="flex items-center gap-2 mb-4">
          <FaComments className="text-2xl text-primary" />
          <span className="text-xl font-bold">Chats</span>
        </div>
        <div className="relative">
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
          <div className="flex justify-center items-center h-full text-gray-500">
            No conversations found
          </div>
        ) : (
          <AnimatePresence>
            {users.filter(user => user._id !== authUser?._id).map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 p-4 border-b border-base-200 cursor-pointer active:bg-base-300 ${
                  selectedUser?._id === user._id ? 'bg-base-300' : 'hover:bg-base-200'
                }`}
                onClick={() => onSelectUser(user)}
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
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Sidebar;