import { useDispatch, useSelector } from "react-redux";
import { FC } from "react";

import AdminLayout from "@/layouts/AdminLayout";
import { AppDispatch, RootReducer } from "@/store";
import usePaginatedData from "@/hooks/usePaginatedData";
import {
  IoEye,
  IoEyeOff,
  MdOutlineRefresh,
  AiOutlineCheckCircle,
  AiFillCloseCircle,
} from "@/assets/icons";
import {
  adminCourseApproveRejectApi,
  adminCourseListUnListApi,
  getAdminCoursesApi,
} from "@/features/admin/api/adminCourseApi";
import { changePage } from "@/features/admin/slice/adminCourseSlice";
import {
  HighlightText,
  Pagination,
  SearchBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  CourseTableSkeleton,
} from "@/components";
import { useConfirm } from "@/hooks";
import { Link } from "react-router-dom";

const PAGE_SIZE = 3;

const Courses: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const confirm = useConfirm();
  const { courses, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.adminCourses
  );

  const {
    paginatedData,
    nextPage,
    previousPage,
    search,
    searchHandler,
    refreshHandler,
  } = usePaginatedData({
    data: courses,
    currentPage,
    getDataApi: getAdminCoursesApi,
    changePageApi: changePage,
    size: PAGE_SIZE,
  });

  const approvedRejectCourse = (
    courseId: string,
    status: "approved" | "rejected"
  ) => {
    confirm(`Are you sure you want to ${status} this course?`, () => {
      dispatch(adminCourseApproveRejectApi({ courseId, status }));
    });
  };

  const listUnlistCourse = (courseId: string, isListed: boolean) => {
    confirm(
      `Are you sure you want to ${isListed ? "unlist" : "list"} this course?`,
      () => {
        dispatch(adminCourseListUnListApi(courseId));
      }
    );
  };

  return (
    <AdminLayout>
      <SearchBox
        placeholder="search by course title"
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
            <TableHead>Price</TableHead>
            <TableHead>
              <span className="block text-center">status</span>
              <span className="block text-center">(approve/reject)</span>{" "}
            </TableHead>
            <TableHead>List/UnList</TableHead>
            <TableHead>view</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <CourseTableSkeleton />
        ) : (
          <TableBody>
            {paginatedData.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  <img src={course.thumbnail} width={"200px"} />
                </TableCell>
                <TableCell>
                  <HighlightText search={search} text={course.title} />
                </TableCell>
                <TableCell>{course.trainerId.email}</TableCell>
                <TableCell>{course.categoryId.categoryName}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell className="text-center">
                  {course.status == "pending" ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="text-3xl text-green-500"
                        onClick={() =>
                          approvedRejectCourse(course._id, "approved")
                        }
                      >
                        <AiOutlineCheckCircle />
                      </button>
                      <button
                        className="text-3xl text-red-500"
                        onClick={() =>
                          approvedRejectCourse(course._id, "rejected")
                        }
                      >
                        <AiFillCloseCircle />
                      </button>
                    </div>
                  ) : course.status == "approved" ? (
                    <p className="text-green-500">Approved</p>
                  ) : (
                    <p className="text-red-50">Rejected</p>
                  )}
                </TableCell>
                <TableCell>
                  <button
                    disabled={course.status !== "approved"}
                    className={`text-3xl ${
                      course.status !== "approved"
                        ? "text-gray-400"
                        : course.isListed
                        ? "text-red-500"
                        : "text-app-secondary"
                    }`}
                    onClick={() =>
                      listUnlistCourse(course._id, course.isListed)
                    }
                  >
                    {course.isListed ? <IoEyeOff /> : <IoEye />}
                  </button>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/admin/courses/${course._id}`}
                    className="text-sm text-blue-500 underline hover:text-purple-400 transition"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default Courses;
