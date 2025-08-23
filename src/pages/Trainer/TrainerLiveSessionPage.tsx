import { useState } from "react";
import { LiveChat, VideoPlayer } from "@/components";
import useTrainerLiveSession from "@/hooks/useTrainerLiveSession";
import { TrainerLayout } from "@/layouts";
import {
  SlidersHorizontal,
  Video,
  Mic,
  ScreenShare,
  StopCircle,
} from "lucide-react";

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
    liveChats,
    sendMessage,
  } = useTrainerLiveSession();

  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <TrainerLayout>
      <div className={`flex flex-col xl:flex-row gap-6 mb-4 h-full`}>
        {/* Video Section */}
        <div
          className={`w-full xl:flex-[3] relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 flex flex-col 
  ${isStreaming ? "h-[50vh] xl:h-[calc(100vh-180px)]" : "h-auto"}`}
        >
          <div className={`relative w-full flex-1 min-h-0`}>
            {!isStreaming && recordedSrc && (
              <VideoPlayer title="" url={recordedSrc} />
            )}

            {isStreaming && (
              <>
                <video
                  ref={screenShareRef}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    isScreenSharing ? "opacity-100" : "opacity-0"
                  }`}
                  autoPlay
                />
                <video
                  ref={cameraVideoRef}
                  className={`absolute z-10 transition-all duration-300 ${
                    isScreenSharing
                      ? "bottom-2 right-2 md:bottom-5 md:right-5 w-24 h-24 md:w-44 md:h-44 bg-blue-500/20 backdrop-blur-xl shadow-xl rounded-xl"
                      : "inset-0 w-full h-full object-cover"
                  }`}
                  autoPlay
                  playsInline
                  style={{ transform: "rotateY(180deg)" }}
                />
              </>
            )}
          </div>

          {/* Collapsible Controls Inline */}
          {isStreaming && (
            <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 flex items-center gap-2 md:gap-4 z-10 bg-black/30 backdrop-blur-md rounded-full p-2 md:p-3">
              {/* Collapse / Expand Button */}
              <button
                onClick={() => setControlsOpen(!controlsOpen)}
                className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 transition-all duration-200"
              >
                <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              {/* Other Controls */}
              {controlsOpen && (
                <>
                  <button
                    onClick={toggleVideo}
                    className={`p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 ${
                      isVideoEnabled
                        ? "ring-2 ring-green-400 shadow-green-500/50"
                        : "opacity-70"
                    }`}
                  >
                    <Video
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        isVideoEnabled ? "text-green-400" : "text-white"
                      }`}
                    />
                  </button>

                  <button
                    onClick={toggleAudio}
                    className={`p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 ${
                      isAudioEnabled
                        ? "ring-2 ring-green-400 shadow-green-500/50"
                        : "opacity-70"
                    }`}
                  >
                    <Mic
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        isAudioEnabled ? "text-green-400" : "text-white"
                      }`}
                    />
                  </button>

                  <button
                    onClick={toggleScreenShare}
                    className={`p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 ${
                      isScreenSharing
                        ? "ring-2 ring-blue-400 shadow-blue-500/50"
                        : "opacity-70"
                    }`}
                  >
                    <ScreenShare
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        isScreenSharing ? "text-blue-400" : "text-white"
                      }`}
                    />
                  </button>

                  <button
                    onClick={stopStreaming}
                    className="p-2 md:p-3 rounded-full bg-red-600/80 backdrop-blur-md border border-red-500 text-white shadow-lg hover:bg-red-700 transition-all duration-200"
                  >
                    <StopCircle className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Chat Section */}
        {isStreaming && (
          <div className="w-full md:w-auto md:flex-1 h-[40vh] md:h-auto">
            <LiveChat liveChats={liveChats} sendMessage={sendMessage} />
          </div>
        )}
      </div>
    </TrainerLayout>
  );
};

export default TrainerLiveSessionPage;
