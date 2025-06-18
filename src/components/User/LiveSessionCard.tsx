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
    <div className="border border-app-primary bg-[#111827] h-[170px] w-[250px] sm:h-[220px] sm:w-[300px] rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out relative group">
      <Link
        to={`/user/courses/${courseId}/live/${streamId}`}
        className="block w-full h-full"
      >
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-[110px] sm:h-[160px] rounded-t-lg transition-opacity duration-300 group-hover:opacity-90"
          />
          {isLive && (
            <Badge className="absolute top-2 left-2 text-white bg-green-600 text-xs px-2 py-[2px] rounded-full animate-pulse shadow-md">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-1 px-2 py-1">
          <p className="text-base sm:text-lg font-medium text-center text-app-neutral line-clamp-1">
            {title}
          </p>
        </div>
      </Link>

      {!isPublic && !courseAccess && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
          <div className="text-center">
            <FaLock className="text-3xl text-white mb-1" />
            <p className="text-xs text-white">Access Restricted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessionCard;
