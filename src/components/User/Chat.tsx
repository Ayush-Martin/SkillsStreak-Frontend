import { useState } from "react";

import { BsFillChatLeftTextFill } from "@/assets/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import AiChat from "./AiChat";
import PremiumChat from "./PremiumChat";

const Chat = () => {
  const [open, setOpen] = useState(false);
  //   const [premiumChatAccess, setPremiumChatAccess] = useState(false);

  return (
    <>
      <div
        className="fixed w-10 h-10 z-20 text-4xl text-app-secondary top-[600px] md:top-[690px] right-[30px] cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        <BsFillChatLeftTextFill />
      </div>
      {open && (
        <div className="fixed  w-80 z-20 rounded-lg h-96 top-[200px] md:top-[300px] right-[40px] bg-opacity-60 bg-app-neutral backdrop-blur-sm">
          <Tabs defaultValue="aiChat" className="w-80">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="aiChat">Ai Chat</TabsTrigger>
              <TabsTrigger value="specialChat">Special Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="aiChat">
              <AiChat />
            </TabsContent>
            <TabsContent value="specialChat">
              <PremiumChat />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default Chat;
