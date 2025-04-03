import { Input, ScrollArea } from "@/components/ui";
import { getSocket } from "@/config/socket";
import { FC, useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { IPremiumChat, IPremiumMessage } from "@/types/chatType";
import { SocketEvents } from "@/constants";

interface IChatProps {
  userId: string;
  chatUserId: string;
  chatUserName: string;
  chatId: string | null;
}

const Chat: FC<IChatProps> = ({ userId, chatUserId, chatId, chatUserName }) => {
  const socket = getSocket();
  const [id, setId] = useState(chatId);
  const [messages, setMessages] = useState<Array<IPremiumMessage>>([]);
  const [message, setMessage] = useState("");

  // Use a ref for the ScrollArea component itself
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // This effect handles scrolling when messages change
  useEffect(() => {
    if (messagesContainerRef.current && scrollAreaRef.current) {
      // Find the actual scrollable element within your custom ScrollArea component
      const scrollableElement =
        scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        ) || scrollAreaRef.current;
      scrollableElement.scrollTop = scrollableElement.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Socket listener for new messages
    const handleNewMessage = (data: IPremiumMessage) => {
      if (data.chatId === id || !id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    // Socket listener for chat join
    const handleChatJoin = (data: IPremiumChat) => {
      if (data.userId === userId) {
        setId(data._id);
      }
    };

    socket.on(SocketEvents.CHAT_NEW_MESSAGE, handleNewMessage);
    socket.on(SocketEvents.CHAT_JOIN, handleChatJoin);

    // Clean up socket listeners when component unmounts
    return () => {
      socket.off(SocketEvents.CHAT_NEW_MESSAGE, handleNewMessage);
      // socket.off(SocketEvents.CHAT_JOIN, handleChatJoin);
    };
  }, [id, socket, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      const res = await axiosGetRequest(`/chats/${chatId}`);
      if (!res) return;

      setMessages(res.data);
    };

    if (chatId) {
      fetchMessages();
      setId(chatId);
    }
  }, [chatId]);

  const sendMessage = () => {
    if (!message.trim()) return; // Prevent sending empty messages

    socket.emit("new message", {
      message,
      receiverId: chatUserId,
      chatId: id,
    });

    setMessage(""); // Clear the message input after sending
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("receiverId", chatUserId);
      await axiosPostRequest(`/chats?chatId=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-center font-tektur">
          {chatUserName}
        </h3>
      </div>

      {/* Messages container */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col" ref={messagesContainerRef}>
          {messages.map((msg) => {
            switch (msg.messageType) {
              case "image":
                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <img src={msg.message} alt="" className="w-56" />
                  </div>
                );
              default:
                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] px-6 py-3 rounded-lg border border-app-border ${
                        msg.senderId === userId
                          ? " text-white font-medium border-l-4 border-l-app-secondary"
                          : "border-l-4 border-l-app-tertiary text-white font-medium"
                      }`}
                    >
                      <h1 className=" text-start font-winkysans">
                        {msg.message}
                      </h1>
                      <p className="text-[13px] font-light text-end text-app-accent">
                        {new Date(msg.createdAt).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            className="flex-1 text-white bg-transparent border-gray-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            type="submit"
            onClick={sendMessage}
            className="hover:scale-110"
          >
            <Send className="w-5 h-5" />
          </button>

          <div className="flex">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer hover:scale-110"
            >
              <Paperclip className="w-5 h-5" />
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                onChange={sendMedia}
                accept="image/*"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
