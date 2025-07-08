import { FC, useEffect, useState } from "react";

import { FaChalkboardTeacher } from "react-icons/fa";
import { AdminLayout } from "@/layouts";
import { FaUsers } from "react-icons/fa6";
import useWallet from "@/hooks/useWallet";
import WalletCard from "@/components/user/WalletCard";
import { axiosGetRequest } from "@/config/axios";
import { AnalyticsAreaChart, StatCard, TopItemsChart } from "@/components";

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

interface graphData {
  label: string;
  value: number;
}

const Dashboard: FC = () => {
  const [usersCount, setUsersCount] = useState(0);
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
    const getUsersCount = async () => {
      const res = await axiosGetRequest("/admin/users/count");
      if (!res) return;
      setUsersCount(res.data);
    };

    const getCoursesCount = async () => {
      const res = await axiosGetRequest("/admin/courses/count");
      if (!res) return;
      setCoursesCount(res.data);
    };
    const getTop5Courses = async () => {
      const res = await axiosGetRequest("/admin/courses/top5");
      if (!res) return;
      setTop5Courses(res.data);
    };

    const getRevenueGraphData = async () => {
      const res = await axiosGetRequest("admin/revenue/graph");
      if (!res) return;
      setRevenueGraphData(res.data);
    };

    getUsersCount();
    getCoursesCount();
    getTop5Courses();
    getRevenueGraphData();
  }, []);

  const { handleRedeem, haveStripeId, setupStripeAccount, wallet } =
    useWallet();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <UsersCard totalUsers={usersCount} />
        <TotalCoursesCard totalCourses={coursesCount} />
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <WalletCard
            balance={wallet.balance}
            haveStripeId={haveStripeId}
            onRedeem={handleRedeem}
            onSetupAccount={setupStripeAccount}
            commissionAmount={wallet.commission}
            redeemableAmount={wallet.redeemable}
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
    </AdminLayout>
  );
};

export default Dashboard;
