import { EnrolledCourseLayout } from "@/layouts";
import {
  BadgeCheck,
  Clock,
  FileText,
  RefreshCcw,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCourseAssignments } from "@/hooks";
import { IAssignmentSubmission } from "@/types/courseType";
import { AssignmentModal } from "@/components";

const statusConfig = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    label: "Pending Submission",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-900/30 text-amber-300 border-amber-500/50",
  },
  completed: {
    icon: <BadgeCheck className="w-4 h-4" />,
    label: "Submitted",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-900/30 text-blue-300 border-blue-500/50",
  },
  verified: {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Verified",
    bgColor: "bg-emerald-900/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-900/30 text-emerald-300 border-emerald-500/50",
  },
  redo: {
    icon: <RefreshCcw className="w-4 h-4" />,
    label: "Needs Revision",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    iconColor: "text-red-400",
    badgeColor: "bg-red-900/30 text-red-300 border-red-500/50",
  },
};

const UserCourseAssignmentsPage = () => {
  const { assignments, completeAssignment, redoAssignment } =
    useCourseAssignments();
  const [selectedAssignment, setSelectedAssignment] =
    useState<IAssignmentSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (assignment: IAssignmentSubmission) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setIsModalOpen(false);
  };

  const groupedAssignments = {
    pending: assignments.filter((a) => a.status === "pending"),
    inProgress: assignments.filter((a) =>
      ["completed", "redo"].includes(a.status)
    ),
    completed: assignments.filter((a) => a.status === "verified"),
  };

  return (
    <EnrolledCourseLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 shadow-lg backdrop-blur-xl hover:shadow-2xl rounded-xl p-6 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Pending</p>
                  <p className="text-3xl font-bold text-amber-400">
                    {groupedAssignments.pending.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-500/70" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 shadow-lg backdrop-blur-xl hover:shadow-2xl rounded-xl p-6 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    In Review
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    {groupedAssignments.inProgress.length}
                  </p>
                </div>
                <BadgeCheck className="w-8 h-8 text-blue-500/70" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 shadow-lg backdrop-blur-xl hover:shadow-2xl rounded-xl p-6 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {groupedAssignments.completed.length}
                  </p>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-500/70" />
              </div>
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="space-y-8">
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No assignments found
                </h3>
                <p className="text-slate-400">
                  Check back later for new assignments.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {assignments.map((assignment) => {
                  const status = statusConfig[assignment.status];
                  return (
                    <div
                      key={assignment._id}
                      className={cn(
                        "bg-white/5 border border-white/10 shadow-lg backdrop-blur-xl hover:shadow-2xl rounded-xl p-6 transition-all duration-200 cursor-pointer group",
                        status.borderColor,
                        status.bgColor
                      )}
                      onClick={() => openModal(assignment)}
                    >
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border",
                            status.badgeColor
                          )}
                        >
                          <span className={status.iconColor}>
                            {status.icon}
                          </span>
                          {status.label}
                        </span>

                        <Eye className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      </div>

                      {/* Assignment Content */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg bg-white/5 border border-white/10"
                            )}
                          >
                            <FileText
                              className={cn("w-5 h-5", status.iconColor)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "font-semibold text-lg mb-1 line-clamp-1 text-white"
                              )}
                            >
                              {assignment.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-2">
                              {assignment.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Hint */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {isModalOpen && selectedAssignment && (
          <AssignmentModal
            assignment={selectedAssignment}
            onClose={closeModal}
            onSubmit={completeAssignment}
            redoAssignment={redoAssignment}
          />
        )}
      </div>
    </EnrolledCourseLayout>
  );
};

export default UserCourseAssignmentsPage;
