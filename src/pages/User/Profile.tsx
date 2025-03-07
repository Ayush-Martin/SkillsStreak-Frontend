import { FC } from "react";
import { useSelector } from "react-redux";

import { UserProfile, UserSidebar } from "@/components";
import UserLayout from "@/layouts/UserLayout";
import { RootReducer } from "@/store";

const Profile: FC = () => {
  const { username, email, about, profileImage, areaOfInterest } = useSelector(
    (state: RootReducer) => state.user
  );
  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="flex items-center justify-center w-full px-0 mt-10 ml-0 text-sm text-white md:px-20 md:mt-0 md:ml-64 md:text-base">
          <UserProfile
            username={username}
            email={email}
            about={about}
            profileImage={profileImage}
            areaOfInterest={areaOfInterest}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
