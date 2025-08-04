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
      />
    </TrainerLayout>
  );
};

export default Students;
