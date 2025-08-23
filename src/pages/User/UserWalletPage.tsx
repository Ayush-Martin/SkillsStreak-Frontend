import { UserSidebar } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { useEffect } from "react";

const UserWalletPage = () => {
  useEffect(() => {
    const fetchWalletHistory = async () => {
      const res = await axiosGetRequest("/wallet/history");
      if (!res) return;
    };

    fetchWalletHistory();
  });

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5 relative"></div>
      </div>
    </UserLayout>
  );
};

export default UserWalletPage;
