import { FC } from "react";
import { TrainerLayout } from "@/layouts";
import {
  BackButton,
  TrainerLessonCard,
  TrainerAddLesson,
  Button,
  Input,
} from "@/components";
import { BiSave, IoMdAddCircleOutline } from "@/assets/icons";
import { useEditModule } from "@/hooks";

const EditModule: FC = () => {
  const {
    deleteLesson,
    loading,
    open,
    submit,
    updateLessonDetails,
    updateLessonFile,
    updateTitle,
    title,
    setTitle,
    setOpen,
    module,
  } = useEditModule();

  return (
    <TrainerLayout>
      <BackButton />

      <div className="p-6 md:p-10 space-y-10 text-white">
        {/* Module Title Editor */}
        <div className="rounded-lg bg-[#0e1118] border border-zinc-700 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-200">Module Title</h2>
          <div className="flex items-center gap-3 max-w-xl">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className="bg-[#1a1f2e] border border-zinc-700 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition w-full text-white"
            />
            <Button
              variant="v2"
              size="icon"
              onClick={updateTitle}
              className=" transition"
            >
              <BiSave className=" " />
            </Button>
          </div>
        </div>

        {/* Add Lesson Section */}
        <div className="rounded-lg bg-[#0e1118] border border-zinc-700 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-200">Lessons</h3>
            <Button
              variant="v1"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition"
              onClick={() => setOpen(true)}
            >
              <IoMdAddCircleOutline className="text-xl" />
              Add Lesson
            </Button>
          </div>

          {open && (
            <div className="mt-4 animate-fadeIn">
              <TrainerAddLesson
                close={() => setOpen(false)}
                submit={submit}
                loading={loading}
              />
            </div>
          )}
        </div>

        {/* Lessons Listing */}
        <div className="flex flex-col py-5 gap-7">
          {module.lessons.length === 0 ? (
            <p className="text-zinc-500 italic">No lessons added yet.</p>
          ) : (
            module.lessons.map((lesson, i) => (
              <div
                key={lesson._id}
                className="animate-slideUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <TrainerLessonCard
                  id={lesson._id}
                  deleteLesson={deleteLesson}
                  path={lesson.path}
                  title={lesson.title}
                  description={lesson.description}
                  type={lesson.type}
                  updateLessonDetails={updateLessonDetails}
                  updateLessonFile={updateLessonFile}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </TrainerLayout>
  );
};

export default EditModule;
