import { LiveChat, VideoPlayer } from "@/components";
import { Button, Input, ScrollArea } from "@/components/ui";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { ILiveSession } from "@/types/courseType";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LiveSession = () => {
  const [liveSession, setLiveSession] = useState<{
    stream: ILiveSession;
    token: string;
  }>();
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [isChatVisible, setIsChatVisible] = useState(
    !!liveSession?.stream.isLive
  );

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    const fetchLiveSession = async () => {
      const res = await axiosGetRequest(`/streams/${streamId}`);
      if (!res) return;
      setLiveSession(res.data);
    };

    fetchLiveSession();
  }, []);

  console.log(liveSession);

  return (
    <div className="h-screen w-full py-10 px-10 bg-app-primary relative">
      <button
        className="text-white absolute top-2"
        onClick={() => navigate(`/courses/${liveSession?.stream.courseId}`)}
      >
        Go to course
      </button>
      <div className="flex h-full k relative">
        {/* Main Video Area */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isChatVisible ? "lg:w-[calc(100%-380px)]" : "w-full"
          }`}
        >
          <div className="relative h-full  flex items-center justify-center overflow-hidden">
            <VideoPlayer
              title="dfd"
              url={
                liveSession?.stream.isLive
                  ? liveSession.stream.liveSrc
                  : liveSession?.stream.recordedSrc || ""
              }
            />

            {/* Chat Toggle Button */}
            {!!liveSession?.stream.isLive && (
              <div className="absolute top-6 right-6 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleChat}
                  className=" bg-white backdrop-blur-sm border-slate-600 text-black  transition-all duration-200 shadow-lg"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {isChatVisible ? "Hide Chat" : "Show Chat"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <LiveChat
          roomId={liveSession?.stream.roomId || ""}
          isChatVisible={isChatVisible}
          toggleChat={toggleChat}
        />
      </div>
    </div>
  );
};

export default LiveSession;
