import { getSocket } from "@/config/socket";
import { FC, useEffect, useState } from "react";
import { Button, Input, ScrollArea } from "../ui";
import ProfileImage from "./ProfileImage";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useScrollToBottom } from "@/hooks";
import { SocketEvents } from "@/constants";

interface ILiveChatProps {
  isChatVisible: boolean;
  toggleChat: () => void;
  roomId: string;
}

interface ILiveComment {
  message: string;
  user: {
    _id: string;
    profileImage: string;
    username: string;
  };
}

const LiveChat: FC<ILiveChatProps> = ({
  roomId,
  isChatVisible,
  toggleChat,
}) => {
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<ILiveComment[]>([]);
  const { _id } = useSelector((state: RootReducer) => state.user);
  const chatEndRef = useScrollToBottom([comments]);

  useEffect(() => {
    if (roomId) {
      socket.on(SocketEvents.LIVE_CHAT_NEW_MESSAGE, (data: ILiveComment) => {
        console.log("dfdf");
        setComments((prev) => [...prev, data]);
      });
    }

    return () => {
      socket.off(SocketEvents.LIVE_CHAT_NEW_MESSAGE);
    };
  }, [roomId]);

  const sendMessage = async () => {
    socket.emit(SocketEvents.LIVE_CHAT_NEW_MESSAGE, { roomId, message });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    // <div className="w-full rounded-md border bg-black border-app-border h-[400px] md:h-[450px] lg:h-[620px] text-white ">
    //   <div className="w-full py-3 text-center border-b border-app-border">
    //     <h1 className="text-white font-boldonse">Live Chat</h1>
    //   </div>
    //   <ScrollArea className="h-[300px] md-[350px] lg:h-[500px] w-full p-4 gap-2">
    //     {comments.map((comment, i) => (
    //       <div
    //         className="flex items-center gap-2 my-2"
    //         key={`${comment.user._id}-${comment.message}-${i}`}
    //       >
    //         <ProfileImage
    //           profileImage={comment.user.profileImage}
    //           size={8}
    //           textSize="xs"
    //         />
    //         <p>
    //           {_id === comment.user._id ? (
    //             <span className="text-app-accent">you</span>
    //           ) : (
    //             <span className="text-app-tertiary">
    //               {comment.user.username}
    //             </span>
    //           )}{" "}
    //           {comment.message}
    //         </p>
    //       </div>
    //     ))}
    //     <div ref={chatEndRef} />
    //   </ScrollArea>
    //   <div className="w-full h-[50px] border-t border-app-border p-2">
    //     <div className="flex items-center gap-2">
    //       <Input
    //         placeholder="Type a message..."
    //         className="flex-1 text-white bg-transparent border-gray-600"
    //         value={message}
    //         onChange={(e) => setMessage(e.target.value)}
    //         onKeyDown={handleKeyPress}
    //       />
    //       <button
    //         type="submit"
    //         onClick={sendMessage}
    //         className="hover:scale-110"
    //       >
    //         <Send className="w-5 h-5" />
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div
      className={`${
        isChatVisible
          ? "fixed md:relative inset-y-0 right-0 w-full md:w-80 z-10 md:z-auto top-16 md:top-0"
          : "hidden"
      } backdrop-blur-md backdrop-saturate-150 border border-app-border rounded-md  flex flex-col transition-all duration-300 md:bg-[#0e131f]`}
    >
      {/* Chat Header */}
      <div className="p-4 border-b  backdrop-blur-md backdrop-saturate-150 bg-black/10  border-app-border shadow-black/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Live Chat</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleChat}
            className="text-gray-400 hover:text-white md:hidden"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 bg-black/50 md:bg-transparent">
        <div className="space-y-3">
          {comments.map((comment) => (
            <div className="flex gap-2">
              <ProfileImage
                profileImage={comment.user.profileImage}
                size={8}
                textSize="xs"
              />
              <div key={comment.message} className="text-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-blue-400">
                    {comment.user.username}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {comment.message}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div ref={chatEndRef}></div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t backdrop-blur-md backdrop-saturate-150 bg-black/10  border-app-border shadow-black/10">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
