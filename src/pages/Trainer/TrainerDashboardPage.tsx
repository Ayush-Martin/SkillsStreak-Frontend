import { FC, useEffect, useState } from "react";

import TrainerLayout from "@/layouts/TrainerLayout";
import {
  TopItemsChart,
  AnalyticsAreaChart,
  WalletCard,
  TrainerStudentsCard,
  TrainerTotalCoursesCard,
} from "@/components";
import { useWallet } from "@/hooks";
import {
  getTrainerCoursesCount,
  getTrainerRevenueGraphData,
  getTrainerStudentsCount,
  getTrainerTop5Courses,
} from "@/api";
import { IRevenueGraph } from "@/types/revenueType";
import { ITop5Courses } from "@/types/courseType";

const Dashboard: FC = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [top5Courses, setTop5Courses] = useState<ITop5Courses>([]);
  const [revenueGraphData, setRevenueGraphData] = useState<IRevenueGraph>({
    daily: [],
    monthly: [],
    yearly: [],
  });

  useEffect(() => {
    const getStudentsCount = async () => {
      const data = await getTrainerStudentsCount();
      if (!data) return;
      setStudentsCount(data);
    };

    const getCoursesCount = async () => {
      const data = await getTrainerCoursesCount();
      if (!data) return;
      setCoursesCount(data);
    };

    const getTop5Courses = async () => {
      const data = await getTrainerTop5Courses();
      if (!data) return;
      setTop5Courses(data);
    };

    const getRevenueGraphData = async () => {
      const data = await getTrainerRevenueGraphData();
      if (!data) return;
      setRevenueGraphData(data);
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
        <TrainerStudentsCard totalStudents={studentsCount} />
        <TrainerTotalCoursesCard totalCourses={coursesCount} />
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
