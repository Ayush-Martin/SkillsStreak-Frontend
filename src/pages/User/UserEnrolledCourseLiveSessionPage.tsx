import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VideoPlayer,
  Discussion,
  LiveSessionsAccordion,
  Button,
} from "@/components";
import { useSubscription } from "@/hooks";
import useDiscussion from "@/hooks/useDiscussion";
import useViewLiveSession from "@/hooks/useViewLiveSession";
import { EnrolledCourseLayout } from "@/layouts";
import { Link, useNavigate } from "react-router-dom";

const UserCourseLiveSessionPage = () => {
  const { courseAccess, liveSessions, viewSession, currentSelectedSession } =
    useViewLiveSession();
  const navigate = useNavigate();

  const { subscriptionDetail } = useSubscription();

  const {
    addDiscussion,
    addReply,
    deleteDiscussion,
    discussions,
    editDiscussion,
    fetchReplies,
  } = useDiscussion(currentSelectedSession?._id || "", "liveSession");

  const hasLiveAccess =
    subscriptionDetail?.active &&
    subscriptionDetail?.features.includes("live_session");

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

            {!hasLiveAccess ? (
              <div className="w-full aspect-video rounded-xl border border-white/10 bg-black/40 text-white flex flex-col items-center justify-center mb-10 p-5">
                <p className="mb-4 text-center">
                  You need an active subscription with Live Session access to
                  view this stream.
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate("/subscriptions")}
                >
                  Subscribe or Upgrade
                </Button>
              </div>
            ) : !courseAccess ? (
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
              <div className="w-full mb-10 overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg">
                <VideoPlayer
                  title={currentSelectedSession?.title || ""}
                  url={
                    currentSelectedSession?.liveSrc ||
                    currentSelectedSession?.recordedSrc ||
                    ""
                  }
                  thumbnail="https://example.com/thumbnail.jpg"
                />
              </div>
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
                    <Discussion
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

export default UserCourseLiveSessionPage;
