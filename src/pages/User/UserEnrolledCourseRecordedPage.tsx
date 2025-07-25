import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  PdfViewer,
  ScrollArea,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoPlayer,
} from "@/components";
import Discussions from "@/components/user/Discussion";
import useDiscussion from "@/hooks/useDiscussion";
import useViewCourseRecorded from "@/hooks/useViewCourseRecorded";
import { EnrolledCourseLayout } from "@/layouts";
import { ICourseRecordedSession } from "@/types/courseType";
import { PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import { FC, useEffect } from "react";
import { Link } from "react-router-dom";

const UserCourseRecordedPage = () => {
  const {
    courseAccess,
    currentSelectedLesson,
    recordedSessions,
    viewLesson,
    completedLessons,
    courseId,
    completeUnCompleteLesson,
  } = useViewCourseRecorded();

  const {
    addDiscussion,
    addReply,
    deleteDiscussion,
    discussions,
    editDiscussion,
    fetchReplies,
  } = useDiscussion(currentSelectedLesson?._id || "", "lesson");

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      completeUnCompleteLesson(lessonId);
    }
  };

  return (
    <EnrolledCourseLayout>
      <div className="flex relative gap-3">
        {/* Left Content */}
        <div className="w-full lg:w-2/3">
          <div className=" bg-white/5 border border-white/10 rounded-xl py-3 px-5  sm:py-6 sm:px-10 shadow-md">
            <Breadcrumb className="mb-5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    to="/user/enrolledCourses"
                    className="md:text-lg text-app-neutral"
                  >
                    Enrolled Courses
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
                <BreadcrumbItem>
                  <Link
                    to={`/user/enrolledCourses/${courseId}`}
                    className="md:text-lg text-app-neutral"
                  >
                    {recordedSessions?.title}
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {courseAccess && currentSelectedLesson ? (
              <Lesson
                completeLesson={() => completeLesson(currentSelectedLesson._id)}
                path={currentSelectedLesson.path}
                title={currentSelectedLesson.title}
                type={currentSelectedLesson.type}
              />
            ) : (
              <div className="w-full mb-10 overflow-hidden rounded-xl border border-white/10 bg-black/50 text-white shadow-lg flex items-center justify-center h-72 sm:h-96">
                <div className="text-center space-y-2 px-6">
                  <p className="text-lg font-semibold text-white/80">
                    {courseAccess
                      ? "Select a lesson to begin learning"
                      : "You do not have access to this course"}
                  </p>
                  {!courseAccess && (
                    <p className="text-sm text-white/50">
                      Please enroll in the course to start viewing the content.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="w-full  ">
              <Tabs
                defaultValue={courseAccess ? "description" : "course-contents"}
                className="w-full my-5"
              >
                <TabsList className="w-full overflow-x-auto min-w-48">
                  <TabsTrigger
                    value="course-contents"
                    className="w-full lg:hidden"
                  >
                    Course Contents
                  </TabsTrigger>
                  {courseAccess && currentSelectedLesson && (
                    <>
                      <TabsTrigger value="description" className="w-full">
                        Description
                      </TabsTrigger>
                      <TabsTrigger value="discussions" className="w-full">
                        Discussions
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
                {courseAccess && currentSelectedLesson && (
                  <>
                    <TabsContent value="description" className="mt-10">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-white shadow-inner">
                        <h2 className="text-xl font-semibold mb-3 text-white/90">
                          Lesson Description
                        </h2>
                        <p className="leading-relaxed text-white/80 tracking-wide">
                          {currentSelectedLesson.description}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="discussions" className="mt-10">
                      <Discussions
                        discussions={discussions}
                        addDiscussion={addDiscussion}
                        deleteDiscussion={deleteDiscussion}
                        editDiscussion={editDiscussion}
                        addReply={addReply}
                        fetchReplies={fetchReplies}
                        trainerId={recordedSessions.trainerId}
                      />
                    </TabsContent>
                  </>
                )}

                <TabsContent
                  value="course-contents"
                  className="mt-10 lg:hidden"
                >
                  <CourseContentsAccordion
                    recordedSessions={recordedSessions}
                    completedLessons={completedLessons}
                    viewLesson={viewLesson}
                    selectedLessonId={currentSelectedLesson?._id}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Sticky Right Content */}
        <div className="hidden lg:block lg:w-1/3">
          <div className="sticky top-20 h-[500px]">
            <CourseContentsAccordion
              recordedSessions={recordedSessions}
              completedLessons={completedLessons}
              viewLesson={viewLesson}
              selectedLessonId={currentSelectedLesson?._id}
            />
          </div>
        </div>
      </div>
    </EnrolledCourseLayout>
  );
};

interface ICourseContentsAccordionProps {
  recordedSessions: ICourseRecordedSession;
  completedLessons: string[];
  viewLesson: (lessonId: string) => void;
  selectedLessonId?: string;
}

const CourseContentsAccordion: FC<ICourseContentsAccordionProps> = ({
  recordedSessions,
  completedLessons,
  viewLesson,
  selectedLessonId,
}) => {
  const totalLessons = recordedSessions.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  console.log(completedLessons, "completedLessons");

  const completionPercentage = (completedLessons.length / totalLessons) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-full">
      <ScrollArea className="h-full w-full pr-2 scroll-smooth">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {recordedSessions.title}
          </h2>
          <div className="text-sm text-white/70 mb-2">
            {completedLessons.length}/{totalLessons} lessons completed
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {recordedSessions.modules.map((module) => (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border-none rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg"
            >
              <AccordionTrigger className="text-white font-medium px-4 py-3 bg-gradient-to-r from-emerald-700/40 via-emerald-600/40 to-emerald-800/40 hover:no-underline">
                {module.title}
              </AccordionTrigger>

              <AccordionContent className="text-white/90 space-y-2 px-4 py-3">
                {module.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id}
                    onClick={() => viewLesson(lesson._id)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${
                        selectedLessonId === lesson._id ? "bg-white/10" : ""
                      }`}
                    >
                      {lesson.type === "video" ? (
                        <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-yellow-400 shrink-0" />
                      )}
                      <span
                        className={`flex-1 ${
                          completedLessons.includes(lesson._id)
                            ? "line-through text-white/60"
                            : ""
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {completedLessons.includes(lesson._id) && (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      )}
                    </div>
                    {idx < module.lessons.length - 1 && (
                      <Separator className="bg-white/10 my-1" />
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

interface ILessonProps {
  type: "video" | "pdf";
  title: string;
  path: string;
  completeLesson: () => void;
}
const Lesson: FC<ILessonProps> = ({ type, title, path, completeLesson }) => {
  useEffect(() => {
    if (type === "pdf") {
      completeLesson();
    }
  }, []);

  return (
    <div
      className={`w-full  mb-10 overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg ${
        type === "video" ? "aspect-video" : "h-[500px]"
      }`}
    >
      {type === "video" ? (
        <VideoPlayer title={title} url={path} onEnded={completeLesson} />
      ) : (
        <PdfViewer path={path} />
      )}
    </div>
  );
};

export default UserCourseRecordedPage;
