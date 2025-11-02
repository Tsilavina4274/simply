import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';

const ChatPage: React.FC = () => {
  return (
    // body background (très sombre)
    <div className="w-full min-h-screen bg-[#0c0c0d] text-white font-sans flex items-stretch">
      {/* Left sidebar card (avec padding + séparation visuelle) */}
      <ChatSidebar />

      {/* Centre (position relative pour le bouton "Bonjour" qui dépasse) */}
      <div className="flex-1 flex flex-col items-stretch px-6 py-6">
        <div className="relative w-full max-w-full">
          {/* Bonjour bouton -- en position absolue, centré et en dehors du card */}
      <div className="absolute left-1/2 -top-3 -translate-x-1/2 z-20">
      <button className="px-8 py-2 rounded-full border-2 border-[#2d86c0] text-[#bfe3ff] bg-transparent backdrop-blur-sm">
        Bonjour
      </button>
      </div>
          {/* Card central (background légèrement plus clair que le body, bord arrondi large) */}
          <div className="mt-10 bg-[#1f2223] rounded-2xl border border-[#2b2b2b] shadow-sm overflow-hidden flex-1 min-h-[72vh]">
            {/* On intègre le contenu du chat dans ce card via ChatWindow (il s'attend à occuper l'espace) */}
            <ChatWindow />
          </div>
        </div>
      </div>

      {/* Right details column */}
      <ChatDetails />
    </div>
  );
};

export default ChatPage;
