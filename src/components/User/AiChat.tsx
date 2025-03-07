
import { Input, ScrollArea } from "@/components/ui";
import { RiSendPlane2Fill } from "@/assets/icons";

const AiChat = () => {
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
      <div className="flex w-full bg-app-highlight">
        <Input
          className="text-white border-0 bg-app-highlight"
          placeholder="type your message"
        />
        <button className="text-2xl text-app-accent">
          <RiSendPlane2Fill />
        </button>
      </div>
    </>
  );
};

export default AiChat;
