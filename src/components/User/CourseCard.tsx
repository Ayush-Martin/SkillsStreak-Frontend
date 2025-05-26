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
    <Link
      to={`/courses/${_id}`}
      className="bg-[#06070d] border border-[#0f1423] h-[230px] w-[250px] sm:h-[280px] sm:w-[300px] rounded-md block hover:scale-105 transition-all duration-300 ease-in-out p-2"
    >
      <div className="w-full rounded-md border-b border-orange-300 pb-3">
        <img
          src={thumbnail}
          alt=""
          className="object-cover rounded-ss-md rounded-se-md h-[110px] sm:h-[160px] w-full"
        />
      </div>
      <div className="flex flex-col gap-1 px-3 py-2">
        <p className="text-lg font-semibold text-center sm:text-xl text-app-secondary">
          {title}
        </p>
        <div className="flex justify-between">
          {price == 0 ? (
            <p className="px-2 py-1 text-[12px] font-medium text-white rounded-sm bg-app-accent">
              Free
            </p>
          ) : (
            <p className="text-white text">₹ {price}</p>
          )}

          <p className="px-2 py-1 text-[12px] font-medium text-white rounded-sm bg-app-tertiary">
            {category}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text text-app-accent">{noOfEnrolled} enrolled</p>
          <p className="text text-app-accent">{noOfModules} modules</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
