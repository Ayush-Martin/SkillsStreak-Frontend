import { Pagination, RefreshData, SearchBox } from "@/components";
import { TrainerStudentsTableSkeleton } from "@/components/skeletons";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { getTrainerStudentsApi } from "@/features/trainer/api/StudentsApi";
import { changePage } from "@/features/trainer/slice/StudentsSlice";
import usePaginatedData from "@/hooks/usePaginatedData";
import TrainerLayout from "@/layouts/TrainerLayout";
import { RootReducer } from "@/store";
import { ChevronsUpDown } from "lucide-react";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface IEnrolledCoursesProps {
  enrolledCourses: {
    _id: string;
    title: string;
    thumbnail: string;
  }[];
}

const EnrolledCourses: FC<IEnrolledCoursesProps> = ({ enrolledCourses }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between px-4 space-x-4">
        <div>
          <Link
            to={`/trainer/courses/${enrolledCourses[0]._id}`}
            className="flex items-center gap-4"
          >
            <img src={enrolledCourses[0].thumbnail} className="w-36" />
            <p className="text-lg">{enrolledCourses[0].title}</p>
          </Link>
          <CollapsibleContent className="space-y-10 ">
            {enrolledCourses.slice(1).map((course) => (
              <Link
                to={`/trainer/courses/${course._id}`}
                className="flex items-center gap-4 my-3"
              >
                <img src={course.thumbnail} className="w-36" />
                <p className="text-lg">{course.title}</p>
              </Link>
            ))}
          </CollapsibleContent>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="w-4 h-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
};

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
            {!paginatedData.length ? (
              <h1 className="mt-3 text-2xl">No Courses</h1>
            ) : (
              paginatedData.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.username}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.enrolledCourses.length}</TableCell>
                  <TableCell>
                    <EnrolledCourses
                      enrolledCourses={student.enrolledCourses}
                    />
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

export default Students;
