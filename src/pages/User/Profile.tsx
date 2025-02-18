import { UserSidebar } from "@/components";
import UserLayout from "@/layouts/UserLayout";

const Profile = () => {
  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 h-80 bg-slate-400 md:mt-0">
          Profile
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
