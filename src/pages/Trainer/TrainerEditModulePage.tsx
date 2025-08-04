import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrainerLayout } from "@/layouts";
import {
  BackButton,
  TrainerLessonCard,
  TrainerAddLesson,
  Button,
  Input,
} from "@/components";
import { ITrainerModule } from "@/types/courseType";
import { BiSave, IoMdAddCircleOutline } from "@/assets/icons";
import {
  addTrainerLesson,
  deleteTrainerLesson,
  editTrainerLesson,
  editTrainerLessonFile,
  getTrainerModule,
  updateTrainerModuleTitle,
} from "@/api";
import { ILessonSchema } from "@/validation/lesson.validation";

const EditModule: FC = () => {
  const { moduleId, courseId } = useParams();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState<ITrainerModule>({
    _id: "",
    title: "",
    lessons: [],
  });

  useEffect(() => {
    const fetchModule = async () => {
      const data = await getTrainerModule(courseId!, moduleId!);
      if (!data) return;
      setModule(data);
      setTitle(data.title);
    };

    fetchModule();
  }, [courseId, moduleId]);

  const updateTitle = async () => {
    const data = await updateTrainerModuleTitle(courseId!, moduleId!, title);
    if (!data) return;
    setModule({ ...module, title });
  };

  const submit = async (data: ILessonSchema & { file: File }) => {
    setLoading(true);
    const lesson = await addTrainerLesson(courseId!, moduleId!, data);
    setLoading(false);
    if (!lesson) return;
    setOpen(false);
    setModule({ ...module, lessons: [lesson, ...module.lessons] });
  };

  const deleteLesson = async (lessonId: string) => {
    await deleteTrainerLesson(courseId!, moduleId!, lessonId);
    setModule({
      ...module,
      lessons: module.lessons.filter((lesson) => lesson._id != lessonId),
    });
  };

  const updateLessonDetails = async (lessonId: string, data: ILessonSchema) => {
    const updatedLesson = await editTrainerLesson(
      courseId!,
      moduleId!,
      lessonId,
      data
    );
    if (!updatedLesson) return;

    setModule({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson._id == lessonId ? updatedLesson : lesson
      ),
    });
  };

  const updateLessonFile = async (lessonId: string, file: File) => {
    const updatedLesson = await editTrainerLessonFile(
      courseId!,
      moduleId!,
      lessonId,
      file
    );

    if (!updatedLesson) return;

    setModule({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson._id == lessonId ? updatedLesson : lesson
      ),
    });
  };

  return (
    <TrainerLayout>
      <BackButton />

      <div className="p-6 md:p-10 space-y-10 text-white">
        {/* Module Title Editor */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Module Title</h2>
          <div className="flex items-center gap-3 max-w-xl">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className="bg-[#1c2130] border border-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition w-full"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={updateTitle}
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              <BiSave className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Add Lesson Section */}
        <div className="border-t border-zinc-700 pt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Lessons</h3>
            <Button
              variant="v1"
              className="flex items-center gap-2"
              onClick={() => setOpen(true)}
            >
              <IoMdAddCircleOutline className="text-xl" />
              Add Lesson
            </Button>
          </div>

          {open && (
            <div className="mt-4">
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
          {module.lessons.map((lesson) => (
            <TrainerLessonCard
              key={lesson._id}
              id={lesson._id}
              deleteLesson={deleteLesson}
              path={lesson.path}
              title={lesson.title}
              description={lesson.description}
              type={lesson.type}
              updateLessonDetails={updateLessonDetails}
              updateLessonFile={updateLessonFile}
            />
          ))}
        </div>
      </div>
    </TrainerLayout>
  );
};

export default EditModule;
