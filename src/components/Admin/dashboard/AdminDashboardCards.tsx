import { StatCard } from "@/components/common";
import { FC } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

interface IUsersCardProps {
  totalUsers: number;
}

const UsersCard: FC<IUsersCardProps> = ({ totalUsers }) => {
  return (
    <StatCard
      icon={<FaUsers className="text-purple-400" />}
      title="Total Users"
      value={totalUsers}
      color="text-purple-400"
      hoverShadowColor="hover:shadow-purple-500/30"
    />
  );
};

interface ITotalCoursesCard {
  totalCourses: number;
}

const TotalCoursesCard: FC<ITotalCoursesCard> = ({ totalCourses }) => {
  return (
    <StatCard
      icon={<FaChalkboardTeacher className="text-indigo-500" />}
      title="Total Course"
      value={totalCourses}
      color="text-indigo-500"
      hoverShadowColor="hover:shadow-indigo-500"
    />
  );
};

export { UsersCard, TotalCoursesCard };
