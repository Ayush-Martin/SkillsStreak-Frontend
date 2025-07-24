import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrainerLayout } from "@/layouts";
import { axiosGetRequest } from "@/config/axios";
import { IViewAssignment } from "@/types/courseType";
import { FC, useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Text, Eye } from "lucide-react";
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
import { Pagination } from "@/components";
import { AiFillCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";

interface IAssignmentSubmission extends IViewAssignment {
  user: { _id: string; email: string };
  course: { _id: string; title: string };
}

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

const getTypeBadgeClass = (type?: string) => {
  switch (type) {
    case "text":
      return "bg-purple-800/30 text-purple-400";
    case "pdf":
      return "bg-orange-800/30 text-orange-400";
    case "image":
      return "bg-pink-800/30 text-pink-400";
    default:
      return "bg-gray-800/30 text-gray-400";
  }
};

const TrainerAssignmentSubmissions = () => {
  const dispatch: AppDispatch = useDispatch();
  const { assignmentSubmissions, currentPage, totalPages, loading } =
    useSelector((state: RootReducer) => state.trainerAssignmentSubmissions);

  const { nextPage, paginatedData, previousPage, refreshHandler } =
    usePaginatedData({
      data: assignmentSubmissions,
      currentPage,
      changePageApi: changePage,
      getDataApi: getTrainerAssignmentSubmissionsApi,
      size: 5,
    });

  const [selectedSubmission, setSelectedSubmission] =
    useState<IAssignmentSubmission | null>(null);

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

      <AssignmentSubmissionModal
        submission={selectedSubmission}
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

const AssignmentSubmissionModal: FC<{
  submission: IAssignmentSubmission | null;
  onClose: () => void;
}> = ({ submission, onClose }) => {
  if (!submission) return null;

  const {
    title,
    course,
    user,
    description,
    task,
    type,
    status,
    content,
    path,
  } = submission;

  const renderSubmitted = () => {
    switch (type) {
      case "pdf":
        return (
          <iframe
            src={path}
            className="w-full h-[500px] rounded border border-gray-700"
            title="Submitted PDF"
          />
        );
      case "image":
        return (
          <img
            src={path}
            alt="Submitted"
            className="w-full max-h-[500px] object-contain rounded border border-gray-700"
          />
        );
      case "text":
        return (
          <div className="p-4 bg-gray-900 border border-gray-700 rounded text-sm whitespace-pre-wrap">
            {content || path}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#0a0d17] text-white border border-gray-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-white">
            <Eye className="w-5 h-5 text-blue-400" />
            Assignment Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Assignment</div>
              <div className="font-semibold text-lg">{title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Course</div>
              <div className="font-semibold">{course.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">User</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium uppercase tracking-wide",
                  getStatusBadgeClass(status)
                )}
              >
                {status}
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium uppercase tracking-wide",
                  getTypeBadgeClass(type)
                )}
              >
                {type}
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Description</div>
            <div className="text-sm text-gray-200">{description}</div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-1">Task</div>
            <div className="text-sm text-gray-200">{task}</div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              {type === "pdf" && (
                <FileText className="w-4 h-4 text-orange-400" />
              )}
              {type === "image" && (
                <ImageIcon className="w-4 h-4 text-pink-400" />
              )}
              {type === "text" && <Text className="w-4 h-4 text-purple-400" />}
              Submission Content
            </div>
            {renderSubmitted()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerAssignmentSubmissions;
