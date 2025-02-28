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
import { RECORDS_PER_PAGE } from "@/constants/general";
import { getTrainerCoursesApi } from "@/features/trainer/api/TrainerCoursesApi";
import { changePage } from "@/features/trainer/slice/TrainerCoursesSlice";
import TrainerLayout from "@/layouts/TrainerLayout";
import { AppDispatch, RootReducer } from "@/store";
import { FC, useEffect, useMemo, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyCourses: FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { courses, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.trainerCourses
  );

  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;

  useEffect(() => {
    if (!courses.length) {
      dispatch(getTrainerCoursesApi({ page: 1, search }));
    }
  }, [dispatch, search, courses.length]);

  const paginatedCourses = useMemo(() => {
    return courses.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [courses, startIndex]);

  const previousPage = () => {
    if (currentPage > 1) dispatch(changePage(currentPage - 1));
  };

  const nextPage = () => {
    if (courses.length > startIndex + RECORDS_PER_PAGE) {
      dispatch(changePage(currentPage + 1));
    } else {
      dispatch(getTrainerCoursesApi({ page: currentPage + 1, search }));
    }
  };

  const searchHandler = (searchInput: string) => {
    setSearch(searchInput);
    dispatch(getTrainerCoursesApi({ page: 1, search: searchInput }));
  };

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
          {paginatedCourses.map((course) => (
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
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </TrainerLayout>
  );
};

export default MyCourses;
