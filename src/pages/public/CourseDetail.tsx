import { FC, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import { COURSES_API } from "@/constants";
import UserLayout from "@/layouts/UserLayout";
import { ICourseDetails } from "@/types/courseType";
import {
  PiStudentBold,
  MdViewModule,
  IoVideocam,
  FaFilePdf,
  TbDiamondFilled,
  FaUserTie,
} from "@/assets/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";
import {
  BreadcrumbNav,
  CourseCard,
  Footer,
  LiveSessionCard,
  Loading,
  Review,
} from "@/components";
import { errorPopup, successPopup } from "@/utils/popup";
import { usePayment } from "@/hooks";
import { useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { CourseCardSkeleton } from "@/components/skeletons";

const CourseDetail: FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const handlePayment = usePayment();
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [courseAccess, setCourseAccess] = useState<boolean | null>(null);
  const { accessToken } = useSelector((state: RootReducer) => state.user);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
    };

    const fetchAccess = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
      setCourseAccess(false);
      if (!res) return;
      if (res.data) {
        setCourseAccess(true);
      }
    };

    fetchCourse();
    if (accessToken) {
      fetchAccess();
    }
  }, [courseId]);

  const breadcrumbItems = useMemo(
    () => [
      { link: "/courses", text: "Courses" },
      { link: `/courses/${course?._id}`, text: `${course?.title}` },
    ],
    [course]
  );

  const handleEnroll = async () => {
    if (!accessToken) {
      errorPopup("You must be logged in to enroll in a course.");
      return;
    }
    const res = await axiosPostRequest(`${COURSES_API}/${courseId}`, {});
    if (!res) return;
    if (!res.data) {
      successPopup(res.message || "enrolled");
      setCourseAccess(true);
    }
    handlePayment(res.data.amount, res.data.id, async (orderId: string) => {
      const res = await axiosPostRequest(`${COURSES_API}/${courseId}/payment`, {
        orderId,
      });

      if (!res) return;

      setCourseAccess(true);
      successPopup(res.message || "enrolled");
    });
  };

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
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex flex-col gap-4 md:w-1/2">
            <h1 className="text-2xl md:text-4xl text-app-secondary font-winkysans">
              {course.title}
            </h1>
            <p className="text-white font-playwritehu">{course.description}</p>
            <Button
              variant={"v2"}
              size={"lg"}
              className="w-40"
              onClick={() =>
                courseAccess
                  ? navigate(`/user/enrolledCourses/${courseId}/view`)
                  : handleEnroll()
              }
            >
              {courseAccess
                ? "Go to course"
                : `Enroll course for ${
                    course.price ? course.price.toString() : "free"
                  }`}
            </Button>
          </div>
          <div className="flex gap-4 mt-5 md:mt-0">
            <p className="flex items-center gap-1 text-app-accent">
              {" "}
              <PiStudentBold className="md:text-2xl" />
              {course.noOfEnrolled} enrolled
            </p>
            <p className="flex items-center gap-1 text-app-accent">
              <MdViewModule className="md:text-2xl" /> {course.modules.length}{" "}
              modules
            </p>
            <Badge className="text-white font-extralight" variant={"outline"}>
              {course.category.categoryName}
            </Badge>
          </div>
        </div>
      </section>

      <section className="flex flex-col w-full gap-16 py-5 mt-5 mb-10 px-7 md:px-32 lg:px-56">
        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Live Sessions :
          </h1>
          <div className="px-10 mt-10">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4 flex">
                {course.liveSessions.map((session) => (
                  <CarouselItem
                    key={session._id}
                    className=" basis-[300px] sm:basis-[350px] lg:basis-[340px]"
                  >
                    <LiveSessionCard
                      isLive={session.isLive}
                      isPublic={session.isPublic}
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
          </div>
        </div>
        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Course Contents :
          </h1>
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
            className="flex flex-col sm:flex-row items-center gap-6 px-4 py-2 border rounded-md border-app-border sm:w-[500px] hover:bg-[#081623] hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]  bg-white rounded-full ">
              {course.trainer.profileImage ? (
                <img
                  src={course.trainer.profileImage}
                  alt=""
                  className="object-cover rounded-full w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]"
                />
              ) : (
                <div className="flex items-center justify-center text-4xl rounded-full w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] text-app-primary ">
                  <FaUserTie />
                </div>
              )}
            </div>

            <div className="text-white">
              <h1 className="md:text-lg font-boldonse text-app-tertiary">
                {course.trainer.username}
              </h1>
              <p className="mt-2 text-sm text-app-neutral sm:text-base">
                {course.trainer.about}
              </p>
            </div>
          </Link>
        </div>

        <div>
          <h1 className="mb-2 text-xl md:text-2xl text-app-neutral font-tektur">
            Reviews :
          </h1>

          <Review courseId={course._id} trainerId={course.trainer._id} />
        </div>
      </section>
      <Footer />
    </UserLayout>
  );
};

export default CourseDetail;
