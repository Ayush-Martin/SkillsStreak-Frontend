import { getSocket } from "@/config/socket";
import { FC, useEffect, useState } from "react";
import { Input, ScrollArea } from "../ui";
import ProfileImage from "../ProfileImage";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useScrollToBottom } from "@/hooks";

interface ILiveChatProps {
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

const LiveChat: FC<ILiveChatProps> = ({ roomId }) => {
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<ILiveComment[]>([]);
  const { _id } = useSelector((state: RootReducer) => state.user);
  const chatEndRef = useScrollToBottom([comments]);

  useEffect(() => {
    if (roomId) {
      socket.on("liveChat", (data: ILiveComment) => {
        setComments((prev) => [...prev, data]);
      });
    }

    return () => {
      socket.off("liveChat");
    };
  }, [roomId]);

  const sendMessage = async () => {
    socket.emit("liveChat", { roomId, message });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="lg:w-2/6 rounded-md border border-app-border h-[400px] md:h-[450px] lg:h-[550px] text-white">
      <div className="w-full py-3 text-center border-b border-app-border">
        <h1 className="text-white font-boldonse">Live Chat</h1>
      </div>
      <ScrollArea className="h-[300px] md-[350px] lg:h-[450px] w-full p-4 gap-2">
        {comments.map((comment, i) => (
          <div
            className="flex items-center gap-2 my-2"
            key={`${comment.user._id}-${comment.message}-${i}`}
          >
            <ProfileImage
              profileImage={comment.user.profileImage}
              size={8}
              textSize="xs"
            />
            <p>
              {_id === comment.user._id ? (
                <span className="text-app-accent">you</span>
              ) : (
                <span className="text-app-tertiary">
                  {comment.user.username}
                </span>
              )}{" "}
              {comment.message}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </ScrollArea>
      <div className="w-full h-[50px] border-t border-app-border p-2">
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
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
