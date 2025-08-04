import {
  UserSidebar,
  SubscriptionCard,
  WalletCard,
  UserCourseStatsCard,
} from "@/components";

import { UserLayout } from "@/layouts";
import { FC, useEffect, useState } from "react";
import { useSubscription, useWallet } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getOverallCourseProgress } from "@/api";

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
      const data = await getOverallCourseProgress();
      if (!data) return;
      setOverallCourseProgress(data);
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
              onSubscribe={() => navigate("/subscriptions")}
            />

            <UserCourseStatsCard
              totalCompleted={overallCourseProgress?.coursesCompleted || 0}
              totalEnrolled={overallCourseProgress?.enrolledCourses || 0}
            />

            {/* Make this full width on md, normal on lg */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <WalletCard
                balance={wallet.balance}
                haveStripeId={haveStripeId}
                onRedeem={handleRedeem}
                onSetupAccount={setupStripeAccount}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DashBoard;
