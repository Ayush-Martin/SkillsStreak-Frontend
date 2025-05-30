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
import { useParams } from "react-router-dom";

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

  const { courseId } = useParams();

  return (
    <TrainerLayout>
      {!isStreaming ? (
        <div>
          <NewStream startStream={startStream} courseId={courseId} />
          <h2>Past Streams</h2>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="p-3 border rounded-md lg:w-3/4 border-app-border bg-black">
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
              <div className="flex gap-1 flex-wrap justify-center items-center">
                <div className="px-2 py-3   flex items-center gap-2">
                  <button
                    onClick={stopStreaming}
                    className="p-2 text-lg text-red-500 bg-transparent border border-red-500 rounded-full md:p-3 md:text-2xl"
                  >
                    <FaRegStopCircle />
                  </button>
                  <p>End Stream</p>
                </div>
                <div className="px-2 py-3   flex items-center gap-2">
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
                  <p>{isVideoEnabled ? "Mute Video" : "Unmute Video"}</p>
                </div>
                <div className="px-2 py-3   flex items-center gap-2">
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
                  <p>{isAudioEnabled ? "Mute Video" : "Unmute Video"}</p>
                </div>
                <div className="px-2 py-3   flex items-center gap-2">
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
                  <p>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3">
            <LiveChat roomId={roomId} />
          </div>
        </div>
      )}
    </TrainerLayout>
  );
};

export default LiveStream;
