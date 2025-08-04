import { FC } from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { Progress } from "../../ui";

interface IEnrolledCourseCardParams {
  courseId: string;
  title: string;
  thumbnail: string;
  completedPercentage: number;
  createdAt: string;
}

const EnrolledCourseCard: FC<IEnrolledCourseCardParams> = ({
  courseId,
  completedPercentage,
  thumbnail,
  title,
}) => {
  return (
    <Link
      to={`/user/enrolledCourses/${courseId}`}
      className="group bg-[#0e111b] rounded-2xl overflow-hidden border border-[#1c1f2e] hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="flex items-start gap-3">
          <Tag size={18} className="text-purple-400 mt-1" />
          <h3 className="text-white text-lg font-semibold leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              {completedPercentage}%
            </span>
          </div>
          <Progress value={completedPercentage} className="h-2 bg-gray-700" />
        </div>
      </div>
    </Link>
  );
};

export default EnrolledCourseCard;
