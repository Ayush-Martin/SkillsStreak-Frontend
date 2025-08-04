import { FC } from "react";
import {
  FaRegStopCircle,
  FaMicrophoneAltSlash,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { FaVideoSlash, FaVideo } from "react-icons/fa6";
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from "react-icons/md";
import TrainerControlButton from "./TrainerControlButton";
interface ITrainerLiveSessionControlsProps {
  stopStreaming: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

const TrainerLiveSessionControls: FC<ITrainerLiveSessionControlsProps> = ({
  isAudioEnabled,
  isScreenSharing,
  isVideoEnabled,
  stopStreaming,
  toggleAudio,
  toggleScreenShare,
  toggleVideo,
}) => {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      <TrainerControlButton
        onClick={stopStreaming}
        icon={<FaRegStopCircle className="text-lg" />}
        label="End"
        variant="danger"
      />
      <TrainerControlButton
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
      <TrainerControlButton
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
      <TrainerControlButton
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
};

export default TrainerLiveSessionControls;
