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
import { getTrainerStudentsApi } from "@/features/trainer/api/StudentsApi";
import { changePage } from "@/features/trainer/slice/StudentsSlice";
import { usePaginatedData } from "@/hooks";
import { TrainerLayout } from "@/layouts";
import { RootReducer } from "@/store";
import { FC } from "react";
import { useSelector } from "react-redux";

const pageSize = 10;

const Students: FC = () => {
  const { students, currentPage, totalPages, loading } = useSelector(
    (state: RootReducer) => state.trainerStudents
  );
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
  });

  return (
    <TrainerLayout>
      <SearchBox
        placeholder="search by email"
        search={search}
        searchHandler={searchHandler}
      />
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
