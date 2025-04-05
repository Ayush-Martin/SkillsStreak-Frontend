import { FC } from "react";
import { Link } from "react-router-dom";

interface ILiveStreamCardProps {
  streamId: string;
  thumbnail: string;
  title: string;
  description: string;
}

const LiveStreamCard: FC<ILiveStreamCardProps> = ({
  streamId,
  thumbnail,
  title,
  description,
}) => {
  return (
    <Link
      to={`/user/live/${streamId}`}
      className="bg-[#1E1E1E] h-[200px] w-[250px] sm:h-[250px] sm:w-[300px] rounded-md block hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <div className="w-full rounded-md ">
        <img
          src={thumbnail}
          alt=""
          className="object-cover rounded-ss-md rounded-se-md h-[110px] sm:h-[160px] w-full"
        />
      </div>
      <div className="flex flex-col gap-1 px-3 ">
        <p className="text-lg font-semibold text-center sm:text-xl text-app-secondary">
          {title}
        </p>
        <p className="text-sm font-semibold text-center text-white sm:text-xl">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default LiveStreamCard;
