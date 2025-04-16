import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useChatStore } from '../store/chatStore';
import { useMediaQuery } from 'react-responsive';
import { FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChatLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { selectedUser, setSelectedUser } = useChatStore();
  
  // In mobile view, we only show the sidebar when no user is selected
  const showSidebar = !isMobile || (isMobile && !selectedUser);
  const showChat = !isMobile || (isMobile && selectedUser);

  const handleBack = () => {
    setSelectedUser(null);
  };

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.3,
      }
    },
    exit: (direction) => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
      }
    })
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-200">
      <AnimatePresence mode="wait" initial={false}>
        {/* Sidebar (Contact List) */}
        {showSidebar && (
          <motion.div
            key="sidebar"
            className={`${isMobile ? 'w-full' : 'w-1/3 min-w-[300px] max-w-sm'} h-full z-10`}
            initial={isMobile ? "hidden" : false}
            animate="visible"
            exit="exit"
            variants={isMobile ? slideVariants : {}}
            custom="left"
          >
            <Sidebar isMobile={isMobile} onContactSelect={() => {}} />
          </motion.div>
        )}

        {/* Chat Area */}
        {showChat && (
          <motion.div
            key="chat"
            className={`${isMobile ? 'w-full absolute inset-0' : 'flex-1'} h-full bg-base-200 z-20`}
            initial={isMobile ? "hidden" : false}
            animate="visible"
            exit="exit"
            variants={isMobile ? slideVariants : {}}
            custom="right"
          >
            {isMobile && (
              <div className="absolute top-4 left-4 z-30">
                <button 
                  onClick={handleBack}
                  className="btn btn-circle btn-sm bg-base-100 shadow-md"
                  aria-label="Back to contacts"
                >
                  <FaArrowLeft />
                </button>
              </div>
            )}
            <Chat />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatLayout;