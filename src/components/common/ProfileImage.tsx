import { FaUserTie } from "@/assets/icons";
import { FC } from "react";

interface IProfileImageProps {
  profileImage: string;
  size: number | string;
  textSize: string;
}

const ProfileImage: FC<IProfileImageProps> = ({
  profileImage,
  size,
  textSize,
}) => {
  return (
    <div
      className={`w-${size} h-${size} rounded-full ${
        profileImage ? "" : "bg-app-neutral"
      } `}
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt=""
          className={`object-cover w-${size} h-${size} rounded-full`}
        />
      ) : (
        <div className={`flex items-center justify-center w-${size} h-${size}`}>
          <FaUserTie className={`text-black text-${textSize}`} />
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
