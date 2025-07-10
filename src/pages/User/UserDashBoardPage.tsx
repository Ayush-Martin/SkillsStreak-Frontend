import { Profile, UserSidebar } from "@/components";
import { Button } from "@/components/ui";
import EditProfile from "@/components/user/EditProfile";
import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { FORGET_PASSWORD_API } from "@/constants";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { successPopup } from "@/utils/popup";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "@/assets/icons";
import { FaBookOpen } from "react-icons/fa";
import StatCardWithProgress from "@/components/common/StatCardWithProgress";
import SubscriptionCard from "@/components/user/SubscriptionCard";
import { useSubscription } from "@/hooks";
import WalletCard from "@/components/user/WalletCard";
import useWallet from "@/hooks/useWallet";

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
  const {
    email,
    bio,
    company,
    place,
    position,
    profileImage,
    socialLinks,
    username,
  } = useSelector((state: RootReducer) => state.user);

  const navigate = useNavigate();
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const { getSubscribed, subscriptionDetail } = useSubscription();
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
          {openEditProfile && (
            <EditProfile
              close={() => setOpenEditProfile(false)}
              data={{
                bio,
                company,
                place,
                position,
                profileImage,
                socialLinks,
                username,
              }}
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <SubscriptionCard
              active={!!subscriptionDetail?.active}
              startDate={subscriptionDetail?.startDate}
              endDate={subscriptionDetail?.endDate}
              onSubscribe={getSubscribed}
            />

            <CourseStatsCard
              totalCompleted={overallCourseProgress?.coursesCompleted || 0}
              totalEnrolled={overallCourseProgress?.enrolledCourses || 0}
            />

            {/* Make this full width on md, normal on lg */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <WalletCard
                balance={wallet.balance}
                commissionAmount={wallet.commission}
                haveStripeId={haveStripeId}
                redeemableAmount={wallet.redeemable}
                onRedeem={handleRedeem}
                onSetupAccount={setupStripeAccount}
              />
            </div>
          </div>

          <div className="flex justify-center items-center gap-3">
            <Button
              className="flex items-center gap-1 bg-transparent border border-app-border"
              onClick={() => setOpenEditProfile(true)}
            >
              <ImProfile /> Edit profile
            </Button>
            <Button
              className="flex items-center gap-1 bg-transparent border border-app-border"
              onClick={() => navigate("/user/changePassword")}
            >
              <RiLockPasswordFill />
              Change Password
            </Button>
          </div>
          <Profile
            {...{
              bio,
              email,
              company,
              place,
              position,
              profileImage,
              socialLinks,
              username,
            }}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default DashBoard;
