import { NewStream } from "@/components";
import { TrainerLayout } from "@/layouts";
import { useEffect, useRef, useState } from "react";
import { Room, VideoPresets, createLocalTracks } from "livekit-client";
import {
  FaRegStopCircle,
  FaMicrophoneAltSlash,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { FaVideoSlash, FaVideo } from "react-icons/fa6";
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from "react-icons/md";

const LiveStream = () => {
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  const startStream = async (token: string) => {
    try {
      setIsStreaming(true);

      // Create a new room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      setRoom(room);

      // Connect to LiveKit server
      await room.connect("wss://skillsstreak-hqejrm1a.livekit.cloud", token);

      // Listen for local track publications
      room.localParticipant.on("trackPublished", (publication) => {
        console.log(publication);
        const mediaStream = new MediaStream([
          publication.track.mediaStreamTrack,
        ]);
        console.log("Track published:", publication.trackSid, publication.kind);

        if (publication.source === "camera") {
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = mediaStream;
            cameraVideoRef.current.play();
          }
        }

        if (publication.source === "screen_share") {
          if (screenShareRef.current) {
            screenShareRef.current.srcObject = mediaStream;
            screenShareRef.current.play();
          }
        }
      });

      // Create and publish local tracks
      const localTracks = await createLocalTracks({
        video: { ...VideoPresets.h720, facingMode: "user" },
        audio: true,
      });

      // Publish each track individually and handle video display
      for (const track of localTracks) {
        const publication = await room.localParticipant.publishTrack(track);

        // Store camera track reference
        if (track.kind === "video") {
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = new MediaStream([
              track.mediaStreamTrack,
            ]);
            cameraVideoRef.current.play().catch((err) => {
              console.warn("Could not autoplay video:", err);
            });
          }
        }
      }
    } catch (err) {
      console.error("Error starting stream:", err);
      setIsStreaming(false);
    }
  };

  const stopStreaming = async () => {
    if (room) {
      try {
        // Disconnect and reset state
        await room.disconnect();
        setRoom(null);
        setIsStreaming(false);
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        setIsScreenSharing(false);

        // Clear video elements
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = null;
        }
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null;
        }
      } catch (err) {
        console.error("Error stopping stream:", err);
      }
    }
  };

  const toggleVideo = async () => {
    if (!room) return;

    try {
      const enabled = !isVideoEnabled;
      if (enabled) {
        const publication = await room.localParticipant.setCameraEnabled(true);
        const track = publication.track;

        if (track && cameraVideoRef.current) {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          cameraVideoRef.current.srcObject = mediaStream;
          cameraVideoRef.current.play();
        }
      } else {
        await room.localParticipant.setCameraEnabled(false);
      }
      setIsVideoEnabled(enabled);
    } catch (err) {
      console.error("Error toggling video:", err);
    }
  };

  const toggleAudio = async () => {
    if (!room) return;
    try {
      const enabled = !isAudioEnabled;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsAudioEnabled(enabled);
    } catch (err) {
      console.error("Error toggling audio:", err);
    }
  };

  const toggleScreenShare = async () => {
    if (!room) return;
    try {
      const enabled = !isScreenSharing;
      if (enabled) {
        const publication = await room.localParticipant.setScreenShareEnabled(
          true
        );
        const track = publication.track;

        if (track && screenShareRef.current) {
          const mediaStream = new MediaStream([track.mediaStreamTrack]);
          screenShareRef.current.srcObject = mediaStream;
          screenShareRef.current.play();
        }
      } else {
        await room.localParticipant.setScreenShareEnabled(false);
      }
      setIsScreenSharing(enabled);
    } catch (err) {
      console.error("Error toggling screen share:", err);
    }
  };

  return (
    <TrainerLayout>
      {!isStreaming ? (
        <NewStream startStream={startStream} />
      ) : (
        <div className="flex gap-4">
          <div className="w-4/6">
            <div className="relative ">
              <video
                ref={screenShareRef}
                className={isScreenSharing ? "block" : "hidden"}
                autoPlay
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
              <video
                ref={cameraVideoRef}
                className={
                  isScreenSharing
                    ? "absolute bottom-6 right-6 w-32 h-32  object-cover block border-4 border-white shadow-xl"
                    : "w-full h-auto"
                }
                autoPlay
                playsInline
              />
            </div>

            <div className="flex items-center justify-between px-10 mt-5">
              <p className="text-sm font-boldonse">10 People watching </p>
              <div className="flex gap-4 ">
                <button
                  onClick={stopStreaming}
                  className="p-3 text-2xl text-red-500 bg-transparent border border-red-500 rounded-full"
                >
                  <FaRegStopCircle />
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-3 bg-transparent border text-2xl rounded-full ${
                    isVideoEnabled
                      ? "text-red-500 border-red-500"
                      : "text-green-500 border-green-500"
                  }`}
                >
                  {isVideoEnabled ? <FaVideoSlash /> : <FaVideo />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-3 bg-transparent border text-2xl rounded-full ${
                    isAudioEnabled
                      ? "text-red-500 border-red-500"
                      : "text-green-500 border-green-500"
                  }`}
                >
                  {isAudioEnabled ? (
                    <FaMicrophoneAltSlash />
                  ) : (
                    <FaMicrophoneAlt />
                  )}
                </button>
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 bg-transparent border text-2xl rounded-full ${
                    isScreenSharing
                      ? "text-red-500 border-red-500"
                      : "text-green-500 border-green-500"
                  }`}
                >
                  {isScreenSharing ? (
                    <MdOutlineStopScreenShare />
                  ) : (
                    <MdOutlineScreenShare />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="w-2/6 rounded-md bg-app-border h-[500px]">
            <div className="w-full py-3 text-center border-b border-app-neutral">
              <h1 className="text-white font-boldonse">Live Chat</h1>
            </div>
            <div className="h-[400px] w-full "></div>
            <div className="w-full h-[50px] border-t border-app-neutral"></div>
          </div>
        </div>
      )}
    </TrainerLayout>
  );
};

export default LiveStream;
