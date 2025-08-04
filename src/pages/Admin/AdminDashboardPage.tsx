import { FC, useEffect, useState } from "react";

import { AdminLayout } from "@/layouts";
import { useWallet } from "@/hooks";
import {
  AnalyticsAreaChart,
  TopItemsChart,
  TotalCoursesCard,
  UsersCard,
  WalletCard,
} from "@/components";
import { ITop5Courses } from "@/types/courseType";
import { IRevenueGraph } from "@/types/revenueType";
import {
  getAdminCoursesCount,
  getAdminRevenueGraphData,
  getAdminTop5Courses,
  getAdminUsersCount,
} from "@/api";

const Dashboard: FC = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [top5Courses, setTop5Courses] = useState<ITop5Courses>([]);
  const [revenueGraphData, setRevenueGraphData] = useState<IRevenueGraph>({
    daily: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    const getUsersCount = async () => {
      const data = await getAdminUsersCount();
      if (!data) return;
      setUsersCount(data);
    };

    const getCoursesCount = async () => {
      const data = await getAdminCoursesCount();
      if (!data) return;
      setCoursesCount(data);
    };
    const getTop5Courses = async () => {
      const data = await getAdminTop5Courses();
      if (!data) return;
      setTop5Courses(data);
    };

    const getRevenueGraphData = async () => {
      const data = await getAdminRevenueGraphData();
      if (!data) return;
      setRevenueGraphData(data);
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
