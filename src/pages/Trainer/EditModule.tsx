import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  axiosDeleteRequest,
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import TrainerLayout from "@/layouts/TrainerLayout";
import { successPopup } from "@/utils/popup";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton } from "@/components";
import { z } from "zod";
import {
  LessonDescriptionValidationRule,
  LessonTitleValidationRule,
} from "@/utils/validationRules";
import { MdDelete, MdDragHandle } from "react-icons/md";
import ReactPlayer from "react-player";
import AddLesson from "@/components/Trainer/AddLesson";
import { ModuleType } from "@/types/courseType";

export const LessonSchema = z.object({
  title: LessonTitleValidationRule,
  description: LessonDescriptionValidationRule,
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;

const EditModule: FC = () => {
  const { moduleId, courseId } = useParams();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [module, setModule] = useState<ModuleType>({
    _id: "",
    title: "",
    order: 0,
    lessons: [],
  });

  useEffect(() => {
    const fetchModule = async () => {
      const res = await axiosGetRequest(
        `${TRAINER_COURSES_API}/${courseId}/${moduleId}`
      );
      if (!res) return;
      setModule(res.data);
      setTitle(res.data.title);
    };

    fetchModule();
  }, []);

  const updateTitle = async () => {
    const res = await axiosPatchRequest(
      `${TRAINER_COURSES_API}/${courseId}/${moduleId}`,
      {
        title,
      }
    );

    if (!res) return;
    setModule({ ...module, title });
    successPopup(res.message || "updated");
  };

  const submit = async (data: LessonSchemaType & { file: File }) => {
    const { description, file, title } = data;
    const type = file.type.startsWith("video") ? "video" : "pdf";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("type", type);
    const res = await axiosPostRequest(
      `trainer/courses/${courseId}/${moduleId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
    if (!res) return;
    successPopup(res.message || "added");
    setOpen(false);
    setModule({ ...module, lessons: [res.data, ...module.lessons] });
  };

  const deleteLesson = async (lessonId: string) => {
    const res = await axiosDeleteRequest(
      `${TRAINER_COURSES_API}/${courseId}/${moduleId}/${lessonId}`
    );

    if (!res) return;
    successPopup(res.message || "deleted");
    setModule({
      ...module,
      lessons: module.lessons.filter((lesson) => lesson._id != lessonId),
    });
  };

  return (
    <TrainerLayout>
      <BackButton />
      <p className="mb-2 text-xl text-app-accent">Title</p>
      <div className="flex gap-2 w-[300px]">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-app-border"
        />
        <Button onClick={updateTitle}>Change</Button>
      </div>

      <Button variant={"v2"} className="mt-10" onClick={() => setOpen(true)}>
        Add Lesson
      </Button>

      {open && <AddLesson close={() => setOpen(false)} submit={submit} />}

      <div className="flex flex-col mt-10 gap-7">
        {module.lessons.map((lesson) => (
          <div className="w-full px-5 py-2 bg-app-border" key={lesson._id}>
            <div className="flex justify-between">
              <h1 className="text-xl text-app-secondary">{lesson.title}</h1>
              <div className="flex gap-2 text-xl ">
                <button
                  className="text-red-500"
                  onClick={() => deleteLesson(lesson._id)}
                >
                  <MdDelete />
                </button>
                <button className="text-2xl text-app-tertiary">
                  <MdDragHandle />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-10 mt-2 md:flex-row">
              <div className="flex justify-center md:block">
                {lesson.type == "video" ? (
                  <div className="w-[500px]">
                    <ReactPlayer
                      url={lesson.path}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        file: {
                          attributes: {
                            crossOrigin: "anonymous", // Handle CORS issues
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-white w-72"></div>
                )}
              </div>
              <div>
                <p className="text-app-accent">Description</p>
                <p>{lesson.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TrainerLayout>
  );
};

export default EditModule;
