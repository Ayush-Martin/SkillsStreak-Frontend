import UserLayout from "@/layouts/UserLayout";
import { Pagination, UserSidebar } from "@/components";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import usePaginatedData from "@/hooks/usePaginatedData";
import { getCompletedEnrolledCoursesApi } from "@/features/user/api/completedEnrolledCoursesApi";
import { changePage } from "@/features/user/slice/completedEnrolledCourses";

const Certificates = () => {
  const { completedEnrolledCourses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.completedEnrolledCourses
  );

  const { paginatedData, nextPage, previousPage } = usePaginatedData({
    data: completedEnrolledCourses,
    currentPage,
    getDataApi: getCompletedEnrolledCoursesApi,
    changePageApi: changePage,
  });

  console.log(paginatedData);

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 h-80 md:mt-0">
          Certificates
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

export default Certificates;
