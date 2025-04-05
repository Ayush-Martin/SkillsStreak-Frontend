import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { LivekitError, Room } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const LiveStream = () => {
  const { streamId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState(false);
  const [screen, setScreen] = useState(false);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const viewStream = async () => {
      try {
        const res = await axiosGetRequest(`/streams/${streamId}`);
        if (!res) return;

        console.log(res);
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        setRoom(room);

        room.on("trackSubscribed", (track) => {
          if (!videoRef.current) return;
          if (track.kind === "video") {
            videoRef.current.srcObject = new MediaStream([
              track.mediaStreamTrack,
            ]);
            videoRef.current.play();
          }
        });

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

        room.on("trackUnsubscribed", (track, publication) => {
          if (publication.source === "screen_share") {
            setScreen(false);
          } else if (publication.source === "camera") {
            setCamera(false);
          }
        });

        await room.connect(
          "wss://skillsstreak-hqejrm1a.livekit.cloud",
          res.data
        );
      } catch (err) {
        console.log(err);
      }
    };

    viewStream();
  }, []);

  console.log("camera", camera);
  console.log("screen", screen);

  return (
    <UserLayout>
      <div className="flex gap-4 px-20 py-10">
        <div className="relative w-4/6">
          <video
            ref={screenShareRef}
            className={screen ? "block" : "hidden"}
            autoPlay
            style={{
              width: "100%",
              height: "auto",
            }}
          />
          <video
            ref={cameraVideoRef}
            className={
              screen
                ? "absolute bottom-6 right-6 w-40 h-40 rounded-full object-cover block border-4 border-white shadow-xl"
                : "w-full h-auto"
            }
            autoPlay
            playsInline
          />
        </div>
        <div className="w-2/6 rounded-md bg-app-border h-[500px]">
          <div className="w-full py-3 text-center border-b border-app-neutral">
            <h1 className="text-white font-boldonse">Live Chat</h1>
          </div>
          <div className="h-[400px] w-full "></div>
          <div className="w-full h-[50px] border-t border-app-neutral"></div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LiveStream;
