// MobileLayout.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { FaBars, FaTimes } from 'react-icons/fa';

const ChatLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { selectedUser } = useChatStore();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Auto-close sidebar when a user is selected on mobile
    if (isMobile && selectedUser) {
      setShowSidebar(false);
    }
  }, [selectedUser, isMobile]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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

  return (
    <div className="h-screen relative">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          isMobile={isMobile} 
          isMobileOpen={showSidebar} 
          onMobileToggle={toggleSidebar} 
        />
      </div>

      {/* Mobile Chat View */}
      <div className={`h-full ${selectedUser ? 'block' : 'hidden'}`}>
        {selectedUser && (
          <div className="h-full">
            <div className="p-2 border-b border-base-300 bg-base-100">
              <button 
                onClick={toggleSidebar}
                className="btn btn-ghost btn-sm"
              >
                <FaBars />
              </button>
            </div>
            <Chat />
          </div>
        )}
      </div>

      {/* Empty State when no chat is selected */}
      {!selectedUser && (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-base-300 bg-base-100">
            <button 
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm"
            >
              <FaBars />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
              <button 
                onClick={toggleSidebar}
                className="btn btn-primary mt-4"
              >
                Open Contacts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;