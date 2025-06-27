import { Profile, UserSidebar } from "@/components";
import { Button } from "@/components/ui";
import EditProfile from "@/components/User/EditProfile";
import { axiosPostRequest } from "@/config/axios";
import { FORGET_PASSWORD_API } from "@/constants";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { successPopup } from "@/utils/popup";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "@/assets/icons";
import { FaBookOpen, FaRegClock, FaWallet } from "react-icons/fa";
import StatCardWithProgress from "@/components/common/StatCardWithProgress";
import { isBefore, differenceInDays, format } from "date-fns";
import StatCard from "@/components/common/StatCard";

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

interface SubscriptionCardProps {
  startDate?: Date;
  endDate?: Date;
  onSubscribe?: () => void;
}

const SubscriptionCard: FC<SubscriptionCardProps> = ({
  startDate,
  endDate,
  onSubscribe,
}) => {
  const today = new Date();
  const isSubscribed =
    startDate && endDate && isBefore(today, new Date(endDate));

  const formattedStart = startDate ? format(startDate, "MMM dd, yyyy") : "-";
  const formattedEnd = endDate ? format(endDate, "MMM dd, yyyy") : "-";

  const daysLeft =
    isSubscribed && endDate ? differenceInDays(new Date(endDate), today) : 0;

  const progressPercent =
    startDate && endDate
      ? 100 -
        (differenceInDays(new Date(endDate), today) /
          differenceInDays(new Date(endDate), new Date(startDate))) *
          100
      : 0;

  const infoItems = [
    { label: "Started:", value: formattedStart },
    { label: "Expires:", value: formattedEnd },
    {
      label: "Days Left:",
      value: isSubscribed
        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
        : "Expired",
      className: isSubscribed
        ? daysLeft <= 3
          ? "text-red-400"
          : "text-green-400"
        : "",
    },
  ];

  return (
    <StatCardWithProgress
      icon={<FaRegClock />}
      title={isSubscribed ? "Premium Active" : "No Active Subscription"}
      items={infoItems}
      progressPercent={progressPercent}
      showProgress={isSubscribed}
      fallback={
        <div className="flex justify-center pt-2">
          <Button
            onClick={onSubscribe}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm shadow-lg transition"
          >
            Subscribe Now
          </Button>
        </div>
      }
    />
  );
};

const WalletCard = () => {
  return (
    <StatCard
      icon={<FaWallet className="text-blue-400" />}
      title="Wallet Balance"
      value={`₹ ${(1250.75).toFixed(2)}`}
      color="text-green-400"
      hoverShadowColor="hover:shadow-blue-400/30"
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

  const changePassword = async () => {
    const res = await axiosPostRequest(FORGET_PASSWORD_API, { email });
    if (!res) return;
    successPopup(res.message || "OTP sent to your email");
    navigate("/auth/verifyOTP", {
      state: {
        email,
        forAction: "resetPassword",
      },
    });
  };

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
              startDate={new Date("2025-06-01")}
              endDate={new Date("2025-07-01")}
              onSubscribe={() => console.log("subscribe clicked")}
            />

            <CourseStatsCard totalCompleted={2} totalEnrolled={30} />

            {/* Make this full width on md, normal on lg */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <WalletCard />
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
              onClick={changePassword}
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
