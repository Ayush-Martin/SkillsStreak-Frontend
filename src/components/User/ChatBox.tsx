import { ProfileImage } from "@/components";
import { BiCategory, BiSolidImageAdd } from "@/assets/icons/icons";
import { ScrollArea } from "@/components/ui";
import { BiSend } from "react-icons/bi";
import { FC, useEffect, useMemo, useState } from "react";
import { getSocket } from "@/config/socket";
import {
  IChatMessage,
  IChatMessageReaction,
  IChatMessageReactionEmoji,
} from "@/types/chatType";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { useScrollToBottom } from "@/hooks";
import { SocketEvents } from "@/constants";
import { FaRegSmile } from "react-icons/fa";

interface IChatBoxProps {
  sideBarOpenClose: () => void;
  selectedChat: { _id: string; icon: string; title: string } | null;
  updateLastMessage: (lastMessage: string, chatId: string) => void;
}

interface IMessageProps {
  messageId: string;
  message: string;
  reactions: IChatMessageReaction[];
  messageType: "text" | "image";
  createdAt: string;
  isSender: boolean;
  username: string;
  profileImage: string;
  currentUserId: string;
  sendReaction: (messageId: string, emoji: IChatMessageReactionEmoji) => void;
}

const emojiList: IChatMessageReactionEmoji[] = ["❤️", "👍", "😂", "🔥", "👎"];

const Message: FC<IMessageProps> = ({
  messageId,
  message,
  messageType,
  createdAt,
  isSender,
  username,
  profileImage,
  reactions,
  currentUserId,
  sendReaction,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Transform reactions: emoji -> [userIds]
  const reactionMap = useMemo(() => {
    const map: Record<IChatMessageReactionEmoji, string[]> = {
      "❤️": [],
      "👍": [],
      "😂": [],
      "🔥": [],
      "👎": [],
    };
    for (const r of reactions) {
      if (map[r.emoji]) map[r.emoji].push(r.userId);
    }
    return map;
  }, [reactions]);

  const userReaction = useMemo(() => {
    return reactions.find((r) => r.userId === currentUserId)?.emoji || null;
  }, [reactions, currentUserId]);

  const handleReaction = (emoji: IChatMessageReactionEmoji) => {
    if (userReaction === emoji) return; // no need to resend same emoji
    sendReaction(messageId, emoji);
    setShowPicker(false);
  };

  return (
    <div
      className={`flex mb-6 px-4 ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div className="flex gap-3 items-end group relative max-w-[85%]">
        {!isSender && (
          <ProfileImage
            profileImage={profileImage}
            size={9}
            textSize="text-2xl"
          />
        )}

        <div
          className={`relative px-5 py-3 rounded-3xl shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/5 ${
            isSender
              ? "bg-gradient-to-br from-[#1a2731] to-[#232f3e] text-white rounded-br-none"
              : "bg-gradient-to-br from-[#1c1f26] to-[#2c2f38] text-white rounded-bl-none"
          }`}
        >
          {!isSender && (
            <p className="text-xs text-app-accent font-semibold mb-1 underline tracking-wide">
              {username}
            </p>
          )}

          {messageType === "text" ? (
            <p className="text-sm leading-snug whitespace-pre-wrap break-words text-white/90">
              {message}
            </p>
          ) : (
            <img
              src={message}
              alt="img"
              className="rounded-xl mt-2 max-w-[260px] border border-white/10 shadow-md"
            />
          )}

          {/* Timestamp + React button */}
          <div className="flex items-center justify-between mt-2 text-xs text-white/50">
            <span>
              {new Date(createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white ml-2"
            >
              <FaRegSmile />
            </button>
          </div>

          {/* Emoji Picker */}
          {showPicker && (
            <div
              className={`absolute -bottom-12 z-50 mb-2 flex gap-2 bg-[#1f1f26] border border-white/10 p-2 rounded-xl shadow-xl ${
                isSender ? "right-0" : "left-0"
              }`}
            >
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  className={`text-xl hover:scale-125 transition-transform duration-150 ${
                    userReaction === emoji ? "opacity-100" : "opacity-60"
                  }`}
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Reaction Count Bar */}
          {Object.values(reactionMap).some((arr) => arr.length > 0) && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {emojiList.map((emoji) => {
                const users = reactionMap[emoji];
                if (users.length === 0) return null;
                const isYou = users.includes(currentUserId);

                return (
                  <div
                    key={emoji}
                    className={`flex items-center gap-1 px-2 py-1 text-sm rounded-full backdrop-blur-sm border shadow-sm ${
                      isYou
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-white/5 text-gray-300 border-gray-500/20"
                    }`}
                  >
                    {emoji} <span className="text-xs">{users.length}</span>
                  </div>
                );
              })}
            </div>
          )}
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

    socket.on(
      SocketEvents.CHAT_MESSAGE_REACTION_BROADCAST,
      ({
        chatId,
        messageId,
        reactions,
      }: {
        chatId: string;
        messageId: string;
        reactions: IChatMessageReaction[];
      }) => {
        if (chatId != selectedChat._id) return;
        setMessages((messages) =>
          messages.map((message) =>
            message._id !== messageId ? message : { ...message, reactions }
          )
        );
        // updateLastMessage(
        //   message.messageType == "text" ? message.message : "image",
        //   message.chatId
        // );
      }
    );

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

  const sendReaction = (
    messageId: string,
    emoji: IChatMessageReactionEmoji
  ) => {
    if (!selectedChat || !socket) return;
    socket.emit(SocketEvents.CHAT_MESSAGE_REACTION_SEND, {
      chatId: selectedChat._id,
      messageId,
      emoji,
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
                messageId={message._id}
                reactions={message.reactions}
                sendReaction={sendReaction}
                currentUserId={_id}
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
