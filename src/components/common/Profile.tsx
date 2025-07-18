import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaUser,
  FaYoutube,
} from "react-icons/fa6";
import { Briefcase } from "lucide-react";
import { CgWebsite } from "react-icons/cg";
import { FC, JSX } from "react";
import { CourseCard } from "../user";
import { FaBookOpen } from "@/assets/icons";
import { IUserProfile } from "@/types/userType";
import { ICourseCardData } from "@/types/courseType";

const iconMap: Record<string, JSX.Element> = {
  github: <FaGithub className="text-gray-300" />,
  linkedin: <FaLinkedin className="text-blue-400" />,
  instagram: <FaInstagram className="text-pink-400" />,
  facebook: <FaFacebook className="text-blue-600" />,
  youtube: <FaYoutube className="text-red-500" />,
  website: <CgWebsite className="text-gray-400" />,
};

interface ProfileViewProps extends IUserProfile {
  courses: Array<ICourseCardData>;
}

const UserProfileView: FC<ProfileViewProps> = ({
  courses,
  email,
  username,
  bio,
  company,
  education,
  experiences,
  location,
  position,
  profileImage,
  skills,
  socialLinks,
}) => {
  const renderInfoItem = (label: string, value?: string) =>
    value ? (
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-purple-400 mb-1">{label}</h4>
        <p className="text-white text-sm">{value}</p>
      </div>
    ) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="flex flex-col items-center gap-6 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-white/5 border-4 border-white/10 shadow-2xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">{username}</h2>
            <p className="text-gray-400 text-sm mt-1">{email}</p>
          </div>
        </div>

        {/* Skills & Social Links */}
        <div className="lg:col-span-2 space-y-8">
          {skills.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
              <h3 className="text-purple-400 font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-600/20 text-white px-4 py-2 rounded-full text-sm border border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.values(socialLinks).some((v) => v?.trim()) && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
              <h3 className="text-purple-400 font-semibold mb-3">
                Social Links
              </h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(socialLinks)
                  .filter(([_, url]) => url?.trim())
                  .map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-[#141824] hover:bg-app-border rounded-xl transition-all duration-300 text-2xl hover:scale-110 shadow-md hover:shadow-lg"
                    >
                      {iconMap[platform]}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm mb-12">
          <h3 className="text-purple-400 font-semibold mb-3">About Me</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{bio}</p>
        </div>
      )}

      {/* Experience & Details */}
      {(experiences.length > 0 ||
        location ||
        company ||
        position ||
        education) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {experiences.length > 0 && (
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </h3>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-4 border-purple-500/40 pl-6 relative"
                    >
                      <div className="absolute -left-[12px] top-2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white/10 shadow" />
                      <h4 className="text-lg font-semibold text-white">
                        {exp.position}
                      </h4>
                      <p className="text-purple-300 font-medium">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-400 mb-2">
                        {exp.duration}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-300">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other Info */}
          <div className="space-y-6">
            {renderInfoItem("Location", location)}
            {renderInfoItem("Company", company)}
            {renderInfoItem("Position", position)}
            {renderInfoItem("Education", education)}
          </div>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="mb-12">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-purple-400 flex items-center gap-2 mb-6">
              <FaBookOpen className="text-purple-500" />
              Courses Created
            </h3>

            {/* Optional Stats Summary */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[160px] bg-[#1f1f2b] border border-purple-500/30 p-4 rounded-xl shadow-inner text-white text-center">
                <div className="text-xl font-bold">{courses.length}</div>
                <div className="text-sm text-gray-400">Total Courses</div>
              </div>
              <div className="flex-1 min-w-[160px] bg-[#1f1f2b] border border-purple-500/30 p-4 rounded-xl shadow-inner text-white text-center">
                <div className="text-xl font-bold">
                  {courses.reduce((acc, c) => acc + (c.noOfEnrolled || 0), 0)}
                </div>
                <div className="text-sm text-gray-400">Total Enrolled</div>
              </div>
            </div>

            {/* Proper Grid Layout for CourseCard */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  _id={course._id}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  price={course.price}
                  category={course.category}
                  noOfEnrolled={course.noOfEnrolled}
                  noOfModules={course.noOfModules}
                  averageRating={course.averageRating}
                  linkPrefix="/courses"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView;
