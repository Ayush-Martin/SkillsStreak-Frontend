import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AdminAssignmentSubmissionModal,
  Pagination,
} from "@/components";
import { TrainerLayout } from "@/layouts";
import { IEnrolledCourseAssignmentSubmission } from "@/types/courseType";
import { useState } from "react";
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

const TrainerAssignmentSubmissions = () => {
  const dispatch: AppDispatch = useDispatch();
  const { assignmentSubmissions, currentPage, totalPages } = useSelector(
    (state: RootReducer) => state.trainerAssignmentSubmissions
  );

  const { nextPage, paginatedData, previousPage, refreshHandler } =
    usePaginatedData({
      data: assignmentSubmissions,
      currentPage,
      changePageApi: changePage,
      getDataApi: getTrainerAssignmentSubmissionsApi,
      size: 5,
    });

  const [selectedSubmission, setSelectedSubmission] =
    useState<IEnrolledCourseAssignmentSubmission | null>(null);

  return (
    <TrainerLayout>
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
      </Table>

      <AdminAssignmentSubmissionModal
        submission={selectedSubmission!}
        onClose={() => setSelectedSubmission(null)}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </TrainerLayout>
  );
};

export default TrainerAssignmentSubmissions;
