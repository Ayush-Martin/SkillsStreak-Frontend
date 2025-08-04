import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  CourseContentsAccordion,
  PdfViewer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoPlayer,
  Discussion,
} from "@/components";
import { useDiscussion, useViewCourseRecorded } from "@/hooks";
import { EnrolledCourseLayout } from "@/layouts";

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
                      <Discussion
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
  }, [path, type]);

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
