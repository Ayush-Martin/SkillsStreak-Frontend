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
        className="fixed w-10 h-10 z-20 text-4xl text-app-secondary top-[620px] md:top-[600px] right-[30px] cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        <BsFillChatLeftTextFill />
      </div>
      {open && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center w-full h-screen rounded-lg ">
          <div className="w-full md:w-[1000px] h-[550px] bg-opacity-70 rounded-lg bg-black backdrop-blur-sm px-3 md:px-20 py-10">
            <Tabs defaultValue="aiChat" className="">
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
        </div>
      )}
    </>
  );
};

export default Chat;
