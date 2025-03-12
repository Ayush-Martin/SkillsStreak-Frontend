import { SubscriptionCard, UserSidebar } from "@/components";
import UserLayout from "@/layouts/UserLayout";

const DashBoard = () => {
  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full px-5 mt-10 ml-0 text-white md:ml-64 h-80 md:mt-0">
          <div className="gap-4 md:flex">
            <SubscriptionCard />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default DashBoard;
