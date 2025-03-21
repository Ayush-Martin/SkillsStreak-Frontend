import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Progress,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@/components/ui";
import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { COURSES_API, ENROLLED_COURSES } from "@/constants/API";
import UserLayout from "@/layouts/UserLayout";
import { ICourseDetails } from "@/types/courseType";
import {
  AboutTheTrainer,
  PdfViewer,
  VideoPlayer,
  Loading,
  Certificate,
} from "@/components";
import { FaLock, IoVideocam, FaFilePdf } from "@/assets/icons";
import { successPopup } from "@/utils/popup";
import usePayment from "@/hooks/usePayment";

const Course: FC = () => {
  const { courseId } = useParams();
  const handlePayment = usePayment();
  const [course, setCourse] = useState<ICourseDetails | null>(null);
  const [courseAccess, setCourseAccess] = useState<boolean | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<{
    _id: string;
    path: string;
    description: string;
    title: string;
    type: string;
  } | null>(null);

  const fetchLesson = async (lessonId: string) => {
    const res = await axiosGetRequest(
      `${ENROLLED_COURSES}/${courseId}/lessons/${lessonId}`
    );
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
      `${ENROLLED_COURSES}/${courseId}/lessons/${lessonId}`
    );
    if (!res) return;
    const updatedCompletedLessons = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updatedCompletedLessons);
  };

  useEffect(() => {
    const fetchAccess = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}/access`);
      setCourseAccess(false);
      if (!res) return;
      setCourseAccess(true);
    };

    fetchAccess();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axiosGetRequest(`${COURSES_API}/${courseId}`);
      if (!res) return;
      setCourse(res.data);
      if (courseAccess) {
        fetchLesson(res.data?.modules[0].lessons[0]._id);
        fetchEnrolledCourse();
      }
    };
    fetchCourse();
  }, [courseAccess]);

  const handleEnroll = async () => {
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

  if (courseAccess === null) return <Loading />;
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
              {course.title}
            </h1>
            <Progress value={completedPercentage} className="w-[100%] mt-4" />
            <p className="mt-1 text-app-highlight">
              {completedPercentage}% lessons completed
            </p>
            <ScrollArea
              className=" md:h-[260px] lg:h-[490px] mt-10 pr-3"
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
                            key={lesson._id}
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
            </ScrollArea>
          </div>
          {courseAccess == false && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-full gap-2 bg-black bg-opacity-55 backdrop-blur-sm">
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
          <div className="mb-16 md:w-3/4">
            <Tabs defaultValue="description" className="w-full my-5 ">
              <TabsList className="w-full overflow-x-auto min-w-48">
                <TabsTrigger value="description" className="w-full">
                  Description
                </TabsTrigger>
                <TabsTrigger value="doubts" className="w-full">
                  Doubts
                </TabsTrigger>
                <TabsTrigger value="certificate" className="w-full">
                  Certificate
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-5">
                <h1 className="text-xl text-white lg:text-3xl">Description</h1>
                <p className="mt-2 text-sm text-white">
                  {selectedLesson?.description}
                </p>
              </TabsContent>
              <TabsContent value="doubts">
                <h1 className="text-lg text-white lg:text-2xl">Description</h1>
                <p className="mt-2 text-sm text-white">
                  {selectedLesson?.description}
                </p>
              </TabsContent>
              <TabsContent value="certificate" className="py-5">
                <h1 className="text-xl text-white lg:text-3xl">Certificate</h1>
                {completedPercentage == 100 ? (
                  <div className="flex items-center gap-2">
                    <p className="mt-2 text-lg font-thin text-white">
                      Download Certificate here
                    </p>
                    <Certificate
                      courseName={course.title}
                      trainerName={course.trainer.username}
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-lg font-thin text-white">
                    you have now only completed {completedPercentage}% complete
                    all lessons to download certificate
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <AboutTheTrainer {...course.trainer} />
        </div>
      </div>
    </UserLayout>
  );
};

export default Course;
