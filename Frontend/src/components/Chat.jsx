import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { motion } from 'framer-motion';
import { 
  IoSend, 
  IoImage, 
  IoCheckmark, 
  IoCheckmarkDone, 
  IoArrowBack 
} from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';

const Chat = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const { 
    messages, 
    selectedUser, 
    isMessagesLoading, 
    sendMessage, 
    getMessages, 
    typingUsers 
  } = useChatStore();
  
  const { authUser, socket, sendTypingStatus, onlineUsers } = useAuthStore();
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const filePreviewUrl = image ? URL.createObjectURL(image) : null;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser?._id]);

  // Typing indicator debounce
  const debouncedTypingStatus = useRef(
    debounce((isTyping) => {
      if (selectedUser?._id) sendTypingStatus(selectedUser._id, isTyping);
    }, 500)
  ).current;

  const handleSend = async () => {
    if ((!message && !image) || !selectedUser) return;
    const formData = new FormData();
    if (message) formData.append('text', message);
    if (image) formData.append('image', image);
    await sendMessage(selectedUser._id, formData);
    setMessage('');
    setImage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isUserTyping = typingUsers[selectedUser?._id] || false;
  const isUserOnline = onlineUsers?.has(selectedUser?._id.toString());

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header with Back Button */}
      <div className="p-4 border-b border-base-300 bg-base-100 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="btn btn-ghost btn-circle"
        >
          <IoArrowBack size={20} />
        </button>
        <div className="relative">
          <img 
            src={selectedUser.profilePic} 
            alt={selectedUser.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
            isUserOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></span>
        </div>
        <div>
          <h3 className="font-bold text-lg">{selectedUser.fullName}</h3>
          <p className={`text-sm ${
            isUserTyping ? 'text-primary animate-pulse' :
            isUserOnline ? 'text-green-500' : 'text-gray-500'
          }`}>
            {isUserTyping ? 'Typing...' : isUserOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-base-200/20">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-4 ${msg.senderId === authUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] px-4 py-2 rounded-lg ${
                msg.senderId === authUser?._id
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-300 text-base-content'
              }`}>
                {msg.text && <p className="text-base">{msg.text}</p>}
                {msg.image && (
                  <img
                    src={msg.image}
                    className="mt-2 rounded-lg max-w-full max-h-60 object-contain"
                    alt="Sent content"
                  />
                )}
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.senderId === authUser?._id && (
                    <span className="ml-1">
                      {msg.readBy?.length > 0 ? (
                        <IoCheckmarkDone className="inline text-blue-400" />
                      ) : msg.delivered ? (
                        <IoCheckmarkDone className="inline" />
                      ) : (
                        <IoCheckmark className="inline" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Larger Text Field) */}
      <div className="p-3 border-t border-base-300 bg-base-100">
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-10">
            <EmojiPicker 
              onEmojiClick={(e) => {
                setMessage(prev => prev + e.emoji);
                setShowEmojiPicker(false);
              }}
              width={300}
              height={350}
              theme="dark"
            />
          </div>
        )}
        
        {image && (
          <div className="mb-2 relative">
            <img
              src={filePreviewUrl}
              className="max-w-xs max-h-40 rounded-lg object-contain"
              alt="Preview"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="flex gap-2 items-center">
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-ghost btn-circle"
          >
            <IoImage size={24} />
          </button>
          
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-ghost btn-circle"
          >
            <BsEmojiSmile size={24} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          
          <textarea
            ref={messageInputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 input input-bordered min-h-14 py-3 text-base"
            rows={1}
            style={{ resize: 'none' }}
          />
          
          <button
            className="btn btn-primary btn-circle"
            onClick={handleSend}
            disabled={!message && !image}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;