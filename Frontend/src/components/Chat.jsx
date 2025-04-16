import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore.js';
import { useAuthStore } from '../store/authStore.js';
import { motion } from 'framer-motion';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ onBack }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { messages, sendMessage, getMessages, users } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);

  const selectedUser = users.find(u => u._id === userId);

  useEffect(() => {
    if (userId) getMessages(userId);
  }, [userId, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message || !userId) return;
    await sendMessage(userId, { text: message });
    setMessage('');
  };

  if (!selectedUser) {
    navigate('/');
    return null;
  }

  const isUserOnline = onlineUsers?.has(userId);

  return (
    <div className="flex flex-col h-full w-full bg-base-100">
      {/* Header */}
      <div className="p-3 border-b border-base-300 flex items-center gap-3 sticky top-0 z-10 bg-base-100">
        <button 
          onClick={onBack}
          className="btn btn-ghost btn-circle p-2"
        >
          <IoArrowBack size={24} />
        </button>
        <div className="relative">
          <img 
            src={selectedUser.profilePic} 
            className="w-12 h-12 rounded-full object-cover"
            alt={selectedUser.fullName}
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
            isUserOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
          <p className={`text-sm ${
            isUserOnline ? 'text-green-500' : 'text-gray-500'
          }`}>
            {isUserOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-base-200/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <img 
                src={selectedUser.profilePic} 
                className="w-16 h-16 rounded-full object-cover"
                alt={selectedUser.fullName}
              />
            </div>
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="text-gray-500 mb-4">
              Start your conversation with {selectedUser.fullName.split(' ')[0]}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-4 ${msg.senderId === authUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-lg ${
                msg.senderId === authUser?._id
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-300 text-base-content'
              }`}>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-base-300 bg-base-100 sticky bottom-0">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-ghost btn-circle p-2"
          >
            <BsEmojiSmile size={24} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 input input-bordered input-lg text-lg"
          />
          
          <button
            className="btn btn-primary btn-circle p-2"
            onClick={handleSend}
            disabled={!message}
          >
            <IoSend size={20} />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 right-0">
            <EmojiPicker 
              onEmojiClick={(emoji) => {
                setMessage(prev => prev + emoji.emoji);
                setShowEmojiPicker(false);
              }}
              width="100%"
              height={400}
              searchDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;