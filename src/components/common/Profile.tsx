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
    <div className="flex justify-center w-full">
      <div className="flex flex-col gap-4 py-4 border rounded-md md:px-14 border-app-border w-[300px] sm:w-[500px] lg:w-[700px]">
        <div className="flex justify-center">
          <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]  bg-white rounded-full ">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="object-cover rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
              />
            ) : (
              <div className="flex items-center justify-center text-4xl rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] text-app-primary ">
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
        </div>
        <div className="w-full px-10">
          <div className="border-t border-app-border">
            <h1 className="mt-3 text-lg text-white">About Me :</h1>
            <p className="text-sm text-app-neutral">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
