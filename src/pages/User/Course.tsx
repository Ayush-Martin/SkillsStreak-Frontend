import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { COURSES_API, ENROLLED_COURSES } from "@/constants/API";
import UserLayout from "@/layouts/UserLayout";
import { ICourseDetails } from "@/types/courseType";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../public/Loading";
import { AboutTheTrainer, PdfViewer, VideoPlayer } from "@/components";
import { Progress } from "@/components/ui/progress";
import { FaLock } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoVideocam } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { successPopup } from "@/utils/popup";
import usePayment from "@/hooks/usePayment";
import { Input } from "@/components/ui/input";

const Course: FC = () => {
  const { courseId } = useParams();
  const handlePayment = usePayment();
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [useAccess, setUserAccess] = useState<boolean | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<{
    _id: string;
    path: string;
    description: string;
    title: string;
    type: string;
  } | null>(null);

  console.log(completedLessons);

  const fetchLesson = async (lessonId: string) => {
    const res = await axiosGetRequest(`lessons/${lessonId}`);
    if (!res) return;
    setSelectedLesson(res.data);
  };

  const fetchEnrolledCourse = async () => {
    const res = await axiosGetRequest(`${ENROLLED_COURSES}/${courseId}`);
    if (!res) return;
    setCompletedLessons(res.data.completedLessons);
  };

  const completeUnCompleteCourse = async (lessonId: string) => {
    const res = await axiosPatchRequest(
      `${ENROLLED_COURSES}/${courseId}/${lessonId}`
    );
    if (!res) return;
    setCompletedLessons(res.data.completedLessons);
  };

  useEffect(() => {
    const fetchAccess = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
      setUserAccess(false);
      if (!res) return;
      setUserAccess(true);
    };

    fetchAccess();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
      if (useAccess) {
        fetchLesson(res.data?.modules[0].lessons[0]._id);
        fetchEnrolledCourse();
      }
    };
    fetchCourse();
  }, [useAccess]);

  const handleEnroll = async () => {
    const res = await axiosPostRequest(`${COURSES_API}/${courseId}`, {});
    if (!res) return;
    if (!res.data) {
      successPopup(res.message || "enrolled");
      setUserAccess(true);
    }
    handlePayment(res.data.amount, res.data.id, async (orderId: string) => {
      const res = await axiosPostRequest(`${COURSES_API}/${courseId}/payment`, {
        orderId,
      });

      if (!res) return;

      setUserAccess(true);
      successPopup(res.message || "enrolled");
    });
  };

  if (useAccess === null) return <Loading />;
  if (!course) return <Loading />;

  const completedPercentage = Math.floor(
    (completedLessons.length /
      course.modules.reduce((acc, curr) => acc + curr.lessons.length, 0)) *
      100
  );

  return (
    <UserLayout>
      <div className="w-full px-2 md:px-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/courses" className="md:text-lg text-app-neutral">
                Courses
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
            <BreadcrumbItem>
              <Link
                to={`/courses/${course._id}`}
                className="md:text-lg text-app-neutral"
              >
                {course.title}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
            <BreadcrumbItem>
              <Link
                to={`/user/enrolledCourses/${course._id}/view`}
                className="md:text-lg text-app-neutral"
              >
                view
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
            <BreadcrumbItem>
              <Link
                to={`/user/enrolledCourses/${course._id}/view`}
                className="md:text-lg text-app-neutral"
              >
                {selectedLesson?.title}
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative flex flex-col md:flex-row w-full mt-10 h-full md:h-[400px] lg:h-[600px]">
          <div className="h-full md:h-[400px] lg:h-[600px] md:w-3/4 ">
            {selectedLesson ? (
              selectedLesson.type == "video" ? (
                <VideoPlayer url={selectedLesson?.path} />
              ) : (
                <PdfViewer path={selectedLesson?.path} />
              )
            ) : (
              <h1>Loading</h1>
            )}
          </div>
          <div className="h-full px-5 py-2 md:w-1/4 ">
            <h1 className="text-xl text-center lg:text-2xl text-app-secondary">
              Web Development
            </h1>
            <Progress value={completedPercentage} className="w-[100%] mt-4" />
            <p className="mt-1 text-app-highlight">
              {completedPercentage}% lessons completed
            </p>
            <div
              className="overflow-y-auto md:h-[260px] lg:h-[490px] mt-10 "
              style={{ scrollbarWidth: "none" }}
            >
              <Accordion type="single" collapsible className="w-full ">
                {course.modules.map((module) => (
                  <AccordionItem value={module._id} key={module._id}>
                    <AccordionTrigger className="">
                      {module.title}
                    </AccordionTrigger>
                    {module.lessons.map((lesson) => (
                      <AccordionContent
                        key={lesson._id}
                        className={
                          selectedLesson?._id == lesson._id
                            ? "text-app-accent cursor-pointer"
                            : "text-app-neutral cursor-pointer"
                        }
                      >
                        <div className="flex items-center justify-between ">
                          <div
                            className="flex gap-2 cursor-pointer"
                            onClick={() => fetchLesson(lesson._id)}
                          >
                            {lesson.type == "video" ? (
                              <IoVideocam className="text-xl" />
                            ) : (
                              <FaFilePdf className="text-xl" />
                            )}

                            <p className="">{lesson.title}</p>
                          </div>

                          <input
                            type="checkbox"
                            className="w-5 h-5 bg-transparent"
                            checked={completedLessons.includes(lesson._id)}
                            onChange={() =>
                              completeUnCompleteCourse(lesson._id)
                            }
                          />
                        </div>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          {useAccess == false && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-full gap-2 bg-black bg-opacity-75">
              <h1 className="flex flex-col items-center justify-center gap-2 text-2xl text-app-accent">
                <FaLock className="text-3xl" /> you don,t have access
              </h1>
              <Button variant={"v1"} onClick={handleEnroll}>
                Enroll
              </Button>
            </div>
          )}
        </div>
        <div className="px-2 mt-10 md:px-10">
          <div>
            <h1 className="text-lg text-white lg:text-2xl">Description</h1>
            <p className="mt-2 text-sm text-white">
              {selectedLesson?.description}{" "}
            </p>
          </div>
          <div className="my-10">
            <h1 className="text-lg text-white lg:text-2xl">Description</h1>
            <p className="mt-2 text-sm text-white">{course.description} </p>
          </div>

          <AboutTheTrainer
            about={course.trainer.about}
            profileImage={course.trainer.profileImage}
            username={course.trainer.username}
          />
        </div>
      </div>
    </UserLayout>
  );
};

export default Course;
