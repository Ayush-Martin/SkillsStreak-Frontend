import { Pagination, SearchBox } from "@/components";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getTrainerCoursesApi } from "@/features/trainer/api/TrainerCoursesApi";
import { changePage } from "@/features/trainer/slice/TrainerCoursesSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import TrainerLayout from "@/layouts/TrainerLayout";
import { AppDispatch, RootReducer } from "@/store";
import { FC } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyCourses: FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { courses, currentPage, totalPages } = useSelector(
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
          </TableRow>
        </TableHeader>

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
              </TableRow>
            ))
          )}
        </TableBody>
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
