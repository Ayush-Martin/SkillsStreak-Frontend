import { FC, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Progress } from "../ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { cancelEnrolledCourseApi } from "@/features/user/api/enrolledCourseApi";
import { Tag } from "lucide-react";

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
  createdAt,
}) => {
  console.log(
    new Date(createdAt).getTime() + 24 * 60 * 60 * 1000 < new Date().getTime(),
    new Date(createdAt).getTime()
  );

  return (
    <Link
      to={`/user/enrolledCourses/${courseId}`}
      className="  bg-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-gray-800 group"
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Progress</span>
            <span className="text-white text-sm font-medium">
              {completedPercentage}%
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completedPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnrolledCourseCard;
