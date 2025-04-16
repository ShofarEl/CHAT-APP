import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useChatStore } from '../store/chatStore';

const ChatLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { selectedUser, setSelectedUser } = useChatStore();

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // DESKTOP: Show sidebar + chat (default)
  if (!isMobile) {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r border-base-300">
          <Sidebar />
        </div>
        <div className="flex-1">
          <Chat />
        </div>
      </div>
    );
  }

  // MOBILE: Show ONLY ChatList OR Chat (never both!)
  return (
    <div className="h-screen">
      {!selectedUser ? (
        <Sidebar isMobile={true} />
      ) : (
        <Chat onBack={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default ChatLayout;