import React from "react";

const ContactRow = ({ idx = 0 }: { idx?: number }) => {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-[#222427] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#2b2b2b]">
          <img src={`https://i.pravatar.cc/40?img=${idx + 10}`} alt="a" className="w-full h-full object-cover"/>
        </div>

        <div className="leading-[12px]">
          <div className="text-[13px] font-semibold">Alycia</div>
          <div className="text-[11px] text-gray-400">Connectez vous si possible</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="text-[10px] bg-[#1aa64a] text-white font-bold px-2 py-[2px] rounded-full">VIP</div>
        <div className="w-6 h-6 rounded-full bg-[#2b2b2b] text-[11px] flex items-center justify-center text-gray-300">1</div>
      </div>
    </div>
  );
};

const ChatSidebar: React.FC = () => {
  return (
    <aside className="w-[20%] min-w-[240px] p-4">
      {/* Card intérieur pour démarquer du background global */}
      <div className="bg-[#161718] rounded-2xl border border-[#262626] p-4 h-[calc(100vh-32px)] flex flex-col">
        {/* Search */}
        <div>
          <div className="relative rounded-xl bg-[#1f2021] p-2">
            <input
              className="w-full bg-transparent text-[13px] placeholder-gray-400 outline-none px-2 py-2 rounded-md"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Tiny filter pills */}
        <div className="mt-3 flex gap-2 items-center">
          <button className="text-[12px] px-3 py-[4px] rounded-full bg-[#2b2b2b]">All Chats</button>
          <button className="text-[12px] px-3 py-[4px] rounded-full bg-[#222426] text-gray-300">Urgent</button>
        </div>

        {/* Liste contacts - scroll */}
        <div className="mt-3 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-[#2a2a2a]">
          {Array.from({ length: 14 }).map((_, i) => (
            <ContactRow key={i} idx={i} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
