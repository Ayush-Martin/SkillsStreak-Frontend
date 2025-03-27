import UserLayout from "@/layouts/UserLayout";
import { Chat, Footer } from "@/components";
import { Button, Input, ScrollArea } from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import { RootReducer } from "@/store";
import { Search } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { useSelector } from "react-redux";
import { getSocket } from "@/config/socket";
import { useSubscription } from "@/hooks";
import { IPremiumChat, IPremiumMessage } from "@/types/chatType";
import { successPopup } from "@/utils/popup";
import { FaLock } from "react-icons/fa6";
import { SocketEvents } from "@/constants";

interface ISearchTrainersProps {
  messageTrainer: (trainerId: string, trainerName: string) => void;
}

const SearchTrainers: FC<ISearchTrainersProps> = ({ messageTrainer }) => {
  const { _id } = useSelector((state: RootReducer) => state.user);
  const [trainers, setTrainers] = useState<
    Array<{ _id: string; username: string }>
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      const res = await axiosGetRequest(`/trainers`);
      if (!res) return;
      const data = res.data as Array<{ _id: string; username: string }>;
      setTrainers(data.filter((x) => x._id != _id));
    };

    fetchTrainers();
  }, []);

  const selectTrainers = (id: string, name: string) => {
    messageTrainer(id, name);
    setSearch("");
  };

  return (
    <div className="relative mt-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 pl-8 text-white bg-transparent border border-gray-600 "
        />
      </div>
      {search && (
        <div className="absolute z-30 flex flex-col w-full gap-3 px-4 py-5 mt-2 bg-blue-500 rounded-md max-h-52">
          {trainers.length ? (
            trainers
              .filter((trainer) =>
                trainer.username.toLowerCase().includes(search.toLowerCase())
              )
              .map((trainer) => (
                <div className="flex justify-between text-app-neutral">
                  <p>{trainer.username}</p>
                  <button
                    onClick={() =>
                      selectTrainers(trainer._id, trainer.username)
                    }
                  >
                    <BiSolidMessageSquareAdd />
                  </button>
                </div>
              ))
          ) : (
            <h1 className="text-black">No trainers found</h1>
          )}
        </div>
      )}
    </div>
  );
};

const ChatI = () => {
  const socket = getSocket();
  const [chatAccess, setChatAccess] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    chatUserId: string;
    chatUserName: string;
    chatId: string | null;
  }>();
  const [chats, setChats] = useState<Array<IPremiumChat>>([]);
  const { _id } = useSelector((state: RootReducer) => state.user);
  const getSubscription = useSubscription();
  const [open, setOpen] = useState(true);

  const fetchChat = async () => {
    const res = await axiosGetRequest(`/chats`);
    if (!res) {
      setChatAccess(false);
      return;
    }
    setChats(res.data);
    setChatAccess(true);
    socket.on(SocketEvents.CHAT_JOIN, (data: IPremiumChat) => {
      if (data.trainerId == _id) return;
      setChats((chats) => [
        {
          ...data,
          lastMessage: { message: "", createdAt: "", messageType: "text" },
        },
        ...chats,
      ]);
      setSelectedChat({
        chatUserId: data.trainerId,
        chatId: data._id,
        chatUserName: data.name,
      });
    });
  };

  console.log(selectedChat);

  useEffect(() => {
    fetchChat();

    return () => {
      socket.off(SocketEvents.CHAT_JOIN);
      socket.off(SocketEvents.CHAT_NEW_MESSAGE);
    };
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      socket.on(SocketEvents.CHAT_NEW_MESSAGE, (data: IPremiumMessage) => {
        console.log("__ ____ -__ -____ -__ ___-");
        console.log(chats, data);
        const updatedChat = chats.find((chat) => chat._id === data.chatId);
        console.log(updatedChat);
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

  const handleSubscription = () => {
    getSubscription((message: string | undefined) => {
      successPopup(message || "enrolled");
      fetchChat();
    });
  };

  const messageTrainer = (trainerId: string, trainerName: string) => {
    setSelectedChat({
      chatUserId: trainerId,
      chatId: null,
      chatUserName: trainerName,
    });
    setOpen(false);
  };

  return (
    <UserLayout>
      <div className="flex min-h-[700px] text-white mb-10 mt-5 px-7">
        <div className="flex-1 m-0 mt-5 lg:px-20">
          <div
            className="flex justify-center mb-4 sm:hidden"
            onClick={() => setOpen((x) => !x)}
          >
            <Button variant={"v2"}>Chats</Button>
          </div>
          <div
            className={`flex flex-col sm:flex-row h-[600px] relative rounded-md border border-app-border shadow-[0px_4px_10px_rgba(173,216,230,0.5)] hover:shadow-[0px_6px_15px_rgba(173,216,230,0.5)] transition-shadow duration-300`}
          >
            {chatAccess === false && (
              <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center h-full gap-2 bg-black bg-opacity-55 backdrop-blur-sm">
                <h1 className="flex flex-col items-center justify-center gap-2 text-2xl text-app-accent">
                  <FaLock className="text-3xl" /> You don't have access
                </h1>
                <Button variant={"v1"} onClick={handleSubscription}>
                  Subscribe
                </Button>
              </div>
            )}

            {/* Sidebar for Chats */}
            <div
              className={` z-10  w-3/4 sm:block h-full sm:w-1/4 min-w-[100px] shadow-md bg-[#030d16] border-r border-gray-700 flex flex-col ${
                open ? "absolute" : "hidden"
              }`}
            >
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-semibold text-center font-winkysans">
                  Chats
                </h2>
                <SearchTrainers messageTrainer={messageTrainer} />
              </div>

              {/* Scrollable chat list */}
              <ScrollArea className="flex-1 w-full ">
                {chats.map((chat) => (
                  <div
                    key={chat.trainerId}
                    className={`flex items-center p-4 hover:bg-[#091926] cursor-pointer transition-colors ${
                      selectedChat?.chatUserId === chat.userId ||
                      selectedChat?.chatId === chat._id
                        ? " border-l-8 border-b-2 border-b-green-300 border-blue-500"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedChat({
                        chatUserId: chat.trainerId,
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
            <div className="flex flex-col flex-1 w-full sm:w-3/4">
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
      <Footer />
    </UserLayout>
  );
};

export default ChatI;
