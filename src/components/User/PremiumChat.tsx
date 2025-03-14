import { Input, ScrollArea } from "@/components/ui";
import { RiSendPlane2Fill, FaLock } from "@/assets/icons";
import { axiosGetRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";
import { useEffect, useState } from "react";
import useSubscription from "@/hooks/useSubscription";
const PremiumChat = () => {
  const [chatAccess, setChatAccess] = useState(true);
  const getSubscription = useSubscription();

  useEffect(() => {
    const fetchChat = async () => {
      const res = await axiosGetRequest(`/chat`);
      if (!res) {
        setChatAccess(false);
        return;
      }
      setChatAccess(true);
    };

    fetchChat();
  }, []);

  const handleSubscription = () => {
    getSubscription((message: string | undefined) => {
      setChatAccess(true);
      successPopup(message || "enrolled");
    });
  };

  return (
    <>
      <ScrollArea className="flex flex-col gap-5 px-2 h-[304px]">
        <div className="flex justify-start mt-2">
          <div className="px-4 py-2 text-white bg-black rounded-md w-52">
            hello hodf
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="px-4 py-2 text-black bg-white rounded-md w-52">
            hdfd
          </div>
        </div>
      </ScrollArea>
      <div className="relative flex w-full bg-app-highlight">
        <Input
          className="text-white border-0 bg-app-highlight"
          placeholder="type your message"
        />
        <button className="text-2xl text-app-accent">
          <RiSendPlane2Fill />
        </button>
        {!chatAccess && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center w-full h-full gap-2 px-5 py-2 text-lg bg-black bg-opacity-60 backdrop-blur-sm text-app-accent">
            <FaLock />
            <button className="underline" onClick={handleSubscription}>
              Subscribe to premium
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PremiumChat;
