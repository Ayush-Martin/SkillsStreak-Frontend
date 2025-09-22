import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AdminAssignmentSubmissionModal,
  Pagination,
  SearchBox,
  TableSkeleton,
} from "@/components";
import { TrainerLayout } from "@/layouts";
import { IEnrolledCourseAssignmentSubmission } from "@/types/courseType";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePaginatedData } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootReducer } from "@/store";
import { changePage } from "@/features/trainer/slice/AssignmentSubmissionsSlice";
import {
  getTrainerAssignmentSubmissionsApi,
  TrainerChangeAssignmentSubmissionStatus,
} from "@/features/trainer/api/AssignmentSubmissionsApi";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import Filter from "@/components/common/Filter";
import { getTrainerCoursesList } from "@/api";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-800/30 text-green-400";
    case "redo":
      return "bg-red-800/30 text-red-400";
    case "completed":
      return "bg-yellow-800/30 text-yellow-400";
    case "pending":
    default:
      return "bg-gray-800/30 text-gray-400";
  }
};

const size = 5;

const TrainerAssignmentSubmissions = () => {
  const dispatch: AppDispatch = useDispatch();
  const [courses, setCourses] = useState<Array<{ _id: string; title: string }>>(
    []
  );
  const [courseId, setCourseId] = useState<string | "all">("all");
  const [status, setStatus] = useState<
    "all" | "completed" | "verified" | "redo"
  >("all");
  const { assignmentSubmissions, currentPage, totalPages, loading } =
    useSelector((state: RootReducer) => state.trainerAssignmentSubmissions);

  const {
    nextPage,
    paginatedData,
    previousPage,
    refreshHandler,
    searchHandler,
    search,
  } = usePaginatedData({
    data: assignmentSubmissions,
    currentPage,
    changePageApi: changePage,
    getDataApi: getTrainerAssignmentSubmissionsApi,
    size,
    extraData: {
      courseId,
      status,
    },
  });

  useEffect(() => {
    dispatch(
      getTrainerAssignmentSubmissionsApi({
        page: 1,
        courseId,
        search,
        size,
        status,
      })
    );
  }, [courseId, status]);

  const [selectedSubmission, setSelectedSubmission] =
    useState<IEnrolledCourseAssignmentSubmission | null>(null);

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
      <div className="mb-5">
        <SearchBox
          placeholder="Search by title"
          searchHandler={searchHandler}
          search={search}
        />
      </div>
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
          {
            label: "Status",
            default: { value: "all", placeholder: "All" },
            values: [
              { value: "completed", placeholder: "Completed" },
              { value: "verified", placeholder: "Verified" },
              { value: "redo", placeholder: "Redo" },
            ],
            selectedValue: status,
            changeSelectedValue: setStatus,
          },
        ]}
        clearFilters={() => {
          setCourseId("all");
          setStatus("all");
        }}
      />
      <button className="mt-10 text-3xl text-blue-600" onClick={refreshHandler}>
        <MdOutlineRefresh />
      </button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Assignment</TableHead>
            <TableHead className="text-white">Course</TableHead>
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
            <TableHead className="text-white">View</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableSkeleton widths={[200, 150, 100, 50]} />
        ) : (
          <TableBody>
            {paginatedData.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell>{submission.title}</TableCell>
                <TableCell>{submission.course.title}</TableCell>
                <TableCell>{submission.user.email}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium uppercase tracking-wide",
                      getStatusBadgeClass(submission.status)
                    )}
                  >
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  {submission.status === "completed" ? (
                    <>
                      <button
                        className="text-3xl text-green-500"
                        onClick={() =>
                          dispatch(
                            TrainerChangeAssignmentSubmissionStatus({
                              assignmentSubmissionId: submission._id,
                              status: "verified",
                            })
                          )
                        }
                      >
                        <AiOutlineCheckCircle />
                      </button>
                      <button
                        className="text-3xl text-red-500"
                        onClick={() => {
                          dispatch(
                            TrainerChangeAssignmentSubmissionStatus({
                              assignmentSubmissionId: submission._id,
                              status: "redo",
                            })
                          );
                        }}
                      >
                        <AiFillCloseCircle />
                      </button>
                    </>
                  ) : (
                    <h1 className="text-sm text-muted-foreground">No action</h1>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-blue-400 underline cursor-pointer text-sm hover:text-blue-300"
                  >
                    View
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {selectedSubmission && (
        <AdminAssignmentSubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
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

export default TrainerAssignmentSubmissions;
