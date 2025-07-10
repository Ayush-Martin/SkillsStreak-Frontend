import { FC, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { axiosGetRequest } from "@/config/axios";
import { COURSES_API } from "@/constants";
import { UserLayout } from "@/layouts";
import { ICourseDetails } from "@/types/courseType";
import {
  IoVideocam,
  FaFilePdf,
  TbDiamondFilled,
  FaBookOpen,
  FaTag,
  FaUsers,
  FaVideo,
  AiFillHeart,
  AiOutlineHeart,
} from "@/assets/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  BreadcrumbNav,
  Footer,
  LiveSessionCard,
  Loading,
  ProfileImage,
  Review,
} from "@/components";

import { useSelector } from "react-redux";
import { RootReducer } from "@/store";

import { useEnrollCourse, useReview, useWishlist } from "@/hooks";
import { ReviewContext } from "@/context";

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
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const { accessToken } = useSelector((state: RootReducer) => state.user);

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
      console.log(courseId);
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
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

  if (!course) return <Loading />;

  return (
    <UserLayout>
      <section className="w-full h-56 mt-5 px-7 md:h-96">
        <BreadcrumbNav breadcrumbItems={breadcrumbItems} />

        <img
          src={course.thumbnail}
          alt=""
          className="object-cover w-full h-48 mt-2 md:h-80"
        />
      </section>

      <section className="w-full py-5 px-7 md:px-20 lg:px-32 xl:px-56 ">
        <div className="flex flex-col  justify-between gap-3 md:flex-row">
          <div className="flex flex-col gap-4 ">
            <h1 className="bg-purple-600 w-28 text-white px-3 py-1 rounded-full  font-semibold flex items-center gap-1">
              <FaTag size={12} />
              {course.category.categoryName}
            </h1>
            <h1 className="text-4xl md:text-5xl text-app-secondary font-winkysans">
              {course.title}
            </h1>

            <p className="text-white font-playwritehu text-lg">
              {course.description}
            </p>

            <Button
              variant={"v2"}
              size={"lg"}
              className="w-44"
              onClick={() =>
                courseAccess
                  ? navigate(`/user/enrolledCourses/${courseId}/view`)
                  : handleEnroll(courseId!)
              }
            >
              {courseAccess
                ? "Go to course"
                : `Enroll course for ${
                    course.price ? course.price.toString() : "free"
                  }`}
            </Button>

            {!courseAccess && (
              <Button
                onClick={addRemoveWishlist}
                className={`w-44 flex items-center justify-center gap-2 text-white transition ${
                  addedToWishlist
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {addedToWishlist ? (
                  <>
                    <AiFillHeart />
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <AiOutlineHeart />
                    Add to Wishlist
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 mt-5 gap-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaUsers className="w-7 h-7 text-blue-400" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {course.noOfEnrolled}
                </div>
                <div className="text-gray-400 text-sm">Students Enrolled</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaBookOpen className="w-7 h-7 text-green-400" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {course.modules.length}
                </div>
                <div className="text-gray-400 text-sm">Modules</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaVideo className="w-7 h-7 text-red-400" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {course.liveSessions.length}
                </div>
                <div className="text-gray-400 text-sm">Live Sessions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col w-full gap-16 py-5 mt-5 mb-10 px-7 md:px-32 lg:px-56">
        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Live Sessions :
          </h1>
          <div className=" mt-10 px-5 ">
            {course.liveSessions.length === 0 ? (
              <p className="text-app-neutral text-lg font-josefinsans">
                No live sessions available for this course.
              </p>
            ) : (
              <Carousel className="w-full px-10">
                <CarouselContent className="-ml-4 flex">
                  {course.liveSessions.map((session) => (
                    <CarouselItem
                      key={session._id}
                      className=" basis-[300px] sm:basis-[350px] lg:basis-[340px]"
                    >
                      <LiveSessionCard
                        isLive={session.isLive}
                        streamId={session._id}
                        thumbnail={session.thumbnail}
                        title={session.title}
                        courseAccess={courseAccess || false}
                        courseId={course._id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </div>
        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Course Contents :
          </h1>
          {course.modules.length === 0 ? (
            <p className="text-app-neutral text-lg font-josefinsans">
              No modules available for this course.
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module) => (
                <AccordionItem value={module._id} key={module._id}>
                  <AccordionTrigger className=" md:text-lg font-josefinsans">
                    {module.title}
                  </AccordionTrigger>
                  {module.lessons.map((lesson) => (
                    <AccordionContent key={lesson._id} className="">
                      <div className="flex gap-2 px-2 md:text-lg border-s border-app-accent">
                        {lesson.type == "video" ? (
                          <IoVideocam className="text-xl" />
                        ) : (
                          <FaFilePdf className="text-xl" />
                        )}

                        <p className="text-app-neutral">{lesson.title}</p>
                      </div>
                    </AccordionContent>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            What you will learn :
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {course.skillsCovered.map((skill) => (
              <p
                key={skill}
                className="flex items-center w-full gap-2 text-sm text-white md:text-base font-josefinsans"
              >
                <TbDiamondFilled className="text-xl md:text-3xl text-app-secondary" />
                {skill}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Requirements :
          </h1>

          <div className="grid grid-cols-1 text-sm md:grid-cols-2 md:text-base gap-x-10 gap-y-4">
            {course.requirements.map((requirement) => (
              <p
                key={requirement}
                className="flex items-center w-full gap-2 text-white font-josefinsans"
              >
                <TbDiamondFilled className="text-xl md:text-3xl text-app-secondary" />
                {requirement}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            About the trainer :
          </h1>

          <Link
            to={`/trainer/${course.trainer._id}`}
            className="bg-gray-900 rounded-2xl p-8 block"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <ProfileImage
                profileImage={course.trainer.profileImage}
                size={28}
                textSize="5xl"
              />

              {/* Trainer Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {course.trainer.username}
                </h3>
                {/* <p className="text-blue-400 mb-4">{course.trainer.experience}</p> */}
                <p className="text-gray-300 leading-relaxed">
                  {course.trainer.about}
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Reviews :
          </h1>

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
      </section>
      <Footer />
    </UserLayout>
  );
};

export default CourseDetail;
