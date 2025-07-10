import { FC, useEffect, useState } from "react";

import TrainerLayout from "@/layouts/TrainerLayout";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import {
  StatCard,
  TopItemsChart,
  AnalyticsAreaChart,
  WalletCard,
} from "@/components";
import { useWallet } from "@/hooks";
import { axiosGetRequest } from "@/config/axios";

interface IStudentsCardProps {
  totalStudents: number;
}

const StudentsCard: FC<IStudentsCardProps> = ({ totalStudents }) => {
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

interface ICoursesCardProps {
  totalCourses: number;
}

const TotalCoursesCard: FC<ICoursesCardProps> = ({ totalCourses }) => {
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

interface graphData {
  label: string;
  value: number;
}

const Dashboard: FC = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [top5Courses, setTop5Courses] = useState<
    Array<{ title: string; enrolledCount: number; _id: string }>
  >([]);
  const [revenueGraphData, setRevenueGraphData] = useState<{
    daily: graphData[];
    monthly: graphData[];
    yearly: graphData[];
  }>({ daily: [], monthly: [], yearly: [] });

  useEffect(() => {
    const getStudentsCount = async () => {
      const res = await axiosGetRequest("/trainer/students/count");
      if (!res) return;
      setStudentsCount(res.data);
    };

    const getCoursesCount = async () => {
      const res = await axiosGetRequest("/trainer/courses/count");
      if (!res) return;
      setCoursesCount(res.data);
    };

    const getTop5Courses = async () => {
      const res = await axiosGetRequest("trainer/courses/top5");
      if (!res) return;
      setTop5Courses(res.data);
    };

    const getRevenueGraphData = async () => {
      const res = await axiosGetRequest("trainer/revenue/graph");
      if (!res) return;
      setRevenueGraphData(res.data);
    };

    getStudentsCount();
    getCoursesCount();
    getTop5Courses();
    getRevenueGraphData();
  }, []);

  const { handleRedeem, haveStripeId, setupStripeAccount, wallet } =
    useWallet();

  return (
    <TrainerLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StudentsCard totalStudents={studentsCount} />
        <TotalCoursesCard totalCourses={coursesCount} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <WalletCard
            balance={wallet.balance}
            haveStripeId={haveStripeId}
            onRedeem={handleRedeem}
            onSetupAccount={setupStripeAccount}
          />
        </div>
      </div>
      <div className="grid gird-cols-1 lg:grid-cols-2 gap-2">
        <TopItemsChart
          title="Top 5 Courses"
          data={top5Courses.map((course) => {
            return { label: course.title, value: course.enrolledCount };
          })}
          barColors={["#14b8a6", "#6366f1", "#f59e0b", "#a855f7", "#ec4899"]}
          height={320}
        />
        <AnalyticsAreaChart title="Revenue Overview" data={revenueGraphData} />
      </div>
    </TrainerLayout>
  );
};

export default Dashboard;
