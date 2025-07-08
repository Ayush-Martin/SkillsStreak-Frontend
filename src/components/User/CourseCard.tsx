import { FaBookOpen, FaTag, FaUsers, FaIndianRupeeSign } from "@/assets/icons";
import { FC } from "react";
import { Link } from "react-router-dom";

interface ICourseCardParams {
  _id: string;
  thumbnail: string;
  title: string;
  price: number;
  category: string;
  noOfEnrolled: number;
  noOfModules: number;
  averageRating: number;
}

const CourseCard: FC<ICourseCardParams> = ({
  _id,
  thumbnail,
  title,
  price,
  category,
  noOfModules,
  noOfEnrolled,
  averageRating,
}) => {
  return (
    <Link
      to={`/courses/${_id}`}
      className="  bg-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-gray-800 group"
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <FaTag size={12} />
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
            ⭐ {averageRating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <FaUsers size={16} className="text-blue-400" />
            <span>{noOfEnrolled.toLocaleString()} enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBookOpen size={16} className="text-green-400" />
            <span>{noOfModules} modules</span>
          </div>

          {price === 0 ? (
            <div className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md hover:shadow-indigo-500/40 transition-all duration-200">
              Free
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <FaIndianRupeeSign size={16} className="text-green-400" />
              <span>{price}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
