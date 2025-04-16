// src/components/ChatLayout.jsx
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AuthenticatedNavbar from './authenticatedNavBar';
import Sidebar from './Sidebar';
import Chat from './Chat';

const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col h-screen">
      <AuthenticatedNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          selectedUser ? (
            <Chat onBack={() => setSelectedUser(null)} />
          ) : (
            <Sidebar onSelectUser={setSelectedUser} />
          )
        ) : (
          <>
            <Sidebar onSelectUser={setSelectedUser} />
            <Chat />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;