// ChatLayout.jsx
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useChatStore } from '../store/chatStore';
import { useMediaQuery } from 'react-responsive';
import { FaArrowLeft } from 'react-icons/fa';

const ChatLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { selectedUser, setSelectedUser } = useChatStore();

  // Auto switch view based on selectedUser on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(!selectedUser);
    }
  }, [selectedUser, isMobile]);

  const handleBack = () => {
    setSelectedUser(null);
    setIsMobileOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {(isMobile ? isMobileOpen : true) && (
        <div className={`${isMobile ? 'w-full absolute z-20' : 'w-1/3 min-w-[300px] max-w-sm'} h-full`}>
          <Sidebar 
            isMobile={isMobile} 
            isMobileOpen={isMobileOpen} 
            onMobileToggle={() => setIsMobileOpen(false)} 
          />
        </div>
      )}

      {/* Chat */}
      {(isMobile ? !isMobileOpen : true) && (
        <div className={`${isMobile ? 'w-full absolute z-10' : 'flex-1'} h-full bg-base-200`}>
          {/* Back button for mobile */}
          {isMobile && selectedUser && (
            <button 
              onClick={handleBack}
              className="absolute top-4 left-4 z-30 btn btn-circle btn-sm bg-base-100 shadow-md"
            >
              <FaArrowLeft />
            </button>
          )}
          <Chat />
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
