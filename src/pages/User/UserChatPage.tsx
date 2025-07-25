import { UserSidebar } from "@/components";
import { UserLayout } from "@/layouts";
import { ChatContext } from "@/context";

import { useChat } from "@/hooks";
import { useState } from "react";
import ChatSidebar from "@/components/user/ChatSidebar";
import ChatBox from "@/components/user/ChatBox";

const ChatNew = () => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    chats,
    fetchMessages,
    newChat,
    selectChat,
    sendMedia,
    sendMessage,
    sendReaction,
    trainers,
    registerMessageHandlers,
    selectedChat,
    getChatMembers,
  } = useChat();

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5">
          <div className="w-full h-[600px] border border-app-border flex rounded-md bg-gradient-to-br from-[#0e101a] to-[#111827]">
            <ChatContext.Provider
              value={{
                chats,
                fetchMessages,
                newChat,
                selectChat,
                sendMedia,
                sendMessage,
                sendReaction,
                trainers,
                registerMessageHandlers,
                selectedChat,
                getChatMembers,
              }}
            >
              <ChatSidebar isOpen={isOpen} />
              <ChatBox sideBarOpenClose={() => setIsOpen((p) => !p)} />
            </ChatContext.Provider>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ChatNew;
