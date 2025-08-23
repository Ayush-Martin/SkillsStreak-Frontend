import { FC, useState } from "react";
import { PiChatsCircleLight } from "react-icons/pi";
import { ScrollArea } from "../ui";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";

interface ILiveChatProps {
  liveChats: {
    userId: string;
    message: string;
    username: string;
    profileImage: string;
  }[];
  sendMessage: (message: string) => void;
}

const LiveChat: FC<ILiveChatProps> = ({ liveChats, sendMessage }) => {
  const [chatInput, setChatInput] = useState("");
  const { _id } = useSelector((state: RootReducer) => state.user);

  const sendLiveChatMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput("");
    }
  };
  return (
    <aside className="flex-[1.25] h-full bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700 bg-slate-800">
        <PiChatsCircleLight className="text-xl text-blue-400" />
        <span className="text-base font-semibold text-slate-100">
          Live Chat
        </span>
      </div>
      <ScrollArea className="flex-1 px-4 py-4 space-y-3 h-[200px]">
        {liveChats.map((chat, index) => (
          <div key={index} className="flex items-start gap-2 mb-3">
            <img
              src={chat.profileImage}
              alt={chat.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-100">
                {chat.username} {chat.userId === _id && "(You)"}
              </span>
              <span className="text-sm text-slate-400">{chat.message}</span>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex gap-2">
          <input
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button
            className="px-5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={sendLiveChatMessage}
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LiveChat;
