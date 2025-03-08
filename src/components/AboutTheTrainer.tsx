import { FC } from "react";

import { FaUserTie } from "@/assets/icons";

interface IAboutTheTrainerProps {
  profileImage: string;
  username: string;
  about: string;
}

const AboutTheTrainer: FC<IAboutTheTrainerProps> = ({
  profileImage,
  username,
  about,
}) => {
  return (
    <div>
      <h1 className="text-lg text-white lg:text-2xl">About the trainer</h1>
      <div className="flex flex-col items-center gap-2 mt-2 md:flex-row justify between">
        <div className="flex flex-col gap-2">
          <div className="rounded-full w-36 h-36 bg-app-neutral">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="object-cover rounded-full w-36 h-36"
              />
            ) : (
              <div className="flex items-center justify-center text-6xl rounded-full w-36 h-36 text-app-primary ">
                <FaUserTie />
              </div>
            )}
          </div>
          <p className="text-lg text-center text-app-accent ">{username}</p>
        </div>
        <p className="px-2 text-sm text-white md:px-10">{about}</p>
      </div>
    </div>
  );
};

export default AboutTheTrainer;
