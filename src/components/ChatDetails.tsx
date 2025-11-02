import React from "react";

const DetailRow = ({ text = "" }: { text: string }) => (
  <div className="py-3 border-b border-[#262626] flex items-start gap-3">
    <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-[#2b2b2b]">
      <img src="https://i.pravatar.cc/40?img=5" alt="d" className="w-full h-full object-cover"/>
    </div>
    <div className="flex-1">
      <div className="text-[13px] text-gray-100">{text}</div>
      <div className="text-[12px] text-gray-400 mt-1">Connectez vous si possible, tu fais quoi maintenant</div>
    </div>
  </div>
);

const ChatDetails: React.FC = () => {
  return (
    <aside className="w-[22%] min-w-[260px] p-4">
      <div className="bg-[#161718] rounded-2xl border border-[#262626] p-5 h-[calc(100vh-32px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a2a]">
        <div className="text-[18px] font-semibold mb-4">Contact details</div>

        <DetailRow text="Connectez vous si possible, tu fais quoi maintenant" />
        <DetailRow text="Puchase" />
        <DetailRow text="Puchase" />
        <DetailRow text="Recent interaction" />
      </div>
    </aside>
  );
};

export default ChatDetails;
