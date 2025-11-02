import React, { useState, useRef, useEffect } from "react";
import { Plus, Send } from "lucide-react";

const MessageLeft = ({ text = "" }: { text: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-[#333435] ring-1 ring-[#2b2b2b] flex items-center  text-sm">
      <img src="https://i.pravatar.cc/32" alt="a" className="w-10 h-10 rounded-full object-cover"/>
    </div>

    <div className="bg-[#bfbfbf] text-[#222] px-7 py-3 rounded-[16px] max-w-[45%] text-[12px] leading-tight shadow-sm">
      {text}
    </div>
  </div>
);

const MessageRight = ({ text = "" }: { text: string }) => (
  <div className="flex justify-end">
    <div className="relative">
      <div className="bg-[#1677a6] px-7 py-3 rounded-[16px] text-white max-w-[90%] text-[12px] leading-tight shadow-md">
        {text}
      </div>

      <div className="absolute -right-3 bottom-[-5px] w-9 h-9 rounded-full bg-[#0b6db0] ring-2 ring-[#141414] overflow-hidden flex items-center justify-center">
        <img src="https://i.pravatar.cc/40?img=8" alt="me" className="w-full h-full object-cover"/>
      </div>
    </div>
  </div>
);

const ChatWindow: React.FC = () => {
  const sample = "Connectez vous si possible, tu fais quoi maintenant";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const plusRef = useRef<HTMLButtonElement>(null);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusRef.current && !plusRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header intérieur (profil) */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 bg-transparent">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#2b2b2b]">
            <img src="https://i.pravatar.cc/80" alt="Alycia" className="w-full h-full object-cover"/>
          </div>

          <div className="flex-1">
            <div className="text-[22px] font-semibold leading-tight">Alycia</div>
            <div className="text-[13px] text-gray-400 mt-1">New York city</div>
            <div className="text-[13px] text-gray-400">alycia@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Séparateur doux */}
      <div className="px-6">
        <div className="h-px bg-[#252626] rounded-full w-full" />
      </div>

      {/* Zone messages (scroll) */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2 scrollbar-thin scrollbar-thumb-[#2a2a2a]">
        <MessageLeft text={sample} />
        <MessageLeft text={sample} />
        <div className="h-6" />
        <MessageRight text={sample} />
        <div className="h-6" />
        <MessageLeft text={sample} />
      </div>

      {/* Zone d'envoi - card légèrement distincte et arrondie */}
      <div className="px-4 py-4 flex items-center gap-3 bg-[#161718] border-t border-[#262626] relative">

        {/* Bouton Plus avec menu drop-top */}
        <div className="relative">
          <button
            ref={plusRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center ring-1 ring-[#2a2a2a] hover:bg-[#242424] transition"
          >
            <Plus className="w-5 h-5 text-gray-300" />
          </button>
{isMenuOpen && (
  <div className="absolute bottom-full mb-2 right-0 translate-x-30 w-40 bg-[#1f1f1f] border border-[#2a2a2a] rounded-md shadow-lg overflow-hidden z-50">
    <button className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-gray-200">photos uploads</button>
    <button className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-gray-200">Envoyer fichier</button>
  </div>
)}

        </div>

        {/* Input message */}
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-full px-4 py-2 flex items-center gap-3 flex-1">
          <input
            placeholder="Envoyer un message"
            className="flex-1 bg-transparent outline-none text-[13px] text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* Bouton Send */}
        <button className="w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center ring-1 ring-[#2a2a2a] hover:bg-[#242424] transition">
          <Send className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;