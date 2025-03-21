import { Button, ScrollArea } from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import TrainerLayout from "@/layouts/TrainerLayout";
import { RootReducer } from "@/store";
import { Users } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chat } from "@/components";
import { getSocket } from "@/config/socket";
import { IPremiumChat, IPremiumMessage } from "@/types/chatType";

const TrainerChat = () => {
  const socket = getSocket();
  const [chats, setChats] = useState<Array<IPremiumChat>>([]);
  const [selectedChat, setSelectedChat] = useState<{
    chatUserId: string;
    chatId: string | null;
    chatUserName: string;
  }>();
  const { _id } = useSelector((state: RootReducer) => state.user);
  const [open, setOpen] = useState(false); // State for controlling sidebar visibility

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axiosGetRequest("trainer/chats");
      if (!res) return;
      setChats(res.data);

      socket.on("new chat", (data: IPremiumChat) => {
        if (data.trainerId == _id) return;
        setChats((chats) => [...chats, { ...data, lastMessage: "" }]);
      });

      socket.on("new message", (data: IPremiumMessage) => {
        setChats((chats) =>
          chats.map((chat) =>
            chat._id == data.chatId
              ? {
                  ...chat,
                  lastMessage:
                    data.messageType == "text"
                      ? data.message
                      : data.messageType,
                }
              : chat
          )
        );
      });
    };

    fetchChats();
  }, []);

  return (
    <TrainerLayout>
      {/* Button to toggle sidebar on small screens */}
      <div
        className="flex justify-center mb-4 sm:hidden"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Button variant={"v2"}>{open ? "Hide Chats" : "Show Chats"}</Button>
      </div>

      <div className="flex flex-col sm:flex-row h-[620px] relative mb-10">
        {/* Sidebar with Chats */}
        <div
          className={`z-10 w-3/4 sm:block h-full sm:w-1/4 min-w-[300px] bg-[#1f2330] border-r border-gray-700 flex flex-col ${
            open ? "absolute" : "hidden"
          }`}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chats</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white"
              >
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {chats.map((chat) => (
              <div
                key={chat.userId}
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedChat?.chatUserId === chat.userId
                    ? "bg-app-primary border-l-2 border-blue-500"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChat({
                    chatUserId: chat.userId,
                    chatId: chat._id,
                    chatUserName: chat.name,
                  });
                  setOpen(false); // Close sidebar on chat selection for small screens
                }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          {selectedChat ? (
            <Chat
              chatUserId={selectedChat.chatUserId}
              userId={_id}
              chatId={selectedChat.chatId}
              chatUserName={selectedChat.chatUserName}
            />
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerChat;
