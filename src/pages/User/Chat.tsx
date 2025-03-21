// components/ChatUI.jsx
import { useState } from "react";
import {
  Button,
  Input,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { Send, Users, Search, MoreVertical, Paperclip } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import { AiChat, PremiumChat } from "@/components";

const Chat = () => {
  return (
    <UserLayout>
      <div className="flex min-h-[700px] text-white mb-14">
        <Tabs defaultValue="premium" className="flex flex-col flex-1">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="ai">Ai Chat</TabsTrigger>
              <TabsTrigger value="premium">Premium Chat</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="premium"
            className="flex-1 m-0 mt-5 md:px-10 lg:px-20"
          >
            <PremiumChat />
          </TabsContent>
          <TabsContent value="ai" className="flex-1 m-0 mt-5 md:px-20">
            <AiChat />
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default Chat;
