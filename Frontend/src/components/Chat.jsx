import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore.js';
import { useAuthStore } from '../store/authStore.js';
import { motion } from 'framer-motion';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ onBack, selectedUser }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { messages, sendMessage, getMessages } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message || !selectedUser) return;
    await sendMessage(selectedUser._id, { text: message });
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isUserOnline = onlineUsers?.has(selectedUser?._id.toString());

  return (
    <div className="flex flex-col h-full w-full bg-base-100">
      {/* Chat header */}
      <div className="p-3 border-b border-base-300 flex items-center gap-3 bg-base-100 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="btn btn-ghost btn-circle"
          aria-label="Back to conversations"
        >
          <IoArrowBack size={20} />
        </button>
        <div className="relative">
          <img 
            src={selectedUser.profilePic} 
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
            isUserOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{selectedUser.fullName}</h3>
          <p className={`text-xs ${
            isUserOnline ? 'text-green-500' : 'text-gray-500'
          }`}>
            {isUserOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-base-200/10">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <img 
                src={selectedUser.profilePic} 
                alt={selectedUser.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-medium mb-1">{selectedUser.fullName}</h3>
            <p className="text-gray-500 mb-4">Start your conversation with {selectedUser.fullName.split(' ')[0]}</p>
            <p className="text-sm text-gray-400">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-4 ${msg.senderId === authUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
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

      {/* Message input */}
      <div className="p-3 border-t border-base-300 bg-base-100 sticky bottom-0">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-ghost btn-circle"
            aria-label="Add emoji"
          >
            <BsEmojiSmile size={20} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 input input-bordered"
          />
          
          <button
            className="btn btn-primary btn-circle"
            onClick={handleSend}
            disabled={!message}
            aria-label="Send message"
          >
            <IoSend size={18} />
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
              height={350}
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