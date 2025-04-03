import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { UserLayout } from "@/layouts";
import { axiosGetRequest } from "@/config/axios";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useParams } from "react-router-dom";

const ZEGO_APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);

const AudienceStream = () => {
  const { roomId } = useParams();
  const [token, setToken] = useState("");
  const { _id, username } = useSelector((state: RootReducer) => state.user);
  const meetingContainerRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await axiosGetRequest(`/streams/${roomId}`);

      if (res) {
        console.log(res);
        setToken(res.data);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!roomId || !token) return;

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
        config: {
          role: ZegoUIKitPrebuilt.Audience,
          liveStreamingMode: ZegoUIKitPrebuilt.LiveStreamingMode.LiveStreaming,
        },
      },
      showPreJoinView: false,
      turnOnMicrophoneWhenJoining: false,
      turnOnCameraWhenJoining: false,
      showRoomTimer: true,
    });

    return () => {
      zp.destroy();
    };
  }, [roomId, token]);

  return (
    <UserLayout>
      <div ref={meetingContainerRef} className=" h-[650px] mx-20 mt-5"></div>
    </UserLayout>
  );
};

export default AudienceStream;
