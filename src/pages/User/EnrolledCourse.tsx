import { CourseCard, Pagination, UserSidebar } from "@/components";
import { getEnrolledCoursesApi } from "@/features/user/api/enrolledCourseApi";
import { changePage } from "@/features/user/slice/enrolledCourseSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { FC } from "react";
import { useSelector } from "react-redux";

const EnrolledCourse: FC = () => {
  const { enrolledCourses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.enrolledCourses
  );

  const { paginatedData, nextPage, previousPage } = usePaginatedData({
    data: enrolledCourses,
    currentPage,
    getDataApi: getEnrolledCoursesApi,
    changePageApi: changePage,
  });

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 h-80 md:mt-0">
          <div className="flex justify-center mt-10 lg:block sm:px-14 lg:px-24">
            <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedData.map((enrolledCourse) => (
                <CourseCard
                  _id={enrolledCourse.courseId}
                  key={enrolledCourse._id}
                  category={enrolledCourse.course.category.categoryName}
                  noOfEnrolled={10}
                  noOfModules={enrolledCourse.course.moduleCount}
                  price={enrolledCourse.course.price}
                  thumbnail={enrolledCourse.course.thumbnail}
                  title={enrolledCourse.course.title}
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
