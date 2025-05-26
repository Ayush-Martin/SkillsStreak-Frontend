import { FaUserTie } from "@/assets/icons";
import { FC } from "react";

interface IProfileProps {
  username: string;
  email: string;
  profileImage: string;
  about: string;
}

const Profile: FC<IProfileProps> = ({
  username,
  email,
  profileImage,
  about,
}) => {
  return (
    <div className="flex items-center flex-col  sm:flex-row gap-7 py-4 border rounded-md md:px-8 border-app-border w-[300px] sm:w-[480px] ">
      <div className="flex justify-center">
        <div className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px]  bg-white rounded-full ">
          {profileImage ? (
            <img
              src={profileImage}
              alt=""
              className="object-cover rounded-full w-[150px] h-[150px] sm:w-[180px] sm:h-[180px]"
            />
          ) : (
            <div className="flex items-center justify-center text-7xl rounded-full w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] text-app-primary ">
              <FaUserTie />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col text-center">
        <h1 className="text-xl text-center md:text-2xl text-app-secondary font-josefinsans">
          {username}
        </h1>
        <a
          href={`mailto:${email}`}
          className=" text-app-accent hover:underline font-tektur"
        >
          {email}
        </a>
        <div className="w-full px-10">
          <div className="border-t border-app-border">
            <p className="text-sm text-app-neutral">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
