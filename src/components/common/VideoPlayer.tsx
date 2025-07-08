import { FC } from "react";
import ReactPlayer from "react-player";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

interface IVideoPlayerPrams {
  url: string;
  thumbnail?: string;
  title: string;
}

const VideoPlayer: FC<IVideoPlayerPrams> = ({ url, thumbnail, title }) => {
  console.log(url);
  return (
    <MediaPlayer title={title} src={url} className="w-full h-full">
      <MediaProvider />
      <DefaultVideoLayout thumbnails={thumbnail} icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
