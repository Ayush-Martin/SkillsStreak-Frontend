import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useParams } from "react-router-dom";

import { Button, Input } from "@/components/ui";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
  axiosPutRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import TrainerLayout from "@/layouts/TrainerLayout";
import { successPopup } from "@/utils/popup";
import { BackButton, LessonCard, AddLesson } from "@/components";
import {
  LessonDescriptionValidationRule,
  LessonTitleValidationRule,
} from "@/utils/validationRules";
import { ModuleType } from "@/types/courseType";
import { BiSave, IoMdAddCircleOutline } from "@/assets/icons";

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("type", type);
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
    console.log(res);

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
      <p className="mt-5 mb-2 text-xl text-white font-tektur">Title :</p>
      <div className="flex gap-2 w-[300px]">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border border-app-border"
        />
        <button onClick={updateTitle} className="text-2xl text-green-400">
          <BiSave />
        </button>
      </div>

      <p className="pt-5 mt-5 mb-2 text-xl text-white border-t-2 font-tektur border-app-highlight">
        Lessons :
      </p>
      <Button
        variant={"v1"}
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <IoMdAddCircleOutline className="text-2xl" />
        Add Lesson
      </Button>

      {open && (
        <AddLesson
          close={() => setOpen(false)}
          submit={submit}
          loading={loading}
        />
      )}

      <div className="flex flex-col py-5 mt-2 gap-7">
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
    </TrainerLayout>
  );
};

export default EditModule;
