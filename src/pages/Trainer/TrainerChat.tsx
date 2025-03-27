import { Button, ScrollArea } from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import TrainerLayout from "@/layouts/TrainerLayout";
import { RootReducer } from "@/store";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chat } from "@/components";
import { getSocket } from "@/config/socket";
import { IPremiumChat, IPremiumMessage } from "@/types/chatType";
import { SocketEvents } from "@/constants";

const TrainerChat: FC = () => {
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

      socket.on(SocketEvents.CHAT_JOIN, (data: IPremiumChat) => {
        if (data.userId == _id) return;
        setChats((chats) => [
          {
            ...data,
            lastMessage: { message: "", createdAt: "", messageType: "text" },
          },
          ...chats,
        ]);
      });
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      socket.on(SocketEvents.CHAT_NEW_MESSAGE, (data: IPremiumMessage) => {
        const updatedChat = chats.find((chat) => chat._id === data.chatId);
        if (!updatedChat) return;

        const updatedChatCopy = {
          ...updatedChat,
          lastMessage: {
            message:
              data.messageType === "text" ? data.message : data.messageType,
            createdAt: data.createdAt,
            messageType: data.messageType,
          },
        };

        setChats([
          updatedChatCopy,
          ...chats.filter((chat) => chat._id !== data.chatId),
        ]);
      });
    }
  }, [chats]);

  return (
    <TrainerLayout>
      {/* Button to toggle sidebar on small screens */}
      <div className="flex min-h-[700px] text-white">
        <div className="flex-1 ">
          <div
            className="flex justify-center mb-4 sm:hidden"
            onClick={() => setOpen((x) => !x)}
          >
            <Button variant={"v2"}>Chats</Button>
          </div>
          <div
            className={`flex flex-col sm:flex-row h-[600px] relative rounded-md border border-app-border shadow-[0px_4px_10px_rgba(173,216,230,0.5)] hover:shadow-[0px_6px_15px_rgba(173,216,230,0.7)] transition-shadow duration-300`}
          >
            {/* Sidebar for Chats */}
            <div
              className={` z-10  w-3/4 sm:block h-full sm:w-1/4 min-w-[200px] shadow-md bg-[#030d16] border-r border-gray-700 flex flex-col ${
                open ? "absolute" : "hidden"
              }`}
            >
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-semibold text-center font-winkysans">
                  Chats
                </h2>
              </div>

              {/* Scrollable chat list */}
              <ScrollArea className="flex-1 w-full ">
                {chats.map((chat) => (
                  <div
                    key={chat.userId}
                    className={`flex items-center p-4 hover:bg-[#091926] cursor-pointer transition-colors ${
                      selectedChat?.chatUserId === chat.trainerId ||
                      selectedChat?.chatId === chat._id
                        ? " border-l-8 border-b-2 border-b-green-300 border-blue-500"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedChat({
                        chatUserId: chat.userId,
                        chatId: chat._id,
                        chatUserName: chat.name,
                      });
                      setOpen(false);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate font-josefinsans">
                        {chat.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-playwritehu">
                        {chat.lastMessage.messageType === "text"
                          ? chat.lastMessage.message.length > 40
                            ? `${chat.lastMessage.message.slice(0, 40)}...`
                            : chat.lastMessage.message
                          : chat.lastMessage.messageType}
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
                  key={selectedChat.chatUserId}
                  chatUserId={selectedChat.chatUserId}
                  userId={_id}
                  chatId={selectedChat.chatId}
                  chatUserName={selectedChat.chatUserName}
                />
              ) : (
                <div className="flex items-center justify-center flex-1 text-sm text-center text-gray-400 font-boldonse">
                  Select a chat to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerChat;
