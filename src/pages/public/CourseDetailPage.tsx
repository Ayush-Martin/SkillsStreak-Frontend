import { FC, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { UserLayout } from "@/layouts";
import { IUserCourseDetails } from "@/types/courseType";
import {
  IoVideocam,
  FaFilePdf,
  FaBookOpen,
  FaTag,
  FaUsers,
  AiFillHeart,
  AiOutlineHeart,
} from "@/assets/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  BreadcrumbNav,
  Footer,
  Loading,
  ProfileImage,
  Review,
  EnrollCourseModal
} from "@/components";

import { useSelector } from "react-redux";
import { RootReducer } from "@/store";

import { useEnrollCourse, useReview, useWishlist } from "@/hooks";
import { ReviewContext } from "@/context";
import {
  Star,
  Clock,
  Award,
  ChevronRight,
  BookOpen,
  Users,
} from "lucide-react";
import { getUserCourse } from "@/api/course.api";

const CourseDetail: FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const {
    addCourseToWishlist,
    removeCourseFromWishlist,
    checkCourseAddedToWishlist,
  } = useWishlist();
  const {
    addReply,
    addReview,
    deleteReview,
    fetchReplies,
    reviews,
    editReview,
  } = useReview(courseId!);
  const { courseAccess, fetchAccess, handleEnroll } = useEnrollCourse();
  const [course, setCourse] = useState<IUserCourseDetails | null>(null);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);
  const [open, setOpen] = useState(false);

  const addRemoveWishlist = async () => {
    if (addedToWishlist) {
      await removeCourseFromWishlist(courseId!);
      setAddedToWishlist(false);
    } else {
      await addCourseToWishlist(courseId!);
      setAddedToWishlist(true);
    }
  };

  const checkWishlist = async () => {
    const isAdded = await checkCourseAddedToWishlist(courseId!);
    setAddedToWishlist(isAdded);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getUserCourse(courseId!);
      if (!data) return;
      setCourse(data);
    };

    fetchCourse();
    if (accessToken) {
      fetchAccess(courseId!);
      checkWishlist();
    }
  }, [courseId]);

  const breadcrumbItems = useMemo(
    () => [
      { link: "/courses", text: "Courses" },
      { link: `/courses/${course?._id}`, text: `${course?.title}` },
    ],
    [course]
  );

  const enroll = () => {
    if (course?.price) {
      setOpen(true);
      return;
    } else {
      handleEnroll(course!._id);
    }
  };

  const totalLessons =
    course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) ||
    0;

  if (!course) return <Loading />;

  return (
    <UserLayout>
      {open && (
        <EnrollCourseModal
          amount={course.price}
          thumbnail={course.thumbnail}
          title={course.title}
          close={() => setOpen(false)}
          stripeCheckout={() => handleEnroll(course._id, "stripe")}
          walletCheckout={() => handleEnroll(course._id, "wallet")}
        />
      )}

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[500px] mt-5 px-7 overflow-hidden">
        <BreadcrumbNav breadcrumbItems={breadcrumbItems} />

        <div className="relative mt-4 h-80 md:h-96 rounded-2xl overflow-hidden group">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Course Stats */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {course.noOfEnrolled} students
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {totalLessons} lessons
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {course.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-8 px-7 md:px-20 lg:px-32 xl:px-56">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Course Info */}
          <div className="flex-1 space-y-8">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                  <FaTag size={10} />
                  {course.category.categoryName}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-gray-400 text-xs ml-1">(4.8)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl text-app-secondary font-winkysans leading-tight">
                {course.title}
              </h1>

              <p className="text-white/80 font-playwritehu text-base leading-relaxed">
                {course.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={"v2"}
                  size={"lg"}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() =>
                    courseAccess
                      ? navigate(`/user/enrolledCourses/${courseId}`)
                      : enroll()
                  }
                >
                  {courseAccess
                    ? "Continue Learning"
                    : `Enroll Now ${
                        course.price ? `• ₹${course.price}` : "• Free"
                      }`}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                {!courseAccess && (
                  <Button
                    onClick={addRemoveWishlist}
                    className={`px-6 py-4 flex items-center justify-center gap-3 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      addedToWishlist
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                        : "bg-gradient-to-r from-zinc-700 to-gray-700 hover:from-zinc-800 hover:to-gray-800"
                    }`}
                  >
                    {addedToWishlist ? (
                      <>
                        <AiFillHeart className="w-5 h-5" />
                        Remove from Wishlist
                      </>
                    ) : (
                      <>
                        <AiOutlineHeart className="w-5 h-5" />
                        Add to Wishlist
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-400/20 p-3 rounded-xl group-hover:bg-blue-400/30 transition-colors">
                    <FaUsers className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {course.noOfEnrolled.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Students Enrolled
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="bg-green-400/20 p-3 rounded-xl group-hover:bg-green-400/30 transition-colors">
                    <FaBookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {course.modules.length}
                    </div>
                    <div className="text-gray-400 text-sm">Modules</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-400/20 p-3 rounded-xl group-hover:bg-purple-400/30 transition-colors">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {totalLessons}
                    </div>
                    <div className="text-gray-400 text-sm">Total Lessons</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Sections */}
      <section className="flex flex-col w-full gap-16 py-8 mb-10 px-7 md:px-32 lg:px-56">
        {/* Course Contents */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-app-neutral font-tektur">
            Course Contents
          </h2>
          {course.modules.length === 0 ? (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
              <p className="text-app-neutral font-josefinsans text-center">
                No modules available for this course.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {course.modules.map((module, index) => (
                <AccordionItem
                  value={module._id}
                  key={module._id}
                  className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 text-base font-josefinsans hover:no-underline hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-left">{module.title}</span>
                      <span className="ml-auto text-xs text-gray-400">
                        {module.lessons.length} lessons
                      </span>
                    </div>
                  </AccordionTrigger>
                  <div className="px-4 pb-3 space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <AccordionContent
                        key={lesson._id}
                        className="border-none p-0 m-0"
                      >
                        <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-500 text-xs font-mono w-4">
                            {lessonIndex + 1}
                          </span>
                          {lesson.type === "video" ? (
                            <IoVideocam className="text-red-400 w-4 h-4" />
                          ) : (
                            <FaFilePdf className="text-blue-400 w-4 h-4" />
                          )}
                          <p className="text-white text-sm flex-1">
                            {lesson.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {lesson.type === "video" ? "Video" : "PDF"}
                          </span>
                        </div>
                      </AccordionContent>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* What You'll Learn */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-app-neutral font-tektur">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.skillsCovered.map((skill) => (
              <div key={skill} className="flex items-center gap-3 text-white">
                <div className="w-2 h-2 bg-app-secondary rounded-full flex-shrink-0"></div>
                <p className=" font-josefinsans text-lg">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-app-neutral font-tektur">
            Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.requirements.map((requirement) => (
              <div
                key={requirement}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-2 h-2 bg-app-secondary rounded-full flex-shrink-0"></div>
                <p className="font-josefinsans text-lg">{requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About the Trainer */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-app-neutral font-tektur">
            About the Trainer
          </h2>

          <Link
            to={`/trainer/${course.trainer._id}`}
            className="block bg-gray-900 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <ProfileImage
                  profileImage={course.trainer.profileImage}
                  size={32}
                  textSize="3xl"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {course.trainer.username}
                  </h3>
                  <div className="bg-purple-600/20 px-2 py-1 rounded-full">
                    <span className="text-purple-300 text-xs font-medium">
                      Trainer
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {course.trainer.about}
                </p>
                <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-sm font-medium">View Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl text-app-neutral font-tektur">
            Reviews
          </h2>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700/50">
            <ReviewContext.Provider
              value={{
                addReply,
                addReview,
                deleteReview,
                fetchReplies,
                reviews,
                editReview,
              }}
            >
              <Review
                trainerId={course.trainer._id}
                courseAccess={courseAccess!}
              />
            </ReviewContext.Provider>
          </div>
        </div>
      </section>
      <Footer />
    </UserLayout>
  );
};

export default CourseDetail;
