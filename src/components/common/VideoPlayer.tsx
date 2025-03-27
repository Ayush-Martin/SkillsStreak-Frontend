import { FC } from "react";
import ReactPlayer from "react-player";

interface IVideoPlayerPrams {
  url: string;
}

const VideoPlayer: FC<IVideoPlayerPrams> = ({ url }) => {
  return (
    <ReactPlayer
      url={url}
      controls
      width="100%"
      height="100%"
      config={{
        file: {
          attributes: {
            crossOrigin: "anonymous",
          },
        },
      }}
    />
  );
};

export default VideoPlayer;
