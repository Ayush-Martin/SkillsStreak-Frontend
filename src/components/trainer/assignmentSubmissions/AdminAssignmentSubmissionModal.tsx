import { FC } from "react";
import { Modal } from "@/components";
import { FileText, ImageIcon, Text } from "lucide-react";
import { cn } from "@/lib/utils";
import { IEnrolledCourseAssignmentSubmission } from "@/types/courseType";

interface IAdminAssignmentSubmissionModalProps {
  submission: IEnrolledCourseAssignmentSubmission;
  onClose: () => void;
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

const AdminAssignmentSubmissionModal: FC<
  IAdminAssignmentSubmissionModalProps
> = ({ onClose, submission }) => {
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
            className="w-full h-80 rounded-lg border border-gray-700 bg-gray-900 shadow-inner"
            title="Submitted PDF"
          />
        );
      case "image":
        return (
          <img
            src={path}
            alt="Submitted"
            className="w-full max-h-80 object-contain rounded-lg border border-gray-700 bg-gray-900 shadow-inner"
          />
        );
      case "text":
        return (
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-sm text-white/90 whitespace-pre-wrap shadow-inner">
            {content || path}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal onClose={onClose} title="Assignment Submission" heightPx={600}>
      <div className="space-y-6">
        {/* Header info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Description */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-inner">
          <div className="text-sm text-gray-400 mb-1">Description</div>
          <div className="text-sm text-white/90">{description}</div>
        </div>

        {/* Task */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-inner">
          <div className="text-sm text-gray-400 mb-1">Task</div>
          <div className="text-sm text-white/90">{task}</div>
        </div>

        {/* Submission */}
        <div>
          <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            {type === "pdf" && <FileText className="w-4 h-4 text-orange-400" />}
            {type === "image" && (
              <ImageIcon className="w-4 h-4 text-pink-400" />
            )}
            {type === "text" && <Text className="w-4 h-4 text-purple-400" />}
            Submission Content
          </div>
          {renderSubmitted()}
        </div>
      </div>
    </Modal>
  );
};

export default AdminAssignmentSubmissionModal;
