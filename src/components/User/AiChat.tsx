import { Button, Input, ScrollArea } from "@/components/ui";
import { RiSendPlane2Fill } from "@/assets/icons";
import { Send } from "lucide-react";

const aiMessages = [
  {
    id: 1,
    sender: "User",
    content: "Hello, how can you help me today?",
    time: "2:28 PM",
    isMe: true,
  },
  {
    id: 2,
    sender: "AI",
    content: "Hi! I'm here to assist you with any questions.",
    time: "2:29 PM",
    isMe: false,
  },
];

const AiChat = () => {
  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.isMe ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.isMe ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              <p>{msg.content}</p>
              <span className="block mt-1 text-xs opacity-70">{msg.time}</span>
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form className="flex items-center gap-2">
          <Input
            placeholder="Ask me anything..."
            className="flex-1 text-white bg-gray-700 border-gray-600"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;
