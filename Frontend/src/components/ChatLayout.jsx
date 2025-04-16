// src/components/ChatLayout.jsx
import { useMediaQuery } from 'react-responsive';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthenticatedNavbar from './authenticatedNavBar';
import Sidebar from './Sidebar';
import Chat from './Chat';

const ChatLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-base-100">
      <AuthenticatedNavbar />
      
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route 
            path="/" 
            element={
              <Sidebar 
                onSelectUser={(user) => navigate(`/chat/${user._id}`)} 
              />
            } 
          />
          <Route 
            path="/chat/:userId" 
            element={
              <Chat 
                onBack={() => navigate('/')}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default ChatLayout;