import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { motion } from 'framer-motion';
import { FaComments, FaSearch, FaPlus } from 'react-icons/fa';

const Sidebar = ({ onSelectUser }) => {
  const { users, getUsers, loading, unreadCounts } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="h-full w-full flex flex-col bg-base-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
          <button className="btn btn-circle btn-primary">
            <FaPlus size={18} />
          </button>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts"
            className="input input-bordered w-full pl-10 text-lg py-3"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : users.filter(u => u._id !== authUser?._id).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="text-5xl mb-4">👋</div>
            <h3 className="text-xl font-bold mb-2">No conversations</h3>
            <p className="text-gray-500 mb-4">Start a new chat to connect!</p>
            <button className="btn btn-primary">
              New Chat
            </button>
          </div>
        ) : (
          users.filter(user => user._id !== authUser?._id).map((user) => (
            <motion.div
              key={user._id}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 border-b border-base-200 active:bg-base-300"
              onClick={() => onSelectUser(user)}
            >
              <div className="relative">
                <img 
                  src={user.profilePic} 
                  className="w-14 h-14 rounded-full object-cover"
                  alt={user.fullName}
                />
                <span className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-base-100 ${
                  onlineUsers?.has(user._id.toString()) ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{user.fullName}</h3>
                  {unreadCounts[user._id] > 0 && (
                    <span className="badge badge-primary badge-lg">
                      {unreadCounts[user._id]}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm truncate">
                  {user.lastMessage?.text || 'Tap to chat'}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;