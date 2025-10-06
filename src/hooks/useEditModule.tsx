import {
  getTrainerModule,
  updateTrainerModuleTitle,
  addTrainerLesson,
  deleteTrainerLesson,
  editTrainerLesson,
  editTrainerLessonFile,
} from "@/api";
import { ITrainerModule } from "@/types/courseType";
import { LessonSchemaType } from "@/validation/lesson.validation";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const useEditModule = () => {
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

  const submit = async (data: LessonSchemaType & { file: File }) => {
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

  const updateLessonDetails = async (
    lessonId: string,
    data: LessonSchemaType
  ) => {
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

  return {
    open,
    loading,
    title,
    module,
    setOpen,
    setTitle,
    updateTitle,
    submit,
    deleteLesson,
    updateLessonDetails,
    updateLessonFile,
  };
};

export default useEditModule;
