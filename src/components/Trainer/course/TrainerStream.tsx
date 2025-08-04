import { forwardRef } from "react";

import {
  FaVideo,
  FaVideoSlash,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
  FaRegStopCircle,
} from "@/assets/icons";

interface ITrainerStreamProps {
  stopStreaming: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

const TrainerStream = forwardRef<HTMLVideoElement, ITrainerStreamProps>(
  (
    {
      stopStreaming,
      isAudioEnabled,
      isScreenSharing,
      isVideoEnabled,
      toggleAudio,
      toggleScreenShare,
      toggleVideo,
    },
    ref
  ) => {
    return (
      <div className="flex gap-4">
        <div className="w-3/4">
          <video
            ref={ref}
            autoPlay
            muted={!isAudioEnabled}
            style={{
              width: "100%",
              height: "auto",
              transform: "scaleX(-1)",
            }}
          />

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
        <div className="w-2/4 rounded-md bg-app-border h-[500px]">
          <div className="w-full py-3 text-center border-b border-app-neutral">
            <h1 className="text-white font-boldonse">Live Chat</h1>
          </div>
          <div className="h-[400px] w-full "></div>
          <div className="w-full h-[50px] border-t border-app-neutral"></div>
        </div>
      </div>
    );
  }
);

export default TrainerStream;
