import { getTrainerCoursesList } from "@/api";
import {
  Pagination,
  RefreshData,
  SearchBox,
  TrainerStudentsEnrolledCourses,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TrainerStudentsTableSkeleton,
} from "@/components";
import Filter from "@/components/common/Filter";
import { getTrainerStudentsApi } from "@/features/trainer/api/StudentsApi";
import { changePage } from "@/features/trainer/slice/StudentsSlice";
import { usePaginatedData } from "@/hooks";
import { TrainerLayout } from "@/layouts";
import { AppDispatch, RootReducer } from "@/store";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const pageSize = 10;

const Students: FC = () => {
  const { students, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.trainerStudents
  );
  const [courses, setCourses] = useState<Array<{ _id: string; title: string }>>(
    []
  );
  const [courseId, setCourseId] = useState<string | "all">("all");
  const dispatch: AppDispatch = useDispatch();

  const {
    nextPage,
    paginatedData,
    previousPage,
    refreshHandler,
    search,
    searchHandler,
  } = usePaginatedData({
    data: students,
    currentPage,
    changePageApi: changePage,
    getDataApi: getTrainerStudentsApi,
    size: pageSize,
    extraData: {
      courseId,
    },
  });

  useEffect(() => {
    dispatch(
      getTrainerStudentsApi({
        page: 1,
        courseId,
        search,
        size: pageSize,
      })
    );
  }, [courseId]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getTrainerCoursesList();
      if (!data) return;
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <TrainerLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />
      <div className="mt-5">
        <Filter
          filters={[
            {
              label: "Courses",
              default: { value: "all", placeholder: "All" },
              values: courses.map((c) => ({
                value: c._id,
                placeholder: c.title,
              })),
              selectedValue: courseId,
              changeSelectedValue: setCourseId,
            },
          ]}
        />
      </div>
      <RefreshData refreshHandler={refreshHandler} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No of Enrolled</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Overall Completion</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TrainerStudentsTableSkeleton />
        ) : (
          <TableBody>
            {paginatedData.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.enrolledCourses.length}</TableCell>
                <TableCell>
                  <TrainerStudentsEnrolledCourses
                    enrolledCourses={student.enrolledCourses}
                  />
                </TableCell>
                <TableCell className="w-40">
                  <div className="flex flex-col">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${student.overallCompletion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {Math.round(student.overallCompletion)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <Pagination
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </TrainerLayout>
  );
};

export default Students;
