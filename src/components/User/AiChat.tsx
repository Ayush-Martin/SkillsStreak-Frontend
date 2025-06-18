import { FaRobot } from "@/assets/icons";
import { Send } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { axiosPostRequest } from "@/config/axios";
import { ScrollArea } from "@/components/ui";
import { Mosaic } from "react-loading-indicators";
import { useScrollToBottom } from "@/hooks";

interface IAiChatProps {
  courseId: string;
}

interface IAiChat {
  role: "user" | "model";
  parts: { text: string }[];
}

const AiChat: FC<IAiChatProps> = ({ courseId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLading] = useState(false);
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<Array<IAiChat>>([]);
  const chatEndRef = useScrollToBottom([chats, loading]);

  useEffect(() => {
    const fetchWelcomeChat = async () => {
      setLading(true);
      const message =
        "Greet the user and explain that you’re here to help them understand the course content, answer questions, and support their learning journey. Be concise, friendly, and helpful in your tone.";

      const res = await axiosPostRequest(`/courses/${courseId}/aiChat`, {
        message,
        history: [],
      });

      if (!res) return;
      setLading(false);
      setChats([
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: res.data }] },
      ]);
    };

    fetchWelcomeChat();
  }, []);

  const sendMessage = async () => {
    setLading(true);
    const newUserMessage: IAiChat = {
      role: "user",
      parts: [{ text: message }],
    };
    const updatedChats = [...chats, newUserMessage];
    setChats(updatedChats);
    const res = await axiosPostRequest(`/courses/${courseId}/aiChat`, {
      message,
      history: chats,
    });

    if (!res) return;
    setLading(false);
    setChats([...updatedChats, { role: "model", parts: [{ text: res.data }] }]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="fixed top-[590px] md:top-[670px] bg-white bg-opacity-70 border-app-border backdrop-blur-sm right-5 text-4xl p-3 rounded-full text-app-border hover:bg-app-accent hover:text-app-primary transition-all duration-300 z-50"
        onClick={() => setOpen(true)}
      >
        <FaRobot />
      </button>

      <div
        className={`fixed flex flex-col top-0 left-0 right-0 sm:left-auto sm:right-3 sm:top-[80px] w-full h-[689px] sm:w-[500px] sm:h-[667px]  backdrop-blur-md backdrop-saturate-150 bg-[#031019]/70 border-[#031019]/20 shadow-[#031019]/10 rounded-none md:rounded-md transform transition-all duration-300 ease-in-out z-50 ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        } shadow-[0_0_30px_10px_rgba(255,255,255,0.1)]`}
      >
        <div className="flex items-center justify-between w-full px-10 py-3 border-b border-app-border">
          <h1 className="text-2xl text-white">Ai chat</h1>
          <button
            className="text-2xl text-white transition hover:text-red-500"
            onClick={() => setOpen(false)}
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full h-full py-2 overflow-y-auto text-white">
          <ScrollArea className="flex flex-col gap-2 px-3 h-[550px] md:h-[520px]">
            {chats.slice(1).map((chat, index) => (
              <div
                key={index}
                className={`animate-fade-in flex justify-start px-5 py-2 border rounded border-app-border my-2 ${
                  chat.role === "model"
                    ? "bg-transparent me-10"
                    : "bg-app-border ms-10"
                }`}
              >
                <p className="text-white">{chat.parts[0].text}</p>
              </div>
            ))}
            {loading && (
              <div className="flex items-center justify-start gap-2 px-5 py-2 my-2 border rounded animate-fade-in border-app-border">
                <Mosaic
                  color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                  size="small"
                />
                <p className="font-tektur">Thinking ...</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </ScrollArea>
          <div className="bottom-0 p-4 border-t border-gray-700">
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
      </div>
    </>
  );
};

export default AiChat;
