import { LiveChat, VideoPlayer } from "@/components";
import LiveStream from "@/components/User/LiveSession";
import { axiosGetRequest } from "@/config/axios";
import { useUserStream } from "@/hooks";
import { UserLayout } from "@/layouts";
import { ILiveSession } from "@/types/courseType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LiveSession = () => {
  const [liveSession, setLiveSession] = useState<{
    stream: ILiveSession;
    token: string;
  }>();
  const { streamId } = useParams();

  useEffect(() => {
    const fetchLiveSession = async () => {
      const res = await axiosGetRequest(`/streams/${streamId}`);
      if (!res) return;
      setLiveSession(res.data);
    };

    fetchLiveSession();
  }, []);

  return (
    <UserLayout>
      <div
        className={` gap-2 py-2 px-6 ${
          liveSession?.stream.isLive
            ? "flex flex-col lg:flex-row min-h-[calc(100vh-64px)]"
            : "h-[calc(100vh-64px)]"
        }`}
      >
        <div
          className={`h-full ${
            liveSession?.stream.isLive ? " lg:w-3/4" : "w-full"
          }`}
        >
          <VideoPlayer
            title={liveSession?.stream.title || ""}
            url={
              liveSession?.stream.isLive
                ? liveSession.stream.liveSrc
                : liveSession?.stream.recordedSrc || ""
            }
            thumbnail={liveSession?.stream.thumbnail}
          />
        </div>
        {liveSession?.stream.isLive && (
          <div className="h-full lg:w-1/4">
            <LiveChat roomId={liveSession?.stream.roomId || ""} />
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default LiveSession;
