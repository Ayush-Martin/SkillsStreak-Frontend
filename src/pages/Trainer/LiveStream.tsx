import { LiveChat, NewStream } from "@/components";
import { TrainerLayout } from "@/layouts";
import {
  FaRegStopCircle,
  FaMicrophoneAltSlash,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { FaVideoSlash, FaVideo } from "react-icons/fa6";
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from "react-icons/md";
import { useTrainerStream } from "@/hooks";

const LiveStream = () => {
  const {
    isStreaming,
    roomId,
    startStream,
    stopStreaming,
    toggleAudio,
    toggleScreenShare,
    toggleVideo,
    cameraVideoRef,
    screenShareRef,
    isScreenSharing,
    isAudioEnabled,
    isVideoEnabled,
  } = useTrainerStream();

  return (
    <TrainerLayout>
      {!isStreaming ? (
        <NewStream startStream={startStream} />
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="p-3 border rounded-md lg:w-4/6 border-app-border">
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
                style={{
                  transform: "rotateY(180deg)",
                }}
                className={
                  isScreenSharing
                    ? "absolute bottom-6 right-6 w-16 h-16 md:w-20 md:h-20  lg:w-32 lg:h-32  object-cover block border-4 border-white shadow-xl"
                    : "w-full h-auto"
                }
                autoPlay
                playsInline
              />
            </div>

            <div className="flex items-center justify-center px-2 mt-5 border rounded jus md:px-10 border-app-border md">
              <div className="flex gap-4 ">
                <div className="px-2 py-3 border-x border-app-border">
                  <button
                    onClick={stopStreaming}
                    className="p-2 text-lg text-red-500 bg-transparent border border-red-500 rounded-full md:p-3 md:text-2xl"
                  >
                    <FaRegStopCircle />
                  </button>
                </div>
                <div className="px-2 py-3 border-x border-app-border">
                  <button
                    onClick={toggleVideo}
                    className={`p-2 md:p-3 text-lg md:text-2xl  bg-transparent border  rounded-full ${
                      isVideoEnabled
                        ? "text-red-500 border-red-500"
                        : "text-green-500 border-green-500"
                    }`}
                  >
                    {isVideoEnabled ? <FaVideoSlash /> : <FaVideo />}
                  </button>
                </div>
                <div className="px-2 py-3 border-x border-app-border">
                  <button
                    onClick={toggleAudio}
                    className={`p-2 md:p-3 text-lg md:text-2xl bg-transparent border  rounded-full ${
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
                </div>
                <div className="px-2 py-3 border-x border-app-border">
                  <button
                    onClick={toggleScreenShare}
                    className={`p-2 md:p-3 text-lg md:text-2xl bg-transparent border  rounded-full ${
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
          </div>

          <LiveChat roomId={roomId} />
        </div>
      )}
    </TrainerLayout>
  );
};

export default LiveStream;
