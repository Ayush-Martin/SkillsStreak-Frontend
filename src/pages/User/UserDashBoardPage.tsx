import { UserSidebar } from "@/components";

import { axiosGetRequest } from "@/config/axios";

import UserLayout from "@/layouts/UserLayout";

import { FC, useEffect, useState } from "react";

import { FaBookOpen } from "react-icons/fa";
import StatCardWithProgress from "@/components/common/StatCardWithProgress";
import SubscriptionCard from "@/components/user/SubscriptionCard";
import { useSubscription } from "@/hooks";
import WalletCard from "@/components/user/WalletCard";
import useWallet from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";

interface CourseStatsCardProps {
  totalEnrolled: number;
  totalCompleted: number;
}

const CourseStatsCard: FC<CourseStatsCardProps> = ({
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

const DashBoard: FC = () => {
  const { subscriptionDetail } = useSubscription();
  const navigate = useNavigate();
  const [overallCourseProgress, setOverallCourseProgress] = useState<{
    enrolledCourses: number;
    coursesCompleted: number;
  }>();

  const { wallet, haveStripeId, handleRedeem, setupStripeAccount } =
    useWallet();

  useEffect(() => {
    const fetchOverallCourseProgress = async () => {
      const res = await axiosGetRequest("/enrolledCourses/progress");
      if (!res) return;
      setOverallCourseProgress(res.data);
    };

    fetchOverallCourseProgress();
  }, []);

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <SubscriptionCard
              startDate={subscriptionDetail?.startDate}
              endDate={subscriptionDetail?.endDate}
              onSubscribe={() => {}}
            />

            <CourseStatsCard
              totalCompleted={overallCourseProgress?.coursesCompleted || 0}
              totalEnrolled={overallCourseProgress?.enrolledCourses || 0}
            />

            {/* Make this full width on md, normal on lg */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <WalletCard
                balance={wallet.balance}
                haveStripeId={haveStripeId}
                onRedeem={handleRedeem}
                onSetupAccount={() => navigate("/subscriptionPlans")}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DashBoard;
