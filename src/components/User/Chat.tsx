import { Button, Input, ScrollArea } from "@/components/ui";
import { getSocket } from "@/config/socket";
import { FC, useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { IPremiumChat, IPremiumMessage } from "@/types/chatType";

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
  const scrollAreaRef = useRef<HTMLDivElement | null>(null); // Ref to ScrollArea

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Scroll only the chat container (ScrollArea)
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axiosGetRequest(`/chats/${chatId}`);
      if (!res) return;
      setMessages(res.data);
      scrollToBottom(); // Scroll to the bottom after loading messages
    };

    // Ensure socket listeners are not added multiple times
    socket.off("new message");
    socket.off("new chat");

    socket.on("new message", (data: IPremiumMessage) => {
      if (data.chatId == id || !id) {
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom(); // Scroll when a new message arrives
      }
    });

    socket.on("new chat", (data: IPremiumChat) => {
      if (data.userId == userId) {
        setId(data._id);
      }
    });

    if (chatId) fetchMessages();
  }, [chatId, id, socket, userId]);

  const sendMessage = () => {
    if (!message) return; // Prevent sending empty messages
    socket.emit("new message", {
      message,
      receiverId: chatUserId,
      chatId: id,
    });
    setMessage(""); // Clear the message input after sending
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
    <div className="flex flex-col h-[620px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-app-border">
        <h3 className="font-semibold text-center">{chatUserName}</h3>
      </div>

      {/* Messages container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ScrollArea
          className="flex-1 p-4 overflow-y-auto"
          ref={scrollAreaRef} // Ref for scrolling
        >
          {messages.map((msg) => {
            switch (msg.messageType) {
              case "image":
                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId == userId ? "justify-end" : "justify-start"
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
                      msg.senderId == userId ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.senderId == userId
                          ? "bg-white text-black font-medium"
                          : "bg-black text-white font-medium"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                );
            }
          })}
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-700 bg-app-border">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            className="flex-1 text-white bg-gray-700 border-gray-600"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </Button>

          <div className="flex">
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
