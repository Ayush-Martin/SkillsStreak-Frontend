import { axiosGetRequest } from "@/config/axios";
import { successPopup } from "@/utils/popup";
import { Room } from "livekit-client";
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;


const useUserStream = (streamId:string) => {
  const navigate = useNavigate();
  const [camera, setCamera] = useState(false);
  const [screen, setScreen] = useState(false);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const viewStream = async () => {
      try {
        const res = await axiosGetRequest(`/streams/${streamId}`);
        if (!res) return;

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        setRoom(room);

        room.on("trackSubscribed", (track, publication) => {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);

          if (publication.source === "screen_share") {
            if (screenShareRef.current) {
              screenShareRef.current.srcObject = mediaStream;
              screenShareRef.current.play();
            }
            setScreen(true);
          } else if (publication.source === "camera") {
            if (cameraVideoRef.current) {
              cameraVideoRef.current.srcObject = mediaStream;
              cameraVideoRef.current.play();
            }
            setCamera(true);
          }
        });

        room.on("trackUnsubscribed", (_, publication) => {
          if (publication.source === "screen_share") {
            setScreen(false);
          } else if (publication.source === "camera") {
            setCamera(false);
          }
        });

        room.on("participantDisconnected", (participant) => {
          if (participant.identity.startsWith("host")) {
            successPopup("live has been end");
            navigate("/user/live");
          }
        });

        await room.connect(LIVEKIT_URL, res.data.token);

        setRoomId(res.data.stream.roomId);
      } catch (err) {
        console.error(err);
      }
    };

    viewStream();
  }, []);

  return {
    cameraVideoRef,
    screenShareRef,
    camera,
    screen,
    roomId,
    room,
  };
};

export default useUserStream;
