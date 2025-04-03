import { FC, useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { RootReducer } from "@/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { endStream } from "@/features/trainer/slice/TrinerStreamSlice";
import { axiosPatchRequest } from "@/config/axios";

interface ITrainerStreamProps {
  token: string;
  roomId: string;
}

const ZEGO_APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);

const TrainerStream: FC<ITrainerStreamProps> = ({ token, roomId }) => {
  const { _id, username } = useSelector((state: RootReducer) => state.user);
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const dispatch = useDispatch();

  const stopStream = async () => {
    await axiosPatchRequest(`/trainer/streams/${roomId}`);
  };

  useEffect(() => {
    if (!roomId || !token) {
      console.warn("Waiting for roomId and token...", roomId, token);
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      ZEGO_APP_ID,
      token,
      roomId,
      _id,
      username
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: meetingContainerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: { role: ZegoUIKitPrebuilt.Host },
      },
      showPreJoinView: false,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      sharedLinks: [
        {
          name: "Join as Co-Host",
          url: `${window.location.origin}/trainer/stream?roomID=${roomId}&role=Cohost`,
        },
        {
          name: "Join as Audience",
          url: `${window.location.origin}/stream/${roomId}`,
        },
      ],
      onUserJoin: (users) => {
        console.log("Users joined:", users);
        setViewerCount((prev) => prev + users.length);
      },
      onUserLeave: (users) => {
        console.log("Users left:", users);
        setViewerCount((prev) => Math.max(0, prev - users.length));
      },
      onLiveEnd() {
        stopStream();
        dispatch(endStream());
      },
    });

    return () => {
      zp.destroy();
    };
  }, []);

  return (
    <>
      {/* Live Viewer Count */}
      <div className="px-4 py-2 text-white bg-black bg-opacity-50 rounded-md left-3">
        Viewers: {viewerCount}
      </div>

      {/* Streaming Container */}
      <div ref={meetingContainerRef} className="w-full h-[600px]"></div>
    </>
  );
};

export default TrainerStream;
