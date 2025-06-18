import { BookOpen, IndianRupee, Tag, Users } from "lucide-react";
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
}

const CourseCard: FC<ICourseCardParams> = ({
  _id,
  thumbnail,
  title,
  price,
  category,
  noOfModules,
  noOfEnrolled,
}) => {
  return (
    // <Link
    //   to={`/courses/${_id}`}
    //   className="bg-[#06070d] border border-[#0f1423] h-[230px] w-[250px] sm:h-[280px] sm:w-[300px] rounded-md block hover:scale-105 transition-all duration-300 ease-in-out p-2"
    // >
    //   <div className="w-full rounded-md border-b border-orange-300 pb-3">
    //     <img
    //       src={thumbnail}
    //       alt=""
    //       className="object-cover rounded-ss-md rounded-se-md h-[110px] sm:h-[160px] w-full"
    //     />
    //   </div>
    //   <div className="flex flex-col gap-1 px-3 py-2">
    //     <p className="text-lg font-semibold text-center sm:text-xl text-app-secondary">
    //       {title}
    //     </p>
    //     <div className="flex justify-between">
    //       {price == 0 ? (
    //         <p className="px-2 py-1 text-[12px] font-medium text-white rounded-sm bg-app-accent">
    //           Free
    //         </p>
    //       ) : (
    //         <p className="text-white text">₹ {price}</p>
    //       )}

    //       <p className="px-2 py-1 text-[12px] font-medium text-white rounded-sm bg-app-tertiary">
    //         {category}
    //       </p>
    //     </div>
    //     <div className="flex justify-between">
    //       <p className="text text-app-accent">{noOfEnrolled} enrolled</p>
    //       <p className="text text-app-accent">{noOfModules} modules</p>
    //     </div>
    //   </div>
    // </Link>
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
            <Tag size={12} />
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
            ⭐ {10}
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
            <Users size={16} className="text-blue-400" />
            <span>{noOfEnrolled.toLocaleString()} enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={16} className="text-green-400" />
            <span>{noOfModules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee size={16} className="text-green-400" />
            <span>{price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
