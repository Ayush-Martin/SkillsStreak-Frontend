import { StatCard } from "@/components";
import { FC } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";

interface ITrainerStudentsCardProps {
  totalStudents: number;
}

const TrainerStudentsCard: FC<ITrainerStudentsCardProps> = ({
  totalStudents,
}) => {
  return (
    <StatCard
      icon={<FaUserGraduate className="text-purple-400" />}
      title="Total Students"
      value={totalStudents}
      color="text-purple-400"
      hoverShadowColor="hover:shadow-purple-500/30"
    />
  );
};

interface ITrainerCoursesCardProps {
  totalCourses: number;
}

const TrainerTotalCoursesCard: FC<ITrainerCoursesCardProps> = ({
  totalCourses,
}) => {
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

export { TrainerStudentsCard, TrainerTotalCoursesCard };
