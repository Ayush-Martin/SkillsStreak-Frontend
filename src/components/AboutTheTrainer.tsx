import React, { FC } from "react";
import { FaUserTie } from "react-icons/fa6";

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
        <div className="flex flex-col ">
          <div className="rounded-full w-52 h-52 bg-app-neutral">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="object-cover rounded-full w-52 h-52"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full w-52 h-52 text-8xl text-app-primary ">
                <FaUserTie />
              </div>
            )}
          </div>
          <p className="text-lg text-center text-app-accent">{username}</p>
        </div>
        <p className="px-2 text-sm text-white md:px-10">{about}</p>
      </div>
    </div>
  );
};

export default AboutTheTrainer;
