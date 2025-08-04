import { TrainerLiveSessionControls, VideoPlayer } from "@/components";
import useTrainerLiveSession from "@/hooks/useTrainerLiveSession";
import { TrainerLayout } from "@/layouts";
import { PiChatsCircleLight } from "react-icons/pi";

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
              <TrainerLiveSessionControls
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

export default TrainerLiveSessionPage;
