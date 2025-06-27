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
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { COURSES_API, ENROLLED_COURSES } from "@/constants";
import { UserLayout } from "@/layouts";
import { ICourseDetails } from "@/types/courseType";
import {
  PdfViewer,
  VideoPlayer,
  Loading,
  Certificate,
  Footer,
  AiChat,
} from "@/components";
import {
  FaLock,
  IoVideocam,
  FaFilePdf,
  BiSkipPreviousCircle,
  BiSolidSkipNextCircle,
} from "@/assets/icons";
import { successPopup } from "@/utils/popup";
import { usePayment } from "@/hooks";
import Notebook from "@/components/User/NoteBook";
import { INotebook } from "@/types/noteBookType";

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
  const [notebooks, setNotebooks] = useState<INotebook[]>([]);

  const getNotebooks = async () => {
    const res = await axiosGetRequest(`/enrolledCourses/${courseId}/notebooks`);
    if (!res) return;
    setNotebooks(res.data);
  };

  const addNotebook = async (title: string) => {
    const res = await axiosPostRequest(
      `/enrolledCourses/${courseId}/notebooks`,
      {
        title,
      }
    );
    if (!res) return;

    setNotebooks([...notebooks, res.data]);
  };

  const deleteNotebook = async (notebookId: string) => {
    const res = await axiosDeleteRequest(
      `/enrolledCourses/${courseId}/notebooks/${notebookId}`
    );
    if (!res) return;

    setNotebooks(notebooks.filter((notebook) => notebook._id !== notebookId));
  };

  const updateNotebook = async (
    notebookId: string,
    title: string,
    notes: string[]
  ) => {
    const res = await axiosPutRequest(
      `/enrolledCourses/${courseId}/notebooks/${notebookId}`,
      {
        title,
        notes,
      }
    );
    if (!res) return;
    console.log(res.data);
    setNotebooks(
      notebooks.map((notebook) =>
        notebook._id !== notebookId ? notebook : res.data
      )
    );
  };

  const getPreviousLesson = (lessonId: string) => {
    const lessons = course?.modules.map((module) => module.lessons).flat();
    if (!lessons) return null;

    const index = lessons.findIndex((lesson) => lesson._id === lessonId);

    const data = index === -1 || index === 0 ? null : lessons[index - 1];
    return data;
  };

  const getNextLesson = (lessonId: string) => {
    const lessons = course?.modules.map((module) => module.lessons).flat();
    if (!lessons) return null;

    const index = lessons.findIndex((lesson) => lesson._id === lessonId);

    const data =
      index === -1 || index === lessons.length - 1 ? null : lessons[index + 1];

    return data;
  };

  const goToPreviousLesson = (
    currentLessonId: string,
    previousLessonId: string
  ) => {
    fetchLesson(previousLessonId);
  };

  const goToNextLesson = (currentLessonId: string, nextLessonId: string) => {
    if (!completedLessons.includes(currentLessonId)) {
      completeUnCompleteCourse(currentLessonId);
    }

    fetchLesson(nextLessonId);
  };

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
    getNotebooks();
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
      <div className="relative w-full px-2 mt-5 md:px-10">
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
          <div className="h-full md:h-[400px] lg:h-[600px] md:w-3/4 relative">
            {selectedLesson ? (
              <>
                {selectedLesson.type == "video" ? (
                  <VideoPlayer
                    url={selectedLesson?.path}
                    title={selectedLesson?.title}
                  />
                ) : (
                  <PdfViewer path={selectedLesson?.path} />
                )}

                <div className="absolute top-[50px] md:top-[200px] lg:top-[300px] left-2">
                  <button
                    disabled={!getPreviousLesson(selectedLesson?._id)}
                    onClick={() =>
                      goToPreviousLesson(
                        selectedLesson?._id,
                        getPreviousLesson(selectedLesson?._id)?._id || ""
                      )
                    }
                    className="text-5xl text-app-highlight disabled:text-app-border hover:text-app-accent"
                  >
                    <BiSkipPreviousCircle />
                  </button>
                </div>

                <div className="absolute  top-[50px] md:top-[200px] lg:top-[300px] right-2 t">
                  <button
                    disabled={!getNextLesson(selectedLesson?._id)}
                    onClick={() =>
                      goToNextLesson(
                        selectedLesson?._id,
                        getNextLesson(selectedLesson?._id)?._id || ""
                      )
                    }
                    className="text-5xl text-app-highlight disabled:text-app-border hover:text-app-accent"
                  >
                    <BiSolidSkipNextCircle />
                  </button>
                </div>
              </>
            ) : (
              <h1>Loading</h1>
            )}
          </div>

          <div className="h-full px-4 mx-2 py-4 md:w-1/4 bg-[#111827] rounded-2xl shadow-lg">
            <h1 className="text-2xl text-center text-white font-semibold tracking-wide">
              <span className="pb-1 border-b-4 border-green-400 inline-block">
                {course.title}
              </span>
            </h1>

            <div className="mt-8">
              <Progress value={completedPercentage} className="w-full" />
              <p className="mt-2 text-sm text-gray-400 text-center">
                {completedPercentage}% lessons completed
              </p>
            </div>

            <ScrollArea
              className="mt-6 md:h-[260px] lg:h-[430px] pr-3 border-y border-gray-600 py-2"
              style={{ scrollbarWidth: "none" }}
            >
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module) => (
                  <AccordionItem value={module._id} key={module._id}>
                    <AccordionTrigger className="text-white font-medium tracking-wide">
                      {module.title}
                    </AccordionTrigger>
                    {module.lessons.map((lesson) => (
                      <AccordionContent
                        key={lesson._id}
                        className={`cursor-pointer rounded px-3 py-1 mt-1 transition-all ${
                          selectedLesson?._id === lesson._id
                            ? "bg-green-600 text-white"
                            : "hover:bg-gray-800 text-gray-300"
                        }`}
                        onClick={() => fetchLesson(lesson._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" ? (
                              <IoVideocam className="text-lg" />
                            ) : (
                              <FaFilePdf className="text-lg" />
                            )}
                            <p className="text-sm">{lesson.title}</p>
                          </div>
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-green-400"
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
                <TabsTrigger value="notebook" className="w-full">
                  Notebook
                </TabsTrigger>
                <TabsTrigger value="certificate" className="w-full">
                  Certificate
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="description"
                className="mt-8 bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 border border-gray-700 rounded-2xl shadow-inner p-6 backdrop-blur-lg text-white"
              >
                <h2 className="text-xl font-bold mb-3">Lesson Description</h2>
                <p className="text-base leading-relaxed text-gray-200 font-light">
                  {selectedLesson?.description || "No description available."}
                </p>
              </TabsContent>
              <TabsContent
                value="notebook"
                className="mt-8 bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 border border-gray-700 rounded-2xl shadow-inner p-6 backdrop-blur-lg text-white"
              >
                <h2 className="text-xl font-bold mb-3">Notebook</h2>
                <Notebook
                  notebooks={notebooks}
                  addNotebook={addNotebook}
                  deleteNotebook={deleteNotebook}
                  updateNotebook={updateNotebook}
                />
              </TabsContent>
              <TabsContent
                value="certificate"
                className="mt-8 bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 border border-gray-700 rounded-2xl shadow-inner p-6 backdrop-blur-lg text-white"
              >
                <h2 className="text-xl font-bold mb-3">Your Certificate</h2>
                {completedPercentage === 100 ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <p className="text-base text-green-300 font-medium">
                      🎉 Congratulations! You’ve completed the course.
                    </p>
                    <Certificate
                      courseName={course.title}
                      trainerName={course.trainer.username}
                    />
                  </div>
                ) : (
                  <p className="text-base text-gray-400">
                    You’ve completed{" "}
                    <span className="text-blue-400 font-semibold">
                      {completedPercentage}%
                    </span>
                    . Finish all lessons to unlock your certificate.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {courseId && <AiChat courseId={courseId} />}
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Course;
