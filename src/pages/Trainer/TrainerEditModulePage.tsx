import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useParams } from "react-router-dom";

import { Button, Input } from "@/components";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { TrainerLayout } from "@/layouts";
import { successPopup } from "@/utils/popup";
import { BackButton, LessonCard, AddLesson } from "@/components";
import {
  LessonDescriptionValidationRule,
  LessonTitleValidationRule,
} from "@/utils/validationRules";
import { ModuleType } from "@/types/courseType";
import { BiSave, IoMdAddCircleOutline } from "@/assets/icons";
import { getVideoDuration } from "@/utils/video";

export const LessonSchema = z.object({
  title: LessonTitleValidationRule,
  description: LessonDescriptionValidationRule,
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;

const EditModule: FC = () => {
  const { moduleId, courseId } = useParams();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState<ModuleType>({
    _id: "",
    title: "",
    lessons: [],
  });

  useEffect(() => {
    const fetchModule = async () => {
      const res = await axiosGetRequest(
        `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}`
      );
      if (!res) return;
      setModule(res.data);
      setTitle(res.data.title);
    };

    fetchModule();
  }, []);

  const updateTitle = async () => {
    const res = await axiosPatchRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}`,
      {
        title,
      }
    );

    if (!res) return;
    setModule({ ...module, title });
    successPopup(res.message || "updated");
  };

  const submit = async (data: LessonSchemaType & { file: File }) => {
    setLoading(true);
    const { description, file, title } = data;
    const type = file.type.startsWith("video") ? "video" : "pdf";
    let duration: number;

    if (type === "video") {
      duration = await getVideoDuration(file);
      console.log(duration);
    } else {
      duration = 60;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("type", type);
    formData.append("duration", Math.round(duration).toString());
    const res = await axiosPostRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading(false);

    if (!res) return;
    successPopup(res.message || "added");
    setOpen(false);
    setModule({ ...module, lessons: [res.data, ...module.lessons] });
  };

  const deleteLesson = async (lessonId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}/${lessonId}`
    );

    if (!res) return;
    successPopup(res.message || "deleted");
    setModule({
      ...module,
      lessons: module.lessons.filter((lesson) => lesson._id != lessonId),
    });
  };

  const updateLessonDetails = async (
    lessonId: string,
    data: LessonSchemaType
  ) => {
    const res = await axiosPutRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}/${lessonId}`,
      data
    );

    if (!res) return;
    successPopup(res.message || "edited");
    setModule({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson._id == lessonId ? res.data : lesson
      ),
    });
  };

  const updateLessonFile = async (lessonId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosPatchRequest(
      `${TRAINER_COURSES_API}/${courseId}/modules/${moduleId}/${lessonId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!res) return;
    successPopup(res.message || "edited");
    setModule({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson._id == lessonId ? res.data : lesson
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
              <AddLesson
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
            <LessonCard
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
