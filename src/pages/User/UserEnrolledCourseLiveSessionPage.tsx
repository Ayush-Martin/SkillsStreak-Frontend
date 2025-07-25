import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoPlayer,
} from "@/components";
import Discussions from "@/components/user/Discussion";
import useDiscussion from "@/hooks/useDiscussion";
import useViewLiveSession from "@/hooks/useViewLiveSession";
import { EnrolledCourseLayout } from "@/layouts";
import { IViewLiveSession } from "@/types/courseType";
import { CalendarDays, Clock3, Video } from "lucide-react";
import React, { FC } from "react";
import { Link } from "react-router-dom";

const UserCourseLiveSessionPage = () => {
  const { courseAccess, liveSessions, viewSession, currentSelectedSession } =
    useViewLiveSession();

  const {
    addDiscussion,
    addReply,
    deleteDiscussion,
    discussions,
    editDiscussion,
    fetchReplies,
  } = useDiscussion(currentSelectedSession?._id || "", "liveSession");

  return (
    <EnrolledCourseLayout>
      <div className="flex relative gap-3">
        {/* Left Content */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 sm:py-6 sm:px-10 shadow-md">
            <Breadcrumb className="mb-5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link to="/courses" className="md:text-lg text-app-neutral">
                    Courses
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="md:text-lg text-app-neutral" />
                <BreadcrumbItem>
                  <span className="md:text-lg text-white">Live Sessions</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {!courseAccess ? (
              <div className="w-full aspect-video rounded-xl border border-white/10 bg-black/40 text-white flex items-center justify-center mb-10">
                You don't have access to this course.
              </div>
            ) : !currentSelectedSession ? (
              <div className="w-full aspect-video rounded-xl border border-white/10 bg-black/40 text-white flex items-center justify-center mb-10">
                No session selected
              </div>
            ) : currentSelectedSession.status === "upcoming" ? (
              <div className="w-full aspect-video rounded-xl border border-white/10 bg-black/40 text-white flex items-center justify-center mb-10">
                This live session hasn't started yet.
              </div>
            ) : (
              <LiveVideo
                url={
                  currentSelectedSession?.liveSrc ||
                  currentSelectedSession?.recordedSrc ||
                  ""
                }
                title={currentSelectedSession?.title || ""}
              />
            )}

            <Tabs defaultValue="description" className="w-full my-5">
              <TabsList className="w-full overflow-x-auto min-w-48">
                <TabsTrigger
                  value="course-contents"
                  className="w-full lg:hidden"
                >
                  Course Contents
                </TabsTrigger>
                <TabsTrigger value="description" className="w-full">
                  Description
                </TabsTrigger>
                <TabsTrigger value="discussions" className="w-full">
                  Discussions
                </TabsTrigger>
              </TabsList>
              {courseAccess && currentSelectedSession && (
                <>
                  <TabsContent value="description" className="mt-10">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-white shadow-inner">
                      <h2 className="text-xl font-semibold mb-3 text-white/90">
                        Session Description
                      </h2>
                      <p className="leading-relaxed text-white/80 tracking-wide">
                        {currentSelectedSession.description}
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
                      trainerId={""} // TODO
                    />
                  </TabsContent>
                </>
              )}
              <TabsContent
                value="course-contents"
                className="mt-10 lg:hidden h-[600px]"
              >
                <LiveSessionsAccordion
                  sessions={liveSessions}
                  viewSession={viewSession}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sticky Right Content */}
        <div className="hidden lg:block lg:w-1/3">
          <div className="sticky top-20 h-[500px]">
            <LiveSessionsAccordion
              sessions={liveSessions}
              viewSession={viewSession}
            />
          </div>
        </div>
      </div>
    </EnrolledCourseLayout>
  );
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "live":
      return (
        <span className="text-red-400 font-semibold animate-pulse text-sm">
          ● Live Now
        </span>
      );
    case "upcoming":
      return (
        <span className="text-yellow-400 font-medium text-sm">Upcoming</span>
      );
    case "completed":
      return (
        <span className="text-green-400 font-medium text-sm">Completed</span>
      );
    default:
      return null;
  }
};

const LiveSessionsAccordion: FC<{
  sessions: IViewLiveSession[];
  viewSession: (id: string) => void;
}> = ({ sessions, viewSession }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-full">
      <ScrollArea className="h-full w-full pr-2 scroll-smooth">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Live Sessions
          </h2>
          <p className="text-white/60 text-sm">
            Track all your upcoming and completed live sessions here.
          </p>
        </div>

        <div className="space-y-5">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-md shadow-md cursor-pointer hover:border-white/20"
              onClick={() => viewSession(session._id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text">
                  {session.title}
                </h3>
                {getStatusBadge(session.status)}
              </div>

              <div className="flex items-center gap-4 text-sm text-white/80 mt-2">
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock3 className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
              </div>

              <div className="mt-4">
                {session.status === "live" && (
                  <Button variant="destructive" className="w-full">
                    Join Now
                  </Button>
                )}
                {session.status === "upcoming" && (
                  <Button
                    variant="outline"
                    className="w-full text-yellow-400 border-yellow-400 hover:bg-yellow-500/10"
                  >
                    View Details
                  </Button>
                )}
                {session.status === "completed" && (
                  <Button
                    variant="secondary"
                    className="w-full flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Watch Recording
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const LiveVideo: FC<{ url: string; title: string }> = ({ url, title }) => {
  return (
    <div className="w-full mb-10 overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg">
      <VideoPlayer
        title={title}
        url={url}
        thumbnail="https://example.com/thumbnail.jpg"
      />
    </div>
  );
};

export default UserCourseLiveSessionPage;
