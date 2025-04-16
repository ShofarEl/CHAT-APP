// src/components/ChatLayout.jsx
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AuthenticatedNavbar from './authenticatedNavBar';
import Sidebar from './Sidebar';
import Chat from './Chat';

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleBackToConversations = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-col h-screen bg-base-100">
      <AuthenticatedNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          selectedUser ? (
            <Chat 
              onBack={handleBackToConversations} 
              selectedUser={selectedUser}
            />
          ) : (
            <Sidebar 
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
            />
          )
        ) : (
          <>
            <Sidebar 
              onSelectUser={handleSelectUser}
              selectedUser={selectedUser}
            />
            {selectedUser ? (
              <Chat selectedUser={selectedUser} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-base-200">
                <div className="text-center p-6">
                  <div className="text-5xl mb-4">💬</div>
                  <h2 className="text-xl font-bold mb-2">ChatSpace Web</h2>
                  <p className="text-gray-500">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;