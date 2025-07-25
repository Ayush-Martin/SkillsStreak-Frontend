import { VideoPlayer } from "@/components";
import useTrainerLiveSession from "@/hooks/useTrainerLiveSession";
import { TrainerLayout } from "@/layouts";
import {
  FaRegStopCircle,
  FaMicrophoneAltSlash,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { FaVideoSlash, FaVideo } from "react-icons/fa6";
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from "react-icons/md";
import { PiChatsCircleLight } from "react-icons/pi";
import { FC, ReactNode } from "react";

const TrainerLiveSessionPage = () => {
  const {
    cameraVideoRef,
    screenShareRef,
    stopStreaming,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    isStreaming,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    recordedSrc,
  } = useTrainerLiveSession();

  return (
    <TrainerLayout>
      <div
        className={`flex flex-col lg:flex-row  gap-6 ${
          isStreaming && "h-[calc(100vh-112px)]"
        }`}
      >
        {/* Video & Controls */}
        <div className="flex-[3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex flex-col">
          <div className="relative w-full flex-1">
            {!isStreaming && recordedSrc && (
              <VideoPlayer title="" url={recordedSrc} />
            )}

            {isStreaming && (
              <>
                <video
                  ref={screenShareRef}
                  className={`absolute inset-0 w-full h-full object-contain ${
                    isScreenSharing ? "opacity-100" : "opacity-0"
                  }`}
                  autoPlay
                />
                <video
                  ref={cameraVideoRef}
                  className={`absolute z-10 ${
                    isScreenSharing
                      ? "bottom-4 right-4 w-40 h-40 border-4 border-blue-500 shadow-lg rounded-lg"
                      : "inset-0 w-full h-full rounded-xl object-cover"
                  }`}
                  autoPlay
                  playsInline
                  style={{ transform: "rotateY(180deg)" }}
                />
              </>
            )}
          </div>

          {/* Controls */}
          {isStreaming && (
            <div className="w-full px-6 py-4 border-t border-slate-700 bg-slate-800 flex justify-center">
              <ControlPanel
                {...{
                  stopStreaming,
                  toggleVideo,
                  toggleAudio,
                  toggleScreenShare,
                  isVideoEnabled,
                  isAudioEnabled,
                  isScreenSharing,
                }}
              />
            </div>
          )}
        </div>

        {/* Chat Section */}
        {isStreaming && (
          <aside className="flex-[1.25] h-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700 bg-slate-800">
              <PiChatsCircleLight className="text-xl text-blue-400" />
              <span className="text-base font-semibold text-slate-100">
                Live Chat
              </span>
            </div>
            <div className="flex-1 px-4 py-4 overflow-y-auto">
              {/* Chat messages will go here */}
            </div>
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <input
                placeholder="Type your message..."
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </aside>
        )}
      </div>
    </TrainerLayout>
  );
};

const ControlPanel: FC<{
  stopStreaming: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}> = ({
  stopStreaming,
  toggleVideo,
  toggleAudio,
  toggleScreenShare,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
}) => (
  <div className="flex justify-center flex-wrap gap-4">
    <ControlButton
      onClick={stopStreaming}
      icon={<FaRegStopCircle className="text-lg" />}
      label="End"
      variant="danger"
    />
    <ControlButton
      onClick={toggleVideo}
      icon={
        isVideoEnabled ? (
          <FaVideoSlash className="text-lg" />
        ) : (
          <FaVideo className="text-lg" />
        )
      }
      label={isVideoEnabled ? "Video Off" : "Video On"}
      variant={isVideoEnabled ? "danger" : "success"}
    />
    <ControlButton
      onClick={toggleAudio}
      icon={
        isAudioEnabled ? (
          <FaMicrophoneAltSlash className="text-lg" />
        ) : (
          <FaMicrophoneAlt className="text-lg" />
        )
      }
      label={isAudioEnabled ? "Mute" : "Unmute"}
      variant={isAudioEnabled ? "danger" : "success"}
    />
    <ControlButton
      onClick={toggleScreenShare}
      icon={
        isScreenSharing ? (
          <MdOutlineStopScreenShare className="text-lg" />
        ) : (
          <MdOutlineScreenShare className="text-lg" />
        )
      }
      label={isScreenSharing ? "Stop Share" : "Share Screen"}
      variant={isScreenSharing ? "danger" : "success"}
    />
  </div>
);

const ControlButton: FC<{
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "danger" | "success";
}> = ({ onClick, icon, label, variant = "default" }) => {
  const styles = {
    default:
      "bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-slate-100",
    danger:
      "bg-red-900/50 border border-red-700 text-red-400 hover:bg-red-800/60 hover:text-red-300",
    success:
      "bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/60 hover:text-green-300",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-4 py-3 rounded-xl font-medium transition-colors text-sm ${styles[variant]}`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );
};

export default TrainerLiveSessionPage;
