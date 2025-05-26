import { FC } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui";
import { FaLock } from "@/assets/icons/icons";

interface ILiveSessionCardProps {
  streamId: string;
  thumbnail: string;
  title: string;
  isLive: boolean;
  isPublic: boolean;
  courseAccess: boolean;
  courseId: string;
}

const LiveSessionCard: FC<ILiveSessionCardProps> = ({
  streamId,
  thumbnail,
  title,
  isLive,
  isPublic,
  courseAccess,
  courseId,
}) => {
  return (
    <div className="border border-app-primary bg-black  h-[170px] w-[250px] sm:h-[220px] sm:w-[300px] rounded-md block hover:scale-105 transition-all duration-300 ease-in-out p-1 relative">
      <Link
        to={`/user/courses/${courseId}/live/${streamId}`}
        className="w-full rounded-md border-b pb-2 border-app-border relative"
      >
        <img
          src={thumbnail}
          alt=""
          className="object-cover rounded-ss-md rounded-se-md h-[110px] sm:h-[160px] w-full"
        />
        {isLive && (
          <Badge className="bg-green-700 absolute bottom-2 left-1 text-sm">
            Live
          </Badge>
        )}
      </Link>
      <div className="flex flex-col gap-1 px-3 py-2 ">
        <p className="text-xl font-semibold text-center sm:text-xl text-app-neutral">
          {title}
        </p>
      </div>
      {!isPublic && !courseAccess && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-70 rounded-md flex justify-center items-center">
          <FaLock className="text-4xl text-white" />
        </div>
      )}
    </div>
  );
};

export default LiveSessionCard;
