import { FC } from "react";

import TrainerLayout from "@/layouts/TrainerLayout";
import {
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaUserGraduate,
} from "react-icons/fa";
import StatCard from "@/components/common/StatCard";
import TopItemsChart from "@/components/common/TopItemsChart";
import AnalyticsAreaChart from "@/components/common/AnalyticsAreaChart";

const RevenueCard = () => {
  return (
    <StatCard
      icon={<FaMoneyBillWave className="text-yellow-400" />}
      title="Total Revenue"
      value="₹ 45,000"
      color="text-yellow-400"
      hoverShadowColor="hover:shadow-yellow-500/30"
    />
  );
};

const StudentsCard = () => {
  return (
    <StatCard
      icon={<FaUserGraduate className="text-purple-400" />}
      title="Total Students"
      value={230}
      color="text-purple-400"
      hoverShadowColor="hover:shadow-purple-500/30"
    />
  );
};

const TotalCoursesCard = () => {
  return (
    <StatCard
      icon={<FaChalkboardTeacher className="text-indigo-500" />}
      title="Total Course"
      value={10}
      color="text-indigo-500"
      hoverShadowColor="hover:shadow-indigo-500"
    />
  );
};

const Dashboard: FC = () => {
  const topCourses = [
    { label: "React Basics", value: 120 },
    { label: "Next.js", value: 100 },
    { label: "Node.js", value: 80 },
    { label: "Tailwind CSS", value: 60 },
    { label: "TypeScript", value: 50 },
  ];

  const revenueData = [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1900 },
    { label: "Mar", value: 1400 },
    { label: "Apr", value: 2300 },
    { label: "May", value: 1800 },
    { label: "Jun", value: 2500 },
  ];

  return (
    <TrainerLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <RevenueCard />
        <StudentsCard />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <TotalCoursesCard />
        </div>
      </div>
      <div className="grid gird-cols-1 lg:grid-cols-2 gap-2">
        <TopItemsChart
          title="Top 5 Courses"
          data={topCourses}
          barColors={["#14b8a6", "#6366f1", "#f59e0b", "#a855f7", "#ec4899"]}
          height={320}
        />
        <AnalyticsAreaChart
          title="Monthly Revenue"
          data={revenueData}
          color="#10b981" // emerald-500
          height={320}
        />
      </div>
    </TrainerLayout>
  );
};

export default Dashboard;
