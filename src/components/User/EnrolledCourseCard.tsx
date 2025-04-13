import { FC, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Progress } from "../ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { cancelEnrolledCourseApi } from "@/features/user/api/enrolledCourseApi";

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
  const dispatch: AppDispatch = useDispatch();
  const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("hello");
    dispatch(cancelEnrolledCourseApi(courseId));
  };

  console.log(
    new Date(createdAt).getTime() + 24 * 60 * 60 * 1000 < new Date().getTime(),
    new Date(createdAt).getTime()
  );

  return (
    <Link
      to={`/courses/${courseId}`}
      className="bg-[#1E1E1E] h-[210px] w-[250px] sm:h-[260px] sm:w-[300px] rounded-md block hover:scale-105 transition-all duration-300 ease-in-out"
    >
      <div className="w-full rounded-md ">
        <img
          src={thumbnail}
          alt=""
          className="object-cover rounded-ss-md rounded-se-md h-[110px] sm:h-[160px] w-full"
        />
      </div>
      <div className="flex flex-col gap-2 px-3 ">
        <p className="text-lg font-semibold text-center sm:text-xl text-app-tertiary">
          {title}
        </p>
        <Progress value={completedPercentage} className="w-[100%]" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-app-neutral font-josefinsans">
            {completedPercentage.toFixed(0)}% lessons completed
          </p>

          {new Date().getTime() <
            new Date(createdAt).getTime() + 24 * 60 * 60 * 1000 && (
            <button
              className="px-2 py-1 text-red-500 bg-transparent border border-red-500 rounded-md hover:bg-red-500 hover:text-white"
              onClick={handleCancel}
            >
              cancel
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EnrolledCourseCard;
