import { UserSidebar } from "@/components";
import UserLayout from "@/layouts/UserLayout";
import { FC } from "react";

const Payments: FC = () => {
  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 h-80 bg-slate-400 md:mt-0">
          Payments
        </div>
      </div>
    </UserLayout>
  );
};

export default Payments;
