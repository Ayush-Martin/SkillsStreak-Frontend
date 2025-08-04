import { Skeleton } from "@/components";

const CourseCardSkeleton = () => {
  return (
    <div className="bg-[#1E1E1E] h-[200px] w-[250px] sm:h-[250px] sm:w-[300px] rounded-md block ">
      {/* Image Skeleton with darker shade */}
      <Skeleton className="w-full h-[110px] sm:h-[160px] rounded-ss-md rounded-se-md bg-gray-700" />

      <div className="flex flex-col gap-1 px-3 mt-2">
        {/* Title Skeleton with lighter shade */}
        <Skeleton className="w-3/4 h-4 mx-auto bg-gray-600 sm:h-6" />

        {/* Price and Category Skeletons with medium gray */}
        <div className="flex justify-between mt-2">
          <Skeleton className="w-12 h-5 bg-gray-500 rounded-sm sm:w-16" />
          <Skeleton className="w-16 h-5 bg-gray-500 rounded-sm sm:w-20" />
        </div>

        {/* Enrolled and Modules Skeletons with different color */}
        <div className="flex justify-between mt-2">
          <Skeleton className="h-4 bg-gray-400 w-14 sm:w-20" />
          <Skeleton className="h-4 bg-gray-400 w-14 sm:w-20" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
