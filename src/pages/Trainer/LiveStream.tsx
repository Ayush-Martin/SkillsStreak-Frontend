import { LiveChat, NewStream } from "@/components";
import { TrainerLayout } from "@/layouts";
import {
  FaRegStopCircle,
  FaMicrophoneAltSlash,
  FaMicrophoneAlt,
  FaVideoSlash,
  FaVideo,
} from "react-icons/fa";
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from "react-icons/md";
import { useTrainerStream } from "@/hooks";
import { useParams } from "react-router-dom";
import { ReactNode, useState } from "react";

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
  const [isChatVisible, setIsChatVisible] = useState(true);

  const toggleChat = () => setIsChatVisible(!isChatVisible);

  return (
    <TrainerLayout>
      {!isStreaming ? (
        <div className="flex flex-col items-center justify-center w-full p-4">
          <NewStream startStream={startStream} courseId={courseId} />
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          {/* Video Section */}
          <div className="relative w-full overflow-hidden rounded-md border border-app-border bg-black lg:w-3/4">
            <div className="relative aspect-video bg-black">
              {/* Screen Share */}
              <video
                ref={screenShareRef}
                className={`absolute top-0 left-0 w-full h-full object-contain ${
                  isScreenSharing ? "block" : "hidden"
                }`}
                autoPlay
              />
              {/* Camera Feed */}
              <video
                ref={cameraVideoRef}
                className={`${
                  isScreenSharing
                    ? "absolute bottom-4 right-4 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 border-4 border-white shadow-xl rounded-md object-cover"
                    : "w-full h-full object-cover"
                }`}
                autoPlay
                playsInline
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>

            {/* Control Panel */}
            <div className="flex flex-wrap justify-center gap-4 p-4 border-t border-app-border bg-gray-900/80">
              <ControlButton
                onClick={stopStreaming}
                icon={<FaRegStopCircle />}
                label="End Stream"
                color="red"
              />
              <ControlButton
                onClick={toggleVideo}
                icon={isVideoEnabled ? <FaVideoSlash /> : <FaVideo />}
                label={isVideoEnabled ? "Mute Video" : "Unmute Video"}
                color={isVideoEnabled ? "red" : "green"}
              />
              <ControlButton
                onClick={toggleAudio}
                icon={
                  isAudioEnabled ? (
                    <FaMicrophoneAltSlash />
                  ) : (
                    <FaMicrophoneAlt />
                  )
                }
                label={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                color={isAudioEnabled ? "red" : "green"}
              />
              <ControlButton
                onClick={toggleScreenShare}
                icon={
                  isScreenSharing ? (
                    <MdOutlineStopScreenShare />
                  ) : (
                    <MdOutlineScreenShare />
                  )
                }
                label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                color={isScreenSharing ? "red" : "green"}
              />
              <ControlButton
                onClick={toggleChat}
                icon={<span className="text-xl">💬</span>}
                label={isChatVisible ? "Hide Chat" : "Show Chat"}
                color="blue"
              />
            </div>
          </div>

          {/* Chat Section */}

          {isChatVisible && (
            <LiveChat
              roomId={roomId}
              isChatVisible={isChatVisible}
              toggleChat={toggleChat}
            />
          )}
        </div>
      )}
    </TrainerLayout>
  );
};

export default LiveStream;

const ControlButton = ({
  onClick,
  icon,
  label,
  color = "gray",
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  color?: string;
}) => {
  const baseStyle = `flex flex-col items-center gap-1 p-2 md:p-3 rounded-lg text-${color}-500 border border-${color}-500 hover:bg-${color}-500 hover:text-white transition`;
  return (
    <button onClick={onClick} className={baseStyle}>
      <div className="text-2xl">{icon}</div>
      <span className="text-sm">{label}</span>
    </button>
  );
};
