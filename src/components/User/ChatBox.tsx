import { ProfileImage } from "@/components";
import { BiCategory, BiSolidImageAdd } from "@/assets/icons/icons";
import { ScrollArea } from "@/components/ui";
import { BiSend } from "react-icons/bi";
import { FC, useEffect, useState } from "react";
import { getSocket } from "@/config/socket";
import { IChatMessage } from "@/types/chatType";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { useScrollToBottom } from "@/hooks";
import { SocketEvents } from "@/constants";

interface IChatBoxProps {
  sideBarOpenClose: () => void;
  selectedChat: { _id: string; icon: string; title: string } | null;
  updateLastMessage: (lastMessage: string, chatId: string) => void;
}

interface IMessageProps {
  message: string;
  messageType: "text" | "image";
  createdAt: string;
  isSender: boolean;
  username: string;
  profileImage: string;
}

const Message: FC<IMessageProps> = ({
  createdAt,
  message,
  messageType,
  isSender,
  profileImage,
  username,
}) => {
  return (
    <div className={`flex  mb-5 ${isSender ? "justify-end" : "justify-start"}`}>
      <div className="flex items-end gap-2">
        {!isSender && (
          <ProfileImage
            profileImage={profileImage}
            size={9}
            textSize="text-2xl"
          />
        )}

        <div
          className={`max-w-[500px] py-1 px-6 min-h-[50px]  rounded-md ${
            isSender ? "bg-[#2A3439]" : "bg-[#333333]"
          }`}
        >
          {!isSender && (
            <p className="text-sm text-start text-app-accent underline">
              {username}
            </p>
          )}

          {messageType === "text" ? (
            <p className=" mb-1 text-start">{message}</p>
          ) : (
            <img src={message} className="max-w-[300px]"></img>
          )}
          <p className="text-sm text-end text-app-secondary">
            {new Date(createdAt).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ISendMessage {
  sendMessage: (message: string) => void;
  sendMedia: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SendMessage: FC<ISendMessage> = ({ sendMessage, sendMedia }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="h-[60px] w-full  border-t border-app-border flex justify-between items-center">
      <div className="w-[50px] h-full py-2 mx-3  text-3xl flex">
        <label
          htmlFor="file-upload"
          className="inline-flex items-center   font-medium text-white rounded-md cursor-pointer hover:scale-110"
        >
          <BiSolidImageAdd />
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            onChange={sendMedia}
            accept="image/*"
          />
        </label>
      </div>
      <form
        className="flex justify-between w-full items-center h-full "
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <input
          className="w-full h-full bg-transparent placeholder:text-app-neutral focus:outline-none focus:ring-0"
          placeholder="write a message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="w-[50px] h-full py-2 mx-3  text-3xl">
          <BiSend />
        </button>
      </form>
    </div>
  );
};

const ChatBox: FC<IChatBoxProps> = ({
  sideBarOpenClose,
  selectedChat,
  updateLastMessage,
}) => {
  const [messages, setMessages] = useState<Array<IChatMessage>>([]);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const divRef = useScrollToBottom([messages]);
  const { _id } = useSelector((state: RootReducer) => state.user);

  useEffect(() => {
    const socket = getSocket();
    setSocket(socket);
    setMessages([]);
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await axiosGetRequest(`/chats/${selectedChat._id}`);
      if (!res) return;

      setMessages(res.data);
    };

    fetchMessages();

    socket.on(SocketEvents.CHAT_MESSAGE_BROADCAST, (message: IChatMessage) => {
      console.log(message);
      if (message.chatId != selectedChat._id) return;
      setMessages((p) => [...p, message]);
      // updateLastMessage(
      //   message.messageType == "text" ? message.message : "image",
      //   message.chatId
      // );
    });

    return () => {
      socket?.off(SocketEvents.CHAT_MESSAGE_BROADCAST);
    };
  }, [selectedChat]);

  const sendMessage = (message: string) => {
    if (!selectedChat || !socket) return;
    socket.emit(SocketEvents.CHAT_MESSAGE_SEND, {
      chatId: selectedChat._id,
      message: message,
    });
  };

  const sendMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await axiosPostRequest(`/chats/${selectedChat?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <div className="w-full h-[70px] border-b border-app-border flex ">
        <div className="w-1/12  h-full flex justify-center items-center mx-3">
          <button className="text-3xl" onClick={sideBarOpenClose}>
            <BiCategory />
          </button>
        </div>
        <div className="w-full  h-full flex justify-between items-center">
          <div className="w-full h-full  flex gap-4 items-center  bg-opacity-25 p-2 rounded-md">
            {selectedChat ? (
              <>
                {" "}
                <ProfileImage
                  profileImage={selectedChat.icon}
                  size={16}
                  textSize="3xl"
                />
                <h1 className="font-playwritehu">{selectedChat.title}</h1>
              </>
            ) : (
              <h1 className="font-playwritehu">Select A chat</h1>
            )}
          </div>
          <div className="h-full"></div>
        </div>
      </div>
      {selectedChat && (
        <div className="w-full">
          <ScrollArea className=" px-5 py-3 h-[470px] w-full">
            {messages.map((message) => (
              <Message
                createdAt={message.createdAt}
                key={message._id}
                messageType={message.messageType}
                message={message.message}
                profileImage={message.sender.profileImage}
                isSender={message.sender._id === _id}
                username={message.sender.username}
              />
            ))}
            <div ref={divRef}></div>
          </ScrollArea>
          <SendMessage sendMessage={sendMessage} sendMedia={sendMedia} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
