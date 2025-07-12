import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseCard, Footer, Loading, ProfileImage } from "@/components";
import { axiosGetRequest } from "@/config/axios";
import { UserLayout } from "@/layouts";
import { ICourseData } from "@/types/courseType";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import { IProfile } from "@/types/userType";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaBriefcase,
  FaAward,
  FaGraduationCap,
  FaTools,
  FaBookOpen,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

interface ITrainer extends IProfile {
  courses: Array<ICourseData>;
}

const Trainer: FC = () => {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState<ITrainer | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      const res = await axiosGetRequest(`/trainers/${trainerId}`);
      if (!res) return;
      setTrainer(res.data);
    };

    fetchTrainer();
  }, [trainerId]);

  if (!trainer) return <Loading />;

  const {
    username,
    bio,
    profileImage,
    company,
    position,
    skills,
    github,
    linkedin,
    website,
    yearsOfExperience,
    educationalQualification,
    courses,
    email,
    place,
  } = trainer;

  const skillsArray = skills
    ? skills.split(",").map((skill) => skill.trim())
    : [];
  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.noOfEnrolled || 0),
    0
  );

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#0a0d17]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border-b border-purple-500/20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center  space-y-6">
              <div className="flex justify-center items-center">
                <ProfileImage
                  profileImage={profileImage}
                  size={32}
                  textSize="7xl"
                />
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                  {username}
                </h1>

                {position && company && (
                  <div className="flex justify-center items-center gap-2 text-lg text-purple-200">
                    <FaBriefcase className="text-purple-400" />
                    <span>
                      {position} at {company}
                    </span>
                  </div>
                )}

                <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
                  {place && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-purple-400" />
                      <span>{place}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-1">
                      <FaEnvelope className="text-purple-400" />
                      <span>{email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-colors">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {courses.length}
              </div>
              <div className="text-gray-400 text-sm">Courses</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-colors">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {totalStudents.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Students</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center hover:bg-gray-800/70 transition-colors">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {yearsOfExperience}+
              </div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
                  <FaBookOpen className="text-purple-400" />
                  About
                </h2>
                <p className="text-gray-300 leading-relaxed">{bio}</p>
              </div>

              {/* Skills Section */}
              {skillsArray.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
                    <FaTools className="text-purple-400" />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill) => (
                      <span
                        key={skill}
                        className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Education */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-400" />
                  Education
                </h3>
                <p className="text-gray-300 text-sm">
                  {educationalQualification}
                </p>
              </div>

              {/* Experience */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center gap-2">
                  <FaAward className="text-purple-400" />
                  Experience
                </h3>
                <p className="text-gray-300 text-sm">
                  {yearsOfExperience}+ years of professional experience
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-4">
                  Connect
                </h3>
                <div className="space-y-3">
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-purple-200 transition-colors"
                    >
                      <FaGithub className="text-gray-400" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-purple-200 transition-colors"
                    >
                      <FaLinkedin className="text-indigo-400" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-purple-200 transition-colors"
                    >
                      <FaGlobe className="text-emerald-400" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          {courses.length > 0 && (
            <div className="bg-[#0a0d17] border border-purple-500/20 rounded-2xl px-6 py-8 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-200 mb-6 flex items-center gap-3">
                <FaBookOpen className="text-purple-400" />
                Courses by {username}
              </h2>

              <div className="relative">
                <Carousel>
                  {/* Navigation Buttons */}
                  <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-purple-800/30 hover:bg-purple-800/50 text-white border border-purple-500/30 rounded-full w-10 h-10 shadow-md" />
                  <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-purple-800/30 hover:bg-purple-800/50 text-white border border-purple-500/30 rounded-full w-10 h-10 shadow-md" />

                  {/* Cards Area */}
                  <CarouselContent className="px-10">
                    <div className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide py-2">
                      {courses.map((course) => (
                        <div
                          key={course._id}
                          className="flex-shrink-0 w-[320px] sm:w-[340px] transition-all"
                        >
                          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:shadow-purple-500/30 transition-shadow duration-300 ">
                            <CourseCard
                              averageRating={course.averageRating || 0}
                              _id={course._id}
                              category={course.category.categoryName}
                              noOfEnrolled={course.noOfEnrolled}
                              noOfModules={course.moduleCount}
                              price={course.price}
                              thumbnail={course.thumbnail}
                              title={course.title}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </UserLayout>
  );
};

export default Trainer;
