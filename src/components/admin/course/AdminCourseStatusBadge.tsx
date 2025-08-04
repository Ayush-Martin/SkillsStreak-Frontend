import { FC } from "react";

interface IAdminCourseStatusBadgeProps {
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "live"
    | "upcoming"
    | "completed";
}

const AdminCourseStatusBadge: FC<IAdminCourseStatusBadgeProps> = ({
  status,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          color: "bg-green-900/30 text-green-400 border-green-700",
          text: "Approved",
        };
      case "pending":
        return {
          color: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
          text: "Pending",
        };
      case "rejected":
        return {
          color: "bg-red-900/30 text-red-400 border-red-700",
          text: "Rejected",
        };
      case "live":
        return {
          color: "bg-red-900/30 text-red-400 border-red-700",
          text: "Live",
        };
      case "upcoming":
        return {
          color: "bg-blue-900/30 text-blue-400 border-blue-700",
          text: "Upcoming",
        };
      case "completed":
        return {
          color: "bg-white/5  text-gray-300 border-white/10",
          text: "Completed",
        };
      default:
        return {
          color: "bg-white/5  text-gray-300 border-white/10",
          text: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config.color}`}
    >
      {config.text}
    </span>
  );
};

export default AdminCourseStatusBadge;
