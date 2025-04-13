import { FC } from "react";
import { useSelector } from "react-redux";

import { EnrolledCourseCard, Pagination, UserSidebar } from "@/components";
import { getEnrolledCoursesApi } from "@/features/user/api/enrolledCourseApi";
import { changePage } from "@/features/user/slice/enrolledCourseSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";

const PAGE_SIZE = 6;

const EnrolledCourse: FC = () => {
  const { enrolledCourses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.enrolledCourses
  );

  const { paginatedData, nextPage, previousPage } = usePaginatedData({
    data: enrolledCourses,
    currentPage,
    getDataApi: getEnrolledCoursesApi,
    changePageApi: changePage,
    size: PAGE_SIZE,
  });

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-5 ml-0 text-white pt-7 md:ml-64 md:mt-0">
          <h1 className="text-xl text-center text-white font-boldonse">
            Continue Learning
          </h1>
          <div className="flex justify-center mt-10 sm:px-14 lg:px-24">
            <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedData.map((enrolledCourse) => (
                <EnrolledCourseCard
                  key={enrolledCourse._id}
                  completedPercentage={enrolledCourse.completedPercentage}
                  thumbnail={enrolledCourse.course.thumbnail}
                  title={enrolledCourse.course.title}
                  courseId={enrolledCourse.course._id}
                  createdAt={enrolledCourse.createdAt}
                />
              ))}
            </div>
          </div>

          {paginatedData.length != 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              previousPage={previousPage}
              nextPage={nextPage}
            />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default EnrolledCourse;
