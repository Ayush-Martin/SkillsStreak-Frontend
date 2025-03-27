import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FC } from "react";

import { Pagination, SearchBox } from "@/components";
import {
  Button,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@/components/ui";
import {
  getTrainerCoursesApi,
  trainerCourseListUnListApi,
} from "@/features/trainer/api/TrainerCoursesApi";
import { changePage } from "@/features/trainer/slice/TrainerCoursesSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import TrainerLayout from "@/layouts/TrainerLayout";
import { AppDispatch, RootReducer } from "@/store";
import { IoEye, IoEyeOff, MdOutlineRefresh } from "@/assets/icons";
import { CourseTableSkeleton } from "@/components/skeletons";

const MyCourses: FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.trainerCourses
  );

  const { nextPage, paginatedData, previousPage, search, searchHandler } =
    usePaginatedData({
      data: courses,
      currentPage,
      getDataApi: getTrainerCoursesApi,
      changePageApi: changePage,
    });

  const refreshHandler = () => {
    dispatch(getTrainerCoursesApi({ page: 1, search }));
  };

  return (
    <TrainerLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />

      <div className="flex justify-center w-full my-5">
        <Button variant={"v1"} onClick={() => navigate("/trainer/courses/add")}>
          Add Course
        </Button>
      </div>
      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>List / UnList</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <CourseTableSkeleton />
        ) : (
          <TableBody>
            {!paginatedData.length ? (
              <h1 className="mt-3 text-2xl">No Courses</h1>
            ) : (
              paginatedData.map((course) => (
                <TableRow
                  key={course._id}
                  onClick={() => navigate(`/trainer/courses/${course._id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <img src={course.thumbnail} width={"200px"} />
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>{course.difficulty}</TableCell>
                  <TableCell>{course.categoryId.categoryName}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    <button
                      disabled={course.status !== "approved"}
                      className={`text-3xl ${
                        course.status !== "approved"
                          ? "text-gray-500"
                          : course.isListed
                          ? "text-red-500"
                          : "text-app-secondary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(trainerCourseListUnListApi(course._id));
                      }}
                    >
                      {course.isListed ? <IoEyeOff /> : <IoEye />}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        )}
      </Table>

      {paginatedData.length != 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      )}
    </TrainerLayout>
  );
};

export default MyCourses;
