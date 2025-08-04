import { StatCardWithProgress } from "@/components";
import { FC } from "react";
import { FaBookOpen } from "react-icons/fa6";

interface IUserCourseStatsCardProps {
  totalEnrolled: number;
  totalCompleted: number;
}

export const UserCourseStatsCard: FC<IUserCourseStatsCardProps> = ({
  totalEnrolled,
  totalCompleted,
}) => {
  const progressPercent =
    totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

  const infoItems = [
    { label: "Courses Enrolled:", value: totalEnrolled.toString() },
    {
      label: "Courses Completed:",
      value: totalCompleted.toString(),
      className: "text-green-400",
    },
    {
      label: "Completion:",
      value: `${progressPercent}%`,
      className:
        progressPercent < 40
          ? "text-red-400"
          : progressPercent < 80
          ? "text-yellow-400"
          : "text-green-400",
    },
  ];

  return (
    <StatCardWithProgress
      icon={<FaBookOpen />}
      title="Course Progress"
      items={infoItems}
      progressPercent={progressPercent}
      progressColor="from-blue-500 via-indigo-500 to-teal-400"
      shadowColor="hover:shadow-blue-500/30"
    />
  );
};
