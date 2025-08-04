import {
  BackButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import {
  TrainerCourseAssignments,
  TrainerCourseBasicDetails,
  TrainerCourseLiveSession,
  TrainerCourseNewModules,
} from "@/components";
import { useEditCourse } from "@/hooks";
import { TrainerLayout } from "@/layouts";
import { AlertCircle } from "lucide-react";

const TrainerNewEditCoursePage = () => {
  const {
    categories,
    errors,
    handleThumbnailChange,
    EditBasicDetails,
    register,
    setValue,
    trigger,
    previewThumbnail,
    watch,
    fetchModules,
    modules,
    addModule,
    deleteModule,
    editModule,
    addAssignment,
    assignments,
    deleteAssignment,
    editAssignment,
    fetchAssignments,
    fetchLiveSessions,
    liveSessions,
    editLiveSession,
    scheduleLiveSession,
    deleteLiveSession,
    courseStatus,
    viewLiveSession,
  } = useEditCourse();

  return (
    <TrainerLayout>
      <div className="flex gap-2">
        <BackButton />
        {courseStatus !== "approved" && (
          <div
            className={`flex items-center gap-3  rounded-lg px-4 py-3 text-sm font-medium ${
              courseStatus === "rejected"
                ? "text-red-400 bg-red-500/10 border border-red-500/30"
                : "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30"
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>
              {courseStatus === "rejected"
                ? "Course has been rejected by the admin"
                : "Course is under review "}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="basic_details" className="w-full my-5">
        <TabsList className="w-full overflow-x-auto min-w-48">
          <TabsTrigger value="basic_details" className="w-full">
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="recorded" className="w-full">
            Recorded Sessions
          </TabsTrigger>
          <TabsTrigger value="assignments" className="w-full">
            Assignments
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="w-full"
            disabled={courseStatus !== "approved"}
          >
            Live Sessions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic_details">
          <TrainerCourseBasicDetails
            categories={categories}
            errors={errors}
            handleThumbnailChange={handleThumbnailChange}
            previewThumbnail={previewThumbnail}
            register={register}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
            submit={EditBasicDetails}
          />
        </TabsContent>
        <TabsContent value="recorded" className="mt-10">
          <TrainerCourseNewModules
            addModule={addModule}
            deleteModule={deleteModule}
            fetchModules={fetchModules}
            modules={modules}
            editModule={editModule}
          />
        </TabsContent>
        <TabsContent value="assignments" className="mt-10">
          <TrainerCourseAssignments
            addAssignment={addAssignment}
            assignments={assignments}
            deleteAssignment={deleteAssignment}
            editAssignment={editAssignment}
            fetchAssignments={fetchAssignments}
          />
        </TabsContent>
        <TabsContent value="live" className="mt-10">
          <TrainerCourseLiveSession
            editSession={editLiveSession}
            scheduleSession={scheduleLiveSession}
            fetchSessions={fetchLiveSessions}
            sessions={liveSessions}
            deleteSession={deleteLiveSession}
            viewSession={viewLiveSession}
          />
        </TabsContent>
      </Tabs>
    </TrainerLayout>
  );
};

export default TrainerNewEditCoursePage;
