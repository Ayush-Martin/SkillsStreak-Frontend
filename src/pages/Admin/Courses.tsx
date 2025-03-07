import { useDispatch, useSelector } from "react-redux";
import { FC } from "react";

import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "../../store";
import usePaginatedData from "@/hooks/usePaginatedData";
import { IoEye, IoEyeOff, MdOutlineRefresh } from "@/assets/icons";
import {
  adminCourseListUnListApi,
  getAdminCoursesApi,
} from "@/features/admin/api/adminCourseApi";
import { changePage } from "@/features/admin/slice/adminCourseSlice";
import { Pagination, SearchBox } from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.adminCourses
  );

  const { paginatedData, nextPage, previousPage, search, searchHandler } =
    usePaginatedData({
      data: courses,
      currentPage,
      getDataApi: getAdminCoursesApi,
      changePageApi: changePage,
    });

  const refreshHandler = () => {
    dispatch(getAdminCoursesApi({ page: 1, search }));
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search ..."
        search={search}
        searchHandler={searchHandler}
      />

      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>List/UnList</TableHead>
          </TableRow>
        </TableHeader>

        {paginatedData.length === 0 ? (
          <div className="mt-10 mb-10 text-3xl">No categories found</div>
        ) : (
          <TableBody>
            {paginatedData.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  <img src={course.thumbnail} width={"200px"} />
                </TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.trainerId.email}</TableCell>
                <TableCell>{course.categoryId.categoryName}</TableCell>
                <TableCell>{course.difficulty}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <button
                    className={`text-3xl ${
                      course.isListed ? "text-red-500" : "text-app-secondary"
                    }`}
                    onClick={() =>
                      dispatch(adminCourseListUnListApi(course._id))
                    }
                  >
                    {course.isListed ? <IoEyeOff /> : <IoEye />}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {!!paginatedData.length && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      )}
    </AdminLayout>
  );
};

export default Courses;
