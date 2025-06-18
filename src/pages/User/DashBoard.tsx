import {
  Profile,
  SubscriptionCard,
  UserProfile,
  UserSidebar,
} from "@/components";
import { Button } from "@/components/ui";
import { axiosPostRequest } from "@/config/axios";
import { FORGET_PASSWORD_API } from "@/constants";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";
import { successPopup } from "@/utils/popup";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashBoard: FC = () => {
  const { email } = useSelector((state: RootReducer) => state.user);

  const navigate = useNavigate();

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
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5">
          <div className="flex flex-col gap-4 xl:gap-0 xl:flex-row items-center justify-center">
            <div className="flex flex-col justify-center gap-2  md:px-5 md:flex-col lg:flex-row">
              <SubscriptionCard />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DashBoard;
