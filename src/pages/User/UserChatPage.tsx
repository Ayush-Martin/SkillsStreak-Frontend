import { UserSidebar } from "@/components";
import { UserLayout } from "@/layouts";

import { useEffect, useState } from "react";

import ChatSidebar from "@/components/user/ChatSidebar";
import ChatBox from "@/components/user/ChatBox";
import { axiosGetRequest } from "@/config/axios";
import { IChat } from "@/types/chatType";
import { getSocket } from "@/config/socket";
import { SocketEvents } from "@/constants";

const ChatNew = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState<Array<IChat>>([]);
  // const [socket, setSocket] = useState<>();
  const [selectedChat, setSelectedChat] = useState<{
    _id: string;
    icon: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      const res = await axiosGetRequest("/chats");
      if (!res) return;
      console.log(res.data);
      setChats(res.data);
    };

    fetchChat();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on(SocketEvents.CHAT_JOIN, (chat: IChat) => {
      setChats((p) => [...p, chat]);
    });

    socket.on(
      SocketEvents.CHAT_LAST_MESSAGE,
      ({
        chatId,
        lastMessage,
        lastMessageTime,
      }: {
        lastMessage: string;
        chatId: string;
        lastMessageTime: string;
      }) => {
        setChats((prevChats) => {
          const chat = prevChats.find((chat) => chat._id === chatId);
          if (!chat) return prevChats;

          const updatedChat = {
            ...chat,
            lastMessage,
            lastMessageTime,
          };

          // Move updated chat to the top
          const newChats = [
            updatedChat,
            ...prevChats.filter((chat) => chat._id !== chatId),
          ];

          return newChats;
        });
      }
    );

    return () => {
      socket.off(SocketEvents.CHAT_JOIN);
      socket.off(SocketEvents.CHAT_LAST_MESSAGE);
    };
  }, []);

  const selectChat = (_id: string, icon: string, title: string) => {
    setSelectedChat({ _id, icon, title });
  };

  const updateLastMessage = (lastMessage: string, chatId: string) => {
    const chat = chats.find((chat) => chat._id === chatId);
    if (!chat) return;
    const updatedChat = [
      { ...chat, lastMessage },
      ...chats.filter((chat) => chat._id !== chatId),
    ];
    setChats(updatedChat);
  };

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5">
          <div className="w-full h-[600px] border border-app-border flex rounded-md bg-gradient-to-br from-[#0e101a] to-[#111827]">
            <ChatSidebar
              isOpen={isOpen}
              chats={chats}
              selectChat={selectChat}
              selectedChat={selectedChat}
              setChats={setChats}
            />
            <ChatBox
              updateLastMessage={updateLastMessage}
              selectedChat={selectedChat}
              sideBarOpenClose={() => setIsOpen((p) => !p)}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ChatNew;
