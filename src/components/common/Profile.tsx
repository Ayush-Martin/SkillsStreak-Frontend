import {
  FaGithub,
  FaGlobe,
  FaLinkedin,
  HiBuildingOffice,
  MdEmail,
  MdPlace,
} from "@/assets/icons";
import { FC, JSX } from "react";
import ProfileImage from "./ProfileImage";
import { IProfile } from "@/types/userType";

const Profile: FC<IProfile> = ({
  username,
  email,
  profileImage,
  place,
  company,
  position,
  bio,
  socialLinks,
}) => {
  return (
    <div className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-5xl bg-gradient-to-br from-[#0e101a] to-[#111827] border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 space-y-8 text-white">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3 flex-shrink-0">
            <ProfileImage
              profileImage={profileImage}
              size="28"
              textSize="5xl"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{username}</h1>
              {position && (
                <p className="text-sm text-indigo-400">{position}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {[
              { icon: <MdEmail />, label: email },
              { icon: <MdPlace />, label: place },
              { icon: <HiBuildingOffice />, label: company },
            ].map(
              (item, index) =>
                item.label && (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition"
                  >
                    <span className="text-indigo-400 text-lg">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Bio Section */}
        {bio && (
          <div>
            <h2 className="text-xl font-semibold border-l-4 border-indigo-500 pl-4 mb-3">
              Bio
            </h2>
            <div className="bg-white/5 border border-white/10 p-5 rounded-lg text-sm text-gray-300 leading-relaxed tracking-wide">
              {bio}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-semibold border-l-4 border-indigo-500 pl-4 mb-3">
            Connect with Me
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.website && (
              <SocialLink
                href={socialLinks.website}
                icon={<FaGlobe />}
                label="Website"
              />
            )}
            {socialLinks.linkedin && (
              <SocialLink
                href={socialLinks.linkedin}
                icon={<FaLinkedin />}
                label="LinkedIn"
              />
            )}
            {socialLinks.github && (
              <SocialLink
                href={socialLinks.github}
                icon={<FaGithub />}
                label="GitHub"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: JSX.Element;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-md text-sm text-white"
  >
    {icon}
    {label}
  </a>
);

export default Profile;
